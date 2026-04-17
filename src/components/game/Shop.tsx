import { SHOP_ITEMS, getShopCategory, PREMIUM_CHARACTER_IMAGES, ACCESSORY_IMAGES, type ShopItem } from "@/lib/shopData";
import type { PlayerProfile } from "@/hooks/useGameState";

interface ShopProps {
  profile: PlayerProfile;
  onPurchase: (item: ShopItem) => void;
  onActivate: (item: ShopItem) => void;
  onBack: () => void;
}

const Shop = ({ profile, onPurchase, onActivate, onBack }: ShopProps) => {
  const purchased = profile.purchasedUpgrades || {};
  const categories = ["character", "accessory", "upgrade", "consumable", "theme"] as const;

  return (
    <div className="h-screen bg-background p-4 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
        {/* Header */}
        <div className="card-illustrated p-5 flex items-center gap-4">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground font-display transition-colors text-lg">←</button>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-semibold text-primary text-glow">🏪 Magical Shop</h2>
            <p className="text-sm text-muted-foreground font-body">Spend your coins on upgrades & themes</p>
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
                  const owned = purchased[item.id] === true;
                  const canAfford = profile.coins >= item.cost;
                  const isActiveTheme = item.type === "theme" && profile.activeTheme === item.id;
                  const isActiveCharacter = item.type === "character" && profile.activeCharacterSkin === item.id;
                  const activeAccessories = profile.activeAccessories || [];
                  const isActiveAccessory = item.type === "accessory" && activeAccessories.includes(item.id);
                  const toggleableOwned = owned && (item.type === "theme" || item.type === "character" || item.type === "accessory");

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (toggleableOwned) {
                          onActivate(item);
                        } else if (!owned && canAfford) {
                          onPurchase(item);
                        }
                      }}
                      disabled={(!owned && !canAfford) || (owned && !toggleableOwned)}
                      className={`card-illustrated p-4 text-left transition-all duration-300 animate-pop-in ${
                        isActiveTheme || isActiveCharacter || isActiveAccessory ? "!border-primary box-glow !bg-primary/8" :
                        owned && !toggleableOwned ? "!opacity-60" :
                        canAfford ? "hover:border-primary/30 hover:scale-[1.02]" :
                        "!opacity-40 cursor-not-allowed"
                      }`}
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div className="flex items-center gap-3">
                        {item.type === "character" && PREMIUM_CHARACTER_IMAGES[item.id] ? (
                          <img
                            src={PREMIUM_CHARACTER_IMAGES[item.id]}
                            alt={item.name}
                            loading="lazy"
                            width={56}
                            height={56}
                            className="w-14 h-14 rounded-xl object-cover border-2 border-border shrink-0"
                          />
                        ) : item.type === "accessory" && ACCESSORY_IMAGES[item.id] ? (
                          <img
                            src={ACCESSORY_IMAGES[item.id]}
                            alt={item.name}
                            loading="lazy"
                            width={56}
                            height={56}
                            className="w-14 h-14 rounded-xl object-contain bg-secondary/40 border-2 border-border shrink-0 p-1"
                          />
                        ) : (
                          <span className="text-3xl">{item.emoji}</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-semibold text-foreground text-sm truncate">{item.name}</h4>
                          <p className="text-xs text-muted-foreground font-body line-clamp-2">{item.description}</p>
                        </div>
                        <div className="text-right">
                          {owned ? (
                            <span className="text-xs font-display font-semibold text-primary px-2 py-1 rounded-full bg-primary/12">
                              {isActiveTheme || isActiveCharacter || isActiveAccessory ? "ACTIVE" : toggleableOwned ? "TAP" : "OWNED"}
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
