import { useRef, useCallback, useState } from "react";

interface TouchControlsProps {
  keysRef: React.MutableRefObject<Set<string>>;
}

const TouchControls = ({ keysRef }: TouchControlsProps) => {
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [jumping, setJumping] = useState(false);
  const activeTouch = useRef<number | null>(null);
  // Anchor where the user first touched — joystick recenters there for natural feel
  const anchor = useRef({ x: 0, y: 0 });

  // Joystick geometry
  const BASE_SIZE = 120;
  const STICK_SIZE = 56;
  const MAX_DIST = (BASE_SIZE - STICK_SIZE) / 2 + 8;
  const THRESHOLD = 12;

  const updateKeys = useCallback((dx: number, dy: number) => {
    const k = keysRef.current;
    // Compute desired state, only mutate on change to avoid thrash
    const wantLeft = dx < -THRESHOLD;
    const wantRight = dx > THRESHOLD;
    const wantUp = dy < -THRESHOLD;
    const wantDown = dy > THRESHOLD;

    if (wantLeft) k.add("a"); else k.delete("a");
    if (wantRight) k.add("d"); else k.delete("d");
    if (wantUp) k.add("w"); else k.delete("w");
    if (wantDown) k.add("s"); else k.delete("s");
  }, [keysRef]);

  const clearMoveKeys = useCallback(() => {
    const k = keysRef.current;
    k.delete("a");
    k.delete("d");
    k.delete("w");
    k.delete("s");
  }, [keysRef]);

  const handleJoyStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    activeTouch.current = touch.identifier;
    // Anchor at the touch point so joystick is relative — first touch = center
    anchor.current = { x: touch.clientX, y: touch.clientY };
    setJoystickPos({ x: 0, y: 0 });
  }, []);

  const handleJoyMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier !== activeTouch.current) continue;
      let dx = touch.clientX - anchor.current.x;
      let dy = touch.clientY - anchor.current.y;
      const dist = Math.hypot(dx, dy);
      if (dist > MAX_DIST) {
        dx = (dx / dist) * MAX_DIST;
        dy = (dy / dist) * MAX_DIST;
      }
      setJoystickPos({ x: dx, y: dy });
      updateKeys(dx, dy);
    }
  }, [updateKeys, MAX_DIST]);

  const handleJoyEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouch.current) {
        activeTouch.current = null;
        setJoystickPos({ x: 0, y: 0 });
        clearMoveKeys();
      }
    }
  }, [clearMoveKeys]);

  const handleJumpStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    keysRef.current.add(" ");
    setJumping(true);
  }, [keysRef]);

  const handleJumpEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    keysRef.current.delete(" ");
    setJumping(false);
  }, [keysRef]);

  const isActive = activeTouch.current !== null;

  return (
    <div
      className="fixed inset-0 pointer-events-none select-none"
      style={{ zIndex: 20 }}
    >
      {/* Joystick zone — bottom-left half of screen, anchored to safe area */}
      <div
        className="absolute pointer-events-auto touch-none"
        style={{
          left: 0,
          right: "50%",
          bottom: 0,
          // Use safe-area + dynamic viewport so it's always reachable above mobile UI
          top: "40%",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          paddingLeft: "env(safe-area-inset-left, 0px)",
        }}
        onTouchStart={handleJoyStart}
        onTouchMove={handleJoyMove}
        onTouchEnd={handleJoyEnd}
        onTouchCancel={handleJoyEnd}
      >
        {/* Visible joystick base — follows the touch anchor when active, default position when idle */}
        <div
          className="absolute rounded-full bg-black/30 border-[3px] border-white/40 backdrop-blur-sm shadow-xl"
          style={{
            width: BASE_SIZE,
            height: BASE_SIZE,
            left: isActive ? anchor.current.x - BASE_SIZE / 2 : 32,
            top: isActive
              ? anchor.current.y - BASE_SIZE / 2 - (window.innerHeight * 0.4)
              : `calc(100% - ${BASE_SIZE}px - 32px - env(safe-area-inset-bottom, 0px))`,
            transition: isActive ? "none" : "opacity 0.2s",
            opacity: isActive ? 0.95 : 0.7,
          }}
        >
          {/* Directional hint dots */}
          <div className="absolute inset-0 rounded-full opacity-30 pointer-events-none">
            <div className="absolute left-1/2 top-1.5 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
            <div className="absolute left-1/2 bottom-1.5 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
            <div className="absolute top-1/2 left-1.5 -translate-y-1/2 w-1 h-1 rounded-full bg-white" />
            <div className="absolute top-1/2 right-1.5 -translate-y-1/2 w-1 h-1 rounded-full bg-white" />
          </div>
          {/* Inner stick */}
          <div
            className="absolute rounded-full bg-white/80 border-2 border-white shadow-lg pointer-events-none"
            style={{
              width: STICK_SIZE,
              height: STICK_SIZE,
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`,
              transition: isActive ? "none" : "transform 0.15s ease-out",
            }}
          />
        </div>
      </div>

      {/* Jump button — bottom-right, safe-area aware */}
      <div
        className="absolute pointer-events-auto touch-none"
        style={{
          right: "calc(32px + env(safe-area-inset-right, 0px))",
          bottom: "calc(40px + env(safe-area-inset-bottom, 0px))",
        }}
        onTouchStart={handleJumpStart}
        onTouchEnd={handleJumpEnd}
        onTouchCancel={handleJumpEnd}
      >
        <div
          className={`w-[84px] h-[84px] rounded-full flex items-center justify-center shadow-xl transition-all duration-75 ${
            jumping
              ? "bg-white/60 border-[3px] border-white scale-90"
              : "bg-black/30 border-[3px] border-white/50 backdrop-blur-sm"
          }`}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" className="text-white drop-shadow-md">
            <path d="M12 4l-8 8h5v8h6v-8h5L12 4z" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TouchControls;
