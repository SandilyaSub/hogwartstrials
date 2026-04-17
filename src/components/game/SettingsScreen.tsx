import { useTheme } from "@/hooks/useTheme";
import { SHOP_ITEMS, PREMIUM_CHARACTER_IMAGES } from "@/lib/shopData";
import { CHARACTERS } from "@/lib/gameData";
import type { PlayerProfile } from "@/hooks/useGameState";

import harryImg from "@/assets/characters/harry.png";
import hermioneImg from "@/assets/characters/hermione.png";
import ronImg from "@/assets/characters/ron.png";
import lunaImg from "@/assets/characters/luna.png";
import ginnyImg from "@/assets/characters/ginny.png";
import nevilleImg from "@/assets/characters/neville.png";
import dracoImg from "@/assets/characters/draco.png";
import cedricImg from "@/assets/characters/cedric.png";
import choImg from "@/assets/characters/cho.png";

const CHARACTER_IMAGES: Record<string, string> = {
  harry: harryImg, hermione: hermioneImg, ron: ronImg,
  luna: lunaImg, ginny: ginnyImg, neville: nevilleImg,
  draco: dracoImg, cedric: cedricImg, cho: choImg,
};

interface SettingsScreenProps {
  profile: PlayerProfile;
  onActivateTheme: (themeId: string) => void;
  onSelectCharacter: (charId: string) => void;
  onActivatePremiumCharacter: (skinId: string | undefined) => void;
  onBack: () => void;
}

const SettingsScreen = ({
  profile,
  onActivateTheme,
  onSelectCharacter,
  onActivatePremiumCharacter,
  onBack,
}: SettingsScreenProps) => {
  const { theme, toggleTheme } = useTheme();

  const purchasedThemes = SHOP_ITEMS.filter(
    i => i.type === "theme" && profile.purchasedUpgrades?.[i.id]
  );

  const purchasedCharacters = SHOP_ITEMS.filter(
    i => i.type === "character" && profile.purchasedUpgrades?.[i.id]
  );

  const activeSkin = profile.activeCharacterSkin;

  return (
    <div className="h-screen bg-background p-4 overflow-y-auto">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 animate-slide-up">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-secondary/60 border border-border hover:border-primary/30 transition-all text-foreground/60 hover:text-foreground"
          >
            ←
          </button>
          <h1 className="font-display text-2xl font-bold text-primary text-glow">Settings</h1>
        </div>

        {/* Switch Character */}
        <div className="card-illustrated p-5 mb-4 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">🧙 Switch Character</h2>
          <div className="grid grid-cols-3 gap-2">
            {CHARACTERS.map(char => {
              // A base character is "active" only when no premium skin is equipped
              const isActive = !activeSkin && profile.character?.id === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => {
                    // Selecting a base character also unequips any premium skin
                    if (activeSkin) onActivatePremiumCharacter(undefined);
                    onSelectCharacter(char.id);
                  }}
                  className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 border-2 ${
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/40 hover:border-primary/30"
                  }`}
                >
                  <img
                    src={CHARACTER_IMAGES[char.id]}
                    alt={char.name}
                    className="w-12 h-12 rounded-xl object-cover"
                    loading="lazy"
                  />
                  <span className="font-display text-xs font-medium text-foreground truncate w-full text-center">
                    {char.name.split(" ")[0]}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-display font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Premium Characters (purchased from shop) */}
        {purchasedCharacters.length > 0 && (
          <div className="card-illustrated p-5 mb-4 animate-slide-up" style={{ animationDelay: "0.075s" }}>
            <h2 className="font-display text-lg font-semibold text-foreground mb-3">🌟 Legendary Characters</h2>
            <div className="grid grid-cols-3 gap-2">
              {purchasedCharacters.map(char => {
                const isActive = activeSkin === char.id;
                return (
                  <button
                    key={char.id}
                    onClick={() =>
                      onActivatePremiumCharacter(isActive ? undefined : char.id)
                    }
                    className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 border-2 ${
                      isActive
                        ? "border-primary bg-primary/10"
                        : "border-border bg-secondary/40 hover:border-primary/30"
                    }`}
                  >
                    {PREMIUM_CHARACTER_IMAGES[char.id] ? (
                      <img
                        src={PREMIUM_CHARACTER_IMAGES[char.id]}
                        alt={char.name}
                        className="w-12 h-12 rounded-xl object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-2xl">{char.emoji}</span>
                    )}
                    <span className="font-display text-xs font-medium text-foreground truncate w-full text-center">
                      {char.name.split(" ")[0]}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-display font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground font-body mt-3">
              Tap an active character to unequip and revert to your base wizard.
            </p>
          </div>
        )}

        {/* Mode Toggle */}
        <div className="card-illustrated p-5 mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">🌗 Display Mode</h2>
          <button
            onClick={toggleTheme}
            className="w-full p-3.5 rounded-xl bg-secondary/40 border-2 border-border hover:border-primary/30 transition-all flex items-center gap-3 text-foreground"
          >
            <span className="text-xl">{theme === "dark" ? "🌙" : "☀️"}</span>
            <span className="font-body text-sm">{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
            <span className="ml-auto text-xs text-muted-foreground font-body">Tap to switch</span>
          </button>
        </div>

        {/* Color Themes */}
        <div className="card-illustrated p-5 mb-4 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <h2 className="font-display text-lg font-semibold text-foreground mb-3">🎨 Color Themes</h2>
          <div className="space-y-2">
            <button
              onClick={() => onActivateTheme("dark")}
              className={`w-full p-3.5 rounded-xl text-left flex items-center gap-3 transition-all border-2 ${
                (!profile.activeTheme || profile.activeTheme === "dark")
                  ? "border-primary bg-primary/10"
                  : "border-border bg-secondary/40 hover:border-primary/30"
              }`}
            >
              <span className="text-xl">🌑</span>
              <div className="flex-1">
                <p className="font-display text-sm font-medium text-foreground">Default</p>
                <p className="text-xs text-muted-foreground font-body">Standard dark/light theme</p>
              </div>
              {(!profile.activeTheme || profile.activeTheme === "dark") && (
                <span className="text-xs font-display font-semibold text-primary px-2.5 py-1 rounded-full bg-primary/10">ACTIVE</span>
              )}
            </button>

            {purchasedThemes.map(t => (
              <button
                key={t.id}
                onClick={() => onActivateTheme(t.id)}
                className={`w-full p-3.5 rounded-xl text-left flex items-center gap-3 transition-all border-2 ${
                  profile.activeTheme === t.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary/40 hover:border-primary/30"
                }`}
              >
                <span className="text-xl">{t.emoji}</span>
                <div className="flex-1">
                  <p className="font-display text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground font-body">{t.description}</p>
                </div>
                {profile.activeTheme === t.id && (
                  <span className="text-xs font-display font-semibold text-primary px-2.5 py-1 rounded-full bg-primary/10">ACTIVE</span>
                )}
              </button>
            ))}

            {purchasedThemes.length === 0 && (
              <p className="text-sm text-muted-foreground font-body text-center py-3">
                No themes purchased yet. Visit the Shop to buy some! 🏪
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
