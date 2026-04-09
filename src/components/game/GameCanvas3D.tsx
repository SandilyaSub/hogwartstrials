import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Sky } from "@react-three/drei";
import * as THREE from "three";
import { WORLDS } from "@/lib/gameData";
import { generateLevel3D } from "@/lib/engine3d/levelGenerator3D";
import type { Platform3D, Enemy3D, Coin3D, LevelData3D, PlayerState3D } from "@/lib/engine3d/types";
import type { PlayerProfile } from "@/hooks/useGameState";
import { toggleMusic, isMusicPlaying } from "@/lib/musicEngine";

interface GameCanvas3DProps {
  profile: PlayerProfile;
  worldId: number;
  levelIdx: number;
  onComplete: () => void;
  onDeath: () => void;
  onBack: () => void;
}

// ─── Keyboard input hook ───
function useKeyboard() {
  const keys = useRef(new Set<string>());
  useEffect(() => {
    const down = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase());
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);
  return keys;
}

// ─── Platform Component ───
function PlatformMesh({ plat, time }: { plat: Platform3D; time: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const basePos = useMemo(() => new THREE.Vector3(...plat.position), [plat.position]);

  useFrame(() => {
    if (!meshRef.current) return;
    if (plat.type === "disappearing" && !plat.visible) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;

    if (plat.type === "moving" && plat.moveAxis && plat.moveRange) {
      const offset = Math.sin(time * (plat.moveSpeed || 1)) * plat.moveRange;
      if (plat.moveAxis === "x") meshRef.current.position.x = basePos.x + offset;
      else if (plat.moveAxis === "z") meshRef.current.position.z = basePos.z + offset;
      else meshRef.current.position.y = basePos.y + offset;
    }
  });

  const color = plat.type === "finish" ? "#ffd700"
    : plat.type === "hazard" ? "#cc3030"
    : plat.type === "moving" ? "#4a6a8a"
    : plat.type === "disappearing" ? "#8a6aaa"
    : plat.type === "ice" ? "#8ac8e8"
    : plat.color || "#5a4a3a";

  return (
    <mesh ref={meshRef} position={[...plat.position]} castShadow receiveShadow>
      <boxGeometry args={[...plat.size]} />
      <meshStandardMaterial
        color={color}
        roughness={plat.type === "ice" ? 0.1 : 0.7}
        metalness={plat.type === "finish" ? 0.5 : 0.1}
        emissive={plat.type === "finish" ? "#aa8800" : "#000000"}
        emissiveIntensity={plat.type === "finish" ? 0.3 : 0}
      />
    </mesh>
  );
}

// ─── Coin Component ───
function CoinMesh({ coin, time }: { coin: Coin3D; time: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  if (coin.collected) return null;

  return (
    <mesh
      ref={meshRef}
      position={[coin.position[0], coin.position[1] + Math.sin(time * 2 + coin.position[2]) * 0.3, coin.position[2]]}
      rotation={[0, time * 2, 0]}
    >
      <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
      <meshStandardMaterial color="#ffd700" emissive="#aa8800" emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

// ─── Enemy Component ───
function EnemyMesh({ enemy, time }: { enemy: Enemy3D; time: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const offset = Math.sin(time * enemy.speed) * enemy.range;
    if (enemy.moveAxis === "x") meshRef.current.position.x = enemy.origPos[0] + offset;
    else meshRef.current.position.z = enemy.origPos[2] + offset;
  });

  return (
    <group position={[...enemy.position]}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[...enemy.size]} />
        <meshStandardMaterial color="#aa3333" emissive="#660000" emissiveIntensity={0.3} />
      </mesh>
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.8}
        anchorX="center"
        anchorY="middle"
      >
        {enemy.emoji || "👾"}
      </Text>
    </group>
  );
}

// ─── Player Component with Physics ───
function Player({
  levelData,
  profile,
  onComplete,
  onDeath,
}: {
  levelData: LevelData3D;
  profile: PlayerProfile;
  onComplete: () => void;
  onDeath: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const keys = useKeyboard();
  const { camera } = useThree();
  const stateRef = useRef<PlayerState3D>({
    position: [...levelData.startPos],
    velocity: [0, 0, 0],
    onGround: false,
    hp: 100,
    alive: true,
    facing: 0,
  });
  const hasRevive = useRef(profile.pet?.effect?.type === "revive");
  const completedRef = useRef(false);
  const timeRef = useRef(0);

  const GRAVITY = -20;
  const JUMP = 10;
  const SPEED = 8;
  const houseBoosts = profile.house?.boosts || { speed: 0, jump: 0, flying: 0 };
  const upgrades = profile.purchasedUpgrades || {};
  const jumpPower = JUMP + houseBoosts.jump * 1.5 + (upgrades["jump_boost_1"] ? 1.5 : 0) + (upgrades["jump_boost_2"] ? 3 : 0);
  const speed = SPEED + houseBoosts.speed * 0.8 + (upgrades["speed_boost_1"] ? 0.8 : 0) + (upgrades["speed_boost_2"] ? 1.5 : 0);

  useFrame((_, delta) => {
    if (!meshRef.current || !stateRef.current.alive || completedRef.current) return;
    const dt = Math.min(delta, 0.05); // cap delta
    timeRef.current += dt;
    const state = stateRef.current;
    const k = keys.current;

    // Input
    let moveX = 0, moveZ = 0;
    if (k.has("w") || k.has("arrowup")) moveZ = -1;
    if (k.has("s") || k.has("arrowdown")) moveZ = 1;
    if (k.has("a") || k.has("arrowleft")) moveX = -1;
    if (k.has("d") || k.has("arrowright")) moveX = 1;

    // Normalize diagonal
    const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (len > 0) { moveX /= len; moveZ /= len; }

    state.velocity[0] = moveX * speed;
    state.velocity[2] = moveZ * speed;

    // Gravity
    state.velocity[1] += GRAVITY * dt;

    // Jump
    if ((k.has(" ") || k.has("arrowup")) && state.onGround) {
      state.velocity[1] = jumpPower;
      state.onGround = false;
    }

    // Apply velocity
    state.position[0] += state.velocity[0] * dt;
    state.position[1] += state.velocity[1] * dt;
    state.position[2] += state.velocity[2] * dt;

    // Platform collision
    state.onGround = false;
    for (const plat of levelData.platforms) {
      if (plat.type === "disappearing" && !plat.visible) continue;

      let px = plat.position[0], py = plat.position[1], pz = plat.position[2];
      // Apply moving offset
      if (plat.type === "moving" && plat.moveAxis && plat.moveRange) {
        const offset = Math.sin(timeRef.current * (plat.moveSpeed || 1)) * plat.moveRange;
        if (plat.moveAxis === "x") px += offset;
        else if (plat.moveAxis === "z") pz += offset;
        else py += offset;
      }

      const hw = plat.size[0] / 2, hh = plat.size[1] / 2, hd = plat.size[2] / 2;
      const playerR = 0.4;

      // Check if player is above platform and within horizontal bounds
      if (
        state.position[0] > px - hw - playerR && state.position[0] < px + hw + playerR &&
        state.position[2] > pz - hd - playerR && state.position[2] < pz + hd + playerR
      ) {
        const platTop = py + hh;
        const playerBottom = state.position[1] - 0.8; // player feet

        if (state.velocity[1] <= 0 && playerBottom <= platTop && playerBottom > platTop - 1.5) {
          state.position[1] = platTop + 0.8;
          state.velocity[1] = 0;
          state.onGround = true;

          if (plat.type === "finish" && !completedRef.current) {
            completedRef.current = true;
            onComplete();
            return;
          }

          if (plat.type === "hazard") {
            if (hasRevive.current) {
              hasRevive.current = false;
              state.position = [...levelData.startPos];
              state.velocity = [0, 0, 0];
            } else {
              state.alive = false;
              onDeath();
              return;
            }
          }

          if (plat.type === "disappearing") {
            plat.timer = (plat.timer || 0) + dt * 60;
            if (plat.timer > 40) plat.visible = false;
          }

          // Move with moving platform
          if (plat.type === "moving" && plat.moveAxis && plat.moveRange) {
            const spd = (plat.moveSpeed || 1);
            const derivOffset = Math.cos(timeRef.current * spd) * plat.moveRange * spd;
            if (plat.moveAxis === "x") state.position[0] += derivOffset * dt;
            else if (plat.moveAxis === "z") state.position[2] += derivOffset * dt;
          }
        }
      }
    }

    // Coin collection
    for (const coin of levelData.coins) {
      if (coin.collected) continue;
      const dx = state.position[0] - coin.position[0];
      const dy = state.position[1] - coin.position[1];
      const dz = state.position[2] - coin.position[2];
      if (dx * dx + dy * dy + dz * dz < 2) {
        coin.collected = true;
      }
    }

    // Enemy collision
    for (const enemy of levelData.enemies) {
      let ex = enemy.origPos[0], ey = enemy.origPos[1], ez = enemy.origPos[2];
      const offset = Math.sin(timeRef.current * enemy.speed) * enemy.range;
      if (enemy.moveAxis === "x") ex += offset;
      else ez += offset;

      const dx = state.position[0] - ex;
      const dy = state.position[1] - ey;
      const dz = state.position[2] - ez;
      if (dx * dx + dy * dy + dz * dz < 2) {
        // Stomp from above
        if (state.velocity[1] < 0 && dy > 0.5) {
          state.velocity[1] = jumpPower * 0.6;
          enemy.origPos[1] = -100; // remove
        } else {
          if (hasRevive.current) {
            hasRevive.current = false;
            state.velocity[1] = jumpPower;
          } else {
            state.alive = false;
            onDeath();
            return;
          }
        }
      }
    }

    // Fall death
    if (state.position[1] < -20) {
      if (hasRevive.current) {
        hasRevive.current = false;
        state.position = [...levelData.startPos];
        state.velocity = [0, 0, 0];
      } else {
        state.alive = false;
        onDeath();
        return;
      }
    }

    // Update mesh position
    meshRef.current.position.set(...state.position);

    // Update facing direction
    if (Math.abs(state.velocity[0]) > 0.1 || Math.abs(state.velocity[2]) > 0.1) {
      state.facing = Math.atan2(state.velocity[0], state.velocity[2]);
    }
    meshRef.current.rotation.y = state.facing;

    // Third-person camera
    const camDist = 8;
    const camHeight = 5;
    const camTarget = new THREE.Vector3(...state.position);
    const camPos = new THREE.Vector3(
      state.position[0] + Math.sin(state.facing + Math.PI) * camDist,
      state.position[1] + camHeight,
      state.position[2] + Math.cos(state.facing + Math.PI) * camDist,
    );
    camera.position.lerp(camPos, 0.08);
    camera.lookAt(camTarget);
  });

  const charColor = profile.character?.color || "#c0392b";

  return (
    <group ref={meshRef as any} position={[...levelData.startPos]}>
      {/* Body */}
      <mesh castShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.35, 0.8, 8, 16]} />
        <meshStandardMaterial color={charColor} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#f0d0a0" />
      </mesh>
      {/* Character emoji floating above */}
      <Text position={[0, 1.5, 0]} fontSize={0.5} anchorX="center" anchorY="middle">
        {profile.character?.emoji || "⚡"}
      </Text>
    </group>
  );
}

