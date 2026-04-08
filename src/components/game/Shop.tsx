import { SHOP_ITEMS, getShopCategory, type ShopItem } from "@/lib/shopData";
import type { PlayerProfile } from "@/hooks/useGameState";

interface ShopProps {
  profile: PlayerProfile;
  onPurchase: (item: ShopItem) => void;
  onBack: () => void;
}

const Shop = ({ profile, onPurchase, onBack }: ShopProps) => {
  const purchased = profile.purchasedUpgrades || {};
  const categories = ["upgrade", "consumable", "theme", "song"] as const;

  return (
    <div className="min-h-screen bg-background p-4 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
        {/* Header */}
        <div className="card-illustrated p-5 flex items-center gap-4">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground font-display transition-colors text-lg">←</button>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-semibold text-primary text-glow">🏪 Magical Shop</h2>
            <p className="text-sm text-muted-foreground font-body">Spend your coins on upgrades, themes & music</p>
          </div>
          <div className="text-right">
            <p className="font-display text-xl font-bold text-primary">🪙 {profile.coins}</p>
            <p className="text-xs text-muted-foreground font-body">coins</p>
          </div>
        </div>

        {/* Categories */}
        {categories.map(cat => {
          const items = SHOP_ITEMS.filter(i => i.type === cat);
          return (
            <div key={cat} className="space-y-3">
              <h3 className="font-display text-lg font-semibold text-foreground/80 px-1">
                {getShopCategory(cat)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.map((item, i) => {
                  const isDefault = item.id === "song_default";
                  const owned = isDefault || purchased[item.id] === true;
                  const canAfford = profile.coins >= item.cost;
                  const isActiveTheme = item.type === "theme" && profile.activeTheme === item.id;
                  const isActiveSong = item.type === "song" && profile.activeSong === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => !owned && canAfford && onPurchase(item)}
                      disabled={owned || !canAfford}
                      className={`card-illustrated p-4 text-left transition-all duration-300 animate-pop-in ${
                        (isActiveTheme || isActiveSong) ? "!border-primary box-glow !bg-primary/8" :
                        owned ? "!opacity-60" :
                        canAfford ? "hover:border-primary/30 hover:scale-[1.02]" :
                        "!opacity-40 cursor-not-allowed"
                      }`}
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{item.emoji}</span>
                        <div className="flex-1">
                          <h4 className="font-display font-semibold text-foreground text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground font-body">{item.description}</p>
                        </div>
                        <div className="text-right">
                          {owned ? (
                            <span className="text-xs font-display font-semibold text-primary px-2 py-1 rounded-full bg-primary/12">
                              {isActiveTheme || isActiveSong ? "ACTIVE" : isDefault ? "DEFAULT" : "OWNED"}
                            </span>
                          ) : (
                            <span className={`text-sm font-display font-bold ${canAfford ? "text-primary" : "text-muted-foreground"}`}>
                              🪙 {item.cost}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Shop;
