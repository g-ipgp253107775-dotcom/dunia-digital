// Web Speech API Text-to-Speech manager supporting Bahasa Melayu baku (ms-MY)

export type SpeechState = 'idle' | 'playing' | 'paused' | 'ended';

export interface VoiceInfo {
  voice: SpeechSynthesisVoice | null;
  name: string;
  lang: string;
  isMalayMalaysia: boolean;
  note: string;
}

class TextToSpeechManager {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private state: SpeechState = 'idle';
  private rate: number = 0.95; // Slightly measured pace for primary pupils
  private onStateChange: ((state: SpeechState) => void) | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private voiceInfo: VoiceInfo = {
    voice: null,
    name: 'Sistem Lalai',
    lang: 'ms-MY',
    isMalayMalaysia: false,
    note: 'Menyemak suara pelayar...',
  };

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();

    // 1. Search for genuine ms-MY voice (e.g., Google Bahasa Melayu, Microsoft Yasmin, etc.)
    const msVoice = this.voices.find(
      (v) =>
        v.lang === 'ms-MY' ||
        v.lang === 'ms_MY' ||
        (v.lang.startsWith('ms') && !v.lang.includes('id'))
    );

    if (msVoice) {
      this.voiceInfo = {
        voice: msVoice,
        name: msVoice.name,
        lang: msVoice.lang,
        isMalayMalaysia: true,
        note: 'Pek Suara Bahasa Melayu (Malaysia) 🇲🇾 Aktif',
      };
      return;
    }

    // 2. Check for voice name containing "malay" or "melayu"
    const namedMalay = this.voices.find((v) =>
      /malay|melayu/i.test(v.name)
    );
    if (namedMalay) {
      this.voiceInfo = {
        voice: namedMalay,
        name: namedMalay.name,
        lang: namedMalay.lang,
        isMalayMalaysia: true,
        note: 'Pek Suara Bahasa Melayu (Malaysia) 🇲🇾 Aktif',
      };
      return;
    }

    // 3. Fallback: Honest report
    const defaultVoice = this.voices.find((v) => v.default) || this.voices[0] || null;
    this.voiceInfo = {
      voice: defaultVoice,
      name: defaultVoice ? defaultVoice.name : 'Enjin Lalai Pelayar',
      lang: defaultVoice ? defaultVoice.lang : 'ms-MY',
      isMalayMalaysia: false,
      note: 'Pek suara ms-MY belum dipasang pada peranti ini; sebutan menggunakan enjin suara pelayar sedia ada.',
    };
  }

  public getVoiceInfo(): VoiceInfo {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voiceInfo;
  }

  public registerStateCallback(cb: (state: SpeechState) => void) {
    this.onStateChange = cb;
  }

  private setState(newState: SpeechState) {
    this.state = newState;
    if (this.onStateChange) {
      this.onStateChange(newState);
    }
  }

  public getState(): SpeechState {
    return this.state;
  }

  public setRate(newRate: number) {
    this.rate = Math.max(0.7, Math.min(1.5, newRate));
    if (this.state === 'playing') {
      // Re-apply rate on next utterance
    }
  }

  public getRate(): number {
    return this.rate;
  }

  public speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Sistem Text-to-Speech tidak disokong oleh pelayar web ini.');
      return;
    }

    // Stop any existing speech first
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ms-MY';
    utterance.rate = this.rate;
    utterance.pitch = 1.05; // Slightly friendly tone for Year 5 pupils

    const info = this.getVoiceInfo();
    if (info.voice) {
      utterance.voice = info.voice;
    }

    utterance.onstart = () => {
      this.setState('playing');
    };

    utterance.onpause = () => {
      this.setState('paused');
    };

    utterance.onresume = () => {
      this.setState('playing');
    };

    utterance.onend = () => {
      this.setState('ended');
      this.currentUtterance = null;
    };

    utterance.onerror = (e) => {
      // Ignore user cancellation errors
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('TTS Error:', e.error);
      }
      this.setState('idle');
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public pause() {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      this.setState('paused');
    }
  }

  public resume() {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.setState('playing');
    }
  }

  public stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    this.setState('idle');
  }
}

export const textToSpeech = new TextToSpeechManager();
