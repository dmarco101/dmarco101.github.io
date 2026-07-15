const officialDownloads = "https://www.warhammer-community.com/en-gb/topics/downloads/";

const source = (faction, archiveUrl) => ({
  label: `${faction} Faction Pack, 10th Edition`,
  version: "Version 1.6, May 2026 final 10th Edition archive",
  officialUrl: officialDownloads,
  archiveUrl,
  verificationLevel: "Community-transcribed, officially version-checked",
  verificationState: "cross-checked-transcription"
});

export const factionRuleGuides = [
  {
    id: "voice-of-command",
    faction: "Astra Militarum",
    title: "Voice of Command",
    aliases: ["orders", "officer orders", "guard orders", "imperial guard orders"],
    summary: "Eligible Officers issue one of six Orders to eligible nearby units, applying a focused characteristic improvement until your next Command phase.",
    timing: ["Issue Orders in your Command phase.", "An Officer can also issue Orders at the end of a phase in which it disembarked from a Transport or was set up on the battlefield."],
    eligibility: ["Your Army Faction must be Astra Militarum.", "The issuing model must have the Officer keyword and Voice of Command.", "The Officer's datasheet states its Orders-per-battle-round limit and eligible recipients.", "Choose one eligible friendly unit within 6 inches of the Officer."],
    sequence: ["Choose an Officer that can still issue an Order.", "Choose one of the six Orders.", "Choose an eligible friendly unit within 6 inches.", "Replace any existing Order on that unit unless a rule explicitly says otherwise.", "Apply the Order until the start of your next Command phase, unless Battle-shock ends it first."],
    restrictions: ["Orders cannot be issued to Battle-shocked units.", "An Order ends if the affected unit becomes Battle-shocked.", "A unit is normally affected by only one Order at a time.", "Only Astra Militarum models in the selected unit receive the benefit."],
    commonMistakes: ["Treating Born Soldiers as the faction army rule. It is the Combined Arms detachment rule.", "Assuming every Officer can order every Astra Militarum unit. Check the Officer's eligible recipient keywords.", "Keeping an Order after the unit becomes Battle-shocked.", "Stacking repeated copies of the same Order."],
    choices: [
      { name: "Move! Move! Move!", shorthand: "+3 inches Move", effect: "Add 3 inches to the Move characteristic of models in the unit.", check: "Use when movement distance matters more than an offensive or defensive characteristic." },
      { name: "Fix Bayonets!", shorthand: "+1 WS", effect: "Improve the Weapon Skill of melee weapons equipped by models in the unit by 1.", check: "This changes Weapon Skill, not the Hit roll modifier." },
      { name: "Take Aim!", shorthand: "+1 BS", effect: "Improve the Ballistic Skill of ranged weapons equipped by models in the unit by 1.", check: "This changes Ballistic Skill, not the Hit roll modifier." },
      { name: "First Rank, Fire! Second Rank, Fire!", shorthand: "+1 Rapid Fire Attack", effect: "Improve the Attacks characteristic of Rapid Fire weapons equipped by models in the unit by 1.", check: "Only Rapid Fire weapons gain the extra attack." },
      { name: "Take Cover!", shorthand: "+1 Save", effect: "Improve the Save characteristic of models in the unit by 1, but never beyond 3+.", check: "This is a characteristic improvement and is separate from the Benefit of Cover." },
      { name: "Duty and Honour!", shorthand: "+1 Leadership and OC", effect: "Improve the Leadership and Objective Control characteristics of models in the unit by 1.", check: "In 10th Edition, improving Leadership by 1 makes the required value one lower." }
    ],
    source: source("Astra Militarum", "https://wahapedia.ru/wh40k10ed/factions/astra-militarum/#Army-Rules")
  },
  {
    id: "dark-pacts",
    faction: "Chaos Space Marines",
    title: "Dark Pacts",
    aliases: ["dark pact", "pact", "lethal hits pact", "sustained hits pact", "heretic astartes army rule"],
    summary: "When an eligible unit is selected to shoot or fight, it can risk mortal wounds by testing Leadership before choosing Lethal Hits or Sustained Hits 1 for that phase.",
    timing: ["Decide each time an eligible unit is selected to shoot or fight.", "Resolve the Leadership test before any benefit from the Dark Pact applies."],
    eligibility: ["Your Army Faction must be Heretic Astartes.", "The selected unit must have the Dark Pacts ability.", "The unit must have been selected to shoot or fight."],
    sequence: ["Select a unit to shoot or fight.", "Choose whether that unit will make a Dark Pact.", "If it does, take a Leadership test immediately.", "If the test fails, the unit suffers D3 mortal wounds.", "Choose Lethal Hits or Sustained Hits 1 for that unit's weapons.", "Apply the selected ability until the end of the phase."],
    restrictions: ["A unit without the Dark Pacts ability cannot use the rule.", "The benefit applies only until the end of the current phase.", "A standard Dark Pact grants one of the two listed abilities, not both.", "Detachment and datasheet rules can modify the test or benefit, so check those after the base sequence."],
    commonMistakes: ["Using the older sequence that tested Leadership after resolving attacks. Final 10th Edition version 1.6 tests first.", "Choosing both Lethal Hits and Sustained Hits 1 without another rule granting both.", "Making the Pact at the start of the phase instead of when the unit is selected.", "Forgetting that a failed test causes D3 mortal wounds even though the chosen weapon benefit still applies."],
    choices: [
      { name: "Lethal Hits", shorthand: "Critical Hits auto-wound", effect: "Critical Hits automatically wound the target.", check: "Strong when bypassing the normal Wound roll is valuable." },
      { name: "Sustained Hits 1", shorthand: "+1 hit per Critical Hit", effect: "Each Critical Hit scores one additional hit.", check: "The additional hit does not itself count as a Critical Hit." }
    ],
    source: source("Chaos Space Marines", "https://wahapedia.ru/wh40k10ed/factions/chaos-space-marines/#Army-Rules")
  }
];
