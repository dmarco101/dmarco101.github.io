import { communityArchiveSource, detachmentRulesById } from "./detachment-rules.js";
import { ruleDetailsByDetachment } from "./detachment-rule-details.js";

const astraSource = {
  label: "Warhammer Community: Astra Militarum Detachments",
  version: "10th Edition Codex preview, 8 January 2025",
  url: "https://www.warhammer-community.com/en-gb/articles/cwbqyqmp/astra-militarum-detachments-artillery-barrages-mechanised-assault-and-stealth-tactics/",
  verificationState: "official-publication"
};

const chaosSource = {
  label: "Warhammer Community: Chaos Space Marines Detachments",
  version: "10th Edition Codex preview, 7 May 2024",
  url: "https://www.warhammer-community.com/en-gb/articles/i9jnuFX0/what-can-the-new-codex-chaos-space-marines-detachments-do-for-you/",
  verificationState: "official-publication"
};

function detachment(id, name, faction, playstyle, summary, ruleName, source, aliases = []) {
  const rules = detachmentRulesById[id];
  const details = ruleDetailsByDetachment[id];
  const normaliseName = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const findDetails = (collection, itemName) => Object.entries(collection ?? {}).find(([candidate]) => normaliseName(candidate) === normaliseName(itemName))?.[1] ?? {};
  return {
    id, name, faction, playstyle, summary, ruleName, source, aliases,
    edition: "10th Edition",
    contentStatus: "current",
    sourcePriority: "canonical",
    sourceVersion: communityArchiveSource.version,
    enhancements: (rules?.enhancements ?? []).map((item, index) => ({ id: `${id}-e${index + 1}`, contentStatus: "current", sourcePriority: "canonical", sourceVersion: communityArchiveSource.version, ...item, ...findDetails(details?.enhancements, item.name) })),
    stratagems: (rules?.stratagems ?? []).map((item, index) => ({ id: `${id}-s${index + 1}`, contentStatus: "current", sourcePriority: "canonical", sourceVersion: communityArchiveSource.version, ...item, ...findDetails(details?.stratagems, item.name) })),
    rulesSource: {
      ...communityArchiveSource,
      url: faction === "Astra Militarum" ? communityArchiveSource.astraUrl : communityArchiveSource.chaosUrl
    }
  };
}

export const detachmentEntries = [
  detachment("combined-arms", "Combined Arms", "Astra Militarum", "Flexible combined force", "A general-purpose detachment for armies mixing infantry, armour, and artillery.", "Born Soldiers", astraSource, ["combined regiment", "index"]),
  detachment("bridgehead-strike", "Bridgehead Strike", "Astra Militarum", "Tempestus Scions and reserves", "Builds around elite Tempestus forces arriving from reserves and contesting key ground.", "Only the Best / Fire Zone Purge", astraSource, ["scions", "deep strike", "grotmas"]),
  detachment("mechanised-assault", "Mechanised Assault", "Astra Militarum", "Transport-led close-range pressure", "Uses armoured transports to deliver infantry quickly and support aggressive short-range attacks.", "Armoured Fist", astraSource, ["chimera", "transport"]),
  detachment("hammer-of-the-emperor", "Hammer of the Emperor", "Astra Militarum", "Tank formations", "Favours armoured spearheads and concentrated fire from Astra Militarum vehicles.", "Iron Tread", astraSource, ["tanks", "leman russ", "rogal dorn"]),
  detachment("siege-regiment", "Siege Regiment", "Astra Militarum", "Attrition and artillery support", "Calls in battlefield-wide artillery support to disrupt movement, strip cover, or protect friendly units.", "Artillery Support", astraSource, ["krieg", "artillery", "bombardment"]),
  detachment("recon-element", "Recon Element", "Astra Militarum", "Scouts, cavalry, and camouflage", "Uses mobile Regiment and Walker units, layered cover, and reactive positioning tools.", "Masters of Camouflage", astraSource, ["sentinel", "rough riders", "stealth"]),

  detachment("deceptors", "Deceptors", "Chaos Space Marines", "Infiltration and misdirection", "An Alpha Legion-style force that establishes forward pressure with infiltrating troops and deployment tricks.", "Masters of Misdirection", chaosSource, ["alpha legion", "infiltrators"]),
  detachment("renegade-raiders", "Renegade Raiders", "Chaos Space Marines", "Fast objective pressure", "A mobile raiding force that advances while firing and rewards attacks around contested objectives.", "Raiders and Reavers", chaosSource, ["red corsairs", "assault", "advance"]),
  detachment("chaos-cult", "Chaos Cult", "Chaos Space Marines", "Mortal hordes", "Pushes Cultists and other Damned units forward in large, expendable waves.", "Desperate Devotion", chaosSource, ["cultists", "damned"]),
  detachment("pactbound-zealots", "Pactbound Zealots", "Chaos Space Marines", "Marks of Chaos", "A flexible god-aligned detachment built around matching units and Dark Pacts to Chaos marks.", "Marks of Chaos", chaosSource, ["slaves to darkness", "dark pacts"]),
  detachment("veterans-long-war", "Veterans of the Long War", "Chaos Space Marines", "Focused target elimination", "Selects a priority enemy and concentrates disciplined attacks on that focus of hatred.", "Focus of Hatred", chaosSource, ["black legion", "focus of hatred"]),
  detachment("fellhammer-siege-host", "Fellhammer Siege-host", "Chaos Space Marines", "Durable siege warfare", "An Iron Warriors-style force that withstands enemy fire and grinds down hard targets.", "Iron Fortitude", chaosSource, ["iron warriors", "durability"]),
  detachment("dread-talons", "Dread Talons", "Chaos Space Marines", "Jump infantry and Battle-shock", "A Night Lords-style terror force using fast airborne units and Battle-shock pressure.", "Terror Descends (Aura)", chaosSource, ["night lords", "raptors", "warp talons"]),
  detachment("soulforged-warpack", "Soulforged Warpack", "Chaos Space Marines", "Daemon Engines", "Empowers Daemon Vehicles through Vashtorr's infernal contracts and aggressive machine warfare.", "Debt to the Soul Forge", chaosSource, ["vashtorr", "daemon vehicles", "daemon engines"])
];
