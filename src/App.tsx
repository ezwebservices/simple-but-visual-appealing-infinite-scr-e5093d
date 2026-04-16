import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { getCurrentUser } from 'aws-amplify/auth';
import { colors, fontStack } from './styles/theme';
import LoadingScreen from './components/LoadingScreen';
import InfiniteScroll from './components/InfiniteScroll';
import ParentDashboard from './components/ParentDashboard';
import ProfileSwitcher from './components/ProfileSwitcher';
import AuthFlow from './components/AuthFlow';
import SubscriptionGate from './components/SubscriptionGate';
import UnlockProgress from './components/UnlockProgress';
import UnlockCelebration from './components/UnlockCelebration';
import useProgress from './hooks/useProgress';
import useAudio from './hooks/useAudio';
import useChildProfiles from './hooks/useChildProfiles';
import useMastery from './hooks/useMastery';
import { getUnlockedCharacters, getUnlockedDanceMoves, detectNewUnlocks, type UnlockEvent } from './hooks/useUnlocks';
import type { MathProblem, SubConcept } from './types';

type AppView = 'game' | 'dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check auth state on mount
  useEffect(() => {
    getCurrentUser()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  // Show loading screen with dancing characters while checking auth
  if (isAuthenticated === null) {
    return <LoadingScreen />;
  }

  // Unauthenticated → show auth flow
  if (!isAuthenticated) {
    return <AuthFlow onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <SubscriptionGate>
      <GameView />
    </SubscriptionGate>
  );
}

function GameView() {
  const { speak, isSpeaking, cancelSpeech } = useAudio();
  const { children, activeChild, activeChildId, cloudLoading, addChild, switchChild, updateChild, removeChild, resetChild } = useChildProfiles();
  // useProgress now operates on `activeChild.stats` via `updateChild`, which
  // routes through the same debounced cloud write-through as the rest of the
  // profile. Old behaviour (global localStorage key) leaked one kid's streak
  // onto another on shared devices and never synced across devices at all.
  const { recordCorrect, recordWrong } = useProgress(activeChild, updateChild);
  const { recordAnswer, getActiveConcept, getNextProblemConcept, getConceptDifficulty } = useMastery();
  const [view, setView] = useState<AppView>('game');
  const [unlockEvent, setUnlockEvent] = useState<UnlockEvent | null>(null);

  const currentConcept: SubConcept = activeChild ? getActiveConcept(activeChild) : 'rote-counting-5';
  const unlockedCharacters = activeChild ? getUnlockedCharacters(activeChild) : ['bloo' as const];
  const unlockedDanceMoves = activeChild ? getUnlockedDanceMoves(activeChild) : 1;

  // Track previous profile so we can detect new unlocks on each correct answer
  const prevChildRef = useRef(activeChild);

  const handleCorrect = useCallback((problem: MathProblem) => {
    recordCorrect();
    if (activeChild && activeChildId) {
      const { updatedChild } = recordAnswer(
        activeChild, problem.concept, true, problem.num1, problem.num2, problem.operator,
      );
      updateChild(activeChildId, () => updatedChild);

      // Detect newly-unlocked characters/dance moves
      const event = detectNewUnlocks(activeChild, updatedChild);
      if (event) {
        // Delay the celebration so the on-correct dance has time to play first.
        // When it fires, cancel speech so the kid isn't distracted by the next
        // question auto-reading underneath the overlay.
        setTimeout(() => {
          cancelSpeech();
          setUnlockEvent(event);
        }, 1800);
      }
      prevChildRef.current = updatedChild;
    }
  }, [activeChild, activeChildId, recordCorrect, recordAnswer, updateChild, cancelSpeech]);

  const handleWrong = useCallback((problem: MathProblem) => {
    recordWrong();
    if (activeChild && activeChildId) {
      const { updatedChild } = recordAnswer(
        activeChild, problem.concept, false, problem.num1, problem.num2, problem.operator,
      );
      updateChild(activeChildId, () => updatedChild);
    }
  }, [activeChild, activeChildId, recordWrong, recordAnswer, updateChild]);

  // ── Cloud sync gate (placed AFTER all hooks to avoid React error #310) ──
  // Wait for cloud fetch before rendering. This prevents the race condition
  // where "Player 1" was created on a new device before real profiles loaded.
  if (cloudLoading) {
    return <LoadingScreen />;
  }
  if (children.length === 0) {
    addChild('Player 1', 'bloo');
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: colors.cream,
        fontFamily: fontStack,
        overflow: 'hidden',
      }}
    >
      {/* Streak counter removed — replaced by the unlock button below */}

      {/* Parent dashboard button — top-left, next to profile switcher (clears answer buttons on mobile) */}
      <button
        type="button"
        onClick={() => setView('dashboard')}
        style={{
          position: 'fixed',
          top: 20,
          left: 84,
          zIndex: 40,
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          fontSize: '1.3rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          WebkitTapHighlightColor: 'transparent',
        }}
        aria-label="Open parent dashboard"
      >
        &#9881;
      </button>

      {/* Profile switcher — bottom-left avatar */}
      <ProfileSwitcher
        children={children}
        activeChildId={activeChildId}
        onSwitchChild={switchChild}
      />

      {/* Unlock collection button — floating top-right, opens full modal with character + dance previews */}
      {activeChild && <UnlockProgress child={activeChild} />}

      {/* key={activeChildId} forces full remount on profile switch,
          resetting the problem buffer to the new child's active concept */}
      <InfiniteScroll
        key={activeChildId ?? 'default'}
        onCorrect={handleCorrect}
        onWrong={handleWrong}
        onSpeak={speak}
        isSpeaking={isSpeaking}
        isPaused={unlockEvent !== null}
        concept={currentConcept}
        getConceptForIndex={(index) =>
          activeChild ? getNextProblemConcept(activeChild, index) : currentConcept
        }
        getDifficultyForConcept={(c) =>
          activeChild ? getConceptDifficulty(activeChild, c) : 0.5
        }
        availableCharacters={unlockedCharacters}
        unlockedDanceMoves={unlockedDanceMoves}
      />

      {/* Unlock celebration overlay — full-screen burst when new character/dance unlocks */}
      <UnlockCelebration
        unlock={unlockEvent}
        activeCharacter={activeChild?.avatar ?? 'bloo'}
        onDismiss={() => {
          cancelSpeech();
          setUnlockEvent(null);
        }}
      />

      {/* Parent Dashboard overlay */}
      <AnimatePresence>
        {view === 'dashboard' && (
          <ParentDashboard
            children={children}
            activeChildId={activeChildId}
            onSwitchChild={switchChild}
            onAddChild={addChild}
            onRemoveChild={removeChild}
            onResetChild={resetChild}
            onEditChild={(id, name, avatar) =>
              updateChild(id, (c) => ({ ...c, name, avatar }))
            }
            onClose={() => setView('game')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
