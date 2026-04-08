/** Short narrative blurbs tying each level to the Harry Potter books. */
export const LEVEL_STORIES: Record<string, { quote: string; narrator: string; story: string }> = {
  // World 1 — Philosopher's Stone
  "1-1": {
    narrator: "Rubeus Hagrid",
    quote: "Yer a wizard, Harry.",
    story: "You've just received your Hogwarts letter and crossed the Black Lake by boat. The towering castle awaits — but first, you must make your way across the landing docks and up the winding path to the entrance hall.",
  },
  "1-2": {
    narrator: "Percy Weasley",
    quote: "The staircases like to change, so do pay attention.",
    story: "Your first night at Hogwarts, and the Grand Staircase has other plans. The enchanted stairs shift and rotate without warning — one wrong step and you'll end up in a corridor you've never seen before.",
  },
  "1-3": {
    narrator: "Hermione Granger",
    quote: "Honestly, if you two hadn't found me, I'd probably be dead.",
    story: "A mountain troll has been let loose in the dungeons! The corridors are pitch black — you'll need Lumos to light your way through the darkness while avoiding the troll's rampage.",
  },
  "1-4": {
    narrator: "Ron Weasley",
    quote: "It's the only way… I've got to be taken.",
    story: "To reach the Philosopher's Stone, you must cross McGonagall's enchanted chessboard. The giant chess pieces move on their own, and the tiles shift beneath your feet. One false step and you'll be crushed.",
  },
  "1-5": {
    narrator: "Albus Dumbledore",
    quote: "To the well-organised mind, death is but the next great adventure.",
    story: "Professor Quirrell stands before the Mirror of Erised, but he's not alone — Voldemort's face lurks beneath his turban. You must face them both to protect the Philosopher's Stone!",
  },

  // World 2 — Chamber of Secrets
  "2-1": {
    narrator: "Arthur Weasley",
    quote: "Never trust anything that can think for itself if you can't see where it keeps its brain.",
    story: "Summer holidays are over, and you've arrived at Diagon Alley for school supplies. But the rooftops of the magical shopping district hide a secret parkour route — race across the chimney tops above Flourish and Blotts!",
  },
  "2-2": {
    narrator: "Ron Weasley",
    quote: "The car! We can fly the car to Hogwarts!",
    story: "The barrier at Platform 9¾ has sealed itself! Your only option: Mr Weasley's enchanted Ford Anglia. Dodge the Hogwarts Express, soar past clouds, and try not to crash into the Whomping Willow.",
  },
  "2-3": {
    narrator: "Gilderoy Lockhart",
    quote: "Celebrity is as celebrity does, remember that.",
    story: "Professor Lockhart has given you detention — signing his fan mail! But the classroom is chaos: Cornish pixies have escaped again and Lockhart's enchanted love letters are flying everywhere. Survive until the bell rings!",
  },
  "2-4": {
    narrator: "Hermione Granger",
    quote: "Even in the wizarding world, hearing voices isn't a good sign.",
    story: "You've discovered the entrance to the Chamber of Secrets behind the bathroom sinks. The ancient pipes are full of locked doors that only open with Alohomora — solve the sequence to descend deeper.",
  },
  "2-5": {
    narrator: "Tom Riddle",
    quote: "Let's match the power of Lord Voldemort against the famous Harry Potter.",
    story: "Deep in the Chamber, the Basilisk awaits — a thousand-year-old serpent that can kill with a single glance. Armed with the Sword of Gryffindor, you must strike before its deadly eyes find you!",
  },

  // World 3 — Prisoner of Azkaban
  "3-1": {
    narrator: "Hermione Granger",
    quote: "Honestly, don't you two read?",
    story: "Hermione's Time-Turner is malfunctioning! Platforms phase in and out of existence as time ripples around you. What was solid ground a moment ago might vanish — and what was empty air might suddenly appear.",
  },
  "3-2": {
    narrator: "Albus Dumbledore",
    quote: "Mysterious thing, time. Powerful, and when meddled with, dangerous.",
    story: "The Hogwarts Clock Tower stretches impossibly high. Its gears and pendulums create moving platforms, and the hands of the great clock sweep across your path. Climb to the top before time runs out!",
  },
  "3-3": {
    narrator: "Remus Lupin",
    quote: "The ones who love us never really leave us.",
    story: "Sirius Black has been spotted in the Forbidden Forest! You must race through the ancient woods, leaping over gnarled roots and dodging Buckbeak's territorial swoops, to reach the Shrieking Shack.",
  },
  "3-4": {
    narrator: "Sirius Black",
    quote: "If you want to know what a man's like, look at how he treats his inferiors.",
    story: "The Black Lake has frozen over, but the ice is treacherous. Dementors glide above the surface, and the frozen ground offers no grip. Slide and jump your way across before the ice cracks beneath you.",
  },
  "3-5": {
    narrator: "Harry Potter",
    quote: "EXPECTO PATRONUM!",
    story: "Hundreds of Dementors swarm the lakeside! You must cast your Patronus and survive their soul-draining assault. Only the happiest memory you possess can power a charm strong enough to drive them back.",
  },

  // World 4 — Goblet of Fire
  "4-1": {
    narrator: "Barty Crouch Sr.",
    quote: "The Triwizard Tournament will be held at Hogwarts.",
    story: "The First Task: face a Hungarian Horntail! The dragon guards its nest in a rocky arena, breathing fire across every path. You must outmanoeuvre it to claim the golden egg without getting scorched.",
  },
  "4-2": {
    narrator: "Cedric Diggory",
    quote: "Take the cup together — it's still a Hogwarts victory.",
    story: "The Triwizard maze has transformed into treacherous cliff faces. Enchanted hedges grow along vertical walls, and the path forward requires death-defying leaps across crumbling stone pillars.",
  },
  "4-3": {
    narrator: "Moaning Myrtle",
    quote: "I'd try the egg in the water if I were you.",
    story: "The Second Task sends you beneath the Black Lake. Gillyweed lets you breathe, but the murky depths are full of Grindylows and tangled weeds. Swim through the underwater maze to rescue your friend!",
  },
  "4-4": {
    narrator: "Lord Voldemort",
    quote: "I can touch you now.",
    story: "The Triwizard Cup was a Portkey — you've been transported to a dark graveyard in Little Hangleton. Tombstones loom in the fog, Death Eaters close in, and the Dark Lord himself has returned.",
  },
  "4-5": {
    narrator: "Albus Dumbledore",
    quote: "Remember, if the time should come, you must be strong.",
    story: "The Hungarian Horntail has broken free of its chains! It chases you across the Hogwarts rooftops in a desperate flight. Outrun its fire and reach safety before the beast catches you!",
  },

  // World 5 — Order of the Phoenix
  "5-1": {
    narrator: "Nymphadora Tonks",
    quote: "Don't call me Nymphadora!",
    story: "The Ministry of Magic's grand atrium stretches before you — but the Death Eaters have infiltrated it. Navigate the enchanted lifts, dodge hexes, and make your way to the Department of Mysteries.",
  },
  "5-2": {
    narrator: "Sybill Trelawney",
    quote: "The one with the power to vanquish the Dark Lord approaches...",
    story: "Rows upon rows of glowing prophecy orbs line the shelves of the Hall of Prophecy. The shelves topple like dominoes as Death Eaters blast them apart — grab the prophecy and run!",
  },
  "5-3": {
    narrator: "Harry Potter",
    quote: "Every great wizard in history has started out as nothing more than what we are now: students.",
    story: "Welcome to Dumbledore's Army! The Room of Requirement has transformed into a training ground. Master your jumping, dodging, and spellwork on this magical obstacle course.",
  },
  "5-4": {
    narrator: "Bellatrix Lestrange",
    quote: "I killed Sirius Black! I killed Sirius Black!",
    story: "The battle rages through the Ministry's corridors! Walls crack, ceilings collapse, and jets of light fly in every direction. Sprint through the chaos as the Order and Death Eaters clash around you.",
  },
  "5-5": {
    narrator: "Albus Dumbledore",
    quote: "It is the unknown we fear when we look upon death and darkness.",
    story: "Voldemort himself has arrived at the Ministry! Dumbledore faces him in the atrium in a titanic duel. Fight through the magical shockwaves and survive the Dark Lord's wrath!",
  },

  // World 6 — Half-Blood Prince
  "6-1": {
    narrator: "Horace Slughorn",
    quote: "I would have thought an expert like you would have known that.",
    story: "Professor Slughorn's Potions classroom is full of bubbling cauldrons and simmering hazards. Follow the Half-Blood Prince's annotations to navigate through potion fumes, acid splashes, and Amortentia clouds.",
  },
  "6-2": {
    narrator: "Albus Dumbledore",
    quote: "I am not worried, Harry. I am with you.",
    story: "The Astronomy Tower looms above the castle. Death Eaters have breached the grounds and the tower itself is crumbling. Climb through collapsing stairwells and shattered windows to reach the top.",
  },
  "6-3": {
    narrator: "Draco Malfoy",
    quote: "I have to do this. I have to kill you.",
    story: "Draco has been sneaking into the Room of Requirement to repair the Vanishing Cabinet. The room shifts between realities — furniture appears and disappears, creating an ever-changing labyrinth.",
  },
  "6-4": {
    narrator: "Albus Dumbledore",
    quote: "Drink this. You must drink it all.",
    story: "Dumbledore has brought you to a sea cave to retrieve Slytherin's locket. The dark lake is full of Inferi — the reanimated dead — and the only path crosses over their cursed waters.",
  },
  "6-5": {
    narrator: "Severus Snape",
    quote: "Avada Kedavra.",
    story: "Deep within the cave, the Horcrux is guarded by dark enchantments. The potion of despair, the rising Inferi, and the crushing darkness — survive it all to destroy a piece of Voldemort's soul.",
  },

  // World 7 — Deathly Hallows
  "7-1": {
    narrator: "Alastor Moody",
    quote: "CONSTANT VIGILANCE!",
    story: "The Order is moving you from Privet Drive under cover of darkness, but Voldemort's Death Eaters have found you! Seven Potters soar through the night sky — dodge curses, avoid Voldemort, and reach the Burrow alive.",
  },
  "7-2": {
    narrator: "Neville Longbottom",
    quote: "I'll join you when hell freezes over! Dumbledore's Army!",
    story: "The Battle of Hogwarts rages. The castle you once called home is shattered — towers crumble, bridges collapse, and giants stride through the grounds. Navigate the ruins of the place you love.",
  },
  "7-3": {
    narrator: "Hermione Granger",
    quote: "We've never done anything like this before — stolen a dragon!",
    story: "You've broken into Gringotts and freed the Ukrainian Ironbelly! Cling to the half-blind dragon as it smashes through the bank's ceiling and soars over London. Hold on tight!",
  },
  "7-4": {
    narrator: "Harry Potter",
    quote: "I never wanted any of you to die for me.",
    story: "Hogwarts is in ruins, but you must reach the top of the broken castle. The final Horcrux awaits in the Room of Requirement, and Fiendfyre has consumed everything. Climb through the inferno.",
  },
  "7-5": {
    narrator: "Lord Voldemort",
    quote: "Avada Kedavra!",
    story: "This is the end. Lord Voldemort stands in the Great Hall, his red eyes burning with fury. The Elder Wand is in his hand — but it answers to you. This is the final battle. Everything ends here.",
  },
};
