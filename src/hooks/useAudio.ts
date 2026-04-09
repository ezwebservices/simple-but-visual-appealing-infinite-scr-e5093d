import { useCallback, useRef, useState } from 'react';
import type { Operator } from '../types';

function operatorWord(op: Operator): string {
  return op === 'plus' ? 'plus' : 'minus';
}

export default function useAudio() {
  const supported = useRef(typeof window !== 'undefined' && 'speechSynthesis' in window);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const queue = useRef<string[]>([]);
  const speaking = useRef(false);
  const keepAliveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  /** Resolvers for any pending waitForSpeechEnd() callers. */
  const idleResolvers = useRef<Array<() => void>>([]);

  const stopKeepAlive = useCallback(() => {
    if (keepAliveTimer.current !== null) {
      clearInterval(keepAliveTimer.current);
      keepAliveTimer.current = null;
    }
  }, []);

  /** Chrome silently kills speechSynthesis after ~15s. Periodic pause/resume keeps it alive. */
  const startKeepAlive = useCallback(() => {
    stopKeepAlive();
    keepAliveTimer.current = setInterval(() => {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        speechSynthesis.resume();
      }
    }, 10000);
  }, [stopKeepAlive]);

  const pickVoice = useCallback(() => {
    const voices = speechSynthesis.getVoices();
    return (
      voices.find(
        (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'),
      ) ?? voices.find((v) => v.lang.startsWith('en')) ?? null
    );
  }, []);

  const flushIdleResolvers = useCallback(() => {
    const resolvers = idleResolvers.current.splice(0);
    resolvers.forEach((r) => r());
  }, []);

  const playNext = useCallback(() => {
    if (queue.current.length === 0) {
      speaking.current = false;
      setIsSpeaking(false);
      stopKeepAlive();
      flushIdleResolvers();
      return;
    }

    const text = queue.current.shift()!;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = 1;

      const voice = pickVoice();
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        setIsSpeaking(true);
        startKeepAlive();
      };
      utterance.onend = () => playNext();
      utterance.onerror = () => playNext();

      speechSynthesis.speak(utterance);
    } catch {
      playNext();
    }
  }, [pickVoice, startKeepAlive, stopKeepAlive, flushIdleResolvers]);

  /** Queue-friendly speak: waits for in-progress speech to finish. */
  const speak = useCallback(
    (text: string) => {
      if (!supported.current) return;
      queue.current.push(text);
      if (!speaking.current) {
        speaking.current = true;
        playNext();
      }
    },
    [playNext],
  );

  /** Cancel all queued and in-progress speech, then speak immediately. */
  const speakNow = useCallback(
    (text: string) => {
      if (!supported.current) return;
      queue.current = [];
      speechSynthesis.cancel();
      speaking.current = false;
      speak(text);
    },
    [speak],
  );

  const speakProblem = useCallback(
    (num1: number, num2: number, operator: Operator) => {
      speakNow(`How many is ${num1} ${operatorWord(operator)} ${num2}?`);
    },
    [speakNow],
  );

  const speakCorrect = useCallback(() => {
    speakNow('Great job!');
  }, [speakNow]);

  const speakTryAgain = useCallback(() => {
    speakNow("That's okay! Try again!");
  }, [speakNow]);

  /** Cancel all queued and in-progress speech without starting anything new. */
  const cancelSpeech = useCallback(() => {
    if (!supported.current) return;
    queue.current = [];
    speechSynthesis.cancel();
    speaking.current = false;
    setIsSpeaking(false);
    stopKeepAlive();
    flushIdleResolvers();
  }, [stopKeepAlive, flushIdleResolvers]);

  /**
   * Returns a promise that resolves once the speech queue is fully drained.
   * If nothing is speaking, resolves immediately.
   */
  const waitForSpeechEnd = useCallback((): Promise<void> => {
    if (!speaking.current) return Promise.resolve();
    return new Promise<void>((resolve) => {
      idleResolvers.current.push(resolve);
    });
  }, []);

  return {
    speak,
    speakNow,
    speakProblem,
    speakCorrect,
    speakTryAgain,
    cancelSpeech,
    isSpeaking,
    waitForSpeechEnd,
  };
}
