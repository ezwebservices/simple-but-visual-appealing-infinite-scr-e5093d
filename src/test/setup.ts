import '@testing-library/jest-dom/vitest';

// Mock SpeechSynthesis API
class MockSpeechSynthesisUtterance {
  text = '';
  rate = 1;
  pitch = 1;
  volume = 1;
  voice: SpeechSynthesisVoice | null = null;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(text?: string) {
    if (text) this.text = text;
  }
}

const mockSpeechSynthesis = {
  speak: vi.fn((utterance: MockSpeechSynthesisUtterance) => {
    utterance.onstart?.();
    // Simulate speech ending after a tick
    setTimeout(() => utterance.onend?.(), 10);
  }),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  getVoices: vi.fn(() => []),
  paused: false,
  pending: false,
  speaking: false,
  onvoiceschanged: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(() => true),
};

Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true,
});

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: MockSpeechSynthesisUtterance,
  writable: true,
});

// Mock framer-motion to avoid animation complexity in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    motion: new Proxy({} as Record<string, unknown>, {
      get: (_target, prop: string) => {
        // Return a component that renders the HTML element with all props
        const Component = ({
          children,
          initial: _initial,
          animate: _animate,
          exit: _exit,
          transition: _transition,
          whileTap: _whileTap,
          whileHover: _whileHover,
          variants: _variants,
          ...rest
        }: Record<string, unknown>) => {
          const React = require('react');
          return React.createElement(prop, rest, children);
        };
        Component.displayName = `motion.${prop}`;
        return Component;
      },
    }),
  };
});
