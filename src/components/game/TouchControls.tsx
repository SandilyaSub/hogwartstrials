import { useRef, useCallback, useState, useEffect } from "react";

interface TouchControlsProps {
  keysRef: React.MutableRefObject<Set<string>>;
}

const TouchControls = ({ keysRef }: TouchControlsProps) => {
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [jumping, setJumping] = useState(false);
  const activeTouch = useRef<number | null>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const baseCenter = useRef({ x: 0, y: 0 });

  // Fixed joystick geometry (Roblox-style)
  const BASE_SIZE = 120;
  const STICK_SIZE = 56;
  const MAX_DIST = (BASE_SIZE - STICK_SIZE) / 2 + 8;
  const THRESHOLD = 14;

  const updateBaseCenter = useCallback(() => {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    baseCenter.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }, []);

  useEffect(() => {
    updateBaseCenter();
    window.addEventListener("resize", updateBaseCenter);
    window.addEventListener("orientationchange", updateBaseCenter);
    return () => {
      window.removeEventListener("resize", updateBaseCenter);
      window.removeEventListener("orientationchange", updateBaseCenter);
    };
  }, [updateBaseCenter]);

  const updateKeys = useCallback((dx: number, dy: number) => {
    keysRef.current.delete("a");
    keysRef.current.delete("d");
    keysRef.current.delete("w");
    keysRef.current.delete("s");
    if (dx < -THRESHOLD) keysRef.current.add("a");
    if (dx > THRESHOLD) keysRef.current.add("d");
    if (dy < -THRESHOLD) keysRef.current.add("w");
    if (dy > THRESHOLD) keysRef.current.add("s");
  }, [keysRef]);

  const handleJoyStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    updateBaseCenter();
    const touch = e.changedTouches[0];
    activeTouch.current = touch.identifier;
    let dx = touch.clientX - baseCenter.current.x;
    let dy = touch.clientY - baseCenter.current.y;
    const dist = Math.hypot(dx, dy);
    if (dist > MAX_DIST) { dx = (dx / dist) * MAX_DIST; dy = (dy / dist) * MAX_DIST; }
    setJoystickPos({ x: dx, y: dy });
    updateKeys(dx, dy);
  }, [updateKeys, updateBaseCenter, MAX_DIST]);

  const handleJoyMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier !== activeTouch.current) continue;
      let dx = touch.clientX - baseCenter.current.x;
      let dy = touch.clientY - baseCenter.current.y;
      const dist = Math.hypot(dx, dy);
      if (dist > MAX_DIST) { dx = (dx / dist) * MAX_DIST; dy = (dy / dist) * MAX_DIST; }
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
        keysRef.current.delete("a");
        keysRef.current.delete("d");
        keysRef.current.delete("w");
        keysRef.current.delete("s");
      }
    }
  }, [keysRef]);

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

  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none">
      {/* Fixed joystick - bottom-left, always visible (Roblox style) */}
      <div
        ref={baseRef}
        className="absolute bottom-8 left-8 pointer-events-auto touch-none"
        style={{ width: BASE_SIZE, height: BASE_SIZE }}
        onTouchStart={handleJoyStart}
        onTouchMove={handleJoyMove}
        onTouchEnd={handleJoyEnd}
        onTouchCancel={handleJoyEnd}
      >
        {/* Outer base ring */}
        <div className="absolute inset-0 rounded-full bg-black/30 border-[3px] border-white/40 backdrop-blur-sm shadow-xl" />
        {/* Subtle directional hint dots */}
        <div className="absolute inset-0 rounded-full opacity-30">
          <div className="absolute left-1/2 top-1.5 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
          <div className="absolute left-1/2 bottom-1.5 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1.5 -translate-y-1/2 w-1 h-1 rounded-full bg-white" />
          <div className="absolute top-1/2 right-1.5 -translate-y-1/2 w-1 h-1 rounded-full bg-white" />
        </div>
        {/* Inner stick */}
        <div
          className="absolute rounded-full bg-white/70 border-2 border-white shadow-lg"
          style={{
            width: STICK_SIZE,
            height: STICK_SIZE,
            left: "50%",
            top: "50%",
            transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`,
            transition: activeTouch.current === null ? "transform 0.15s ease-out" : "none",
          }}
        />
      </div>

      {/* Jump button - bottom-right, Roblox style */}
      <div
        className="absolute bottom-10 right-10 pointer-events-auto touch-none"
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
