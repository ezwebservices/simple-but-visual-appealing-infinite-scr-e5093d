import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut, fetchAuthSession } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import type { ChildProfile, SubConcept, CharacterName } from '../types';
import { SUB_CONCEPT_ORDER } from '../types';
import { colors, fontStack, dashboard } from '../styles/theme';
import CharacterDisplay from './characters/CharacterDisplay';
import outputs from '../../amplify_outputs.json';

// Local cache key — not authoritative. The cloud UserSettings row is the
// source of truth so a parent who signs in on a new device doesn't get
// prompted to set a fresh PIN.
const PIN_CACHE_KEY = 'numpals-parent-pin-hash';

/** SHA-256 hex of the input — used so we never store the raw PIN. */
async function hashPin(pin: string): Promise<string> {
  const bytes = new TextEncoder().encode(pin);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Loads the hashed parent PIN from the cloud (UserSettings model) with a
 * localStorage fallback for offline / first-load. Returns null when no PIN
 * has been set yet (first-time flow).
 */
async function loadParentPinHash(): Promise<string | null> {
  try {
    const client = generateClient<Schema>();
    const { data } = await client.models.UserSettings.list({ limit: 1 });
    const row = data?.[0];
    if (row?.parentPinHash) {
      localStorage.setItem(PIN_CACHE_KEY, row.parentPinHash);
      return row.parentPinHash;
    }
    return null;
  } catch (e) {
    console.warn('[NumPals] Could not load parent PIN from cloud, falling back to cache:', e);
    return localStorage.getItem(PIN_CACHE_KEY);
  }
}

/** Upserts the cloud UserSettings row with the hashed PIN. */
async function saveParentPinHash(hash: string): Promise<void> {
  localStorage.setItem(PIN_CACHE_KEY, hash);
  try {
    const client = generateClient<Schema>();
    const { data } = await client.models.UserSettings.list({ limit: 1 });
    const existing = data?.[0];
    if (existing) {
      await client.models.UserSettings.update({ id: existing.id, parentPinHash: hash });
    } else {
      await client.models.UserSettings.create({ parentPinHash: hash });
    }
  } catch (e) {
    console.warn('[NumPals] Could not save parent PIN to cloud:', e);
  }
}

/** Lightweight GraphQL fetch — calls a custom mutation against AppSync. */
async function callGraphQL(token: string, operationName: string, query: string) {
  const endpoint = (outputs as Record<string, unknown> & { data?: { url?: string } })?.data?.url;
  if (!endpoint) throw new Error('AppSync endpoint not configured');
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify({ query, operationName }),
  });
  const json = await resp.json();
  if (json.errors) throw new Error(json.errors[0]?.message || 'GraphQL error');
  return json.data?.[operationName];
}

interface ParentDashboardProps {
  children: ChildProfile[];
  activeChildId: string | null;
  onSwitchChild: (id: string) => void;
  onAddChild: (name: string, avatar: CharacterName) => void;
  onRemoveChild: (id: string) => void;
  onResetChild: (id: string) => void;
  onClose: () => void;
}

const SUB_CONCEPT_LABELS: Record<SubConcept, string> = {
  'rote-counting-5': 'Count to 5',
  'rote-counting-10': 'Count to 10',
  'subitizing-5': 'Quick Dots (1-5)',
  'subitizing-10': 'Quick Dots (1-10)',
  'one-to-one-5': 'Count Objects (1-5)',
  'one-to-one-10': 'Count Objects (1-10)',
  'cardinality-5': 'How Many? (1-5)',
  'cardinality-10': 'How Many? (1-10)',
  'comparing-easy': 'Compare (Easy)',
  'comparing-close': 'Compare (Close)',
  'number-order-5': 'Number Order (1-5)',
  'number-order-10': 'Number Order (1-10)',
  'counting-on': 'Counting On',
  'addition-small': 'Addition (Small)',
  'addition-10': 'Addition (to 10)',
  'subtraction-small': 'Subtraction (Small)',
  'subtraction-10': 'Subtraction (to 10)',
  'doubles': 'Doubles',
  'decomposition': 'Part-Whole',
  'make-10': 'Make 10',
};

