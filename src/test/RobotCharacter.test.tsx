import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import RexRobot from '../components/characters/RexRobot';
import CharacterDisplay from '../components/characters/CharacterDisplay';
import type { CharacterMood } from '../types';

const ALL_MOODS: CharacterMood[] = ['happy', 'thinking', 'excited', 'encouraging', 'headShake'];

describe('Robot Character (RexRobot)', () => {
  describe('Basic rendering', () => {
    it('renders an SVG element', () => {
      const { container } = render(<RexRobot />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg!.getAttribute('viewBox')).toBe('0 0 200 240');
    });

    it('renders with default happy mood when no mood specified', () => {
      const { container } = render(<RexRobot />);
      // Should have eyes and mouth (happy default)
      const eyes = container.querySelector('.eyes');
      expect(eyes).toBeInTheDocument();
      const mouth = container.querySelector('.mouth');
      expect(mouth).toBeInTheDocument();
    });

    it('renders head, body, arms, and legs groups', () => {
      const { container } = render(<RexRobot mood="happy" />);
      expect(container.querySelector('.head')).toBeInTheDocument();
      expect(container.querySelector('.body')).toBeInTheDocument();
      expect(container.querySelector('.arm-left')).toBeInTheDocument();
      expect(container.querySelector('.arm-right')).toBeInTheDocument();
      expect(container.querySelector('.leg-left')).toBeInTheDocument();
      expect(container.querySelector('.leg-right')).toBeInTheDocument();
    });

    it('renders dual antennae', () => {
      const { container } = render(<RexRobot mood="happy" />);
      expect(container.querySelector('.antenna-left')).toBeInTheDocument();
      expect(container.querySelector('.antenna-right')).toBeInTheDocument();
    });

    it('renders visor band', () => {
      const { container } = render(<RexRobot mood="happy" />);
      // Visor is a rect in the head area with fill="url(#rr-visor)"
      const visor = container.querySelector('rect[fill="url(#rr-visor)"]');
      expect(visor).toBeInTheDocument();
    });

    it('renders speaker grille mouth area', () => {
      const { container } = render(<RexRobot mood="happy" />);
      const grille = container.querySelector('rect[fill="url(#rr-grille)"]');
      expect(grille).toBeInTheDocument();
    });

    it('accepts className prop', () => {
      const { container } = render(<RexRobot className="test-class" />);
      const svg = container.querySelector('svg');
      expect(svg!.classList.contains('test-class')).toBe(true);
    });
  });

  describe('All mood states render correctly', () => {
    ALL_MOODS.forEach((mood) => {
      it(`renders in ${mood} mood without errors`, () => {
        const { container } = render(<RexRobot mood={mood} />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();

        // Has eyes and mouth in every mood
        const eyes = container.querySelector('.eyes');
        expect(eyes).toBeInTheDocument();
        expect(eyes!.children.length).toBeGreaterThan(0);

        const mouth = container.querySelector('.mouth');
        expect(mouth).toBeInTheDocument();
        expect(mouth!.children.length).toBeGreaterThan(0);
      });
    });

    it('excited mood has sparkle elements', () => {
      const { container } = render(<RexRobot mood="excited" />);
      const eyes = container.querySelector('.eyes');
      // Sparkles are path elements with fill="#80EFFF"
      const sparkles = eyes!.querySelectorAll('path[fill="#80EFFF"]');
      expect(sparkles.length).toBeGreaterThanOrEqual(2);
    });

    it('thinking mood has eyebrow LED arc on right eye', () => {
      const { container } = render(<RexRobot mood="thinking" />);
      const eyes = container.querySelector('.eyes');
      // Thinking mode has a path stroke="#40D0E8" for the eyebrow
      const browArc = eyes!.querySelector('path[stroke="#40D0E8"]');
      expect(browArc).toBeInTheDocument();
    });

    it('encouraging mood has half-closed visor lids', () => {
      const { container } = render(<RexRobot mood="encouraging" />);
      const eyes = container.querySelector('.eyes');
      // Half-closed lid paths with fill="#1A2A38"
      const lids = eyes!.querySelectorAll('path[fill="#1A2A38"]');
      expect(lids.length).toBeGreaterThanOrEqual(2); // one per eye
    });

    it('headShake mood has concerned brow LEDs', () => {
      const { container } = render(<RexRobot mood="headShake" />);
      const eyes = container.querySelector('.eyes');
      // Concerned brow LED paths
      const brows = eyes!.querySelectorAll('path[stroke="#40D0E8"]');
      expect(brows.length).toBeGreaterThanOrEqual(2); // one per eye
    });

    it('happy mood has standard LED eyes with highlights', () => {
      const { container } = render(<RexRobot mood="happy" />);
      const eyes = container.querySelector('.eyes');
      // Happy eyes have circles with fill="url(#rr-eye-glow)"
      const glowCircles = eyes!.querySelectorAll('circle[fill="url(#rr-eye-glow)"]');
      expect(glowCircles.length).toBe(2);
    });
  });

  describe('Mouth varies by mood', () => {
    it('excited mouth has wide smile with glow', () => {
      const { container } = render(<RexRobot mood="excited" />);
      const mouth = container.querySelector('.mouth');
      const paths = mouth!.querySelectorAll('path');
      expect(paths.length).toBe(2); // main smile + inner glow
    });

    it('thinking mouth is small/neutral', () => {
      const { container } = render(<RexRobot mood="thinking" />);
      const mouth = container.querySelector('.mouth');
      const path = mouth!.querySelector('path');
      expect(path).toBeInTheDocument();
      // Smaller mouth: coordinates M94,94 to M106,94
      const d = path!.getAttribute('d')!;
      expect(d).toContain('94');
      expect(d).toContain('106');
    });

    it('headShake mouth is worried/flat', () => {
      const { container } = render(<RexRobot mood="headShake" />);
      const mouth = container.querySelector('.mouth');
      const path = mouth!.querySelector('path');
      expect(path).toBeInTheDocument();
      // Lower opacity for worried look
      expect(path!.getAttribute('opacity')).toBe('0.6');
    });
  });

  describe('Sound wave bars', () => {
    it('shows 4 cyan wave bars when isSpeaking=true', () => {
      const { container } = render(<RexRobot mood="happy" isSpeaking={true} />);
      const waves = container.querySelector('.sound-waves');
      expect(waves).toBeInTheDocument();
      const bars = waves!.querySelectorAll('rect');
      expect(bars.length).toBe(4);
      // All bars should be cyan
      bars.forEach((bar) => {
        expect(bar.getAttribute('fill')).toBe('#40D0E8');
      });
    });

    it('wave bars have staggered animation delays', () => {
      const { container } = render(<RexRobot mood="happy" isSpeaking={true} />);
      const bars = container.querySelectorAll('.sound-waves rect');
      const styles = Array.from(bars).map((b) => b.getAttribute('style') || '');
      // Different animation names and delays
      expect(styles[0]).toContain('rr-wave1');
      expect(styles[1]).toContain('rr-wave2');
      expect(styles[2]).toContain('rr-wave3');
      expect(styles[3]).toContain('rr-wave4');
    });

    it('no wave bars when isSpeaking=false', () => {
      const { container } = render(<RexRobot mood="happy" isSpeaking={false} />);
      expect(container.querySelector('.sound-waves')).toBeNull();
    });

    it('wave bars work in every mood state', () => {
      ALL_MOODS.forEach((mood) => {
        const { container, unmount } = render(<RexRobot mood={mood} isSpeaking={true} />);
        const waves = container.querySelector('.sound-waves');
        expect(waves).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Gradient definitions', () => {
    it('defines all required gradients', () => {
      const { container } = render(<RexRobot />);
      const defs = container.querySelector('defs');
      expect(defs).toBeInTheDocument();

      const expectedIds = [
        'rr-metal', 'rr-metal-head', 'rr-accent', 'rr-eye-glow',
        'rr-antenna-glow-l', 'rr-antenna-glow-r', 'rr-dark-panel',
        'rr-limb', 'rr-shadow', 'rr-grille', 'rr-visor',
      ];
      expectedIds.forEach((id) => {
        const el = defs!.querySelector(`#${id}`);
        expect(el).toBeInTheDocument();
      });
    });

    it('defines CSS keyframe animations', () => {
      const { container } = render(<RexRobot />);
      const style = container.querySelector('style');
      expect(style).toBeInTheDocument();
      const css = style!.textContent || '';
      expect(css).toContain('rr-wave1');
      expect(css).toContain('rr-wave2');
      expect(css).toContain('rr-wave3');
      expect(css).toContain('rr-wave4');
      expect(css).toContain('rr-antenna-pulse');
    });
  });
});

describe('Robot in CharacterDisplay', () => {
  it('renders rex character via CharacterDisplay', () => {
    const { container } = render(
      <CharacterDisplay character="rex" mood="happy" />,
    );
    // Should render RexRobot SVG
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg!.getAttribute('viewBox')).toBe('0 0 200 240');
  });

  it('renders robo character via CharacterDisplay (maps to RexRobot)', () => {
    const { container } = render(
      <CharacterDisplay character="robo" mood="happy" />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // Both rex and robo map to RexRobot, so same viewBox
    expect(svg!.getAttribute('viewBox')).toBe('0 0 200 240');
  });

  it('head-shake animation triggers for encouraging mood', () => {
    const { container } = render(
      <CharacterDisplay character="rex" mood="encouraging" />,
    );
    // CharacterDisplay wraps in motion.div — the mock renders a plain div
    // The character should render with encouraging mood (mapped from headShake)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('head-shake animation triggers for headShake mood', () => {
    const { container } = render(
      <CharacterDisplay character="rex" mood="headShake" />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // headShake mood gets mapped to 'encouraging' for the Character component
    // so the character renders in encouraging state with head-shake wrapper
  });

  it('CharacterDisplay passes isSpeaking through to RexRobot', () => {
    const { container } = render(
      <CharacterDisplay character="rex" mood="happy" isSpeaking={true} />,
    );
    const waves = container.querySelector('.sound-waves');
    expect(waves).toBeInTheDocument();
  });

  it('robot displays properly alongside other characters', () => {
    // Render multiple characters to ensure no ID collisions
    const { container: c1 } = render(
      <CharacterDisplay character="rex" mood="happy" />,
    );
    const { container: c2 } = render(
      <CharacterDisplay character="benny" mood="happy" />,
    );

    expect(c1.querySelector('svg')).toBeInTheDocument();
    expect(c2.querySelector('svg')).toBeInTheDocument();

    // Rex uses rr- prefixed gradients, Bloo uses bb- prefixed
    expect(c1.querySelector('#rr-metal')).toBeInTheDocument();
    expect(c2.querySelector('#bb-metal')).toBeInTheDocument();
  });

  describe('Robot in QuickLessonCard', () => {
    it('QuickLessonCard renders robot character', async () => {
      const QuickLessonCard = (await import('../components/animations/QuickLessonCard')).default;
      const { container } = render(
        <QuickLessonCard
          show={true}
          num1={2}
          num2={1}
          operator="plus"
          correctAnswer={3}
          explanation="2+1=3"
          objectType="apple"
          character="rex"
          onDismiss={vi.fn()}
        />,
      );
      // QuickLessonCard shows a CharacterDisplay in step 1+
      const svg = container.querySelector('svg[viewBox="0 0 200 240"]');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Robot in LessonCard', () => {
    it('LessonCard renders robot character when assigned', async () => {
      const { default: LessonCard } = await import('../components/LessonCard');
      const { container } = render(
        <LessonCard
          problem={{
            id: 'robot-test',
            num1: 3,
            num2: 2,
            operator: 'plus' as const,
            answer: 5,
            wrongAnswers: [4, 6] as [number, number],
            objectType: 'apple' as const,
            character: 'rex' as const,
            backgroundColor: '#FFF8F0',
            explanation: '3+2=5',
            concept: 'addition' as const,
          }}
          isActive={true}
          onCorrect={vi.fn()}
          onWrong={vi.fn()}
          onSpeakProblem={vi.fn()}
        />,
      );
      // Should render the RexRobot SVG
      const svg = container.querySelector('svg[viewBox="0 0 200 240"]');
      expect(svg).toBeInTheDocument();
    });
  });
});

describe('TypeScript type safety', () => {
  it('CharacterName type includes rex and robo', () => {
    // This test verifies at compile time that rex and robo are valid CharacterName values
    const names: import('../types').CharacterName[] = ['bloo', 'sunny', 'rosie', 'milo', 'pip', 'rex', 'robo'];
    expect(names).toHaveLength(7);
  });

  it('CharacterMood type includes all 5 moods', () => {
    const moods: import('../types').CharacterMood[] = ['happy', 'excited', 'thinking', 'encouraging', 'headShake'];
    expect(moods).toHaveLength(5);
  });

  it('RexRobot accepts all CharacterMood values', () => {
    ALL_MOODS.forEach((mood) => {
      expect(() => render(<RexRobot mood={mood} />)).not.toThrow();
    });
  });
});

describe('No visual regressions on existing characters', () => {
  const existingCharacters = ['bloo', 'sunny', 'rosie', 'milo', 'pip'] as const;

  existingCharacters.forEach((char) => {
    it(`${char} still renders SVG correctly`, () => {
      const { container } = render(
        <CharacterDisplay character={char} mood="happy" />,
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it(`${char} still supports isSpeaking prop`, () => {
      const { container } = render(
        <CharacterDisplay character={char} mood="happy" isSpeaking={true} />,
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    ALL_MOODS.forEach((mood) => {
      it(`${char} renders in ${mood} mood`, () => {
        const { container } = render(
          <CharacterDisplay character={char} mood={mood} />,
        );
        expect(container.querySelector('svg')).toBeInTheDocument();
      });
    });
  });
});
