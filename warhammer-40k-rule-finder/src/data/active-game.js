export const gamePhases = ["Command", "Movement", "Shooting", "Charge", "Fight"];

export const coreStratagemTimings = [
  { id: "command-re-roll", name: "Command Re-roll", cp: 1, phases: gamePhases, turn: "either", timing: "Immediately after an eligible roll, test, or saving throw." },
  { id: "counter-offensive", name: "Counter-offensive", cp: 2, phases: ["Fight"], turn: "either", timing: "Just after an enemy unit has fought." },
  { id: "epic-challenge", name: "Epic Challenge", cp: 1, phases: ["Fight"], turn: "either", timing: "When an engaged Character unit is selected to fight." },
  { id: "insane-bravery", name: "Insane Bravery", cp: 1, phases: ["Command"], turn: "your", timing: "Just after failing a Battle-shock test in your Command phase." },
  { id: "grenade-stratagem", name: "Grenade", cp: 1, phases: ["Shooting"], turn: "your", timing: "Before the selected Grenades unit has shot." },
  { id: "tank-shock", name: "Tank Shock", cp: 1, phases: ["Charge"], turn: "your", timing: "After the selected Vehicle ends a Charge move." },
  { id: "rapid-ingress", name: "Rapid Ingress", cp: 1, phases: ["Movement"], turn: "opponent", timing: "At the end of your opponent's Movement phase." },
  { id: "fire-overwatch", name: "Fire Overwatch", cp: 1, phases: ["Movement", "Charge"], turn: "opponent", timing: "After the triggering enemy setup or move." },
  { id: "go-to-ground", name: "Go to Ground", cp: 1, phases: ["Shooting"], turn: "opponent", timing: "After an enemy selects one of your Infantry units as a target." },
  { id: "smokescreen", name: "Smokescreen", cp: 1, phases: ["Shooting"], turn: "opponent", timing: "After an enemy selects one of your Smoke units as a target." },
  { id: "heroic-intervention", name: "Heroic Intervention", cp: 2, phases: ["Charge"], turn: "opponent", timing: "After an enemy unit ends a Charge move." }
];

export const defaultActiveGame = {
  astraDetachmentId: "combined-arms",
  chaosDetachmentId: "pactbound-zealots",
  battleRound: 1,
  firstFaction: "Astra Militarum",
  phase: "Command",
  activeFaction: "Astra Militarum",
  usedRoundReminders: []
};
