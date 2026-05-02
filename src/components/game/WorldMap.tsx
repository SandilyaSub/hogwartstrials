import { WORLDS, MENTOR_QUOTES } from "@/lib/gameData";
import type { PlayerProfile } from "@/hooks/useGameState";
import { useState } from "react";
import GoldCoin from "./GoldCoin";
import FestivalsPanel from "./FestivalsPanel";

import harryImg from "@/assets/characters/harry.png";
import hermioneImg from "@/assets/characters/hermione.png";
import ronImg from "@/assets/characters/ron.png";
import lunaImg from "@/assets/characters/luna.png";
import ginnyImg from "@/assets/characters/ginny.png";
import nevilleImg from "@/assets/characters/neville.png";
import dracoImg from "@/assets/characters/draco.png";
import cedricImg from "@/assets/characters/cedric.png";
import choImg from "@/assets/characters/cho.png";

import owlImg from "@/assets/pets/owl.png";
import catImg from "@/assets/pets/cat.png";
import toadImg from "@/assets/pets/toad.png";
import ratImg from "@/assets/pets/rat.png";
import phoenixImg from "@/assets/pets/phoenix.png";
import hippogriffImg from "@/assets/pets/hippogriff.png";
import thestralImg from "@/assets/pets/thestral.png";
import dragonImg from "@/assets/pets/dragon.png";
import nifflerImg from "@/assets/pets/niffler.png";
import basiliskImg from "@/assets/pets/basilisk.png";
import occamyImg from "@/assets/pets/occamy.png";
import grimImg from "@/assets/pets/grim.png";
import spectreCatImg from "@/assets/festivals/pet_spectre_cat.png";
import yuleFoxImg from "@/assets/festivals/pet_yule_fox.png";
import diyaPeacockImg from "@/assets/festivals/pet_diya_peacock.png";
import amourFawnImg from "@/assets/festivals/pet_amour_fawn.png";
import seashellTurtleImg from "@/assets/festivals/pet_seashell_turtle.png";
import sunPhoenixImg from "@/assets/festivals/pet_sun_phoenix.png";
import newYearOwlImg from "@/assets/festivals/pet_new_year_owl.png";

import world1Img from "@/assets/worlds/world1_philosopher.png";
import world2Img from "@/assets/worlds/world2_chamber.png";
import world3Img from "@/assets/worlds/world3_azkaban.png";
import world4Img from "@/assets/worlds/world4_goblet.png";
import world5Img from "@/assets/worlds/world5_phoenix.png";
import world6Img from "@/assets/worlds/world6_prince.png";
import world7Img from "@/assets/worlds/world7_hallows.png";

const CHARACTER_IMAGES: Record<string, string> = {
  harry: harryImg, hermione: hermioneImg, ron: ronImg,
  luna: lunaImg, ginny: ginnyImg, neville: nevilleImg,
  draco: dracoImg, cedric: cedricImg, cho: choImg,
};

const WORLD_IMAGES: Record<number, string> = {
  1: world1Img, 2: world2Img, 3: world3Img, 4: world4Img,
  5: world5Img, 6: world6Img, 7: world7Img,
};

const PET_IMAGES: Record<string, string> = {
  owl: owlImg, cat: catImg, toad: toadImg, rat: ratImg,
  phoenix: phoenixImg, hippogriff: hippogriffImg, thestral: thestralImg,
  dragon: dragonImg, niffler: nifflerImg, basilisk: basiliskImg,
  occamy: occamyImg, grim: grimImg,
  festival_spectre_cat: spectreCatImg,
  festival_yule_fox: yuleFoxImg,
  festival_diya_peacock: diyaPeacockImg,
  festival_amour_fawn: amourFawnImg,
  festival_seashell_turtle: seashellTurtleImg,
  festival_sun_phoenix: sunPhoenixImg,
  festival_new_year_owl: newYearOwlImg,
};

