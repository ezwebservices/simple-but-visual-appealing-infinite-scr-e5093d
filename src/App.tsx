import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { getCurrentUser } from 'aws-amplify/auth';
import { hasAuthConfig } from './main';
import { colors, fontStack } from './styles/theme';
import InfiniteScroll from './components/InfiniteScroll';
import StreakCounter from './components/StreakCounter';
import ParentDashboard from './components/ParentDashboard';
import ProfileSwitcher from './components/ProfileSwitcher';
import AuthFlow from './components/AuthFlow';
import SubscriptionGate from './components/SubscriptionGate';
import useProgress from './hooks/useProgress';
import useAudio from './hooks/useAudio';
import useChildProfiles from './hooks/useChildProfiles';
import useMastery from './hooks/useMastery';
import type { MathProblem, SubConcept } from './types';

type AppView = 'game' | 'dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
    hasAuthConfig ? null : true // Skip auth check when backend isn't configured
  );

  // Check auth state on mount — only when auth backend is available
  useEffect(() => {
    if (!hasAuthConfig) return;
    getCurrentUser()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  // Show nothing while checking auth
  if (isAuthenticated === null) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: colors.cream,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fontStack,
        fontSize: '1.2rem',
        color: 'rgba(0,0,0,0.4)',
      }}>
        Loading...
      </div>
    );
  }

  // Unauthenticated → show auth flow
  if (!isAuthenticated) {
    return <AuthFlow onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  // Authenticated (or auth not configured) → gate behind subscription if auth available, else go straight to game
  if (!hasAuthConfig) {
    return <GameView />;
  }

  return (
    <SubscriptionGate>
      <GameView />
    </SubscriptionGate>
  );
}

function GameView() {
  const { progress, recordCorrect, recordWrong } = useProgress();
  const { speak, isSpeaking } = useAudio();
  const { children, activeChild, activeChildId, addChild, switchChild, updateChild, removeChild, resetChild } = useChildProfiles();
  const { recordAnswer, getActiveConcept } = useMastery();
  const [view, setView] = useState<AppView>('game');

  // If no children exist, auto-create a default one
  if (children.length === 0) {
    addChild('Player 1', 'bloo');
  }

  const currentConcept: SubConcept = activeChild ? getActiveConcept(activeChild) : 'rote-counting-5';

  const handleCorrect = useCallback((problem: MathProblem) => {
    recordCorrect();
    if (activeChild && activeChildId) {
      const { updatedChild } = recordAnswer(
        activeChild, problem.concept, true, problem.num1, problem.num2, problem.operator,
      );
      updateChild(activeChildId, () => updatedChild);
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
      {/* Streak counter — top-right */}
      <StreakCounter streak={progress.currentStreak} />

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

      {/* key={activeChildId} forces full remount on profile switch,
          resetting the problem buffer to the new child's active concept */}
      <InfiniteScroll
        key={activeChildId ?? 'default'}
        onCorrect={handleCorrect}
        onWrong={handleWrong}
        onSpeak={speak}
        isSpeaking={isSpeaking}
        concept={currentConcept}
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
            onClose={() => setView('game')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
