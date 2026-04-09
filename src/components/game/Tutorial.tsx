import { useState, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { generateTutorialLevel } from "@/lib/engine3d/levelGenerator3D";
import type { Platform3D, Coin3D, LevelData3D } from "@/lib/engine3d/types";
import type { PlayerProfile } from "@/hooks/useGameState";

interface TutorialProps {
  profile: PlayerProfile;
  onComplete: () => void;
}

interface TutorialStep {
  title: string;
  description: string;
  emoji: string;
  triggerZ?: number; // player Z position to trigger this step
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: "Welcome to Hogwarts! ✨",
    description: "Your magical adventure begins here. You'll learn everything you need to survive the wizarding world's most dangerous obstacles.",
    emoji: "🏰",
  },
  {
    title: "Movement Controls 🏃",
    description: "Use W/A/S/D or Arrow Keys to move around. Try walking to the next platform!",
    emoji: "⌨️",
    triggerZ: -5,
  },
  {
    title: "Jumping! 🦘",
    description: "Press SPACE to jump across gaps. Time your jumps carefully — falling means losing a life!",
    emoji: "💨",
    triggerZ: -25,
  },
  {
    title: "Collect Coins! 🪙",
    description: "Gold coins are scattered across every level. Collect them to spend in the Magical Shop on upgrades, themes, and music!",
    emoji: "🪙",
    triggerZ: -45,
  },
  {
    title: "Moving Platforms ⚙️",
    description: "Some platforms move back and forth. Wait for the right moment, then jump! Blue platforms are movers.",
    emoji: "↔️",
    triggerZ: -55,
  },
  {
    title: "Watch Out for Enemies! 🕷️",
    description: "Enemies patrol the platforms. Jump on them from above to defeat them, or dodge around them. Getting hit costs a life!",
    emoji: "⚔️",
    triggerZ: -65,
  },
  {
    title: "Disappearing Platforms 💨",
    description: "Purple platforms vanish shortly after you land on them. Don't linger — keep moving!",
    emoji: "👻",
    triggerZ: -80,
  },
  {
    title: "Pets & Abilities 🐾",
    description: "Your pet companion gives special abilities! Owls boost speed, Cats improve balance, Phoenixes grant an extra life. Visit the Pet Store from the World Map.",
    emoji: "🦉",
  },
  {
    title: "The Magical Shop 🏪",
    description: "Spend coins on: ⬆️ Upgrades (jump/speed boosts), 🧪 Consumables (shields, extra lives), 🎨 Themes (change game colors), 🎵 Music (new background tracks)!",
    emoji: "🛒",
  },
  {
    title: "Boss Battles ⚡",
    description: "Every 5th level is a boss fight! Use spell keys (1-5) to fire: ⚡ Stupefy, ✨ Expelliarmus, ❄️ Petrificus. Dodge boss attacks and fight back!",
    emoji: "🐉",
  },
  {
    title: "Themes & Music 🎨",
    description: "Purchase themes in the shop to change the entire game's look — Amortentia Pink 💖, Ravenclaw Blue 💙, Dark Arts 🐍, and more! Each has unique colors. Songs change the background music.",
    emoji: "🎵",
  },
  {
    title: "You're Ready! 🧙",
    description: "Reach the golden ⭐ FINISH platform to complete each level. Good luck, witch or wizard — your Hogwarts adventure awaits!",
    emoji: "🌟",
  },
];