interface WorldMapProps {
  profile: PlayerProfile;
  onStartLevel: (worldId: number, levelIdx: number) => void;
  onOpenPetStore: () => void;
  onOpenShop?: () => void;
  onOpenFeedback?: () => void;
  onOpenSettings?: () => void;
  onOpenLeaderboard?: () => void;
  onStartFestivalQuest?: (questId: string) => void;
  onOpenFestivalRewards?: () => void;
  onOpenSocial?: () => void;
  onResetGame?: () => void;
}

const WorldMap = ({ profile, onStartLevel, onOpenPetStore, onOpenShop, onOpenFeedback, onOpenSettings, onOpenLeaderboard, onStartFestivalQuest, onOpenFestivalRewards, onOpenSocial, onResetGame }: WorldMapProps) => {
  const [expandedWorld, setExpandedWorld] = useState<number | null>(null);
  const [showMentor, setShowMentor] = useState(false);

  const isLevelUnlocked = (worldId: number, levelIdx: number) => {
    if (worldId === 1 && levelIdx === 0) return true;
    const prevLevelId = levelIdx > 0
      ? WORLDS[worldId - 1].levels[levelIdx - 1].id
      : WORLDS[worldId - 2]?.levels[WORLDS[worldId - 2].levels.length - 1]?.id;
    return prevLevelId ? profile.completedLevels.includes(prevLevelId) : false;
  };

  const mentorQuotes = MENTOR_QUOTES[profile.house?.id || "dumbledore"] || MENTOR_QUOTES.dumbledore;
  const randomQuote = mentorQuotes[Math.floor(Math.random() * mentorQuotes.length)];

  return (
    <div className="h-screen bg-background p-4 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        {/* Header card */}
        <div className="card-illustrated p-5 mb-5 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={CHARACTER_IMAGES[profile.character?.id || "harry"]}
                alt={profile.character?.name || "Character"}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/30"
              />
              <div>
                <h1 className="font-display text-xl font-semibold text-primary text-glow">
                  {profile.username}
                </h1>
                <p className="text-sm text-muted-foreground font-body inline-flex items-center gap-1.5">
                  <span>{profile.house?.name} ·</span>
                  {profile.pet && PET_IMAGES[profile.pet.id] ? (
                    <img src={PET_IMAGES[profile.pet.id]} alt={profile.pet.name} className="w-5 h-5 inline-block object-contain" />
                  ) : (
                    <span>{profile.pet?.emoji || "No pet"}</span>
                  )}
                  <span>·</span>
                  <GoldCoin size={14} /> {profile.coins}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onOpenSettings}
                className="p-2.5 rounded-xl bg-secondary/60 border border-border hover:border-primary/30 transition-all duration-300 text-foreground/60 hover:text-foreground"
              >
                ⚙️
              </button>
              <button onClick={onOpenPetStore} className="p-2.5 rounded-xl bg-secondary/60 border border-border hover:border-primary/30 transition-all duration-300 text-foreground/60 hover:text-foreground font-display text-sm">
                🐾
              </button>
              {onOpenShop && (
                <button onClick={onOpenShop} className="p-2.5 rounded-xl bg-secondary/60 border border-border hover:border-primary/30 transition-all duration-300 text-foreground/60 hover:text-foreground font-display text-sm">
                  🏪
                </button>
               )}
              {/* Owl Post (social) hidden until launch */}
              {false && onOpenSocial && (
                <button onClick={onOpenSocial} className="p-2.5 rounded-xl bg-secondary/60 border border-border hover:border-primary/30 transition-all duration-300 text-foreground/60 hover:text-foreground font-display text-sm" title="Owl Post">
                  🦉
                </button>
              )}
              {onOpenFeedback && (
                <button onClick={onOpenFeedback} className="p-2.5 rounded-xl bg-secondary/60 border border-border hover:border-primary/30 transition-all duration-300 text-foreground/60 hover:text-foreground font-display text-sm">
                  📝
                </button>
               )}
               {onOpenLeaderboard && (
                 <button onClick={onOpenLeaderboard} className="p-2.5 rounded-xl bg-secondary/60 border border-border hover:border-primary/30 transition-all duration-300 text-foreground/60 hover:text-foreground font-display text-sm">
                   🏆
                 </button>
               )}
               {onOpenFestivalRewards && (
                 <button
                   onClick={onOpenFestivalRewards}
                   className="p-2.5 rounded-xl bg-secondary/60 border border-border hover:border-primary/30 transition-all duration-300 text-foreground/60 hover:text-foreground font-display text-sm"
                   title="Festival Rewards"
                 >
                   🎁
                 </button>
               )}
              <button onClick={() => setShowMentor(true)} className="p-2.5 rounded-xl bg-secondary/60 border border-border hover:border-primary/30 transition-all duration-300 text-foreground/60 hover:text-foreground font-display text-sm">
                🧙
              </button>
              <button onClick={onResetGame} className="p-2.5 rounded-xl bg-secondary/60 border border-destructive/30 hover:border-destructive transition-all duration-300 text-destructive/60 hover:text-destructive font-display text-sm">
                ↺
              </button>
            </div>
          </div>
        </div>

        {/* Mentor popup */}
        {showMentor && (
          <div className="mb-4 card-illustrated p-5 box-glow animate-pop-in">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-display text-sm font-semibold text-primary">{profile.house?.mentor || "Albus Dumbledore"}</p>
                <p className="text-foreground/65 mt-2 italic font-body text-base leading-relaxed">"{randomQuote}"</p>
              </div>
              <button onClick={() => setShowMentor(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1">✕</button>
            </div>
          </div>
        )}

        {/* Festival side-quests */}
        {onStartFestivalQuest && (
          <FestivalsPanel profile={profile} onStartQuest={onStartFestivalQuest} />
        )}

        {/* Worlds */}
        <div className="space-y-3">
          {WORLDS.map((world, wi) => {
            const completedCount = world.levels.filter(l => profile.completedLevels.includes(l.id)).length;
            const isExpanded = expandedWorld === world.id;

            return (
              <div
                key={world.id}
                className="card-illustrated overflow-hidden animate-slide-up transition-all duration-300"
                style={{ animationDelay: `${wi * 0.06}s` }}
              >
                <button
                  onClick={() => setExpandedWorld(isExpanded ? null : world.id)}
                  className="w-full p-4 text-left flex items-center gap-4 hover:bg-secondary/20 transition-all duration-300"
                >
                  <img
                    src={WORLD_IMAGES[world.id]}
                    alt={world.title}
                    className="w-11 h-11 rounded-2xl object-cover shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-semibold" style={{ color: world.color }}>
                      World {world.id}: {world.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-body truncate">{world.subtitle} · {completedCount}/{world.levels.length}</p>
                  </div>
                  <div className="w-20 h-2.5 rounded-full bg-secondary/60 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(completedCount / world.levels.length) * 100}%`, backgroundColor: world.color }}
                    />
                  </div>
                  <span className="text-muted-foreground text-sm transition-transform duration-300" style={{ transform: isExpanded ? "rotate(180deg)" : "" }}>▾</span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-2">
                    {world.levels.map((level, idx) => {
                      const unlocked = isLevelUnlocked(world.id, idx);
                      const completed = profile.completedLevels.includes(level.id);

                      return (
                        <button
                          key={level.id}
                          onClick={() => unlocked && onStartLevel(world.id, idx)}
                          disabled={!unlocked}
                          className={`w-full p-3.5 rounded-xl text-left flex items-center gap-3 transition-all duration-300 animate-pop-in ${
                            completed ? "bg-magic-green/10 border-2 border-magic-green/25" :
                            unlocked ? "bg-secondary/40 border-2 border-border hover:border-primary/30 hover:bg-secondary/60" :
                            "bg-secondary/15 border-2 border-border/30 opacity-35 cursor-not-allowed"
                          }`}
                          style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                          <span className="text-lg">{completed ? "✅" : level.isBoss ? "💀" : unlocked ? "🔓" : "🔒"}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-display text-sm font-medium text-foreground">{level.name}</p>
                            <p className="text-xs text-muted-foreground font-body truncate">{level.description}</p>
                          </div>
                          {level.isBoss && (
                            <span className="text-xs font-display font-semibold text-destructive px-2.5 py-1 rounded-full bg-destructive/10">
                              BOSS
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
