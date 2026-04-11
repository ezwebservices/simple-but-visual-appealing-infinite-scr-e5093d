import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChildProfile } from '../types';
import { fontStack } from '../styles/theme';
import CharacterDisplay from './characters/CharacterDisplay';

interface ProfileSwitcherProps {
  children: ChildProfile[];
  activeChildId: string | null;
  onSwitchChild: (childId: string) => void;
}

/**
 * Kid-friendly profile switcher — bottom-left tappable avatar.
 * Tap the active child's avatar to open a bottom-sheet with all profiles.
 * Big character icons, no text reading required for 4-year-olds.
 */
export default function ProfileSwitcher({ children, activeChildId, onSwitchChild }: ProfileSwitcherProps) {
  const [open, setOpen] = useState(false);
  // Pending switch: require a second tap to confirm (prevents accidental switches)
  const [pendingId, setPendingId] = useState<string | null>(null);
  const activeChild = children.find(c => c.id === activeChildId);

  const handleSwitch = useCallback((childId: string) => {
    if (childId === activeChildId) {
      // Already active — just close
      setOpen(false);
      setPendingId(null);
      return;
    }
    if (pendingId === childId) {
      // Second tap — confirm the switch
      onSwitchChild(childId);
      setOpen(false);
      setPendingId(null);
    } else {
      // First tap — highlight and wait for confirmation
      setPendingId(childId);
    }
  }, [onSwitchChild, activeChildId, pendingId]);

  // Only show if there's an active child
  if (!activeChild) return null;

  // Other children (not the active one)
  const otherChildren = children.filter(c => c.id !== activeChildId);

  return (
    <>
      {/* Tappable active avatar — top-left (moved from bottom to clear answer buttons on mobile) */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.9 }}
        aria-label={`Switch profile, current: ${activeChild.name}`}
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 40,
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.9)',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div style={{ width: 44, height: 44 }}>
          <CharacterDisplay character={activeChild.avatar} mood="happy" />
        </div>
        {/* Small badge dot when multiple kids exist */}
        {otherChildren.length > 0 && (
          <div style={{
            position: 'absolute',
            top: -1,
            right: -1,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#4ECDC4',
            border: '2px solid #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.55rem',
            fontWeight: 800,
            color: '#fff',
            fontFamily: fontStack,
          }}>
            {otherChildren.length + 1}
          </div>
        )}
      </motion.button>

      {/* Bottom-sheet overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => { setOpen(false); setPendingId(null); }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 90,
                background: 'rgba(0,0,0,0.3)',
                WebkitTapHighlightColor: 'transparent',
              }}
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 91,
                background: '#fff',
                borderRadius: '24px 24px 0 0',
                padding: '16px 16px 32px',
                boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
              }}
            >
              {/* Drag handle */}
              <div style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                background: 'rgba(0,0,0,0.15)',
                margin: '0 auto 16px',
              }} />

              {/* Title — short text, but the avatars are the primary affordance */}
              <div style={{
                fontFamily: fontStack,
                fontSize: '1rem',
                fontWeight: 700,
                color: 'rgba(0,0,0,0.5)',
                textAlign: 'center',
                marginBottom: 16,
              }}>
                Who&apos;s playing?
              </div>

              {/* Avatar grid */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 16,
                justifyContent: 'center',
                padding: '0 8px',
              }}>
                {children.map((child, i) => {
                  const isActive = child.id === activeChildId;
                  const isPending = child.id === pendingId;
                  return (
                    <motion.button
                      key={child.id}
                      type="button"
                      onClick={() => handleSwitch(child.id)}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: isPending ? [1, 1.08, 1] : 1,
                        opacity: 1,
                      }}
                      transition={isPending
                        ? { scale: { repeat: Infinity, duration: 0.8 }, delay: i * 0.06 }
                        : { delay: i * 0.06, type: 'spring', stiffness: 300, damping: 20 }
                      }
                      whileTap={{ scale: 0.9 }}
                      aria-label={isPending ? `Tap again to switch to ${child.name}` : `Switch to ${child.name}`}
                      style={{
                        width: 80,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      {/* Avatar circle */}
                      <div style={{
                        width: 68,
                        height: 68,
                        borderRadius: '50%',
                        border: isActive
                          ? '3px solid #4ECDC4'
                          : isPending
                            ? '3px solid #F5A623'
                            : '3px solid rgba(0,0,0,0.08)',
                        background: isActive
                          ? 'rgba(78,205,196,0.08)'
                          : isPending
                            ? 'rgba(245,166,35,0.1)'
                            : 'rgba(0,0,0,0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        boxShadow: isActive
                          ? '0 0 0 3px rgba(78,205,196,0.2)'
                          : isPending
                            ? '0 0 0 3px rgba(245,166,35,0.25)'
                            : 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
                      }}>
                        <div style={{ width: 52, height: 52 }}>
                          <CharacterDisplay
                            character={child.avatar}
                            mood={isActive ? 'excited' : isPending ? 'encouraging' : 'happy'}
                          />
                        </div>
                      </div>
                      {/* Label: name or "Tap again!" confirmation */}
                      <span style={{
                        fontFamily: fontStack,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: isActive ? '#4ECDC4' : isPending ? '#F5A623' : 'rgba(0,0,0,0.45)',
                        maxWidth: 80,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                      }}>
                        {isPending ? 'Tap again!' : child.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
