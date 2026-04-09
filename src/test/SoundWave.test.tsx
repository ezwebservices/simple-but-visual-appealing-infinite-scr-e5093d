import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import useAudio from '../hooks/useAudio';
import SoundWaveOverlay from '../components/characters/SoundWaveOverlay';
import RexRobot from '../components/characters/RexRobot';
import BennyBear from '../components/characters/BennyBear';
import CharacterDisplay from '../components/characters/CharacterDisplay';
import LessonCard from '../components/LessonCard';

describe('Sound Wave Animation Feature', () => {
  describe('useAudio hook — isSpeaking state', () => {
    it('starts with isSpeaking=false', () => {
      const { result } = renderHook(() => useAudio());
      expect(result.current.isSpeaking).toBe(false);
    });

    it('sets isSpeaking=true when speech starts (onstart event)', async () => {
      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.speak('hello');
      });

      // The mock calls onstart synchronously in speak()
      expect(result.current.isSpeaking).toBe(true);
    });

    it('sets isSpeaking=false when speech ends (onend event)', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.speak('hello');
      });

      expect(result.current.isSpeaking).toBe(true);

      // The mock fires onend after 10ms
      await act(async () => {
        vi.advanceTimersByTime(20);
      });

      expect(result.current.isSpeaking).toBe(false);
      vi.useRealTimers();
    });

    it('sets isSpeaking=false on error', () => {
      // Override mock to fire onerror instead of onend
      const originalSpeak = window.speechSynthesis.speak;
      (window.speechSynthesis.speak as ReturnType<typeof vi.fn>) = vi.fn((utterance: SpeechSynthesisUtterance) => {
        (utterance as unknown as { onstart: () => void }).onstart?.();
        (utterance as unknown as { onerror: () => void }).onerror?.();
      });

      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.speak('hello');
      });

      expect(result.current.isSpeaking).toBe(false);

      // Restore
      window.speechSynthesis.speak = originalSpeak;
    });

    it('speakProblem triggers isSpeaking for auto-read', () => {
      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.speakProblem(3, 2, 'plus');
      });

      expect(result.current.isSpeaking).toBe(true);
      expect(window.speechSynthesis.speak).toHaveBeenCalled();
    });

    it('cancels previous speech before starting new one', () => {
      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.speak('first');
      });
      act(() => {
        result.current.speak('second');
      });

      expect(window.speechSynthesis.cancel).toHaveBeenCalled();
    });
  });

  describe('useAudio — speech synthesis disabled/unsupported', () => {
    it('useAudio hook checks for speechSynthesis support at init', () => {
      // The hook stores `supported.current` based on window check.
      // Since our test env has speechSynthesis mocked, it should be true.
      // The try/catch in speak() ensures no errors even if it fails at runtime.
      const { result } = renderHook(() => useAudio());
      expect(result.current.isSpeaking).toBe(false);
      // speak should not crash
      expect(() => {
        act(() => {
          result.current.speak('test');
        });
      }).not.toThrow();
    });

    it('speak() does not crash when speechSynthesis throws', () => {
      const originalSpeak = window.speechSynthesis.speak;
      (window.speechSynthesis.speak as ReturnType<typeof vi.fn>) = vi.fn(() => {
        throw new Error('Speech synthesis unavailable');
      });

      const { result } = renderHook(() => useAudio());

      // Should not throw thanks to try/catch
      expect(() => {
        act(() => {
          result.current.speak('test');
        });
      }).not.toThrow();

      window.speechSynthesis.speak = originalSpeak;
    });
  });

  describe('SoundWaveOverlay component', () => {
    it('renders nothing when active=false', () => {
      const { container } = render(<SoundWaveOverlay active={false} />);
      expect(container.querySelector('svg')).toBeNull();
    });

    it('renders 4 animated bars when active=true', () => {
      const { container } = render(<SoundWaveOverlay active={true} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();

      const bars = svg!.querySelectorAll('rect');
      expect(bars).toHaveLength(4);
    });

    it('uses custom color when provided', () => {
      const { container } = render(<SoundWaveOverlay active={true} color="#FF0000" />);
      const bars = container.querySelectorAll('rect');
      bars.forEach((bar) => {
        expect(bar.getAttribute('fill')).toBe('#FF0000');
      });
    });

    it('uses default cyan color', () => {
      const { container } = render(<SoundWaveOverlay active={true} />);
      const bars = container.querySelectorAll('rect');
      bars.forEach((bar) => {
        expect(bar.getAttribute('fill')).toBe('#40D0E8');
      });
    });

    it('bars have wave animation styles', () => {
      const { container } = render(<SoundWaveOverlay active={true} />);
      const bars = container.querySelectorAll('rect');
      bars.forEach((bar) => {
        const style = bar.getAttribute('style') || '';
        expect(style).toContain('animation');
      });
    });
  });

  describe('Sound wave on characters when isSpeaking', () => {
    it('RexRobot shows sound wave bars when isSpeaking=true', () => {
      const { container } = render(<RexRobot mood="happy" isSpeaking={true} />);
      const waveGroup = container.querySelector('.sound-waves');
      expect(waveGroup).toBeInTheDocument();

      const waveBars = waveGroup!.querySelectorAll('rect');
      expect(waveBars.length).toBe(4);
    });

    it('RexRobot hides sound wave bars when isSpeaking=false', () => {
      const { container } = render(<RexRobot mood="happy" isSpeaking={false} />);
      const waveGroup = container.querySelector('.sound-waves');
      expect(waveGroup).toBeNull();
    });

    it('RexRobot hides sound wave bars when isSpeaking is undefined', () => {
      const { container } = render(<RexRobot mood="happy" />);
      const waveGroup = container.querySelector('.sound-waves');
      expect(waveGroup).toBeNull();
    });

    it('BennyBear shows sound wave bars when isSpeaking=true', () => {
      const { container } = render(<BennyBear mood="happy" isSpeaking={true} />);
      const waveGroup = container.querySelector('.sound-waves');
      expect(waveGroup).toBeInTheDocument();

      const waveBars = waveGroup!.querySelectorAll('rect');
      expect(waveBars.length).toBe(3);
    });

    it('BennyBear hides sound wave bars when isSpeaking=false', () => {
      const { container } = render(<BennyBear mood="happy" isSpeaking={false} />);
      const waveGroup = container.querySelector('.sound-waves');
      expect(waveGroup).toBeNull();
    });

    it('CharacterDisplay passes isSpeaking to character components', () => {
      const { container } = render(
        <CharacterDisplay character="rex" mood="happy" isSpeaking={true} />,
      );
      // CharacterDisplay wraps in a motion.div, inside which Rex renders with sound waves
      const waveGroup = container.querySelector('.sound-waves');
      expect(waveGroup).toBeInTheDocument();
    });

    it('CharacterDisplay does not show waves when isSpeaking=false', () => {
      const { container } = render(
        <CharacterDisplay character="benny" mood="happy" isSpeaking={false} />,
      );
      const waveGroup = container.querySelector('.sound-waves');
      expect(waveGroup).toBeNull();
    });

    it('sound wave disappears when speech ends (integration)', async () => {
      vi.useFakeTimers();

      // Simulate the flow: isSpeaking goes true then false
      const { container, rerender } = render(
        <RexRobot mood="happy" isSpeaking={true} />,
      );

      expect(container.querySelector('.sound-waves')).toBeInTheDocument();

      // Rerender with isSpeaking=false (simulating speech end)
      rerender(<RexRobot mood="happy" isSpeaking={false} />);

      expect(container.querySelector('.sound-waves')).toBeNull();
      vi.useRealTimers();
    });
  });

  describe('useAudio — keep-alive timer (Chrome speech cutout fix)', () => {
    it('starts keep-alive timer when speech begins', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useAudio());

      // Use non-ending speech mock so keep-alive has time to fire
      const originalSpeak = window.speechSynthesis.speak;
      (window.speechSynthesis.speak as ReturnType<typeof vi.fn>) = vi.fn((utterance: SpeechSynthesisUtterance) => {
        (utterance as unknown as { onstart: () => void }).onstart?.();
        // Do NOT fire onend — simulates long speech
      });

      act(() => {
        result.current.speak('hello world this is a long sentence');
      });

      // Simulate Chrome: speaking=true, paused=false
      Object.assign(window.speechSynthesis, { speaking: true, paused: false });

      // Advance 10s — the keep-alive interval should fire pause/resume
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(window.speechSynthesis.pause).toHaveBeenCalled();
      expect(window.speechSynthesis.resume).toHaveBeenCalled();

      // Cleanup
      window.speechSynthesis.speak = originalSpeak;
      Object.assign(window.speechSynthesis, { speaking: false, paused: false });
      vi.useRealTimers();
    });

    it('does not pause/resume when speech is already paused', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.speak('test');
      });

      // Simulate paused state
      Object.assign(window.speechSynthesis, { speaking: true, paused: true });
      (window.speechSynthesis.pause as ReturnType<typeof vi.fn>).mockClear();
      (window.speechSynthesis.resume as ReturnType<typeof vi.fn>).mockClear();

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // Should NOT have called pause/resume because paused=true
      expect(window.speechSynthesis.pause).not.toHaveBeenCalled();
      expect(window.speechSynthesis.resume).not.toHaveBeenCalled();

      // Reset
      Object.assign(window.speechSynthesis, { speaking: false, paused: false });
      vi.useRealTimers();
    });

    it('stops keep-alive timer when speech ends naturally', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.speak('done quickly');
      });

      // Let speech end (mock fires onend after 10ms)
      act(() => {
        vi.advanceTimersByTime(20);
      });

      expect(result.current.isSpeaking).toBe(false);

      // Clear pause/resume call counts
      (window.speechSynthesis.pause as ReturnType<typeof vi.fn>).mockClear();
      (window.speechSynthesis.resume as ReturnType<typeof vi.fn>).mockClear();
      Object.assign(window.speechSynthesis, { speaking: false, paused: false });

      // Advance past keep-alive interval — should NOT fire since speech ended
      act(() => {
        vi.advanceTimersByTime(15000);
      });

      expect(window.speechSynthesis.pause).not.toHaveBeenCalled();

      vi.useRealTimers();
    });

    it('stops keep-alive timer when cancelSpeech is called', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useAudio());

      // Start speech with a long-running utterance (override mock to not auto-end)
      const originalSpeak = window.speechSynthesis.speak;
      (window.speechSynthesis.speak as ReturnType<typeof vi.fn>) = vi.fn((utterance: SpeechSynthesisUtterance) => {
        (utterance as unknown as { onstart: () => void }).onstart?.();
        // Do NOT fire onend — simulates long speech
      });

      act(() => {
        result.current.speak('a very long sentence that takes a while');
      });

      expect(result.current.isSpeaking).toBe(true);

      // Cancel speech
      act(() => {
        result.current.cancelSpeech();
      });

      expect(result.current.isSpeaking).toBe(false);

      // Clear and check keep-alive doesn't fire after cancel
      (window.speechSynthesis.pause as ReturnType<typeof vi.fn>).mockClear();
      (window.speechSynthesis.resume as ReturnType<typeof vi.fn>).mockClear();
      Object.assign(window.speechSynthesis, { speaking: false, paused: false });

      act(() => {
        vi.advanceTimersByTime(15000);
      });

      expect(window.speechSynthesis.pause).not.toHaveBeenCalled();

      // Restore
      window.speechSynthesis.speak = originalSpeak;
      vi.useRealTimers();
    });

    it('keep-alive fires multiple times during long speech', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useAudio());

      // Use non-ending speech mock
      const originalSpeak = window.speechSynthesis.speak;
      (window.speechSynthesis.speak as ReturnType<typeof vi.fn>) = vi.fn((utterance: SpeechSynthesisUtterance) => {
        (utterance as unknown as { onstart: () => void }).onstart?.();
      });

      act(() => {
        result.current.speak('very long speech');
      });

      Object.assign(window.speechSynthesis, { speaking: true, paused: false });
      (window.speechSynthesis.pause as ReturnType<typeof vi.fn>).mockClear();
      (window.speechSynthesis.resume as ReturnType<typeof vi.fn>).mockClear();

      // Advance 30s — should fire 3 times (at 10s, 20s, 30s)
      act(() => {
        vi.advanceTimersByTime(30000);
      });

      expect(window.speechSynthesis.pause).toHaveBeenCalledTimes(3);
      expect(window.speechSynthesis.resume).toHaveBeenCalledTimes(3);

      // Cleanup
      window.speechSynthesis.speak = originalSpeak;
      Object.assign(window.speechSynthesis, { speaking: false, paused: false });
      vi.useRealTimers();
    });

    it('queued speech keeps keep-alive running across utterances', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useAudio());

      // Queue two items
      act(() => {
        result.current.speak('first sentence');
        result.current.speak('second sentence');
      });

      // First utterance ends after 10ms, second starts
      act(() => {
        vi.advanceTimersByTime(15);
      });

      // Should still be speaking (second utterance in queue)
      expect(result.current.isSpeaking).toBe(true);

      // Second utterance ends
      act(() => {
        vi.advanceTimersByTime(15);
      });

      expect(result.current.isSpeaking).toBe(false);

      vi.useRealTimers();
    });

    it('speakNow cancels previous speech and resets keep-alive', () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useAudio());

      // Use non-ending speech mock for first call
      const originalSpeak = window.speechSynthesis.speak;
      let utteranceCount = 0;
      (window.speechSynthesis.speak as ReturnType<typeof vi.fn>) = vi.fn((utterance: SpeechSynthesisUtterance) => {
        utteranceCount++;
        (utterance as unknown as { onstart: () => void }).onstart?.();
        // Second call auto-ends so test can proceed
        if (utteranceCount >= 2) {
          setTimeout(() => (utterance as unknown as { onend: () => void }).onend?.(), 10);
        }
      });

      act(() => {
        result.current.speak('first');
      });

      // speakNow should cancel previous and start new
      act(() => {
        result.current.speakNow('interrupt!');
      });

      expect(window.speechSynthesis.cancel).toHaveBeenCalled();
      expect(result.current.isSpeaking).toBe(true);

      // Restore
      window.speechSynthesis.speak = originalSpeak;
      vi.useRealTimers();
    });
  });

  describe('Sound wave on LessonCard (integration)', () => {
    it('LessonCard renders CharacterDisplay with isSpeaking prop', () => {
      const { container } = render(
        <LessonCard
          problem={{
            id: 'test-sw',
            num1: 2,
            num2: 1,
            operator: 'plus',
            answer: 3,
            wrongAnswers: [2, 4],
            objectType: 'star',
            character: 'rex',
            backgroundColor: '#FFF',
            explanation: '2+1=3',
            concept: 'addition',
          }}
          isActive={true}
          onCorrect={vi.fn()}
          onWrong={vi.fn()}
          onSpeakProblem={vi.fn()}
          isSpeaking={true}
        />,
      );
      // When isSpeaking is true, the rex character should show sound waves
      const waveGroup = container.querySelector('.sound-waves');
      expect(waveGroup).toBeInTheDocument();
    });

    it('LessonCard hides sound waves when not speaking', () => {
      const { container } = render(
        <LessonCard
          problem={{
            id: 'test-sw2',
            num1: 2,
            num2: 1,
            operator: 'plus',
            answer: 3,
            wrongAnswers: [2, 4],
            objectType: 'star',
            character: 'rex',
            backgroundColor: '#FFF',
            explanation: '2+1=3',
            concept: 'addition',
          }}
          isActive={true}
          onCorrect={vi.fn()}
          onWrong={vi.fn()}
          onSpeakProblem={vi.fn()}
          isSpeaking={false}
        />,
      );
      const waveGroup = container.querySelector('.sound-waves');
      expect(waveGroup).toBeNull();
    });
  });
});
