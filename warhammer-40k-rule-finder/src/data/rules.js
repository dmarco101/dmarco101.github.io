import { battlefieldFundamentals } from "./battlefield-fundamentals.js";

export const tenthEditionCoreSource = {
  label: "Warhammer 40,000 Core Rules, 10th Edition",
  version: "September 2024 core rules",
  url: "https://assets.warhammer-community.com/warhammer40000_core%26key_corerules_eng_24.09-5xfayxjekm.pdf",
  verificationState: "official-publication"
};

export const tenthEditionUpdateSource = {
  label: "Warhammer 40,000 Core Rules Updates and Commentary, 10th Edition",
  version: "10th Edition updates",
  url: "https://assets.warhammer-community.com/warhammer40000_core%26key_corerulesupdate%26commentary_eng_24.09-lyrhcoyn9s.pdf",
  verificationState: "official-publication"
};

const coreSourceAt = (pages) => ({ ...tenthEditionCoreSource, version: `September 2024 core rules, ${pages}` });

const entry = (id, title, aliases, category, plainEnglish, whenToCheck, diceImpact, doesNotChange, commonMistakes, example, relatedRuleIds, source = tenthEditionCoreSource, focusTags = ["core", "astra-militarum", "chaos"]) => ({
  id,
  title,
  aliases,
  category,
  focusTags,
  plainEnglish,
  whenToCheck,
  diceImpact,
  doesNotChange,
  commonMistakes,
  example,
  relatedRuleIds,
  source,
  contentStatus: "current",
  sourcePriority: "canonical"
});