interface ConceptGroup {
  label: string;
  color: string;
  concepts: SubConcept[];
}

const CONCEPT_GROUPS: ConceptGroup[] = [
  { label: 'Number Words', color: '#87CEEB', concepts: ['rote-counting-5', 'rote-counting-10'] },
  { label: 'Subitizing', color: '#B8A9C9', concepts: ['subitizing-5', 'subitizing-10'] },
  { label: 'Counting Objects', color: '#FFBE76', concepts: ['one-to-one-5', 'one-to-one-10'] },
  { label: 'Cardinality', color: '#A8E6CF', concepts: ['cardinality-5', 'cardinality-10'] },
  { label: 'Comparing', color: '#FFE66D', concepts: ['comparing-easy', 'comparing-close'] },
  { label: 'Number Order', color: '#FF6B6B', concepts: ['number-order-5', 'number-order-10'] },
  { label: 'Counting On', color: '#DDA0DD', concepts: ['counting-on'] },
  { label: 'Addition', color: '#4ECDC4', concepts: ['addition-small', 'addition-10'] },
  { label: 'Doubles & Parts', color: '#6FCF97', concepts: ['doubles', 'decomposition'] },
  { label: 'Make 10', color: '#56CCF2', concepts: ['make-10'] },
  { label: 'Subtraction', color: '#FF6B6B', concepts: ['subtraction-small', 'subtraction-10'] },
];

const AVATAR_OPTIONS: CharacterName[] = ['bloo', 'sunny', 'rosie', 'milo', 'pip', 'rex', 'robo'];
const AVATAR_LABELS: Record<CharacterName, string> = {
  bloo: 'Bloo Bear',
  sunny: 'Sunny Fox',
  rosie: 'Rosie Bunny',
  milo: 'Milo Frog',
  pip: 'Pip Panda',
  rex: 'Rex Robot',
  robo: 'Robo Rocket',
};

