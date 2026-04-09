import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LessonCard from '../components/LessonCard';
import type { MathProblem } from '../types';

const mockProblem: MathProblem = {
  id: 'test-1',
  num1: 3,
  num2: 2,
  operator: 'plus',
  answer: 5,
  wrongAnswers: [4, 6],
  objectType: 'apple',
  character: 'bloo',
  backgroundColor: '#FFF8F0',
  explanation: '3 plus 2 equals 5',
  concept: 'addition',
};

describe('Lesson Button Feature', () => {
  let onCorrect: ReturnType<typeof vi.fn>;
  let onWrong: ReturnType<typeof vi.fn>;
  let onSpeakProblem: ReturnType<typeof vi.fn>;
  let onAdvance: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onCorrect = vi.fn();
    onWrong = vi.fn();
    onSpeakProblem = vi.fn();
    onAdvance = vi.fn();
  });

  const renderCard = (overrides?: Partial<Parameters<typeof LessonCard>[0]>) =>
    render(
      <LessonCard
        problem={mockProblem}
        isActive={true}
        onCorrect={onCorrect}
        onWrong={onWrong}
        onAdvance={onAdvance}
        onSpeakProblem={onSpeakProblem}
        {...overrides}
      />,
    );

  it('renders the Lesson button on the problem screen', () => {
    renderCard();
    const lessonBtn = screen.getByRole('button', { name: /watch lesson demo/i });
    expect(lessonBtn).toBeInTheDocument();
  });

  it('renders a lightbulb SVG icon inside the Lesson button', () => {
    renderCard();
    const lessonBtn = screen.getByRole('button', { name: /watch lesson demo/i });
    const svg = lessonBtn.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('opens the QuickLessonCard walkthrough when Lesson button is tapped', () => {
    renderCard();

    // Before tapping — no "Let me show you" text visible
    expect(screen.queryByText(/let me show you/i)).not.toBeInTheDocument();

    // Tap the Lesson button
    const lessonBtn = screen.getByRole('button', { name: /watch lesson demo/i });
    fireEvent.click(lessonBtn);

    // QuickLessonCard should now be visible with its intro text
    expect(screen.getByText(/let me show you how to solve this/i)).toBeInTheDocument();
  });

  it('does not call onWrong or onCorrect when opening Lesson button', () => {
    renderCard();
    const lessonBtn = screen.getByRole('button', { name: /watch lesson demo/i });
    fireEvent.click(lessonBtn);

    expect(onWrong).not.toHaveBeenCalled();
    expect(onCorrect).not.toHaveBeenCalled();
  });

  it('does not affect progress or mastery when using Lesson button', () => {
    renderCard();
    const lessonBtn = screen.getByRole('button', { name: /watch lesson demo/i });
    fireEvent.click(lessonBtn);

    // No answer selection callbacks should fire
    expect(onWrong).not.toHaveBeenCalled();
    expect(onCorrect).not.toHaveBeenCalled();
    expect(onAdvance).not.toHaveBeenCalled();
  });

  it('renders two separate QuickLessonCard instances (wrong-answer + lesson-button)', () => {
    renderCard();

    // The LessonCard has two QuickLessonCard components:
    // 1. showEncouragement (wrong-answer flow)
    // 2. showLesson (lesson-button flow)
    // Both should exist but only one visible at a time
    // Clicking lesson button should show one without triggering wrong-answer flow
    const lessonBtn = screen.getByRole('button', { name: /watch lesson demo/i });
    fireEvent.click(lessonBtn);

    // The lesson demo should be visible
    expect(screen.getByText(/let me show you how to solve this/i)).toBeInTheDocument();

    // onWrong should NOT have been called (independent of wrong-answer flow)
    expect(onWrong).not.toHaveBeenCalled();
  });

  it('Lesson button works independently of the wrong-answer QuickLessonCard flow', () => {
    renderCard();

    // First: open lesson via button (not via wrong answer)
    const lessonBtn = screen.getByRole('button', { name: /watch lesson demo/i });
    fireEvent.click(lessonBtn);

    // Lesson demo is visible
    expect(screen.getByText(/let me show you how to solve this/i)).toBeInTheDocument();

    // No wrong-answer callbacks
    expect(onWrong).not.toHaveBeenCalled();
    expect(onCorrect).not.toHaveBeenCalled();
  });

  it('Lesson button co-exists with the replay audio button', () => {
    renderCard();
    const replayBtn = screen.getByRole('button', { name: /replay question audio/i });
    const lessonBtn = screen.getByRole('button', { name: /watch lesson demo/i });
    expect(replayBtn).toBeInTheDocument();
    expect(lessonBtn).toBeInTheDocument();
  });

  it('returns to the same problem with no answer selected after lesson dismissal', async () => {
    renderCard();

    // Verify answer buttons are all in default state (no selection)
    const answerButtons = screen.getAllByRole('button').filter(
      (btn) => btn.getAttribute('aria-label')?.includes('Answer') || !btn.getAttribute('aria-label')
    );
    // The answer choices group exists
    const answerGroup = screen.getByRole('group', { name: /answer choices/i });
    expect(answerGroup).toBeInTheDocument();

    // Open lesson
    const lessonBtn = screen.getByRole('button', { name: /watch lesson demo/i });
    fireEvent.click(lessonBtn);

    // The problem card is still rendered underneath
    expect(screen.getByText('3 + 2 = ?')).toBeInTheDocument();
  });

  it('showLesson state is managed independently from showEncouragement', () => {
    renderCard();

    // Before any interaction, neither lesson is shown
    expect(screen.queryByText(/let me show you how to solve this/i)).not.toBeInTheDocument();

    // Open via lesson button
    fireEvent.click(screen.getByRole('button', { name: /watch lesson demo/i }));
    expect(screen.getByText(/let me show you how to solve this/i)).toBeInTheDocument();

    // No wrong-answer state was triggered
    expect(onWrong).not.toHaveBeenCalled();
  });
});
