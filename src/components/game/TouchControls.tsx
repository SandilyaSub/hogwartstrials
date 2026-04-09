import { useRef, useCallback, useState } from "react";

interface TouchControlsProps {
  keysRef: React.MutableRefObject<Set<string>>;
}

const TouchControls = ({ keysRef }: TouchControlsProps) => {
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [joystickOrigin, setJoystickOrigin] = useState<{ x: number; y: number } | null>(null);
  const [jumping, setJumping] = useState(false);
  const originRef = useRef({ x: 0, y: 0 });
  const activeTouch = useRef<number | null>(null);

  const maxDist = 50;
  const threshold = 12;

  const updateKeys = useCallback((dx: number, dy: number) => {
    keysRef.current.delete("a");
    keysRef.current.delete("d");
    keysRef.current.delete("w");
    keysRef.current.delete("s");
    if (dx < -threshold) keysRef.current.add("a");
    if (dx > threshold) keysRef.current.add("d");
    if (dy < -threshold) keysRef.current.add("w");
    if (dy > threshold) keysRef.current.add("s");
  }, [keysRef, threshold]);

  const handleLeftTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    activeTouch.current = touch.identifier;
    originRef.current = { x: touch.clientX, y: touch.clientY };
    setJoystickOrigin({ x: touch.clientX, y: touch.clientY });
    setJoystickPos({ x: 0, y: 0 });
  }, []);

  const handleLeftTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier !== activeTouch.current) continue;
      const center = originRef.current;
      let dx = touch.clientX - center.x;
      let dy = touch.clientY - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > maxDist) { dx = (dx / dist) * maxDist; dy = (dy / dist) * maxDist; }
      setJoystickPos({ x: dx, y: dy });
      updateKeys(dx, dy);
    }
  }, [updateKeys, maxDist]);

  const handleLeftTouchEnd = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouch.current) {
        activeTouch.current = null;
        setJoystickOrigin(null);
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
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Left half - dynamic joystick zone */}
      <div
        className="absolute left-0 top-0 w-1/2 h-full pointer-events-auto touch-none"
        onTouchStart={handleLeftTouchStart}
        onTouchMove={handleLeftTouchMove}
        onTouchEnd={handleLeftTouchEnd}
        onTouchCancel={handleLeftTouchEnd}
      >
        {/* Joystick appears where you touch */}
        {joystickOrigin && (
          <div
            className="absolute"
            style={{
              left: joystickOrigin.x - 56,
              top: joystickOrigin.y - 56,
              width: 112,
              height: 112,
            }}
          >
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full bg-black/20 border-[3px] border-white/20 backdrop-blur-sm" />
            {/* Inner stick */}
            <div
              className="absolute w-14 h-14 rounded-full bg-white/50 border-2 border-white/70 shadow-lg"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`,
                transition: "none",
              }}
            />
          </div>
        )}
      </div>

      {/* Jump button - bottom right, Roblox style */}
      <div
        className="absolute bottom-16 right-8 pointer-events-auto touch-none"
        onTouchStart={handleJumpStart}
        onTouchEnd={handleJumpEnd}
        onTouchCancel={handleJumpEnd}
      >
        <div
          className={`w-[72px] h-[72px] rounded-full flex items-center justify-center shadow-xl transition-all duration-75 ${
            jumping
              ? "bg-white/50 border-[3px] border-white/70 scale-90"
              : "bg-black/25 border-[3px] border-white/30 backdrop-blur-sm"
          }`}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white drop-shadow">
            <path d="M12 5l-7 7h4v7h6v-7h4L12 5z" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TouchControls;
