import { useTheme } from "@/hooks/useTheme";
import { SHOP_ITEMS } from "@/lib/shopData";
import type { PlayerProfile } from "@/hooks/useGameState";

interface SettingsScreenProps {
  profile: PlayerProfile;
  onActivateTheme: (themeId: string) => void;
  onBack: () => void;
}

const SettingsScreen = ({ profile, onActivateTheme, onBack }: SettingsScreenProps) => {
  const { theme, toggleTheme } = useTheme();

  const purchasedThemes = SHOP_ITEMS.filter(
    i => i.type === "theme" && profile.purchasedUpgrades?.[i.id]
  );

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

        {/* Mode Toggle */}
        <div className="card-illustrated p-5 mb-4 animate-slide-up" style={{ animationDelay: "0.05s" }}>
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
        <div className="card-illustrated p-5 mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
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