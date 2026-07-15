const enhancement = (name, points) => ({ name, points });
const stratagem = (name, cp, type) => ({ name, cp, type });

export const communityArchiveSource = {
  label: "Wahapedia archived 10th Edition faction transcription",
  version: "10th Edition faction data version 1.6, cross-checked July 2026",
  verificationLevel: "Community-transcribed, officially cross-checked",
  verificationState: "cross-checked-transcription",
  astraUrl: "https://wahapedia.ru/wh40k10ed/factions/astra-militarum/",
  chaosUrl: "https://wahapedia.ru/wh40k10ed/factions/chaos-space-marines/"
};

export const detachmentRulesById = {
  "combined-arms": {
    enhancements: [enhancement("Death Mask of Ollanius", 10), enhancement("Drill Commander", 20), enhancement("Grand Strategist", 15), enhancement("Reactive Command", 15)],
    stratagems: [stratagem("Coordinated Action", 1, "Battle Tactic"), stratagem("Reinforcements!", 2, "Strategic Ploy"), stratagem("Flexible Command", 2, "Strategic Ploy"), stratagem("Fields of Fire", 1, "Battle Tactic"), stratagem("Inspired Command", 1, "Epic Deed"), stratagem("Stalwart Protector", 1, "Battle Tactic")]
  },
  "bridgehead-strike": {
    enhancements: [enhancement("Bombast-class Vox-array", 35), enhancement("Priority-drop Beacon", 30), enhancement("Shroud Projector", 15), enhancement("Advance Augury", 15)],
    stratagems: [stratagem("Bellicosa Drop", 1, "Battle Tactic"), stratagem("Firing Hot", 2, "Battle Tactic"), stratagem("Fire and Relocate", 1, "Strategic Ploy"), stratagem("Servo-designators", 1, "Strategic Ploy"), stratagem("Aerial Extraction", 1, "Epic Deed"), stratagem("On My Position", 1, "Epic Deed")]
  },
  "mechanised-assault": {
    enhancements: [enhancement("Bold Leadership", 25), enhancement("Sacred Unguents", 10), enhancement("Smoke Grenades", 10), enhancement("Vanguard Honours", 15)],
    stratagems: [stratagem("Vox-relay", 1, "Wargear"), stratagem("Rapid Dispersal", 1, "Strategic Ploy"), stratagem("Clear and Secure", 1, "Battle Tactic"), stratagem("Swift Interception", 1, "Battle Tactic"), stratagem("Hasty Extraction", 1, "Battle Tactic"), stratagem("Move Out", 1, "Strategic Ploy")]
  },
  "hammer-of-the-emperor": {
    enhancements: [enhancement("Calm Under Fire", 15), enhancement("Indomitable Steed", 15), enhancement("Regimental Banner", 20), enhancement("Veteran Crew", 20)],
    stratagems: [stratagem("Final Hour", 1, "Epic Deed"), stratagem("Blazing Advance", 1, "Battle Tactic"), stratagem("Tactical Withdrawal", 1, "Strategic Ploy"), stratagem("Crash Through", 1, "Strategic Ploy"), stratagem("Furious Cannonade", 1, "Battle Tactic"), stratagem("Ablative Plating", 2, "Wargear")]
  },
  "siege-regiment": {
    enhancements: [enhancement("Eager Advance", 20), enhancement("Flash Grenades", 20), enhancement("Legacy Sidearm", 10), enhancement("Stalwart's Honours", 15)],
    stratagems: [stratagem("Trench Fighters", 1, "Battle Tactic"), stratagem("Over the Top", 2, "Strategic Ploy"), stratagem("Flare Burst", 1, "Wargear"), stratagem("Callous Sacrifice", 1, "Battle Tactic"), stratagem("Furious Fusillade", 1, "Strategic Ploy"), stratagem("Minefield", 1, "Wargear")]
  },
  "recon-element": {
    enhancements: [enhancement("Guerrilla Honours", 25), enhancement("Scare Gas Grenades", 5), enhancement("Survival Gear", 5), enhancement("Tripwires", 20)],
    stratagems: [stratagem("Crack Shots", 1, "Battle Tactic"), stratagem("Draw Them Out", 1, "Strategic Ploy"), stratagem("Scramble Field", 1, "Wargear"), stratagem("Courageous Diversion", 1, "Strategic Ploy"), stratagem("Tanglefoot Grenades", 1, "Wargear"), stratagem("Scouting Outriders", 1, "Battle Tactic")]
  },
  deceptors: {
    enhancements: [enhancement("Cursed Fang", 10), enhancement("Falsehood", 10), enhancement("Shroud of Obfuscation", 15), enhancement("Soul Link", 5)],
    stratagems: [stratagem("Detonator", 1, "Wargear"), stratagem("From All Sides", 1, "Battle Tactic"), stratagem("Pick Them Off", 1, "Battle Tactic"), stratagem("Coils of Deception", 1, "Strategic Ploy"), stratagem("Relentless Pursuit", 1, "Strategic Ploy"), stratagem("Scrambled Coordinates", 1, "Strategic Ploy")]
  },
  "renegade-raiders": {
    enhancements: [enhancement("Despot's Claim", 15), enhancement("Dread Reaver", 15), enhancement("Mark of the Hound", 25), enhancement("Tyrant's Lash", 20)],
    stratagems: [stratagem("Unfailingly Obdurate", 1, "Battle Tactic"), stratagem("Scour and Seize", 1, "Battle Tactic"), stratagem("Opportunistic Raiders", 1, "Strategic Ploy"), stratagem("Warpcharged Engines", 1, "Wargear"), stratagem("Ruinous Raid", 1, "Battle Tactic"), stratagem("Reavers' Haste", 1, "Strategic Ploy")]
  },
  "chaos-cult": {
    enhancements: [enhancement("Amulet of Tainted Vigour", 20), enhancement("Cultist's Brand", 20), enhancement("Incendiary Goad", 15), enhancement("Warped Foresight", 10)],
    stratagems: [stratagem("Chosen for Glory", 1, "Battle Tactic"), stratagem("Selfless Demise", 1, "Strategic Ploy"), stratagem("Infernal Sacrifice", 1, "Battle Tactic"), stratagem("Crazed Focus", 1, "Battle Tactic"), stratagem("Reckless Haste", 1, "Strategic Ploy"), stratagem("Mortal Thralls", 1, "Strategic Ploy")]
  },
  "pactbound-zealots": {
    enhancements: [enhancement("Eye of Tzeentch", 15), enhancement("Intoxicating Elixir", 15), enhancement("Orbs of Unlife", 15), enhancement("Talisman of Burning Blood", 15)],
    stratagems: [stratagem("Eye of the Gods", 1, "Epic Deed"), stratagem("Eternal Hate", 1, "Strategic Ploy"), stratagem("Profane Zeal", 1, "Battle Tactic"), stratagem("Skinshift", 1, "Epic Deed"), stratagem("Torpefying Refrain", 1, "Strategic Ploy"), stratagem("Festering Miasma", 1, "Strategic Ploy")]
  },
  "veterans-long-war": {
    enhancements: [enhancement("Eager for Vengeance", 20), enhancement("Eye of Abaddon", 15), enhancement("Mark of Legend", 10), enhancement("Warmaster's Gift", 15)],
    stratagems: [stratagem("Endless Ire", 2, "Epic Deed"), stratagem("Contemptuous Disregard", 1, "Battle Tactic"), stratagem("Bringers of Despair", 2, "Epic Deed"), stratagem("Black Crusade", 1, "Strategic Ploy"), stratagem("Let the Galaxy Burn", 1, "Battle Tactic"), stratagem("Millennia of Experience", 1, "Strategic Ploy")]
  },
  "fellhammer-siege-host": {
    enhancements: [enhancement("Bastion Plate", 10), enhancement("Iron Artifice", 10), enhancement("Ironbound Enmity", 15), enhancement("Warp Tracer", 20)],
    stratagems: [stratagem("Persistent Assailants", 1, "Battle Tactic"), stratagem("Brutal Attrition", 1, "Epic Deed"), stratagem("Pitiless Cannonade", 1, "Battle Tactic"), stratagem("Point-blank Destruction", 1, "Battle Tactic"), stratagem("Steadfast Determination", 1, "Strategic Ploy"), stratagem("Siegecraft", 1, "Strategic Ploy")]
  },
  "dread-talons": {
    enhancements: [enhancement("Eater of Dread", 15), enhancement("Night's Shroud", 20), enhancement("Warp-fuelled Thrusters", 20), enhancement("Willbreaker", 10)],
    stratagems: [stratagem("Depthless Cruelty", 1, "Battle Tactic"), stratagem("Bloody Example", 1, "Epic Deed"), stratagem("Pitiless Hunters", 1, "Battle Tactic"), stratagem("Relentless Terror", 1, "Strategic Ploy"), stratagem("Screaming Descent", 1, "Strategic Ploy"), stratagem("Merciless Pursuit", 1, "Strategic Ploy")]
  },
  "soulforged-warpack": {
    enhancements: [enhancement("Forge's Blessing", 20), enhancement("Invigorated Mechatendrils", 15), enhancement("Tempting Addendum", 25), enhancement("Soul Harvester", 15)],
    stratagems: [stratagem("Desperate Pledge", 1, "Battle Tactic"), stratagem("Glut of Souls", 1, "Strategic Ploy"), stratagem("Daemonic Possession", 1, "Epic Deed"), stratagem("Unstoppable Rampage", 1, "Strategic Ploy"), stratagem("Predatory Pursuit", 1, "Strategic Ploy"), stratagem("Feeding Frenzy", 1, "Strategic Ploy")]
  }
};