// Simplified player for tutorial
function TutorialPlayer({
  levelData,
  profile,
  onPositionChange,
  onComplete,
}: {
  levelData: LevelData3D;
  profile: PlayerProfile;
  onPositionChange: (z: number) => void;
  onComplete: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const keys = useRef(new Set<string>());
  const { camera } = useThree();
  const posRef = useRef([...levelData.startPos] as [number, number, number]);
  const velRef = useRef([0, 0, 0] as [number, number, number]);
  const onGroundRef = useRef(false);
  const completedRef = useRef(false);
  const timeRef = useRef(0);

  useEffect(() => {
    const down = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase());
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current || completedRef.current) return;
    const dt = Math.min(delta, 0.05);
    timeRef.current += dt;
    const k = keys.current;
    const pos = posRef.current;
    const vel = velRef.current;

    let mx = 0, mz = 0;
    if (k.has("w") || k.has("arrowup")) mz = -1;
    if (k.has("s") || k.has("arrowdown")) mz = 1;
    if (k.has("a") || k.has("arrowleft")) mx = -1;
    if (k.has("d") || k.has("arrowright")) mx = 1;
    const len = Math.sqrt(mx * mx + mz * mz);
    if (len > 0) { mx /= len; mz /= len; }

    vel[0] = mx * 7;
    vel[2] = mz * 7;
    vel[1] -= 20 * dt;

    if ((k.has(" ")) && onGroundRef.current) {
      vel[1] = 10;
      onGroundRef.current = false;
    }

    pos[0] += vel[0] * dt;
    pos[1] += vel[1] * dt;
    pos[2] += vel[2] * dt;

    // Collision
    onGroundRef.current = false;
    for (const plat of levelData.platforms) {
      if (plat.type === "disappearing" && !plat.visible) continue;
      let px = plat.position[0], py = plat.position[1], pz = plat.position[2];
      if (plat.type === "moving" && plat.moveAxis && plat.moveRange) {
        const off = Math.sin(timeRef.current * (plat.moveSpeed || 1)) * plat.moveRange;
        if (plat.moveAxis === "x") px += off;
        else if (plat.moveAxis === "z") pz += off;
        else py += off;
      }
      const hw = plat.size[0] / 2, hh = plat.size[1] / 2, hd = plat.size[2] / 2;
      if (pos[0] > px - hw - 0.4 && pos[0] < px + hw + 0.4 &&
          pos[2] > pz - hd - 0.4 && pos[2] < pz + hd + 0.4) {
        const top = py + hh;
        if (vel[1] <= 0 && pos[1] - 0.8 <= top && pos[1] - 0.8 > top - 1.5) {
          pos[1] = top + 0.8;
          vel[1] = 0;
          onGroundRef.current = true;
          if (plat.type === "finish" && !completedRef.current) {
            completedRef.current = true;
            onComplete();
            return;
          }
          if (plat.type === "disappearing") {
            plat.timer = (plat.timer || 0) + dt * 60;
            if (plat.timer! > 120) plat.visible = false; // 3x longer before vanishing
          }
        }
      }
    }

    // Coin collection
    for (const coin of levelData.coins) {
      if (coin.collected) continue;
      const dx = pos[0] - coin.position[0];
      const dy = pos[1] - coin.position[1];
      const dz = pos[2] - coin.position[2];
      if (dx * dx + dy * dy + dz * dz < 2) coin.collected = true;
    }

    // Respawn on fall
    if (pos[1] < -15) {
      posRef.current = [...levelData.startPos] as [number, number, number];
      velRef.current = [0, 0, 0] as [number, number, number];
      return;
    }

    meshRef.current.position.set(...pos);

    // Report position
    onPositionChange(pos[2]);

    // Fixed camera follow - always behind and above
    const camTarget = new THREE.Vector3(pos[0], pos[1] + 1, pos[2]);
    const camPos = new THREE.Vector3(pos[0], pos[1] + 7, pos[2] + 12);
    camera.position.lerp(camPos, 0.06);
    camera.lookAt(camTarget);
  });

  return (
    <group ref={meshRef} position={[...levelData.startPos]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.35, 0.8, 8, 16]} />
        <meshStandardMaterial color={profile.character?.color || "#c0392b"} />
      </mesh>
      <mesh castShadow position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#f0d0a0" />
      </mesh>
      <Text position={[0, 1.5, 0]} fontSize={0.5} anchorX="center" anchorY="middle">
        {profile.character?.emoji || "⚡"}
      </Text>
    </group>
  );
}

