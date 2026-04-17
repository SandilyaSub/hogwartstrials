interface GoldCoinProps {
  size?: number; // px
  className?: string;
}

/**
 * Inline gold-coin icon. Replaces the 🪙 emoji which renders silver/grey
 * on many platforms (looks like a moon). Pure CSS — no asset required.
 */
const GoldCoin = ({ size = 16, className = "" }: GoldCoinProps) => (
  <span
    aria-hidden="true"
    className={`inline-block align-middle rounded-full shrink-0 ${className}`}
    style={{
      width: size,
      height: size,
      background: "radial-gradient(circle at 35% 30%, #fff5b8 0%, #ffd84d 35%, #e0a915 75%, #8a5a06 100%)",
      border: "1px solid #6b3e02",
      boxShadow: "inset 0 -1px 2px rgba(0,0,0,0.35), 0 0 4px rgba(255,200,60,0.4)",
    }}
  />
);

export default GoldCoin;