export const ruleEntries = [
  ...battlefieldFundamentals,
  entry(
    "mortal-wounds", "Mortal Wounds", ["mw", "mortal", "mortal wound"], "Core concept",
    "Each mortal wound causes 1 damage and bypasses normal armour and invulnerable saving throws.",
    ["A rule says a unit suffers mortal wounds.", "An attack converts its damage into mortal wounds."],
    ["Make any rolls required to cause the mortal wounds first.", "Do not make armour or invulnerable saves against them.", "If a model has Feel No Pain, roll one D6 for each wound it would lose."],
    ["The rule that caused the mortal wounds may still require its own Hit or Wound roll."],
    ["Treating Feel No Pain as a saving throw."],
    "A rule inflicts 3 mortal wounds. The target would lose 3 wounds unless Feel No Pain prevents some.",
    ["feel-no-pain", "devastating-wounds", "damage-reduction"], tenthEditionUpdateSource
  ),
  entry(
    "feel-no-pain", "Feel No Pain", ["fnp", "ignore wound", "ignore damage"], "Core concept",
    "Feel No Pain is a post-damage roll. Each successful roll stops one wound from being lost.",
    ["A model with Feel No Pain would lose a wound from damage, including mortal wounds."],
    ["Roll one D6 for each wound the model would lose.", "A result meeting the listed threshold prevents that wound from being lost."],
    ["It does not replace an armour save or an invulnerable save.", "Only one Feel No Pain ability can be used for the same lost wound."],
    ["Rolling one die for a whole attack instead of one die for each wound lost."],
    "A model with Feel No Pain 5+ would lose 4 wounds. Roll four D6; each 5+ prevents one wound.",
    ["mortal-wounds", "devastating-wounds", "damage-reduction"]
  ),
  entry(
    "devastating-wounds", "Devastating Wounds", ["dev wounds", "devastating"], "Weapon ability",
    "A Critical Wound from this weapon bypasses saving throws and resolves its damage as mortal wounds under the updated 10th Edition rule.",
    ["A weapon has Devastating Wounds and an attack scores a Critical Wound."],
    ["Do not make an armour or invulnerable save for that attack.", "Resolve its damage as mortal wounds after normal attacks from that attacking unit.", "Feel No Pain can still apply when wounds would be lost."],
    ["It does not make every successful Wound roll devastating. It needs a Critical Wound."],
    ["Skipping Feel No Pain because the attack bypassed saving throws."],
    "A Damage 2 attack scores a Critical Wound. It bypasses saves and causes 2 mortal wounds.",
    ["mortal-wounds", "feel-no-pain", "anti-keyword"], tenthEditionUpdateSource
  ),
  entry(
    "blast", "Blast", ["blast weapon", "blast attacks"], "Weapon ability",
    "Blast adds attacks against larger target units: add 1 Attack for every full five models in the target unit.",
    ["A Blast weapon targets a unit. Count models in that unit when targets are selected."],
    ["Divide target models by five and round down.", "Add that many attacks to the weapon's Attacks characteristic before making Hit rolls."],
    ["Blast adds attacks, not automatic hits or wounds."],
    ["Adding only one attack to every unit of five or more models instead of scaling at 10, 15, and 20 models."],
    "A Blast weapon targets 12 Cultists. Add 2 attacks because there are two full groups of five.",
    ["engagement-range", "heavy", "rapid-fire"]
  ),
  entry(
    "heavy", "Heavy", ["heavy weapon", "remain stationary"], "Weapon ability",
    "A Heavy weapon is more accurate if its attacking unit Remained Stationary that turn.",
    ["A weapon has Heavy and its unit is selected to shoot."],
    ["If the unit Remained Stationary, add 1 to each attack's Hit roll.", "The normal Hit modifier cap still applies."],
    ["Moving normally does not make the weapon unusable. It only stops Heavy from giving its bonus."],
    ["Treating Heavy as a penalty for moving rather than a bonus for remaining stationary."],
    "A BS 4+ Heavy weapon fired by a stationary unit hits on 3+ before other modifiers.",
    ["assault", "engagement-range", "big-guns-never-tire"]
  ),
  entry(
    "rapid-fire", "Rapid Fire", ["rapid fire x", "half range"], "Weapon ability",
    "Rapid Fire X gives a weapon X additional attacks when it targets a unit within half its range.",
    ["A Rapid Fire weapon selects a target."],
    ["Check whether the target is within half the weapon's range.", "If it is, increase the weapon's Attacks by the listed X."],
    ["Rapid Fire does not change Hit, Wound, Save, or Damage rolls."],
    ["Doubling all attacks. Add the printed X instead."],
    "A weapon with A 2 and Rapid Fire 1 has 3 attacks against a target within half range.",
    ["blast", "assault", "torrent"]
  ),
  entry(
    "assault", "Assault", ["advance and shoot", "advanced"], "Weapon ability",
    "Assault lets a unit that Advanced remain eligible to shoot, but only with its Assault weapons.",
    ["A unit Advanced this turn and is selected to shoot."],
    ["No roll changes. Assault changes which weapons may be used after an Advance."],
    ["It does not make non-Assault weapons eligible to shoot after Advancing."],
    ["Assuming a unit may fire all its weapons because it has one Assault weapon."],
    "A Cadian unit that Advanced can shoot an Assault weapon, but not its non-Assault weapons.",
    ["heavy", "engagement-range", "pistol"]
  ),
  entry(
    "torrent", "Torrent", ["auto hit", "automatically hits"], "Weapon ability",
    "Each attack from a Torrent weapon automatically hits its target.",
    ["A Torrent weapon makes attacks."],
    ["Do not roll Hit rolls for those attacks.", "Continue to Wound rolls unless another rule says otherwise."],
    ["An automatic hit is not a Critical Hit unless another rule explicitly says so."],
    ["Trying to trigger Lethal Hits or Sustained Hits without making Hit rolls."],
    "A Torrent weapon makes 6 attacks. All 6 hit, then roll to wound normally.",
    ["lethal-hits", "sustained-hits", "blast"]
  ),
  entry(
    "lethal-hits", "Lethal Hits", ["lethal", "auto wound"], "Weapon ability",
    "A Critical Hit with this weapon automatically wounds the target.",
    ["A weapon with Lethal Hits scores a Critical Hit."],
    ["Do not make a Wound roll for that Critical Hit. It becomes a successful wound."],
    ["The target still makes a saving throw unless another rule bypasses it."],
    ["Treating every successful Hit as an automatic wound."],
    "A Hit roll of an unmodified 6 becomes an automatic wound with Lethal Hits.",
    ["sustained-hits", "torrent", "devastating-wounds"]
  ),
  entry(
    "sustained-hits", "Sustained Hits", ["sustained", "extra hits"], "Weapon ability",
    "A Critical Hit with this weapon scores the listed number of additional hits.",
    ["A weapon with Sustained Hits X scores a Critical Hit."],
    ["Keep the original hit and add X extra hits.", "Roll to wound for the extra hits normally."],
    ["The additional hits are not automatically Critical Hits."],
    ["Adding attacks before rolling to hit. Sustained Hits creates hits after a Critical Hit."],
    "Sustained Hits 1 on a Critical Hit produces two total hits from that attack.",
    ["lethal-hits", "torrent", "anti-keyword"]
  ),
  entry(
    "anti-keyword", "Anti-keyword", ["anti", "anti vehicle", "anti infantry", "critical wound"], "Weapon ability",
    "Anti-keyword X+ makes an unmodified Wound roll of X+ a Critical Wound when the target has the matching keyword.",
    ["A weapon has Anti-keyword X+ and the target might have the matching keyword."],
    ["Check the target's keywords.", "If they match, rolls meeting the printed threshold are Critical Wounds."],
    ["It does not change the normal Wound roll required for other results."],
    ["Applying Anti-Vehicle to a target that does not have the Vehicle keyword."],
    "Anti-Vehicle 4+ against a Rhino makes unmodified Wound rolls of 4+ Critical Wounds.",
    ["devastating-wounds", "lethal-hits", "twin-linked"]
  ),
  entry(
    "twin-linked", "Twin-linked", ["twin linked", "reroll wound"], "Weapon ability",
    "Twin-linked lets you re-roll the Wound roll for each attack made with that weapon.",
    ["A Twin-linked weapon makes a Wound roll."],
    ["After rolling to wound, you may re-roll that attack's Wound roll."],
    ["It does not double attacks, hits, or damage."],
    ["Using Twin-linked as an extra-attacks rule."],
    "A failed Wound roll from a Twin-linked weapon can be rolled again.",
    ["anti-keyword", "lance", "lethal-hits"]
  ),
  entry(
    "lance", "Lance", ["charge wound bonus", "charged this turn"], "Weapon ability",
    "Lance adds 1 to the Wound roll if the bearer made a Charge move this turn.",
    ["A Lance weapon is used after its bearer charged this turn."],
    ["Add 1 to the Wound roll, subject to the normal modifier cap."],
    ["It does not apply just because the unit is in Engagement Range."],
    ["Using Lance in later rounds of combat without charging that turn."],
    "A Lance attack that normally wounds on 4+ would wound on 3+ before other modifiers.",
    ["twin-linked", "engagement-range", "anti-keyword"]
  ),
  entry(
    "melta", "Melta", ["melta x", "half range damage"], "Weapon ability",
    "Melta X adds X to an attack's Damage characteristic when the target is within half the weapon's range.",
    ["A Melta weapon successfully wounds a target within half range."],
    ["Check half range when targets are selected.", "Add the listed X to the damage of each relevant attack."],
    ["Melta does not add attacks or change the Wound roll."],
    ["Adding Melta before checking whether the target is within half range."],
    "A Damage D6 Melta 2 weapon within half range deals D6+2 damage per unsaved wound.",
    ["damage-reduction", "armour-penetration", "invulnerable-save"]
  ),
  entry(
    "benefit-of-cover", "Benefit of Cover", ["cover", "in cover", "cover save"], "Core concept",
    "Benefit of Cover improves armour saving throws against ranged attacks by 1. It does not improve invulnerable saves.",
    ["A ranged attack is allocated to a model with Benefit of Cover."],
    ["Add 1 to the armour saving throw after AP is considered.", "Do not use the cover bonus on an invulnerable save."],
    ["A model with a 3+ or better Save does not receive Benefit of Cover against AP 0 attacks.", "Multiple instances of cover do not stack."],
    ["Applying cover to an invulnerable save or stacking multiple cover bonuses."],
    "A 3+ armour save against AP -1 becomes 4+, then Cover improves it back to 3+.",
    ["armour-penetration", "invulnerable-save", "engagement-range"]
  ),
  entry(
    "invulnerable-save", "Invulnerable Save", ["invuln", "invulnerable", "invulnerable save"], "Core concept",
    "An invulnerable save is an alternative saving throw that is not modified by Armour Penetration.",
    ["A target has an invulnerable save and an attack successfully wounds it."],
    ["Compare the modified armour save with the invulnerable save.", "Use the better available save for that attack."],
    ["Benefit of Cover does not improve an invulnerable save.", "Devastating Wounds bypasses both kinds of saving throw."],
    ["Applying AP or Cover to the invulnerable save."],
    "A target with a 3+ armour save and 4+ invulnerable save facing AP -4 normally chooses its 4+ invulnerable save.",
    ["benefit-of-cover", "armour-penetration", "devastating-wounds"]
  ),
  entry(
    "engagement-range", "Engagement Range", ["engaged", "locked in combat", "melee range"], "Core concept",
    "Units within Engagement Range are locked in combat. Most units cannot shoot normally while engaged.",
    ["Units are close enough to fight in melee or a player wants to shoot at an engaged unit."],
    ["This is an eligibility rule, not a roll modifier by itself.", "Check Pistol and Big Guns Never Tire for the main shooting exceptions."],
    ["Being close to an enemy does not by itself grant an attack bonus."],
    ["Applying the non-Vehicle shooting restriction to a Vehicle or Monster without checking Big Guns Never Tire."],
    "An infantry unit locked in combat normally cannot fire its non-Pistol ranged weapons.",
    ["big-guns-never-tire", "pistol", "blast"]
  ),
  entry(
    "big-guns-never-tire", "Big Guns Never Tire", ["bgnt", "vehicle engaged", "monster engaged"], "Situation",
    "Vehicles and Monsters can shoot while within Engagement Range, unlike most other units.",
    ["A Vehicle or Monster is engaged and is selected to shoot."],
    ["Ranged attacks made while engaged normally suffer -1 to Hit unless made with a Pistol.", "A Blast weapon cannot target a unit within Engagement Range of the firing unit."],
    ["It does not let an ordinary infantry unit fire non-Pistol ranged weapons while engaged."],
    ["Forgetting the -1 to Hit or firing Blast into a unit engaged with the firing Vehicle."],
    "An engaged Chimera can shoot a non-Blast weapon, normally at -1 to Hit.",
    ["engagement-range", "blast", "pistol"], tenthEditionUpdateSource
  ),
  entry(
    "pistol", "Pistol", ["pistols", "shoot in combat"], "Weapon ability",
    "Pistols can be used while their unit is within Engagement Range, but they have target and weapon-selection restrictions.",
    ["A unit is engaged and one of its models has a Pistol."],
    ["No direct roll change. Pistols change whether a model can shoot and what it can target."],
    ["A non-Vehicle, non-Monster model normally chooses Pistols or its other ranged weapons, not both."],
    ["Firing a Pistol and a non-Pistol weapon with the same ordinary model in the same shooting activation."],
    "An engaged infantry model can fire its Pistol at an enemy unit it is within Engagement Range of.",
    ["engagement-range", "big-guns-never-tire", "assault"]
  ),
  entry(
    "armour-penetration", "Armour Penetration", ["ap", "armour pen", "save modifier"], "Core concept",
    "Armour Penetration worsens an armour saving throw. More negative AP means a higher saving throw is required.",
    ["An attack successfully wounds and the target makes an armour save."],
    ["Apply AP to the armour save before deciding whether an invulnerable save is better.", "Benefit of Cover may improve the armour saving throw against a ranged attack."],
    ["AP does not modify an invulnerable save."],
    ["Adding a negative number directly to the required save instead of worsening the required result."],
    "A 3+ armour save against AP -2 becomes a 5+ armour save before cover.",
    ["benefit-of-cover", "invulnerable-save", "damage-reduction"]
  ),
  entry(
    "damage-reduction", "Damage Reduction", ["reduce damage", "minus one damage", "damage 1 minimum"], "Core concept",
    "A rule can reduce the damage of an attack. Apply it at the damage step, not to attacks, hits, or wounds.",
    ["A target has a rule that changes damage from an attack."],
    ["Apply the reduction after the attack's damage is determined, including a relevant Melta bonus.", "Unless a rule explicitly allows 0 damage, damage normally cannot be reduced below 1."],
    ["It does not stop an attack from hitting, wounding, or bypassing a save."],
    ["Reducing a weapon's number of attacks instead of its damage."],
    "A Damage 3 attack against a target that reduces damage by 1 causes 2 damage.",
    ["melta", "mortal-wounds", "feel-no-pain"]
  ),
  entry(
    "stealth", "Stealth", ["minus one to hit", "hard to hit", "concealment"], "Core concept",
    "If every model in a unit has Stealth, subtract 1 from the Hit roll of each ranged attack made against that unit.",
    ["A ranged attack targets a unit with Stealth."],
    ["Check that every model in the target unit has the ability.", "Subtract 1 from the attack's Hit roll."],
    ["Stealth does not modify melee attacks.", "It modifies Hit rolls, not saving throws."],
    ["Applying Stealth when only some models in the unit have it."],
    "A ranged attack that normally hits a Stealth unit on 3+ hits on 4+ before other modifiers.",
    ["smokescreen", "shooting-phase"], coreSourceAt("page 20")
  ),
  entry(
    "ignores-cover", "Ignores Cover", ["ignore cover", "no benefit of cover"], "Weapon ability",
    "A target cannot receive the Benefit of Cover against an attack made with an Ignores Cover weapon.",
    ["An Ignores Cover weapon makes an attack against a target that might have Cover."],
    ["Resolve the attack without applying Benefit of Cover to the target's armour save."],
    ["It does not remove other defensive abilities.", "It does not change an invulnerable save."],
    ["Treating Ignores Cover as ignoring every terrain or defensive rule."],
    "A flamer with Ignores Cover prevents the target from improving its armour save through Cover.",
    ["benefit-of-cover", "torrent"], coreSourceAt("page 25")
  ),
  entry(
    "precision", "Precision", ["target character", "sniper", "allocate to leader"], "Weapon ability",
    "After a Precision attack successfully wounds an Attached unit, the attacker can allocate it to a visible Character model in that unit.",
    ["A Precision attack successfully wounds an Attached unit containing a visible Character."],
    ["The attacking player decides whether to allocate that attack to the visible Character."],
    ["Precision does not bypass the Character's saving throw.", "The Character must be visible to the attacking model."],
    ["Allocating a failed Wound roll to the Character.", "Ignoring the visibility requirement."],
    "A sniper successfully wounds an Attached unit and allocates that attack to its visible Leader.",
    ["leader", "epic-challenge"], coreSourceAt("page 26")
  ),
  entry(
    "hazardous", "Hazardous", ["hazardous test", "overcharge", "plasma danger"], "Weapon ability",
    "After a unit finishes attacking, roll one Hazardous test for each Hazardous weapon used. Each result of 1 causes a model loss or mortal wounds to a Character, Monster, or Vehicle.",
    ["A unit finishes shooting or fighting after using one or more Hazardous weapons."],
    ["Roll one D6 for each Hazardous weapon used.", "For each 1, destroy one equipped non-Character, non-Monster, non-Vehicle model; those larger model types suffer 3 mortal wounds instead."],
    ["Hazardous tests happen after the unit resolves all of its attacks.", "The test is per weapon used, not per successful hit."],
    ["Rolling only one test for the entire unit.", "Taking tests before resolving the attacks."],
    "Five Hazardous weapons are used, so the unit rolls five tests after all of its attacks are complete.",
    ["command-re-roll", "mortal-wounds"], coreSourceAt("page 28")
  ),
  entry(
    "extra-attacks", "Extra Attacks", ["mount attacks", "additional melee weapon", "extra attack weapon"], "Weapon ability",
    "A model can attack with an Extra Attacks weapon in addition to the one other melee weapon it selects when it fights.",
    ["A model fights while equipped with an Extra Attacks weapon."],
    ["Resolve the model's selected melee weapon and its Extra Attacks weapon."],
    ["Other rules cannot modify the number of attacks made with the Extra Attacks weapon."],
    ["Choosing the Extra Attacks weapon instead of using it in addition to the selected weapon."],
    "A mounted model attacks with its chosen melee weapon and also resolves its mount's Extra Attacks profile.",
    ["fight-phase"], coreSourceAt("page 28")
  ),
  entry(
    "deep-strike", "Deep Strike", ["teleport", "reserves deployment", "arrive nine inches"], "Core concept",
    "A unit whose every model has Deep Strike can start in Reserves and later arrive in a Reinforcements step more than 9 inches horizontally from enemy models.",
    ["During Declare Battle Formations.", "When setting up the unit from Reserves."],
    ["Place the unit in Reserves instead of on the battlefield.", "When it arrives, set every model more than 9 inches horizontally from all enemies."],
    ["Deep Strike does not by itself allow arrival in a prohibited battle round.", "The arriving unit counts as having made a Normal move."],
    ["Measuring the 9-inch restriction diagonally instead of horizontally."],
    "Chaos Terminators arrive from Deep Strike more than 9 inches horizontally from every enemy model.",
    ["movement-phase", "rapid-ingress"], coreSourceAt("page 39")
  ),
  entry(
    "leader", "Leader and Attached Units", ["attach character", "bodyguard", "attached unit", "leading unit"], "Core concept",
    "During Declare Battle Formations, an eligible Leader can attach to one listed Bodyguard unit. Together they count as one Attached unit for most rules.",
    ["Before deployment when declaring formations.", "When allocating attacks to an Attached unit."],
    ["Attach each Leader to one eligible Bodyguard unit.", "Use the Bodyguard models' Toughness while they remain.", "Normally allocate attacks to Bodyguard models before Character models."],
    ["Each Bodyguard unit normally has only one Leader.", "Once the Bodyguard is destroyed, remaining attacks can be allocated to the Character."],
    ["Using the Leader's Toughness for attacks against the Attached unit.", "Allocating ordinary attacks to the Character while Bodyguard models remain."],
    "A Chaos Lord attaches to an eligible Chaos Space Marine Bodyguard unit before deployment.",
    ["precision", "epic-challenge"], coreSourceAt("page 39")
  ),
  entry(
    "battle-round", "Battle Round and Turn Order", ["turn order", "round order", "phase order", "battle round"], "Game flow",
    "Each battle round contains one turn for each player. Every turn follows Command, Movement, Shooting, Charge, then Fight.",
    ["At the start of a round.", "When checking which phase happens next.", "When a rule lasts until a turn or battle round ends."],
    ["Resolve the five phases in order for the first player's turn.", "Repeat the same five phases for the second player's turn.", "After both turns, begin the next battle round unless the battle has ended."],
    ["The Fight phase belongs to the active turn, but both players may select units to fight.", "A battle round is not the same as one player's turn."],
    ["Starting a new battle round after only one player has completed a turn."],
    "Player A completes all five phases, then Player B completes all five phases. That completes one battle round.",
    ["command-phase", "movement-phase", "shooting-phase", "charge-phase", "fight-phase"], coreSourceAt("page 10")
  ),
  entry(
    "command-phase", "Command Phase", ["command step", "battle shock step", "gain cp", "command points"], "Game flow",
    "Both players gain 1CP, then the active player resolves Command phase rules and tests each Below Half-strength unit for Battle-shock.",
    ["At the start of every player's turn.", "When issuing Astra Militarum Orders.", "When checking Battle-shock or CP timing."],
    ["Both players gain 1CP before other Command phase actions.", "Resolve other Command phase rules.", "Roll Battle-shock tests for the active player's Below Half-strength units."],
    ["Battle-shocked units have OC 0 and cannot be affected by their controller's Stratagems.", "Outside the CP gained at the start of the phase, each player can normally gain only 1 additional CP per battle round."],
    ["Only giving CP to the active player.", "Taking Battle-shock tests before resolving other Command phase rules."],
    "At the start of the Astra Militarum turn, both players gain 1CP, then the Astra player issues eligible Orders before taking required Battle-shock tests.",
    ["battle-round", "insane-bravery"], coreSourceAt("page 11")
  ),
  entry(
    "movement-phase", "Movement Phase", ["move units", "normal move", "advance", "fall back", "reinforcements"], "Game flow",
    "Move eligible units first, then set up eligible Reinforcements. A unit's movement choice affects whether it can shoot or charge later that turn.",
    ["After the Command phase.", "Before moving a unit.", "When setting up Reserves."],
    ["Unengaged units can normally move, Advance, or Remain Stationary.", "Engaged units can normally Fall Back or Remain Stationary.", "After moves, set up eligible Reinforcements one unit at a time."],
    ["Advancing or Falling Back normally prevents shooting and charging later that turn.", "A Reinforcement unit counts as having made a Normal move when it arrives."],
    ["Moving Reinforcements again after setting them up.", "Advancing without checking later shooting and charge eligibility."],
    "A unit Advances M+D6 inches, so it normally cannot shoot or charge later that turn unless another rule creates an exception.",
    ["battle-round", "assault", "rapid-ingress", "engagement-range"], coreSourceAt("pages 13-16")
  ),
  entry(
    "shooting-phase", "Shooting Phase", ["shooting sequence", "select targets", "ranged attacks", "shoot phase"], "Game flow",
    "Select one eligible unit at a time, declare all of its ranged targets and weapon profiles, then resolve its attacks before choosing the next unit.",
    ["After the Movement phase.", "Before rolling attacks.", "When splitting weapons between targets."],
    ["Select an eligible unit that has not shot this phase.", "Declare targets for every weapon before resolving attacks.", "Resolve ranged attacks, then repeat with another eligible unit."],
    ["A unit that Advanced or Fell Back is normally ineligible to shoot.", "One weapon's attacks cannot be split between multiple targets, though different weapons and models can choose different targets."],
    ["Rolling one weapon before declaring the unit's remaining targets.", "Selecting a target that is not both visible and in range for the attacking model."],
    "A Leman Russ declares which weapons target the Rhino and which target the Cultists before any Hit rolls are made.",
    ["battle-round", "assault", "fire-overwatch"], coreSourceAt("page 19")
  ),
  entry(
    "charge-phase", "Charge Phase", ["charge sequence", "charge roll", "declare charge", "charge move"], "Game flow",
    "Select an eligible unit, declare every target within 12 inches, roll 2D6, then move only if the unit can reach every declared target legally.",
    ["After the Shooting phase.", "Before rolling a charge.", "When checking whether a unit receives Fights First."],
    ["Choose an eligible unit and declare its charge targets.", "Roll 2D6 for the maximum Charge move.", "If successful, move into Engagement Range of every declared target while maintaining coherency."],
    ["Targets need to be within 12 inches but do not need to be visible.", "Units that Advanced, Fell Back, are already engaged, or are Aircraft are normally ineligible."],
    ["Rolling before declaring every target.", "Moving after a failed charge.", "Receiving the Charge bonus without making a Charge move."],
    "A unit declares two targets. Its roll must allow it to end within Engagement Range of both targets without contacting an undeclared enemy.",
    ["battle-round", "fight-phase", "heroic-intervention", "tank-shock"], coreSourceAt("page 29")
  ),
  entry(
    "fight-phase", "Fight Phase", ["fight sequence", "fights first", "remaining combats", "pile in", "consolidate"], "Game flow",
    "Both players alternate selecting eligible units, starting with the player whose turn is not taking place. Resolve Fights First units before remaining combats.",
    ["After the Charge phase.", "When several units can fight.", "When deciding who selects the next combat."],
    ["Alternate eligible units in the Fights First step, beginning with the non-active player.", "Then alternate remaining eligible units, again beginning with the non-active player.", "Each selected unit piles in, makes melee attacks, and consolidates."],
    ["A unit can normally fight only once per Fight phase.", "A unit is eligible if it is engaged or made a Charge move that turn."],
    ["Assuming the active player always fights first.", "Skipping an eligible unit when a player still has one available."],
    "After charges, the defending player selects the first eligible Fights First unit, then players alternate selections.",
    ["battle-round", "charge-phase", "counter-offensive", "epic-challenge"], coreSourceAt("page 32")
  ),
  entry(
    "command-re-roll", "Command Re-roll", ["reroll", "re roll", "cp reroll"], "Core Stratagem",
    "Spend 1CP immediately after an eligible roll or test to re-roll that roll, test, or saving throw.",
    ["After a Hit, Wound, Damage, save, Advance, Charge, Desperate Escape, Hazardous, or attacks roll that the Stratagem permits."],
    ["Pay 1CP after seeing the original result.", "Re-roll the eligible result and use the new result."],
    ["It does not allow every type of roll to be re-rolled.", "The same Stratagem cannot normally be used more than once in the same phase."],
    ["Keeping the better of the original and re-rolled results."],
    "After failing a Charge roll, spend 1CP to re-roll the Charge roll.",
    ["battle-round", "charge-phase"], coreSourceAt("page 41")
  ),
  entry(
    "counter-offensive", "Counter-offensive", ["interrupt", "fight next", "counter offensive"], "Core Stratagem",
    "Spend 2CP after an enemy unit fights to make one eligible engaged unit from your army fight next.",
    ["In the Fight phase, immediately after an enemy unit finishes fighting."],
    ["Choose one engaged unit that has not fought this phase.", "That unit becomes the next unit to fight."],
    ["It does not let a unit fight twice.", "The selected unit must already be eligible and within Engagement Range."],
    ["Using it before the enemy unit has finished its fight sequence."],
    "After Chaos Terminators fight, the Astra player spends 2CP so an eligible nearby unit fights next.",
    ["fight-phase", "epic-challenge"], coreSourceAt("page 41")
  ),
  entry(
    "epic-challenge", "Epic Challenge", ["precision stratagem", "character duel", "challenge"], "Core Stratagem",
    "Spend 1CP when an engaged Character unit is selected to fight so one Character model's melee attacks gain Precision for the phase.",
    ["In the Fight phase when your engaged Character unit is selected to fight near an Attached unit."],
    ["Choose one Character model in the selected unit.", "That model's melee attacks gain Precision until the phase ends."],
    ["It does not give Precision to every model in the unit.", "It applies to melee attacks, not ranged attacks."],
    ["Targeting the whole unit instead of one Character model."],
    "A Chaos Lord uses Epic Challenge so its melee wounds can be allocated to an eligible Character in an Attached unit.",
    ["fight-phase", "precision", "counter-offensive"], coreSourceAt("page 41")
  ),
  entry(
    "insane-bravery", "Insane Bravery", ["pass battle shock", "battle shock stratagem"], "Core Stratagem",
    "Spend 1CP immediately after failing a Battle-shock test in your Command phase to treat that test as passed.",
    ["In your Command phase Battle-shock step, just after one of your units fails its test."],
    ["Target the unit that just failed.", "Treat that test as passed, so the unit is not Battle-shocked from it."],
    ["It cannot be used before seeing the test result.", "It does not automatically pass future Battle-shock tests."],
    ["Using it on a unit that has not just failed a Battle-shock test."],
    "A Below Half-strength unit fails its test; spend 1CP immediately to treat that test as passed.",
    ["command-phase", "battle-round"], coreSourceAt("page 42")
  ),
  entry(
    "grenade-stratagem", "Grenade", ["grenades stratagem", "throw grenade"], "Core Stratagem",
    "Spend 1CP in your Shooting phase for an eligible Grenades unit to roll six dice against a nearby visible, unengaged enemy; each 4+ causes 1 mortal wound.",
    ["In your Shooting phase before the Grenades unit has been selected to shoot."],
    ["Choose an unengaged Grenades unit.", "Choose a visible unengaged enemy within 8 inches.", "Roll six D6 and inflict 1 mortal wound for each 4+."],
    ["The acting unit must not be within Engagement Range.", "The target must not be within Engagement Range of your units."],
    ["Using it after the unit has already been selected to shoot."],
    "Cadian Troops use Grenade against a visible enemy 6 inches away and roll six dice for mortal wounds.",
    ["shooting-phase", "mortal-wounds"], coreSourceAt("page 42")
  ),
  entry(
    "tank-shock", "Tank Shock", ["vehicle charge stratagem", "ramming"], "Core Stratagem",
    "Spend 1CP in your Charge phase so a Vehicle that completes a charge can roll dice based on a melee weapon's Strength to cause mortal wounds.",
    ["In your Charge phase before resolving a Vehicle unit's charge effects."],
    ["After the Vehicle ends its Charge move, choose an engaged enemy and one of the Vehicle's melee weapons.", "Roll dice equal to that weapon's Strength, adding two dice if Strength exceeds the target's Toughness.", "Each 5+ causes 1 mortal wound, to a maximum of 6."],
    ["It targets a Vehicle unit, not ordinary Infantry.", "The mortal wounds are capped at 6."],
    ["Using the Vehicle's Toughness instead of a selected melee weapon's Strength."],
    "A charging Leman Russ selects its armoured tracks profile, then rolls the permitted dice against the engaged enemy.",
    ["charge-phase", "mortal-wounds"], coreSourceAt("page 42")
  ),
  entry(
    "rapid-ingress", "Rapid Ingress", ["arrive in opponent turn", "reserves stratagem"], "Core Stratagem",
    "Spend 1CP at the end of your opponent's Movement phase to set up one eligible Reserves unit as though it were your Reinforcements step.",
    ["At the end of your opponent's Movement phase."],
    ["Choose one unit in Reserves.", "Set it up using its normal arrival rules."],
    ["It cannot make a unit arrive in a battle round when that unit would not normally be allowed to arrive."],
    ["Treating Rapid Ingress as permission to ignore normal placement restrictions."],
    "A Reserves unit arrives at the end of the opponent's Movement phase, following its normal distance restrictions.",
    ["movement-phase", "battle-round"], coreSourceAt("page 42")
  ),
  entry(
    "fire-overwatch", "Fire Overwatch", ["overwatch", "shoot in opponent movement", "shoot charging unit"], "Core Stratagem",
    "Spend 1CP during the opponent's Movement or Charge phase to let one eligible nearby unit shoot the triggering enemy, but only unmodified Hit rolls of 6 score hits.",
    ["Just after an enemy unit is set up, or starts or ends a Normal, Advance, Fall Back, or Charge move."],
    ["Choose a unit within 24 inches that would be eligible to shoot in your Shooting phase.", "Shoot only the triggering enemy unit.", "Only unmodified Hit rolls of 6 score hits."],
    ["It can only be used once per turn.", "Normal Ballistic Skill and Hit modifiers do not change the required unmodified 6."],
    ["Using the firing unit's normal Ballistic Skill.", "Targeting a different enemy unit."],
    "After Cultists end a Normal move within 24 inches, an eligible Astra unit uses Fire Overwatch and hits only on unmodified 6s.",
    ["shooting-phase", "movement-phase"], coreSourceAt("page 42")
  ),
  entry(
    "go-to-ground", "Go to Ground", ["take cover stratagem", "6 invulnerable", "infantry defence"], "Core Stratagem",
    "Spend 1CP after enemy shooting targets one of your Infantry units; until the phase ends, its models gain Benefit of Cover and a 6+ invulnerable save.",
    ["In the opponent's Shooting phase, immediately after an enemy selects targets."],
    ["Choose one targeted Infantry unit.", "Give its models Benefit of Cover and a 6+ invulnerable save for the phase."],
    ["It cannot target a Vehicle unless it is also Infantry.", "Cover still follows its normal restrictions."],
    ["Using it after attacks have already been resolved."],
    "Targeted Cadian Troops use Go to Ground before the enemy resolves attacks.",
    ["shooting-phase", "benefit-of-cover", "invulnerable-save"], coreSourceAt("page 42")
  ),
  entry(
    "smokescreen", "Smokescreen", ["smoke stratagem", "stealth and cover"], "Core Stratagem",
    "Spend 1CP after enemy shooting targets one of your Smoke units; until the phase ends, its models gain Benefit of Cover and Stealth.",
    ["In the opponent's Shooting phase, immediately after an enemy selects targets."],
    ["Choose one targeted Smoke unit.", "Give its models Benefit of Cover and Stealth for the phase."],
    ["The unit must have the Smoke keyword.", "Stealth affects the attack's Hit roll; it is not an armour-save bonus."],
    ["Using it on a unit without Smoke.", "Applying Stealth as an additional save modifier."],
    "A targeted Chimera uses Smokescreen before attacks are resolved, gaining Cover and Stealth for the phase.",
    ["shooting-phase", "benefit-of-cover"], coreSourceAt("page 42")
  ),
  entry(
    "heroic-intervention", "Heroic Intervention", ["counter charge", "intervene", "charge in opponent turn"], "Core Stratagem",
    "Spend 2CP after an enemy ends a Charge move so one nearby eligible unit can declare a charge against only that enemy.",
    ["In the opponent's Charge phase, immediately after an enemy unit ends a Charge move."],
    ["Choose an eligible unit within 6 inches of the enemy.", "Declare and resolve a charge targeting only that enemy unit."],
    ["A Vehicle can only be selected if it is a Walker.", "A successful intervention does not grant the Charge bonus that turn."],
    ["Giving the intervening unit Fights First from the charge.", "Declaring additional charge targets."],
    "After an enemy charges nearby troops, an eligible unit within 6 inches uses Heroic Intervention to counter-charge that enemy.",
    ["charge-phase", "fight-phase"], coreSourceAt("page 42")
  )
];
