import { useRef, useCallback, useState } from "react";

interface TouchControlsProps {
  keysRef: React.MutableRefObject<Set<string>>;
}

const TouchControls = ({ keysRef }: TouchControlsProps) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [touching, setTouching] = useState(false);
  const centerRef = useRef({ x: 0, y: 0 });

  const handleJoystickStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = joystickRef.current?.getBoundingClientRect();
    if (!rect) return;
    centerRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    setTouching(true);
    updateJoystick(touch.clientX, touch.clientY);
  }, []);

  const handleJoystickMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!touching) return;
    const touch = e.touches[0];
    updateJoystick(touch.clientX, touch.clientY);
  }, [touching]);

  const handleJoystickEnd = useCallback(() => {
    setTouching(false);
    setJoystickPos({ x: 0, y: 0 });
    keysRef.current.delete("a");
    keysRef.current.delete("d");
    keysRef.current.delete("w");
    keysRef.current.delete("s");
  }, [keysRef]);

  const updateJoystick = useCallback((cx: number, cy: number) => {
    const center = centerRef.current;
    const maxDist = 40;
    let dx = cx - center.x;
    let dy = cy - center.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxDist) { dx = (dx / dist) * maxDist; dy = (dy / dist) * maxDist; }

    setJoystickPos({ x: dx, y: dy });

    // Map to keys
    const threshold = 15;
    keysRef.current.delete("a");
    keysRef.current.delete("d");
    keysRef.current.delete("w");
    keysRef.current.delete("s");

    if (dx < -threshold) keysRef.current.add("a");
    if (dx > threshold) keysRef.current.add("d");
    if (dy < -threshold) keysRef.current.add("w");
    if (dy > threshold) keysRef.current.add("s");
  }, [keysRef]);

  const handleJumpStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    keysRef.current.add(" ");
  }, [keysRef]);

  const handleJumpEnd = useCallback(() => {
    keysRef.current.delete(" ");
  }, [keysRef]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Joystick - bottom left */}
      <div
        ref={joystickRef}
        className="absolute bottom-16 left-8 w-28 h-28 pointer-events-auto touch-none"
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
      >
        {/* Base */}
        <div className="absolute inset-0 rounded-full bg-white/15 border-2 border-white/25" />
        {/* Stick */}
        <div
          className="absolute w-12 h-12 rounded-full bg-white/40 border-2 border-white/50 transition-transform duration-75"
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`,
          }}
        />
        {/* Direction arrows */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-white/30 text-xs">▲</div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-white/30 text-xs">▼</div>
        <div className="absolute left-1 top-1/2 -translate-y-1/2 text-white/30 text-xs">◀</div>
        <div className="absolute right-1 top-1/2 -translate-y-1/2 text-white/30 text-xs">▶</div>
      </div>

      {/* Jump button - bottom right */}
      <div
        className="absolute bottom-20 right-10 w-20 h-20 pointer-events-auto touch-none"
        onTouchStart={handleJumpStart}
        onTouchEnd={handleJumpEnd}
      >
        <div className="w-full h-full rounded-full bg-primary/40 border-2 border-primary/60 flex items-center justify-center active:bg-primary/60 transition-colors">
          <span className="text-white font-display text-lg font-bold select-none">JUMP</span>
        </div>
      </div>
    </div>
  );
};

export default TouchControls;