function TutorialScene({ levelData, profile, onPositionChange, onComplete }: {
  levelData: LevelData3D;
  profile: PlayerProfile;
  onPositionChange: (z: number) => void;
  onComplete: () => void;
}) {
  const timeRef = useRef(0);
  const [time, setTime] = useState(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    setTime(timeRef.current);
  });

  return (
    <>
      <ambientLight color="#8888cc" intensity={0.6} />
      <directionalLight color="#ffffff" intensity={1} position={[10, 20, 5]} castShadow />
      <fog attach="fog" color="#1a1a3a" near={15} far={80} />

      {levelData.platforms.map(p => {
        if (p.type === "disappearing" && !p.visible) return null;
        let color = p.type === "finish" ? "#ffd700"
          : p.type === "moving" ? "#4a6a8a"
          : p.type === "disappearing" ? "#8a6aaa"
          : p.color || "#5a4a3a";

        return (
          <mesh key={p.id} position={[...p.position]} castShadow receiveShadow>
            <boxGeometry args={[...p.size]} />
            <meshStandardMaterial
              color={color}
              emissive={p.type === "finish" ? "#aa8800" : "#000"}
              emissiveIntensity={p.type === "finish" ? 0.3 : 0}
            />
          </mesh>
        );
      })}

      {levelData.coins.map(c => c.collected ? null : (
        <mesh key={c.id} position={[c.position[0], c.position[1] + Math.sin(time * 2 + c.position[2]) * 0.3, c.position[2]]} rotation={[0, time * 2, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
          <meshStandardMaterial color="#ffd700" emissive="#aa8800" emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {levelData.enemies.map(e => (
        <group key={e.id} position={[...e.position]}>
          <mesh castShadow>
            <boxGeometry args={[...e.size]} />
            <meshStandardMaterial color="#aa3333" emissive="#660000" emissiveIntensity={0.3} />
          </mesh>
          <Text position={[0, 1.2, 0]} fontSize={0.8} anchorX="center" anchorY="middle">
            {e.emoji || "👾"}
          </Text>
        </group>
      ))}

      <TutorialPlayer
        levelData={levelData}
        profile={profile}
        onPositionChange={onPositionChange}
        onComplete={onComplete}
      />
    </>
  );
}

const Tutorial = ({ profile, onComplete }: TutorialProps) => {
  const levelData = useMemo(() => generateTutorialLevel(), []);
  const [currentStep, setCurrentStep] = useState(0);
  const [showingInfo, setShowingInfo] = useState(true);
  const [playerZ, setPlayerZ] = useState(0);

  // Advance steps based on player position
  useEffect(() => {
    if (showingInfo) return;
    const step = TUTORIAL_STEPS[currentStep];
    const nextStep = TUTORIAL_STEPS[currentStep + 1];
    if (nextStep?.triggerZ && playerZ < nextStep.triggerZ) {
      setCurrentStep(prev => prev + 1);
      setShowingInfo(true);
    }
  }, [playerZ, currentStep, showingInfo]);

  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep >= TUTORIAL_STEPS.length - 1;

  // Steps without triggerZ advance on dismiss
  const handleDismiss = () => {
    setShowingInfo(false);
    // If next step also has no triggerZ, auto-show it
    const next = TUTORIAL_STEPS[currentStep + 1];
    if (next && !next.triggerZ) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setShowingInfo(true);
      }, 500);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black">
      <Canvas
        shadows
        camera={{ fov: 60, near: 0.1, far: 200, position: [0, 8, 12] }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#1a1a3a"]} />
        <TutorialScene
          levelData={levelData}
          profile={profile}
          onPositionChange={setPlayerZ}
          onComplete={onComplete}
        />
      </Canvas>

      {/* Tutorial info overlay */}
      {showingInfo && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 animate-fade-in">
          <div className="max-w-md mx-4 card-illustrated p-6 space-y-4 animate-pop-in">
            <div className="text-center">
              <span className="text-5xl">{step.emoji}</span>
            </div>
            <h2 className="font-display text-xl font-bold text-primary text-center text-glow">
              {step.title}
            </h2>
            <p className="font-body text-sm text-foreground/80 text-center leading-relaxed">
              {step.description}
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleDismiss}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-display text-sm hover:opacity-90 transition-opacity"
              >
                {isLastStep ? "Let's Go!" : "Got it! →"}
              </button>
            </div>
            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 pt-2">
              {TUTORIAL_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentStep ? "bg-primary" : i < currentStep ? "bg-primary/40" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HUD */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/60 text-white px-3 py-1.5 rounded-lg font-display text-sm">
          📖 Tutorial — Step {currentStep + 1}/{TUTORIAL_STEPS.length}
        </div>
      </div>

      {/* Controls reminder */}
      {!showingInfo && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white/70 px-4 py-2 rounded-lg text-xs font-body z-10">
          WASD to move • SPACE to jump • Reach the next platform!
        </div>
      )}
    </div>
  );
};

export default Tutorial;