// ─── Main Scene ───
function Scene({
  levelData,
  profile,
  onComplete,
  onDeath,
}: {
  levelData: LevelData3D;
  profile: PlayerProfile;
  onComplete: () => void;
  onDeath: () => void;
}) {
  const timeRef = useRef(0);
  const [time, setTime] = useState(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    setTime(timeRef.current);
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight color={levelData.theme.ambientColor} intensity={0.5} />
      <directionalLight
        color={levelData.theme.directionalColor}
        intensity={1}
        position={[10, 20, 5]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <pointLight color="#ffd700" intensity={0.3} position={[0, 10, -20]} />

      {/* Fog */}
      <fog attach="fog" color={levelData.theme.fogColor} near={10} far={80} />

      {/* Platforms */}
      {levelData.platforms.map(p => (
        <PlatformMesh key={p.id} plat={p} time={time} />
      ))}

      {/* Coins */}
      {levelData.coins.map(c => (
        <CoinMesh key={c.id} coin={c} time={time} />
      ))}

      {/* Enemies */}
      {levelData.enemies.map(e => (
        <EnemyMesh key={e.id} enemy={e} time={time} />
      ))}

      {/* Player */}
      <Player
        levelData={levelData}
        profile={profile}
        onComplete={onComplete}
        onDeath={onDeath}
      />
    </>
  );
}

// ─── Main Component ───
const GameCanvas3D = ({ profile, worldId, levelIdx, onComplete, onDeath, onBack }: GameCanvas3DProps) => {
  const [paused, setPaused] = useState(false);
  const [musicOn, setMusicOn] = useState(isMusicPlaying());

  const levelData = useMemo(() => generateLevel3D(worldId, levelIdx), [worldId, levelIdx]);

  const world = WORLDS[worldId - 1];
  const level = world?.levels[levelIdx];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPaused(p => !p);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      <Canvas
        shadows
        camera={{ fov: 60, near: 0.1, far: 200, position: [0, 8, 12] }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={[levelData.theme.skyColor]} />
        {!paused && (
          <Scene
            levelData={levelData}
            profile={profile}
            onComplete={onComplete}
            onDeath={onDeath}
          />
        )}
      </Canvas>

      {/* HUD */}
      <div className="absolute top-4 left-4 flex items-center gap-3 z-10">
        <button
          onClick={onBack}
          className="px-3 py-1.5 bg-black/60 text-white rounded-lg font-display text-sm hover:bg-black/80 transition-colors"
        >
          ← Back
        </button>
        <div className="bg-black/60 text-white px-3 py-1.5 rounded-lg font-display text-sm">
          {level?.name || "Level"} — World {worldId}
        </div>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          onClick={() => { toggleMusic(); setMusicOn(isMusicPlaying()); }}
          className="px-3 py-1.5 bg-black/60 text-white rounded-lg text-sm hover:bg-black/80"
        >
          {musicOn ? "🔊" : "🔇"}
        </button>
        <button
          onClick={() => setPaused(p => !p)}
          className="px-3 py-1.5 bg-black/60 text-white rounded-lg text-sm hover:bg-black/80"
        >
          {paused ? "▶" : "⏸"}
        </button>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white/70 px-4 py-2 rounded-lg text-xs font-body z-10">
        WASD / Arrows to move • Space to jump • ESC to pause
      </div>

      {/* Paused overlay */}
      {paused && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          <div className="text-center space-y-4">
            <h2 className="font-display text-3xl text-white text-glow">⏸ Paused</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setPaused(false)}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-display hover:opacity-90"
              >
                Resume
              </button>
              <button
                onClick={onBack}
                className="px-6 py-2 bg-muted text-muted-foreground rounded-lg font-display hover:opacity-90"
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCanvas3D;
