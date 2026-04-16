import { useState } from "react";
import { SHOP_ITEMS, getShopCategory, type ShopItem } from "@/lib/shopData";
import { PREMIUM_ITEMS, getPremiumCategory, type PremiumItem } from "@/lib/premiumShopData";
import type { PlayerProfile } from "@/hooks/useGameState";
import { toast } from "@/hooks/use-toast";

interface ShopProps {
  profile: PlayerProfile;
  onPurchase: (item: ShopItem) => void;
  onActivate: (item: ShopItem) => void;
  onBack: () => void;
}

const Shop = ({ profile, onPurchase, onActivate, onBack }: ShopProps) => {
  const [tab, setTab] = useState<"coins" | "premium">("coins");
  const purchased = profile.purchasedUpgrades || {};
  const categories = ["upgrade", "consumable", "theme"] as const;
  const premiumCategories = ["character", "powerup", "cosmetic"] as const;

  const handlePremiumPurchase = (item: PremiumItem) => {
    toast({
      title: "Coming Soon! 🚀",
      description: `Real-money purchases will be available soon. Stay tuned for ${item.name}!`,
    });
  };

  return (
    <div className="h-screen bg-background p-4 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-5 animate-slide-up">
        {/* Header */}
        <div className="card-illustrated p-5 flex items-center gap-4">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground font-display transition-colors text-lg">←</button>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-semibold text-primary text-glow">🏪 Magical Shop</h2>
            <p className="text-sm text-muted-foreground font-body">
              {tab === "coins" ? "Spend your coins on upgrades & themes" : "Exclusive premium items"}
            </p>
          </div>
          {tab === "coins" && (
            <div className="text-right">
              <p className="font-display text-xl font-bold text-primary">🪙 {profile.coins}</p>
              <p className="text-xs text-muted-foreground font-body">coins</p>
            </div>
          )}
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-2xl bg-secondary/40 border border-border p-1 gap-1">
          <button
            onClick={() => setTab("coins")}
            className={`flex-1 py-2.5 px-4 rounded-xl font-display text-sm font-semibold transition-all duration-300 ${
              tab === "coins"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🪙 Coin Shop
          </button>
          <button
            onClick={() => setTab("premium")}
            className={`flex-1 py-2.5 px-4 rounded-xl font-display text-sm font-semibold transition-all duration-300 ${
              tab === "premium"
                ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            💎 Premium
          </button>
        </div>

        {/* Coin Shop */}
        {tab === "coins" && categories.map(cat => {
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

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (owned && item.type === "theme") {
                          onActivate(item);
                        } else if (!owned && canAfford) {
                          onPurchase(item);
                        }
                      }}
                      disabled={(!owned && !canAfford) || (owned && item.type !== "theme")}
                      className={`card-illustrated p-4 text-left transition-all duration-300 animate-pop-in ${
                        isActiveTheme ? "!border-primary box-glow !bg-primary/8" :
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
                              {isActiveTheme ? "ACTIVE" : "OWNED"}
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

        {/* Premium Shop */}
        {tab === "premium" && (
          <>
            {/* Premium Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent p-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl" />
              <h3 className="font-display text-lg font-bold text-amber-400 mb-1">✨ Premium Collection</h3>
              <p className="text-sm text-muted-foreground font-body">
                Exclusive items you can't get with coins. Unlock legendary powers & styles!
              </p>
            </div>

            {premiumCategories.map(cat => {
              const items = PREMIUM_ITEMS.filter(i => i.category === cat);
              return (
                <div key={cat} className="space-y-3">
                  <h3 className="font-display text-lg font-semibold text-foreground/80 px-1">
                    {getPremiumCategory(cat)}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {items.map((item, i) => (
                      <button
                        key={item.id}
                        onClick={() => handlePremiumPurchase(item)}
                        className={`relative card-illustrated p-4 text-left transition-all duration-300 animate-pop-in hover:border-amber-500/40 hover:scale-[1.02] ${
                          item.highlight ? "!border-amber-500/30 !bg-amber-500/5" : ""
                        }`}
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        {item.highlight && (
                          <span className="absolute -top-2 -right-2 text-[10px] font-display font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-2 py-0.5 rounded-full shadow-lg">
                            HOT
                          </span>
                        )}
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{item.emoji}</span>
                          <div className="flex-1">
                            <h4 className="font-display font-semibold text-foreground text-sm">{item.name}</h4>
                            <p className="text-xs text-muted-foreground font-body">{item.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-display font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                              {item.priceLabel}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;
