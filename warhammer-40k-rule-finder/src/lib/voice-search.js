const errorMessages = {
  "audio-capture": "No microphone was available.",
  "language-not-supported": "Speech recognition does not support this language.",
  "network": "Speech recognition could not reach the browser service.",
  "no-speech": "No speech was detected. Try again.",
  "not-allowed": "Microphone access was not allowed.",
  "service-not-allowed": "Speech recognition is disabled by this browser."
};

export function speechRecognitionConstructor(scope = globalThis) {
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition ?? null;
}

export function createVoiceSearch({ Recognition, onTranscript, onListening, onError, language = "en-CA" }) {
  if (!Recognition) return { supported: false, start() {}, stop() {} };
  const recognition = new Recognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.lang = language;
  recognition.addEventListener("start", () => onListening(true));
  recognition.addEventListener("end", () => onListening(false));
  recognition.addEventListener("result", (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript?.trim();
    if (transcript) onTranscript(transcript);
  });
  recognition.addEventListener("error", (event) => {
    onListening(false);
    if (event.error !== "aborted") onError(errorMessages[event.error] ?? "Speech recognition could not complete.");
  });
  return {
    supported: true,
    start() { recognition.start(); },
    stop() { recognition.stop(); }
  };
}
