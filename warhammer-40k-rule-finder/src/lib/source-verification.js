export const sourceVerificationStates = Object.freeze({
  "official-publication": Object.freeze({
    key: "official-publication",
    label: "Official source",
    shortLabel: "Official source",
    tone: "official",
    description: "This app summary is based on an official Games Workshop 10th Edition publication, with an official source link recorded.",
    guidance: "Use the linked edition and version. A later rules update can still supersede it."
  }),
  "cross-checked-transcription": Object.freeze({
    key: "cross-checked-transcription",
    label: "Cross-checked transcription",
    shortLabel: "Cross-checked",
    tone: "cross-checked",
    description: "This app summary is based on a community transcription checked against surviving official previews, errata, and version markers.",
    guidance: "Use the archive for the complete wording and the official links for supporting context."
  }),
  "integrity-checked-import": Object.freeze({
    key: "integrity-checked-import",
    label: "Integrity-checked archive import",
    shortLabel: "Integrity-checked",
    tone: "integrity",
    description: "Structured data was imported from a final 10th Edition archive export whose files are recorded by byte count and SHA-256 digest.",
    guidance: "Integrity checking detects changed import files. It does not turn a community archive into an official publication."
  }),
  "archived-reference": Object.freeze({
    key: "archived-reference",
    label: "Archived reference",
    shortLabel: "Archived source",
    tone: "archive",
    description: "This app summary links to a final 10th Edition community archive that is not hosted by Games Workshop.",
    guidance: "Confirm edge cases against the final 10th Edition documents used at your table."
  }),
  "review-needed": Object.freeze({
    key: "review-needed",
    label: "Source review needed",
    shortLabel: "Review needed",
    tone: "review",
    description: "This record is missing a declared verification state and should be treated as unreviewed.",
    guidance: "Correct the record's provenance before relying on it during play."
  })
});

export function isSourceVerificationState(value) {
  return typeof value === "string" && Object.hasOwn(sourceVerificationStates, value) && value !== "review-needed";
}

export function getSourceVerificationState(value) {
  return sourceVerificationStates[value] ?? sourceVerificationStates["review-needed"];
}
