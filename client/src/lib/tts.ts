export function speakText(text: string, lang: string = "mn") {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  const voices = window.speechSynthesis.getVoices();
  const mnVoice = voices.find(v => v.lang.startsWith("mn"));
  const ruVoice = voices.find(v => v.lang.startsWith("ru"));

  if (mnVoice) {
    utterance.voice = mnVoice;
    utterance.lang = "mn";
  } else if (ruVoice) {
    utterance.voice = ruVoice;
    utterance.lang = "ru";
  } else {
    utterance.lang = lang;
  }

  utterance.rate = 0.85;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function isTTSSupported(): boolean {
  return "speechSynthesis" in window;
}
