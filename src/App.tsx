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
  const { recordCorrect, recordWrong } = useProgress();
  const { speak, isSpeaking } = useAudio();
  const { children, activeChild, activeChildId, addChild, switchChild, updateChild, removeChild, resetChild } = useChildProfiles();
  const { recordAnswer, getActiveConcept } = useMastery();
  const [view, setView] = useState<AppView>('game');
  const [unlockEvent, setUnlockEvent] = useState<UnlockEvent | null>(null);

  // If no children exist, auto-create a default one (always starts with bloo only)
  if (children.length === 0) {
    addChild('Player 1', 'bloo');
  }

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
        // Delay the celebration so the on-correct dance has time to play first
        setTimeout(() => setUnlockEvent(event), 1800);
      }
      prevChildRef.current = updatedChild;
    }
  }, [activeChild, activeChildId, recordCorrect, recordAnswer, updateChild]);

  const handleWrong = useCallback((problem: MathProblem) => {
    recordWrong();
    if (activeChild && activeChildId) {
      const { updatedChild } = recordAnswer(
        activeChild, problem.concept, false, problem.num1, problem.num2, problem.operator,
      );
      updateChild(activeChildId, () => updatedChild);
    }
  }, [activeChild, activeChildId, recordWrong, recordAnswer, updateChild]);

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

      {/* Parent dashboard button — bottom-right */}
      <button
        type="button"
        onClick={() => setView('dashboard')}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
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
        concept={currentConcept}
        availableCharacters={unlockedCharacters}
        unlockedDanceMoves={unlockedDanceMoves}
      />

      {/* Unlock celebration overlay — full-screen burst when new character/dance unlocks */}
      <UnlockCelebration unlock={unlockEvent} onDismiss={() => setUnlockEvent(null)} />

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
            onClose={() => setView('game')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