/** Inline SVG mini sparkline for accuracy trends */
function AccuracyTrendChart({ data }: { data: { date: string; accuracy: number }[] }) {
  if (data.length < 2) {
    return (
      <div style={{
        fontFamily: fontStack,
        fontSize: '0.8rem',
        color: 'rgba(0,0,0,0.35)',
        textAlign: 'center',
        padding: '20px 0',
      }}>
        Needs more data to show trends
      </div>
    );
  }

  const width = 280;
  const height = 80;
  const padX = 8;
  const padY = 8;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const points = data.slice(-14);
  const maxVal = 100;

  const coords = points.map((p, i) => ({
    x: padX + (i / (points.length - 1)) * chartW,
    y: padY + chartH - (p.accuracy / maxVal) * chartH,
  }));

  const pathD = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`)
    .join(' ');

  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height - padY} L ${coords[0].x} ${height - padY} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', margin: '0 auto' }}>
      {[0, 25, 50, 75, 100].map(v => {
        const y = padY + chartH - (v / maxVal) * chartH;
        return (
          <line key={v} x1={padX} y1={y} x2={width - padX} y2={y}
            stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
        );
      })}
      <path d={areaD} fill={dashboard.trendFill} />
      <path d={pathD} fill="none" stroke={dashboard.trendLine} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={3} fill={dashboard.trendDot} stroke="#fff" strokeWidth={1.5} />
      ))}
      {points.length > 0 && (
        <>
          <text x={coords[0].x} y={height - 1} textAnchor="start" fontSize="8" fill="rgba(0,0,0,0.4)" fontFamily={fontStack}>
            {points[0].date.slice(5)}
          </text>
          <text x={coords[coords.length - 1].x} y={height - 1} textAnchor="end" fontSize="8" fill="rgba(0,0,0,0.4)" fontFamily={fontStack}>
            {points[points.length - 1].date.slice(5)}
          </text>
        </>
      )}
    </svg>
  );
}

/** Single sub-concept row in the mastery list */
function SubConceptRow({ concept, child }: { concept: SubConcept; child: ChildProfile }) {
  const cp = child.conceptProgress[concept];
  const accuracy = cp.totalAttempted > 0 ? Math.round((cp.totalCorrect / cp.totalAttempted) * 100) : 0;
  const isLocked = cp.status === 'locked';
  const isMastered = cp.status === 'mastered';
  const isActive = cp.status === 'active';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '5px 0 5px 18px',
      opacity: isLocked ? 0.35 : 1,
    }}>
      <div style={{
        width: 16, height: 16, borderRadius: '50%',
        background: isMastered ? colors.mint : isActive ? colors.peach : 'rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.55rem', color: '#fff', flexShrink: 0,
      }}>
        {isMastered ? '\u2713' : isActive ? '\u25CF' : ''}
      </div>
      <span style={{
        fontFamily: fontStack, fontSize: '0.78rem', fontWeight: 600,
        color: colors.charcoal, flex: 1,
      }}>
        {SUB_CONCEPT_LABELS[concept]}
      </span>
      {!isLocked && (
        <span style={{
          fontFamily: fontStack, fontSize: '0.68rem', fontWeight: 600,
          color: 'rgba(0,0,0,0.4)',
        }}>
          {accuracy}% ({cp.totalCorrect}/{cp.totalAttempted})
        </span>
      )}
    </div>
  );
}

/** Add child form */
function AddChildForm({ onAdd, onCancel }: { onAdd: (name: string, avatar: CharacterName) => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<CharacterName>('bloo');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        background: dashboard.cardBg,
        borderRadius: dashboard.cardRadius,
        padding: 20,
        boxShadow: dashboard.cardShadow,
      }}
    >
      <div style={{ fontFamily: fontStack, fontWeight: 700, fontSize: '1rem', color: colors.charcoal, marginBottom: 12 }}>
        Add a Child
      </div>
      <input
        type="text"
        placeholder="Child's name"
        value={name}
        onChange={e => setName(e.target.value)}
        maxLength={20}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '2px solid rgba(0,0,0,0.08)',
          borderRadius: 12,
          fontFamily: fontStack,
          fontSize: '1rem',
          outline: 'none',
          boxSizing: 'border-box',
          marginBottom: 12,
        }}
      />
      <div style={{ fontFamily: fontStack, fontSize: '0.8rem', fontWeight: 600, color: colors.charcoal, marginBottom: 8 }}>
        Choose an avatar:
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {AVATAR_OPTIONS.map(a => (
          <motion.button
            key={a}
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setAvatar(a)}
            style={{
              width: 56, height: 56, borderRadius: 16,
              border: avatar === a ? `3px solid ${colors.mint}` : '2px solid rgba(0,0,0,0.08)',
              background: avatar === a ? `${colors.mint}15` : 'transparent',
              cursor: 'pointer',
              padding: 4,
              WebkitTapHighlightColor: 'transparent',
            }}
            aria-label={AVATAR_LABELS[a]}
          >
            <CharacterDisplay character={a} mood="happy" />
          </motion.button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => name.trim() && onAdd(name.trim(), avatar)}
          disabled={!name.trim()}
          style={{
            flex: 1, padding: '12px', border: 'none', borderRadius: 14,
            background: name.trim() ? `linear-gradient(135deg, ${colors.mint}, ${colors.sky})` : '#D1D5DB',
            color: '#fff', fontFamily: fontStack, fontWeight: 700, fontSize: '1rem',
            cursor: name.trim() ? 'pointer' : 'default',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Add Child
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          style={{
            padding: '12px 20px', border: '2px solid rgba(0,0,0,0.08)', borderRadius: 14,
            background: 'transparent', color: colors.charcoal, fontFamily: fontStack, fontWeight: 600,
            fontSize: '0.9rem', cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Cancel
        </motion.button>
      </div>
    </motion.div>
  );
}

/** PIN entry gate — cloud-synced via UserSettings, so the PIN follows the parent across devices. */
function PinGate({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  // While we're fetching the cloud PIN, show a quick loading state and
  // seed with the cached hash so offline use still works.
  const [storedHash, setStoredHash] = useState<string | null>(() => localStorage.getItem(PIN_CACHE_KEY));
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [phase, setPhase] = useState<'enter' | 'set' | 'confirm'>('enter');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    loadParentPinHash().then(hash => {
      if (cancelled) return;
      setStoredHash(hash);
      setPhase(hash ? 'enter' : 'set');
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const handleDigit = (d: string) => {
    setError('');
    if (phase === 'confirm') {
      if (confirmPin.length < 4) setConfirmPin(prev => prev + d);
    } else {
      if (pin.length < 4) setPin(prev => prev + d);
    }
  };

  const handleDelete = () => {
    setError('');
    if (phase === 'confirm') {
      setConfirmPin(prev => prev.slice(0, -1));
    } else {
      setPin(prev => prev.slice(0, -1));
    }
  };

  const handleSubmit = async () => {
    if (phase === 'set') {
      if (pin.length !== 4) { setError('Enter 4 digits'); return; }
      setPhase('confirm');
      return;
    }
    if (phase === 'confirm') {
      if (confirmPin !== pin) { setError('PINs do not match'); setConfirmPin(''); return; }
      const hash = await hashPin(pin);
      await saveParentPinHash(hash);
      setStoredHash(hash);
      onSuccess();
      return;
    }
    // phase === 'enter'
    const hash = await hashPin(pin);
    if (hash === storedHash) {
      onSuccess();
    } else {
      setError('Wrong PIN');
      setPin('');
    }
  };

  const currentValue = phase === 'confirm' ? confirmPin : pin;
  const title = loading
    ? 'Loading…'
    : phase === 'set' ? 'Set a 4-digit PIN'
    : phase === 'confirm' ? 'Confirm your PIN'
    : 'Enter Parent PIN';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 150,
        background: `linear-gradient(180deg, ${colors.cream}, ${colors.peach}40)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: fontStack,
      }}
    >
      <motion.button
        type="button"
        onClick={onClose}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'absolute', top: 20, right: 20,
          width: 40, height: 40, borderRadius: '50%',
          border: 'none', background: 'rgba(0,0,0,0.06)',
          fontSize: '1.2rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        aria-label="Close"
      >
        &#10005;
      </motion.button>

      <div style={{ fontWeight: 900, fontSize: '1.3rem', color: colors.charcoal, marginBottom: 24 }}>
        {title}
      </div>

      {/* PIN dots */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: 20, height: 20, borderRadius: '50%',
            background: i < currentValue.length ? colors.charcoal : 'rgba(0,0,0,0.1)',
            transition: 'background 0.15s',
          }} />
        ))}
      </div>

      {error && (
        <div style={{ color: colors.coral, fontSize: '0.85rem', fontWeight: 600, marginBottom: 12 }}>
          {error}
        </div>
      )}

      {/* Numpad */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 64px)', gap: 10, marginBottom: 16 }}>
        {['1','2','3','4','5','6','7','8','9'].map(d => (
          <motion.button
            key={d} type="button" whileTap={{ scale: 0.9 }}
            onClick={() => handleDigit(d)}
            style={{
              width: 64, height: 56, borderRadius: 14, border: 'none',
              background: 'rgba(255,255,255,0.8)', fontSize: '1.4rem', fontWeight: 700,
              fontFamily: fontStack, cursor: 'pointer', color: colors.charcoal,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            {d}
          </motion.button>
        ))}
        <motion.button
          type="button" whileTap={{ scale: 0.9 }}
          onClick={handleDelete}
          style={{
            width: 64, height: 56, borderRadius: 14, border: 'none',
            background: 'rgba(0,0,0,0.04)', fontSize: '1.2rem', cursor: 'pointer',
            fontFamily: fontStack, color: colors.charcoal,
          }}
        >
          &#9003;
        </motion.button>
        <motion.button
          type="button" whileTap={{ scale: 0.9 }}
          onClick={() => handleDigit('0')}
          style={{
            width: 64, height: 56, borderRadius: 14, border: 'none',
            background: 'rgba(255,255,255,0.8)', fontSize: '1.4rem', fontWeight: 700,
            fontFamily: fontStack, cursor: 'pointer', color: colors.charcoal,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          0
        </motion.button>
        <motion.button
          type="button" whileTap={{ scale: 0.9 }}
          onClick={handleSubmit}
          disabled={currentValue.length !== 4}
          style={{
            width: 64, height: 56, borderRadius: 14, border: 'none',
            background: currentValue.length === 4
              ? `linear-gradient(135deg, ${colors.mint}, ${colors.sky})`
              : 'rgba(0,0,0,0.06)',
            fontSize: '1rem', fontWeight: 700, cursor: currentValue.length === 4 ? 'pointer' : 'default',
            fontFamily: fontStack, color: currentValue.length === 4 ? '#fff' : 'rgba(0,0,0,0.3)',
          }}
        >
          &#10003;
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function ParentDashboard({
  children: childProfiles,
  activeChildId,
  onSwitchChild,
  onAddChild,
  onRemoveChild,
  onResetChild,
  onClose,
}: ParentDashboardProps) {
  const [pinVerified, setPinVerified] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(activeChildId);
  const selectedChild = childProfiles.find(c => c.id === selectedChildId) ?? childProfiles[0] ?? null;

  const [accountBusy, setAccountBusy] = useState<null | 'portal' | 'signout'>(null);

  // Open Stripe Customer Portal — for cancel/update card/view invoices
  const handleManageSubscription = useCallback(async () => {
    setAccountBusy('portal');
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      if (!token) throw new Error('Not signed in');
      const result = await callGraphQL(token, 'createBillingPortalSession', `
        mutation createBillingPortalSession { createBillingPortalSession { url } }
      `);
      if (result?.url) {
        window.location.href = result.url;
        return; // page is navigating away
      }
      alert('Could not open billing portal — please try again.');
    } catch (e) {
      console.error(e);
      alert('Could not open billing portal: ' + (e instanceof Error ? e.message : 'Unknown error'));
    } finally {
      setAccountBusy(null);
    }
  }, []);

  // Sign out — clears Cognito session, returns to AuthFlow
  const handleSignOut = useCallback(async () => {
    if (!confirm('Sign out of NumPals?')) return;
    setAccountBusy('signout');
    try {
      await signOut();
      // Hard reload so the app re-checks auth and shows AuthFlow
      window.location.reload();
    } catch (e) {
      console.error(e);
      setAccountBusy(null);
    }
  }, []);

  if (!pinVerified) {
    return <PinGate onSuccess={() => setPinVerified(true)} onClose={onClose} />;
  }

  const handleAdd = (name: string, avatar: CharacterName) => {
    onAddChild(name, avatar);
    setShowAddForm(false);
  };

  // Aggregate daily accuracy across all concepts
  const dailyAgg = new Map<string, { total: number; correct: number }>();
  if (selectedChild) {
    for (const entry of selectedChild.recentActivity) {
      const date = entry.timestamp.slice(0, 10);
      const existing = dailyAgg.get(date) ?? { total: 0, correct: 0 };
      existing.total += 1;
      if (entry.correct) existing.correct += 1;
      dailyAgg.set(date, existing);
    }
  }
  const aggregatedTrend = Array.from(dailyAgg.entries())
    .map(([date, { total, correct }]) => ({ date, accuracy: Math.round((correct / total) * 100) }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Overall mastery progress
  const masteredCount = selectedChild
    ? SUB_CONCEPT_ORDER.filter(sc => selectedChild.conceptProgress[sc].status === 'mastered').length
    : 0;
  const activeConceptName = selectedChild
    ? SUB_CONCEPT_ORDER.find(sc => selectedChild.conceptProgress[sc].status === 'active')
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 150,
        background: `linear-gradient(180deg, ${colors.cream}, ${colors.peach}40)`,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        fontFamily: fontStack,
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 20px 12px',
        position: 'sticky',
        top: 0,
        background: `linear-gradient(180deg, ${colors.cream}, ${colors.cream}00)`,
        zIndex: 10,
      }}>
        <div style={{ fontWeight: 900, fontSize: '1.4rem', color: colors.charcoal }}>
          Parent Dashboard
        </div>
        <motion.button
          type="button"
          onClick={onClose}
          whileTap={{ scale: 0.9 }}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            border: 'none', background: 'rgba(0,0,0,0.06)',
            fontSize: '1.2rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            WebkitTapHighlightColor: 'transparent',
          }}
          aria-label="Close dashboard"
        >
          &#10005;
        </motion.button>
      </div>

      <div style={{ padding: '0 16px 32px', maxWidth: 480, margin: '0 auto' }}>
        {/* ── Child Selector ── */}
        <div style={{
          background: dashboard.cardBg,
          borderRadius: dashboard.cardRadius,
          padding: 16,
          boxShadow: dashboard.cardShadow,
          marginBottom: 16,
        }}>
          <div style={{
            fontSize: '0.75rem', fontWeight: 700, color: 'rgba(0,0,0,0.4)',
            textTransform: 'uppercase' as const, letterSpacing: '0.08em',
            marginBottom: 10,
          }}>
            Children
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            {childProfiles.map(child => (
              <motion.button
                key={child.id}
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  setSelectedChildId(child.id);
                  onSwitchChild(child.id);
                }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '8px 12px', borderRadius: 16,
                  border: selectedChildId === child.id ? `2px solid ${colors.mint}` : '2px solid transparent',
                  background: selectedChildId === child.id ? `${colors.mint}12` : 'rgba(0,0,0,0.03)',
                  cursor: 'pointer', minWidth: 70,
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <div style={{ width: 44, height: 44 }}>
                  <CharacterDisplay character={child.avatar} mood="happy" />
                </div>
                <span style={{
                  fontFamily: fontStack, fontSize: '0.75rem', fontWeight: 600,
                  color: colors.charcoal,
                }}>
                  {child.name}
                </span>
              </motion.button>
            ))}
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowAddForm(true)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 4, padding: '8px 12px', borderRadius: 16,
                border: '2px dashed rgba(0,0,0,0.12)',
                background: 'transparent', cursor: 'pointer', minWidth: 70,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(0,0,0,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem', color: 'rgba(0,0,0,0.3)',
              }}>
                +
              </div>
              <span style={{ fontFamily: fontStack, fontSize: '0.7rem', fontWeight: 500, color: 'rgba(0,0,0,0.4)' }}>
                Add
              </span>
            </motion.button>
          </div>

          <AnimatePresence>
            {showAddForm && (
              <AddChildForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />
            )}
          </AnimatePresence>
        </div>

        {selectedChild ? (
          <>
            {/* ── Progress Overview ── */}
            <div style={{
              background: dashboard.cardBg,
              borderRadius: dashboard.cardRadius,
              padding: '16px 20px',
              boxShadow: dashboard.cardShadow,
              marginBottom: 16,
            }}>
              <div style={{
                fontSize: '0.75rem', fontWeight: 700, color: 'rgba(0,0,0,0.4)',
                textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                marginBottom: 8,
              }}>
                Progress Overview
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  fontFamily: fontStack, fontSize: '2rem', fontWeight: 900, color: colors.mint,
                }}>
                  {masteredCount}/{SUB_CONCEPT_ORDER.length}
                </div>
                <div style={{ fontFamily: fontStack, fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)' }}>
                  concepts mastered
                </div>
              </div>
              {activeConceptName && (
                <div style={{
                  fontFamily: fontStack, fontSize: '0.8rem', fontWeight: 600,
                  color: colors.peach, background: `${colors.peach}20`,
                  padding: '6px 12px', borderRadius: 10, display: 'inline-block',
                }}>
                  Currently learning: {SUB_CONCEPT_LABELS[activeConceptName]}
                </div>
              )}
              <div style={{
                height: 8, borderRadius: 4,
                background: 'rgba(0,0,0,0.06)',
                overflow: 'hidden',
                marginTop: 12,
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(masteredCount / SUB_CONCEPT_ORDER.length) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${colors.mint}, ${colors.sky})`,
                  }}
                />
              </div>
            </div>

            {/* ── Concept Mastery (grouped) ── */}
            <div style={{
              background: dashboard.cardBg,
              borderRadius: dashboard.cardRadius,
              padding: '16px 20px',
              boxShadow: dashboard.cardShadow,
              marginBottom: 16,
            }}>
              <div style={{
                fontSize: '0.75rem', fontWeight: 700, color: 'rgba(0,0,0,0.4)',
                textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                marginBottom: 4,
              }}>
                Concept Mastery
              </div>
              {CONCEPT_GROUPS.map(group => {
                const groupMastered = group.concepts.every(
                  sc => selectedChild.conceptProgress[sc].status === 'mastered',
                );
                const groupLocked = group.concepts.every(
                  sc => selectedChild.conceptProgress[sc].status === 'locked',
                );
                return (
                  <div key={group.label} style={{ marginBottom: 6 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 0 2px',
                      opacity: groupLocked ? 0.35 : 1,
                    }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: group.color,
                      }} />
                      <span style={{
                        fontFamily: fontStack, fontWeight: 700, fontSize: '0.85rem',
                        color: colors.charcoal,
                      }}>
                        {group.label}
                      </span>
                      {groupMastered && (
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 600, color: colors.mint,
                          background: `${colors.mint}20`, padding: '1px 6px', borderRadius: 6,
                        }}>
                          Mastered
                        </span>
                      )}
                    </div>
                    {group.concepts.map(sc => (
                      <SubConceptRow key={sc} concept={sc} child={selectedChild} />
                    ))}
                  </div>
                );
              })}
            </div>

            {/* ── Accuracy Trend ── */}
            <div style={{
              background: dashboard.cardBg,
              borderRadius: dashboard.cardRadius,
              padding: '16px 20px',
              boxShadow: dashboard.cardShadow,
              marginBottom: 16,
            }}>
              <div style={{
                fontSize: '0.75rem', fontWeight: 700, color: 'rgba(0,0,0,0.4)',
                textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                marginBottom: 10,
              }}>
                Accuracy Trend
              </div>
              <AccuracyTrendChart data={aggregatedTrend} />
            </div>

            {/* ── Recent Activity ── */}
            <div style={{
              background: dashboard.cardBg,
              borderRadius: dashboard.cardRadius,
              padding: '16px 20px',
              boxShadow: dashboard.cardShadow,
              marginBottom: 16,
            }}>
              <div style={{
                fontSize: '0.75rem', fontWeight: 700, color: 'rgba(0,0,0,0.4)',
                textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                marginBottom: 10,
              }}>
                Recent Activity
              </div>
              {selectedChild.recentActivity.length === 0 ? (
                <div style={{
                  fontSize: '0.85rem', color: 'rgba(0,0,0,0.35)',
                  textAlign: 'center', padding: '20px 0',
                }}>
                  No activity yet. Start playing to see progress!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedChild.recentActivity.slice().reverse().slice(0, 20).map((entry, i) => {
                    const time = new Date(entry.timestamp);
                    const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const dateStr = time.toLocaleDateString([], { month: 'short', day: 'numeric' });

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '8px 12px', borderRadius: 12,
                          background: entry.correct ? `${colors.mint}10` : `${colors.coral}10`,
                        }}
                      >
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: entry.correct ? colors.mint : colors.coral,
                          flexShrink: 0,
                        }} />
                        <span style={{
                          fontFamily: fontStack, fontWeight: 700, fontSize: '0.85rem',
                          color: colors.charcoal, flex: 1,
                        }}>
                          {SUB_CONCEPT_LABELS[entry.concept]}
                        </span>
                        <span style={{
                          fontSize: '0.65rem', color: 'rgba(0,0,0,0.3)',
                          whiteSpace: 'nowrap',
                        }}>
                          {dateStr} {timeStr}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Reset progress ── */}
            <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (confirm(`Reset all progress for ${selectedChild.name}? This will clear mastery, accuracy history, and recent activity. This cannot be undone.`)) {
                    onResetChild(selectedChild.id);
                  }
                }}
                style={{
                  padding: '10px 24px', border: `2px solid ${colors.coral}40`, borderRadius: 14,
                  background: `${colors.coral}10`, color: colors.coral,
                  fontFamily: fontStack, fontSize: '0.85rem', fontWeight: 700,
                  cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
                }}
              >
                Reset {selectedChild.name}&apos;s Progress
              </motion.button>
            </div>

            {/* ── Remove child ── */}
            {childProfiles.length > 1 && (
              <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remove ${selectedChild.name}'s profile? This cannot be undone.`)) {
                      onRemoveChild(selectedChild.id);
                      setSelectedChildId(childProfiles.find(c => c.id !== selectedChild.id)?.id ?? null);
                    }
                  }}
                  style={{
                    fontFamily: fontStack, fontSize: '0.8rem', fontWeight: 500,
                    color: 'rgba(0,0,0,0.3)', background: 'none', border: 'none',
                    cursor: 'pointer', textDecoration: 'underline',
                  }}
                >
                  Remove {selectedChild.name}&apos;s profile
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            fontFamily: fontStack, color: 'rgba(0,0,0,0.4)',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>&#128118;</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>No children added yet</div>
            <div style={{ fontSize: '0.85rem' }}>Tap the + button above to add your first child</div>
          </div>
        )}

        {/* ── Account section ── */}
        <div style={{
          background: dashboard.cardBg,
          borderRadius: dashboard.cardRadius,
          padding: 16,
          boxShadow: dashboard.cardShadow,
          marginTop: 16,
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'rgba(0,0,0,0.45)',
            marginBottom: 12,
          }}>
            Account
          </div>

          <button
            type="button"
            onClick={handleManageSubscription}
            disabled={accountBusy !== null}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 14,
              border: 'none',
              background: colors.mint,
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: 700,
              fontFamily: fontStack,
              cursor: accountBusy ? 'wait' : 'pointer',
              opacity: accountBusy === 'portal' ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 10,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>💳</span>
            {accountBusy === 'portal' ? 'Opening...' : 'Manage Subscription'}
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={accountBusy !== null}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 14,
              border: '2px solid rgba(0,0,0,0.1)',
              background: 'transparent',
              color: colors.charcoal,
              fontSize: '0.95rem',
              fontWeight: 700,
              fontFamily: fontStack,
              cursor: accountBusy ? 'wait' : 'pointer',
              opacity: accountBusy === 'signout' ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>👋</span>
            {accountBusy === 'signout' ? 'Signing out...' : 'Sign Out'}
          </button>

          <p style={{
            fontSize: '0.7rem',
            color: 'rgba(0,0,0,0.4)',
            margin: '12px 0 0',
            textAlign: 'center',
            lineHeight: 1.5,
          }}>
            Manage Subscription opens Stripe to update your card,
            cancel, or view past invoices.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
