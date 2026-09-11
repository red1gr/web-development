import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient, User } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- TYPES ---
interface Theme {
  id: string; hex: string; bg: string; accent: string; text: string;
  border: string; focus: string; gradient: string; btn: string;
  glow: string; titleGradient: string; nebula: string;
}

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' ;
type Category = 'FITNESS' | 'STUDY' ;

interface Quest {
  id: string;
  goal: string;
  penalty: string;
  room_code: string;
  is_claimed: boolean;
  claimed_by?: string;
  claimant_avatar?: string;
  created_at: string;
  difficulty?: Difficulty;
  category?: Category;
  expires_at?: string;
  points?: number;
  duo_partner?: string;
  reactions?: Record<string, string[]>;
  comments?: Comment[];
  is_archived?: boolean;
  partner_confirmed?: boolean;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  created_at: string;
}

// interface DailyChallenge {
//   id: string;
//   goal: string;
//   penalty: string;
//   difficulty: Difficulty;
//   category: Category;
//   points: number;
//   date: string;
//   room_code: string;
//   is_claimed: boolean;
//   claimed_by?: string;
// }

// --- CONSTANTS ---
const THEMES: Record<string, Theme> = {
  red:     { id: 'red',     hex: '#ff0000', bg: 'bg-[#050101]', accent: 'bg-red-600',     text: 'text-red-500',     border: 'border-red-600/20',     focus: 'focus:border-red-600',     gradient: 'from-red-600 to-black',       btn: 'bg-red-600 hover:bg-red-500',        glow: 'shadow-red-600/20',     titleGradient: 'to-red-700',   nebula: 'rgba(255,0,0,0.12)' },
  blue:    { id: 'blue',    hex: '#2563eb', bg: 'bg-[#02040a]', accent: 'bg-blue-600',    text: 'text-blue-400',    border: 'border-blue-500/20',    focus: 'focus:border-blue-500',    gradient: 'from-blue-600 to-indigo-900', btn: 'bg-blue-600 hover:bg-blue-400',      glow: 'shadow-blue-500/20',    titleGradient: 'to-blue-700',  nebula: 'rgba(37,99,235,0.12)' },
  emerald: { id: 'emerald', hex: '#10b981', bg: 'bg-[#020504]', accent: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500/20', focus: 'focus:border-emerald-500', gradient: 'from-emerald-600 to-teal-900', btn: 'bg-emerald-600 hover:bg-emerald-400', glow: 'shadow-emerald-500/20', titleGradient: 'to-emerald-600', nebula: 'rgba(16,185,129,0.12)' },
  rose:    { id: 'rose',    hex: '#e11d48', bg: 'bg-[#050102]', accent: 'bg-rose-600',    text: 'text-rose-400',    border: 'border-rose-500/20',    focus: 'focus:border-rose-500',    gradient: 'from-rose-600 to-red-900',    btn: 'bg-rose-600 hover:bg-rose-400',      glow: 'shadow-rose-500/20',    titleGradient: 'to-rose-600',  nebula: 'rgba(225,29,72,0.12)' },
  amber:   { id: 'amber',   hex: '#f59e0b', bg: 'bg-[#050402]', accent: 'bg-amber-500',   text: 'text-amber-400',   border: 'border-amber-500/20',   focus: 'focus:border-amber-500',   gradient: 'from-amber-500 to-orange-900', btn: 'bg-amber-500 hover:bg-amber-400',    glow: 'shadow-amber-500/20',   titleGradient: 'to-amber-600', nebula: 'rgba(245,158,11,0.12)' },
  pink:    { id: 'pink',    hex: '#db2777', bg: 'bg-[#050204]', accent: 'bg-pink-600',    text: 'text-pink-400',    border: 'border-pink-500/20',    focus: 'focus:border-pink-500',    gradient: 'from-pink-600 to-purple-900', btn: 'bg-pink-600 hover:bg-pink-400',      glow: 'shadow-pink-500/20',    titleGradient: 'to-pink-600',  nebula: 'rgba(219,39,119,0.12)' },
};

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; points: number }> = {
  EASY:      { label: 'EASY',      color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10', points: 10  },
  MEDIUM:    { label: 'MEDIUM',    color: 'text-amber-400 border-amber-400/30 bg-amber-400/10',       points: 25  },
  HARD:      { label: 'HARD',      color: 'text-orange-400 border-orange-400/30 bg-orange-400/10',    points: 50  },
};

const CATEGORY_CONFIG: Record<Category, { label: string; color: string }> = {
  FITNESS:  { label: 'FITNESS',  color: 'text-green-400'  },
  STUDY:   { label: 'STUDY',   color: 'text-blue-400'   },
};

const REACTIONS = ['❤', '🤣', '🙂', '❌', '✅', '🔥', '😍'];

const RANK_THRESHOLDS = [
  { min: 0,    rank: 'RECRUIT',  color: 'text-slate-400'   },
  { min: 50,   rank: 'AGENT',    color: 'text-blue-400'    },
  { min: 150,  rank: 'OPERATOR', color: 'text-emerald-400' },
  { min: 350,  rank: 'VETERAN',  color: 'text-amber-400'   },
  { min: 700,  rank: 'ELITE',    color: 'text-orange-400'  },
  { min: 1200, rank: 'LEGEND',   color: 'text-purple-400'  },
];

// Deterministic: same date + same room_code = same challenge for everyone in the room
// const DAILY_POOL = [
//   { goal: 'STUDY 2H',                        penalty: 'ANYTHING',                      difficulty: 'HARD'      as Difficulty, category: 'STUDY'  as Category },
//   { goal: 'FITNESS 1H',                        penalty: 'ANYTHING',                      difficulty: 'HARD'      as Difficulty, category: 'STUDY'  as Category },
// ];

// function getDailySeed(date: string, roomCode: string): number {
//   const str = date + roomCode;
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
//   }
//   return Math.abs(hash);
// }

function getRank(points: number) {
  return [...RANK_THRESHOLDS].reverse().find(r => points >= r.min) || RANK_THRESHOLDS[0];
}

// --- SMALL COMPONENTS ---
const MissionTimer = ({ startTime }: { startTime: string }) => {
  const [elapsed, setElapsed] = useState('');
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
      setElapsed(`${Math.floor(diff / 60)}M ${diff % 60}S`);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);
  return <span className="font-mono text-[10px] opacity-60 tracking-widest">{elapsed}</span>;
};

const CountdownTimer = ({ expiresAt, onExpire }: { expiresAt: string; onExpire: () => void }) => {
  const [remaining, setRemaining] = useState('');
  const [critical, setCritical] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
      if (diff <= 0) { setRemaining('EXPIRED'); onExpire(); clearInterval(interval); return; }
      const m = Math.floor(diff / 60), s = diff % 60;
      setRemaining(`T- ${m}:${s.toString().padStart(2, '0')}`);
      setCritical(diff < 60);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);
  return (
    <span className={`font-mono text-xs font-black tracking-widest ${critical ? 'text-red-500 animate-pulse' : 'text-amber-400'}`}>
      {remaining}
    </span>
  );
};

const GlobalDecorations = ({ theme }: { theme: Theme }) => {
  const particles = useMemo(() => [...Array(20)].map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: Math.random() * 10 + 10,
  })), []);
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        initial={{ top: '-10%' }} animate={{ top: '110%' }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50"
      />
      {particles.map(p => (
        <motion.div key={p.id}
          animate={{ y: [0, -100, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'linear' }}
          className="absolute rounded-full bg-white/20"
          style={{ width: p.size, height: p.size, left: p.left, top: p.top }}
        />
      ))}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 25, repeat: Infinity }}
        className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full blur-[140px]"
        style={{ backgroundColor: theme.nebula }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(${theme.hex} 1px, transparent 1px), linear-gradient(90deg, ${theme.hex} 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
};

// // --- DAILY CHALLENGE PANEL ---
// const DailyChallengePanel = ({
//    roomKey, user, onClaim,
// }: { theme: Theme; roomKey: string; user: User | null; onClaim: (pts: number) => void }) => {
//   const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const today = new Date().toISOString().split('T')[0];
//     const seed = getDailySeed(today, roomKey);
//     const picked = DAILY_POOL[seed % DAILY_POOL.length];
//     const pts = DIFFICULTY_CONFIG[picked.difficulty].points * 2;

//     supabase
//       .from('daily_challenges')
//       .select('*')
//       .eq('room_code', roomKey)
//       .eq('date', today)
//       .single()
//       .then(({ data }) => {
//         if (data) { setChallenge(data as DailyChallenge); setLoading(false); return; }
//         supabase
//           .from('daily_challenges')
//           .insert([{
//             goal: picked.goal, penalty: picked.penalty,
//             difficulty: picked.difficulty, category: picked.category,
//             points: pts, date: today, room_code: roomKey, is_claimed: false,
//           }])
//           .select()
//           .single()
//           .then(({ data: d }) => { if (d) setChallenge(d as DailyChallenge); setLoading(false); });
//       });
//   }, [roomKey]);

//   const claim = async () => {
//     if (!challenge || challenge.is_claimed || !user) return;
//     const name = (user.user_metadata?.full_name || user.email || 'AGENT').toUpperCase();
//     await supabase.from('daily_challenges').update({ is_claimed: true, claimed_by: name }).eq('id', challenge.id);
//     setChallenge(prev => prev ? { ...prev, is_claimed: true, claimed_by: name } : null);
//     onClaim(challenge.points);
//   };

//   if (loading || !challenge) return null;

//   const diff = DIFFICULTY_CONFIG[challenge.difficulty];
//   const cat = CATEGORY_CONFIG[challenge.category];

//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
//       className="bg-black/40 border border-yellow-500/30 rounded-[8px] p-6 space-y-4 relative overflow-hidden">
//       <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl" />
//       <div className="flex items-center justify-between">
//         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-400">DAILY CHALLENGE</span>
//         <span className="text-[10px] font-mono text-white/30">{new Date().toLocaleDateString()}</span>
//       </div>
//       <div className="flex gap-2 flex-wrap">
//         <span className={`text-[10px] font-black border rounded px-2 py-0.5 ${diff.color}`}>{diff.label}</span>
//         <span className={`text-[10px] font-black ${cat.color}`}>{cat.label}</span>
//         <span className="text-[10px] font-black text-yellow-400">+{challenge.points} PTS</span>
//       </div>
//       <h4 className="text-2xl font-black italic uppercase tracking-tighter text-yellow-300">{challenge.goal}</h4>
//       <p className="text-[11px] text-red-400 font-black uppercase">{challenge.penalty}</p>
//       {challenge.is_claimed
//         ? <p className="text-[11px] font-black text-white/40 uppercase">CLAIMED BY {challenge.claimed_by}</p>
//         : <button onClick={claim} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 rounded-[6px] text-xs uppercase tracking-widest transition-colors">
//             CLAIM DAILY CHALLENGE
//           </button>
//       }
//     </motion.div>
//   );
// };

// --- PLAYER PROFILE MODAL ---
const PlayerProfileModal = ({
  name, quests, onClose, theme,
}: { name: string; quests: Quest[]; onClose: () => void; theme: Theme }) => {
  const completed = quests.filter(q => q.is_claimed && q.claimed_by === name);
  const totalPts = completed.reduce((s, q) => s + (q.points || DIFFICULTY_CONFIG[(q.difficulty || 'EASY')].points), 0);
  const rank = getRank(totalPts);
  const duoMissions = completed.filter(q => q.duo_partner).length;
  const catBreakdown = completed.reduce((acc, q) => {
    const c = q.category || 'FITNESS';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.8, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 40 }}
        className="bg-[#0a0a0a] border border-white/10 rounded-[12px] p-8 w-full max-w-md space-y-6"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] opacity-40">AGENT PROFILE</h2>
          <button onClick={onClose} className="opacity-40 hover:opacity-100 font-black text-lg">X</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-[8px] bg-white/10 flex items-center justify-center text-2xl font-black">{name[0]}</div>
          <div>
            <p className="text-2xl font-black italic uppercase">{name}</p>
            <p className={`text-xs font-black ${rank.color}`}>{rank.rank}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'POINTS',   value: totalPts,         color: theme.text      },
            { label: 'MISSIONS', value: completed.length, color: 'text-white'    },
            { label: 'DUO',      value: duoMissions,      color: 'text-pink-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 rounded-[8px] p-3 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[9px] opacity-40 uppercase font-black">{s.label}</p>
            </div>
          ))}
        </div>
        {Object.keys(catBreakdown).length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-black opacity-40 uppercase">CATEGORY BREAKDOWN</p>
            {Object.entries(catBreakdown).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-2">
                <span className="text-xs uppercase font-black flex-1">{cat}</span>
                <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white/40 rounded-full" style={{ width: `${(count / completed.length) * 100}%` }} />
                </div>
                <span className="text-xs font-mono w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// --- COMMENT DRAWER ---
const CommentDrawer = ({
  quest, user, onClose, onUpdate,
}: { quest: Quest; user: User | null; onClose: () => void; onUpdate: () => void }) => {
  const [text, setText] = useState('');
  const comments: Comment[] = quest.comments || [];

  const postComment = async () => {
    if (!text.trim() || !user) return;
    const newComment: Comment = {
      id: crypto.randomUUID(),
      author: (user.user_metadata?.full_name || user.email || 'AGENT').toUpperCase(),
      avatar: user.user_metadata?.avatar_url || '',
      text: text.trim().toUpperCase(),
      created_at: new Date().toISOString(),
    };
    await supabase.from('quests').update({ comments: [...comments, newComment] }).eq('id', quest.id);
    setText('');
    onUpdate();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-end justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        className="bg-[#0d0d0d] border border-white/10 rounded-t-[16px] w-full max-w-lg p-6 space-y-4 max-h-[70vh] flex flex-col"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40">MISSION INTEL</h3>
          <button onClick={onClose} className="opacity-40 hover:opacity-100 font-black">X</button>
        </div>
        <p className="text-lg font-black italic uppercase truncate">{quest.goal}</p>
        <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
          {comments.length === 0 && (
            <p className="text-xs opacity-30 uppercase font-black text-center py-4">NO INTEL YET</p>
          )}
          {comments.map(c => (
            <div key={c.id} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-white/10 text-[10px] flex items-center justify-center font-black shrink-0">
                {c.author[0]}
              </div>
              <div>
                <span className="text-[10px] font-black opacity-40 uppercase">{c.author}</span>
                <p className="text-sm font-black uppercase">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 bg-white/5 border border-white/10 rounded-[8px] px-4 py-3 text-sm font-black uppercase outline-none focus:border-white/30"
            placeholder="ADD INTEL..." value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && postComment()}
          />
          <button onClick={postComment} className="bg-white text-black font-black px-4 rounded-[8px] text-xs uppercase">
            SEND
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- QUEST CARD ---
const QuestCard = ({
  q, theme,currentUserName, onSecure, onTerminate, onReact, onComment, onExpire, onConfirmDuo,
}: {
  q: Quest; theme: Theme; user: User | null; currentUserName: string;
  onSecure: (id: string, isDuo: boolean, partner: string) => void;
  onTerminate: (id: string) => void;
  onReact: (id: string, label: string) => void;
  onComment: (q: Quest) => void;
  onExpire: (id: string) => void;
  onConfirmDuo: (id: string) => void;
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [duoPartner, setDuoPartner] = useState('');
  const [showDuoInput, setShowDuoInput] = useState(false);

  const diff = DIFFICULTY_CONFIG[q.difficulty || 'EASY'];
  const cat = q.category ? CATEGORY_CONFIG[q.category] : null;
  const reactions: Record<string, string[]> = q.reactions || {};
  const comments: Comment[] = q.comments || [];
  const isExpired = q.expires_at && new Date(q.expires_at) < new Date();
  const isDuoPending = q.is_claimed && q.duo_partner && !q.partner_confirmed;
  const isMyDuoConfirm = isDuoPending && q.duo_partner?.toUpperCase() === currentUserName;

  return (
    <motion.div layout key={q.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -20 }}
      className={`relative rounded-[8px] border transition-all overflow-hidden
        ${q.is_claimed ? 'bg-black/10 border-white/5 opacity-60' : isExpired ? 'bg-red-900/10 border-red-500/20' : 'bg-black/40 border-white/10'}`}>

      {/* Top bar */}
      <div className="flex items-center gap-2 px-6 pt-5 pb-2 flex-wrap">
        <div className={`w-2 h-2 rounded-full ${q.is_claimed ? 'bg-white/20' : isExpired ? 'bg-red-500' : 'bg-red-600 animate-pulse'}`} />
        <span className="text-[10px] font-black uppercase opacity-40">
          {q.is_claimed ? 'SECURED' : isExpired ? 'EXPIRED' : 'LIVE'}
        </span>
        {!q.is_claimed && !isExpired && <MissionTimer startTime={q.created_at} />}
        {q.expires_at && !q.is_claimed && !isExpired && (
          <CountdownTimer expiresAt={q.expires_at} onExpire={() => onExpire(q.id)} />
        )}
        {cat && <span className={`text-[10px] font-black ${cat.color}`}>{cat.label}</span>}
        <span className={`text-[10px] font-black border rounded px-2 py-0.5 ${diff.color}`}>{diff.label}</span>
        <span className={`text-[10px] font-black ml-auto ${theme.text}`}>+{q.points || diff.points} PTS</span>
        {q.duo_partner && <span className="text-[10px] font-black text-pink-400">DUO</span>}
      </div>

      {/* Goal + penalty */}
      <div className="px-6 pb-4">
        <h4 className={`text-3xl sm:text-4xl font-[1000] uppercase italic tracking-tighter ${q.is_claimed ? 'line-through opacity-40' : theme.text}`}>
          {q.goal}
        </h4>
        <div className="flex gap-3 mt-3 flex-wrap items-center">
          <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-[4px] text-[10px] font-black uppercase border border-red-500/20">
            {q.penalty}
          </span>
          {q.is_claimed && (
            <span className="text-[10px] font-black uppercase opacity-60">
              DONE — {q.claimed_by}{q.duo_partner ? ` + ${q.duo_partner}` : ''}
            </span>
          )}
        </div>
      </div>

      {/* Reactions row */}
      <div className="px-6 pb-3 flex gap-2 flex-wrap items-center">
        {Object.entries(reactions).map(([label, users]) =>
          users.length > 0 && (
            <button key={label} onClick={() => onReact(q.id, label)}
              className="flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-0.5 text-[10px] font-black uppercase transition-all">
              {label} <span className="opacity-50 ml-1">{users.length}</span>
            </button>
          )
        )}
        <button onClick={() => setShowReactions(v => !v)}
          className="text-[10px] opacity-30 hover:opacity-80 font-black uppercase transition-all">
          + REACT
        </button>
        <button onClick={() => onComment(q)}
          className="text-[10px] opacity-30 hover:opacity-80 font-black uppercase ml-auto transition-all">
          INTEL ({comments.length})
        </button>
      </div>

      <AnimatePresence>
        {showReactions && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="px-6 pb-3 flex gap-2 flex-wrap">
            {REACTIONS.map(r => (
              <button key={r} onClick={() => { onReact(q.id, r); setShowReactions(false); }}
                className="text-[10px] font-black bg-white/5 hover:bg-white/15 border border-white/10 px-3 py-1.5 rounded uppercase tracking-wider transition-all">
                {r}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Duo confirmation banner */}
      {isMyDuoConfirm && (
        <div className="mx-6 mb-4 bg-pink-500/10 border border-pink-500/30 rounded-[6px] p-3 flex items-center justify-between gap-3">
          <p className="text-[11px] font-black uppercase text-pink-400">
            {q.claimed_by} INVITED YOU FOR DUO
          </p>
          <button onClick={() => onConfirmDuo(q.id)}
            className="bg-pink-500 text-black font-black px-4 py-1.5 rounded text-[10px] uppercase">
            CONFIRM
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="px-6 pb-5 flex gap-3 flex-wrap items-center">
        {!q.is_claimed && !isExpired && (
          <>
            <button onClick={() => onSecure(q.id, false, '')}
              className={`${theme.btn} px-8 py-4 rounded-[8px] text-black font-black text-xs uppercase tracking-widest`}>
              SECURE SOLO
            </button>
            {!showDuoInput
              ? <button onClick={() => setShowDuoInput(true)}
                  className="bg-pink-600/20 hover:bg-pink-600/40 border border-pink-500/30 text-pink-400 px-8 py-4 rounded-[8px] font-black text-xs uppercase tracking-widest transition-all">
                  DUO
                </button>
              : <div className="flex gap-2 items-center">
                  <input
                    value={duoPartner}
                    onChange={e => setDuoPartner(e.target.value.toUpperCase())}
                    className="bg-white/5 border border-pink-500/40 rounded px-3 py-2 text-xs font-black uppercase outline-none w-36"
                    placeholder="PARTNER NAME..."
                  />
                  <button
                    onClick={() => { if (duoPartner) { onSecure(q.id, true, duoPartner); setShowDuoInput(false); } }}
                    className="bg-pink-600 text-white font-black px-4 py-2 rounded text-xs uppercase">
                    GO
                  </button>
                </div>
            }
          </>
        )}
        <button onClick={() => onTerminate(q.id)}
          className="bg-white/5 px-5 py-4 rounded-[8px] hover:bg-red-600 transition-all uppercase font-black text-xs ml-auto">
          X
        </button>
      </div>
    </motion.div>
  );
};

// --- MAIN GAME ---
const VaultGame = () => {
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<'auth' | 'room' | 'game'>('auth');
  const [roomKey, setRoomKey] = useState('');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [goal, setGoal] = useState('');
  const [penalty, setPenalty] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('EASY');
  const [category, setCategory] = useState<Category>('FITNESS');
  const [timed, setTimed] = useState(false);
  const [timedMins, setTimedMins] = useState(5);
  const [theme, setTheme] = useState<Theme>(THEMES.red);
  const [notification, setNotification] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<Category | 'ALL'>('ALL');
  const [filterDiff, setFilterDiff] = useState<Difficulty | 'ALL'>('ALL');
  const [commentTarget, setCommentTarget] = useState<Quest | null>(null);
  const [profileTarget, setProfileTarget] = useState<string | null>(null);
 // const [bonusPoints, setBonusPoints] = useState(0);
  const [tab, setTab] = useState<'active' | 'archive'>('active');

  const currentUserName = (user?.user_metadata?.full_name || user?.email || 'AGENT').toUpperCase();

  const showNotification = (msg: string) => {
    setNotification(msg.toUpperCase());
    setTimeout(() => setNotification(null), 3000);
  };

  const logToDiscord = async (action: string, details: string) => {
    const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return;
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: `VAULT LOG: ${action}`,
          color: parseInt(theme.hex.replace('#', ''), 16),
          fields: [
            { name: 'AGENT', value: currentUserName, inline: true },
            { name: 'DETAILS', value: details, inline: false },
          ],
          footer: { text: 'VAULT PROTOCOL ACTIVE' },
        }],
      }),
    }).catch(() => {});
  };

  useEffect(() => {
    const saved = localStorage.getItem('vault_theme');
    if (saved && THEMES[saved]) setTheme(THEMES[saved]);
  }, []);

  const changeTheme = (t: Theme) => { setTheme(t); localStorage.setItem('vault_theme', t.id); };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setUser(session.user); setStep('room'); }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN' && session) { setStep('room'); }
      if (event === 'SIGNED_OUT') { setStep('auth'); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    logToDiscord('DISCONNECT', 'Agent initiated logout.');
    await supabase.auth.signOut();
    setStep('auth');
  };

  const syncData = useCallback(async () => {
    if (!roomKey) return;
    const { data } = await supabase
      .from('quests')
      .select('*')
      .eq('room_code', roomKey)
      .order('created_at', { ascending: false });
    if (data) setQuests(data as Quest[]);
  }, [roomKey]);

  useEffect(() => {
    if (step === 'game' && roomKey) {
      syncData();
      const ch = supabase
        .channel(`room-${roomKey}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'quests', filter: `room_code=eq.${roomKey}` }, () => syncData())
        .subscribe();
      return () => { supabase.removeChannel(ch); };
    }
  }, [step, roomKey, syncData]);

  const deployBounty = async () => {
    if (!goal || !penalty) return;
    const pts = DIFFICULTY_CONFIG[difficulty].points;
    const expiresAt = timed ? new Date(Date.now() + timedMins * 60000).toISOString() : null;
    const { error } = await supabase.from('quests').insert([{
      goal: goal.toUpperCase(), penalty: penalty.toUpperCase(),
      room_code: roomKey, is_claimed: false,
      difficulty, category, points: pts,
      expires_at: expiresAt,
      reactions: {}, comments: [], is_archived: false,
    }]);
    if (!error) {
      setGoal(''); setPenalty('');
      showNotification('NEW MISSION DEPLOYED');
      logToDiscord('MISSION DEPLOYED', `${goal} [${difficulty} / ${category}]${timed ? ` — ${timedMins}MIN LIMIT` : ''}`);
    }
  };

  const secureBounty = async (id: string, isDuo: boolean, partner: string) => {
    const q = quests.find(q => q.id === id);
    if (!q || q.is_claimed) return;
    const update: Partial<Quest> = {
      is_claimed: true,
      claimed_by: currentUserName,
      claimant_avatar: user?.user_metadata?.avatar_url || '',
    };
    if (isDuo) { update.duo_partner = partner.toUpperCase(); update.partner_confirmed = false; }
    else { update.partner_confirmed = true; }
    const { error } = await supabase.from('quests').update(update).eq('id', id).eq('is_claimed', false);
    if (!error) {
      showNotification(isDuo ? `DUO REQUEST SENT TO ${partner}` : 'MISSION SECURED');
      logToDiscord('MISSION SECURED', isDuo ? `${currentUserName} + ${partner} (DUO PENDING)` : currentUserName);
      syncData();
    }
  };

  const confirmDuo = async (id: string) => {
    await supabase.from('quests').update({ partner_confirmed: true }).eq('id', id);
    showNotification('DUO CONFIRMED');
    syncData();
  };

  const terminateBounty = async (id: string) => {
    await supabase.from('quests').delete().eq('id', id);
    showNotification('MISSION TERMINATED');
    syncData();
  };

  const reactToQuest = async (id: string, label: string) => {
    const q = quests.find(q => q.id === id);
    if (!q) return;
    const reactions = { ...(q.reactions || {}) };
    if (!reactions[label]) reactions[label] = [];
    const idx = reactions[label].indexOf(currentUserName);
    if (idx >= 0) reactions[label].splice(idx, 1);
    else reactions[label].push(currentUserName);
    await supabase.from('quests').update({ reactions }).eq('id', id);
    syncData();
  };

  const expireQuest = async (id: string) => {
    await supabase.from('quests').update({ is_archived: true }).eq('id', id);
    syncData();
  };

  const scores = useMemo(() => {
    const base = quests
      .filter(q => q.is_claimed && q.partner_confirmed)
      .reduce((acc: Record<string, number>, q) => {
        const pts = q.points || DIFFICULTY_CONFIG[(q.difficulty || 'EASY')].points;
        const add = (name: string) => { acc[name] = (acc[name] || 0) + pts; };
        if (q.claimed_by) add(q.claimed_by);
        if (q.duo_partner && q.partner_confirmed) add(q.duo_partner);
        return acc;
      }, {});
    //if (bonusPoints > 0) base[currentUserName] = (base[currentUserName] || 0) + bonusPoints;
    return base;
  }, [quests, currentUserName]); // [quests, bonusPoints, currentUserName]);

  const activeQuests = quests.filter(q =>
    !q.is_archived &&
    (filterCat === 'ALL' || q.category === filterCat) &&
    (filterDiff === 'ALL' || q.difficulty === filterDiff)
  );
  const archivedQuests = quests.filter(q =>
    q.is_archived || (q.expires_at && new Date(q.expires_at) < new Date())
  );

  return (
    <div className={`min-h-screen ${theme.bg} text-slate-200 p-4 transition-colors duration-1000 flex flex-col items-center relative overflow-x-hidden`}>
      <GlobalDecorations theme={theme} />

      {/* Notification toast */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-10 z-[100] bg-white text-black px-6 py-3 rounded-[8px] font-black text-xs tracking-[0.3em] shadow-[0_0_50px_rgba(255,255,255,0.2)]">
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment drawer */}
      <AnimatePresence>
        {commentTarget && (
          <CommentDrawer
            quest={commentTarget} user={user}
            onClose={() => setCommentTarget(null)}
            onUpdate={() => { syncData(); setCommentTarget(null); }}
          />
        )}
      </AnimatePresence>

      {/* Profile modal */}
      <AnimatePresence>
        {profileTarget && (
          <PlayerProfileModal name={profileTarget} quests={quests} onClose={() => setProfileTarget(null)} theme={theme} />
        )}
      </AnimatePresence>

      {/* Theme switcher */}
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="fixed top-6 z-50 flex gap-3 bg-black/60 p-2 rounded-full border border-white/10 backdrop-blur-xl shadow-2xl">
        {Object.values(THEMES).map(t => (
          <button key={t.id} onClick={() => changeTheme(t)}
            className={`w-7 h-7 rounded-full transition-all border-2 ${theme.id === t.id ? 'border-white scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`}
            style={{ backgroundColor: t.hex }}
          />
        ))}
      </motion.div>

      <AnimatePresence mode="wait">

        {/* AUTH */}
        {step === 'auth' && (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
            className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] w-full px-4">
            <motion.h1
              initial={{ letterSpacing: '-0.05em', filter: 'blur(10px)' }}
              animate={{ letterSpacing: '-0.02em', filter: 'blur(0px)' }}
              className="text-[100px] sm:text-[160px] font-[1000] italic leading-[0.8] text-center tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-transparent">
              TUTU<br /><span className={theme.text}>GAME</span>
            </motion.h1>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="flex flex-col items-center mt-12 space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">WELCOME TO TUTU GAME BY RED1 DEV</p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${theme.hex}66` }}
                whileTap={{ scale: 0.95 }}
                onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
                className="flex items-center gap-4 bg-white text-black px-16 py-7 rounded-full font-[900] text-xl uppercase tracking-widest">
                <span>LOGIN</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ROOM SELECT */}
        {step === 'room' && (
          <motion.div key="room" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] w-full p-6">
            <div className="w-full max-w-4xl flex flex-col items-center space-y-12">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-4 border-t-2 border-b-2 border-white/10 rounded-full" />
                  <img src={user?.user_metadata?.avatar_url}
                    className={`w-36 h-36 rounded-full mx-auto border-2 ${theme.border} relative z-10 object-cover`} alt="" />
                </div>
                <div>
                  <h2 className="text-xs font-black uppercase tracking-[0.1em] text-white/40 mb-2">SYSTEM IDENTITY VALIDATED</h2>
                  <h1 className="text-4xl sm:text-7xl font-black italic uppercase tracking-tighter">
                    WELCOME, <span className={theme.text}>{user?.user_metadata?.full_name?.split(' ')[0] || 'AGENT'}</span>
                  </h1>
                </div>
              </motion.div>
              <div className="w-full max-w-lg space-y-6">
                <input
                  type="text"
                  className="w-full bg-transparent border-b-2 border-white/10 p-8 text-center text-8xl font-black outline-none focus:border-white/40 tracking-[0.3em]"
                  placeholder="0000" value={roomKey}
                  onChange={e => setRoomKey(e.target.value.toUpperCase())}
                />
                <div className="flex flex-col items-center space-y-8">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => roomKey && setStep('game')}
                    className={`px-20 py-6 rounded-full ${theme.btn} text-black font-black text-2xl uppercase shadow-2xl`}>
                    ENTER
                  </motion.button>
                  <button onClick={handleLogout}
                    className="text-[11px] font-black uppercase opacity-20 hover:opacity-100 hover:text-red-500 transition-all">
                    DISCONNECT
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* GAME */}
        {step === 'game' && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="relative z-10 max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-12 gap-8 pt-24 pb-12 px-4">

            {/* LEFT SIDEBAR */}
            <div className="lg:col-span-4 space-y-5">

              {/* User card */}
              <div className="bg-black/40 backdrop-blur-2xl border border-white/10 p-5 rounded-[8px] flex items-center gap-4">
                <img src={user?.user_metadata?.avatar_url} className={`w-14 h-14 rounded-[8px] border-2 ${theme.border}`} alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black opacity-40 uppercase">OPERATOR</p>
                  <h2 className="text-xl font-black uppercase italic truncate">{user?.user_metadata?.full_name?.split(' ')[0]}</h2>
                  <p className={`text-[10px] font-black ${getRank(scores[currentUserName] || 0).color}`}>
                    {getRank(scores[currentUserName] || 0).rank} — {scores[currentUserName] || 0} PTS
                  </p>
                </div>
                <button onClick={() => setProfileTarget(currentUserName)}
                  className="text-[10px] opacity-40 hover:opacity-100 font-black uppercase transition-all">
                  VIEW
                </button>
              </div>

              {/* Daily challenge */}
              {/* <DailyChallengePanel
                theme={theme} roomKey={roomKey} user={user}
                onClaim={(pts) => { setBonusPoints(b => b + pts); showNotification(`+${pts} PTS — DAILY BONUS`); }}
              /> */}

              {/* Leaderboard */}
              <div className="bg-black/20 border border-white/5 p-6 rounded-[8px] space-y-4">
                <h3 className="text-xs font-black opacity-40 tracking-[0.1em] uppercase border-b border-white/10 pb-3">LEADERBOARD</h3>
                <div className="space-y-3">
                  {Object.entries(scores).sort(([, a], [, b]) => b - a).map(([name, val], i) => {
                    const rank = getRank(val);
                    return (
                      <button key={name} onClick={() => setProfileTarget(name)}
                        className="flex justify-between items-center w-full group hover:opacity-80 transition-all">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] opacity-30 font-mono w-4">#{i + 1}</span>
                          <span className="text-sm uppercase font-black group-hover:underline">{name}</span>
                          <span className={`text-[9px] font-black ${rank.color}`}>{rank.rank}</span>
                        </div>
                        <span className={`font-mono ${theme.text} font-black text-lg`}>{val}</span>
                      </button>
                    );
                  })}
                  {Object.keys(scores).length === 0 && (
                    <p className="text-[10px] opacity-30 uppercase">NO SCORES YET</p>
                  )}
                </div>
              </div>

              {/* Deploy form */}
              <div className="bg-black/40 border border-white/10 p-6 rounded-[8px] space-y-4">
                <h3 className="text-xs font-black opacity-40 uppercase">DEPLOY MISSION</h3>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-[8px] p-4 text-sm font-black uppercase outline-none focus:border-white/40"
                  placeholder="OBJECTIVE..." value={goal}
                  onChange={e => setGoal(e.target.value)}
                />
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-[8px] p-4 text-sm font-black uppercase text-red-400 outline-none focus:border-red-500"
                  placeholder="PENALTY..." value={penalty}
                  onChange={e => setPenalty(e.target.value)}
                />

                {/* Difficulty */}
                <div>
                  <p className="text-[10px] font-black opacity-30 uppercase mb-2">DIFFICULTY</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map(d => (
                      <button key={d} onClick={() => setDifficulty(d)}
                        className={`py-2 px-3 rounded text-[10px] font-black uppercase border transition-all
                          ${difficulty === d ? DIFFICULTY_CONFIG[d].color : 'border-white/10 opacity-30 hover:opacity-60'}`}>
                        {d} (+{DIFFICULTY_CONFIG[d].points})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <p className="text-[10px] font-black opacity-30 uppercase mb-2">CATEGORY</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(Object.keys(CATEGORY_CONFIG) as Category[]).map(c => (
                      <button key={c} onClick={() => setCategory(c)}
                        className={`py-2 rounded text-[10px] font-black uppercase transition-all border
                          ${category === c ? `${CATEGORY_CONFIG[c].color} border-current bg-current/10` : 'border-white/10 opacity-30 hover:opacity-60'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time limit */}
                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={() => setTimed(v => !v)}
                    className={`flex items-center gap-2 text-[10px] font-black uppercase transition-all ${timed ? 'text-amber-400' : 'opacity-30 hover:opacity-60'}`}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${timed ? 'border-amber-400 bg-amber-400/20' : 'border-white/20'}`}>
                      {timed && <div className="w-2 h-2 rounded-sm bg-amber-400" />}
                    </div>
                    TIME LIMIT
                  </button>
                  {timed && (
                    <div className="flex items-center gap-2">
                      {[2, 5, 10, 15, 30,60,90,120,240].map(m => (
                        <button key={m} onClick={() => setTimedMins(m)}
                          className={`text-[10px] font-black px-2 py-1 rounded transition-all ${timedMins === m ? 'bg-amber-400 text-black' : 'opacity-40 hover:opacity-80'}`}>
                          {m}M
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={deployBounty}
                  className={`w-full ${theme.btn} py-4 rounded-[8px] text-black font-black uppercase text-sm tracking-widest`}>
                  DEPLOY
                </button>
              </div>

              <button onClick={() => setStep('room')}
                className="w-full text-[10px] font-black uppercase opacity-20 hover:opacity-60 transition-all py-2">
                CHANGE ROOM
              </button>
            </div>

            {/* RIGHT: MISSIONS */}
            <div className="lg:col-span-8 space-y-4">

              {/* Tabs */}
              <div className="flex gap-2">
                {(['active', 'archive'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-5 py-2 rounded-[6px] text-[10px] font-black uppercase transition-all ${tab === t ? 'bg-white text-black' : 'opacity-30 hover:opacity-60'}`}>
                    {t === 'active'
                      ? `ACTIVE (${activeQuests.filter(q => !q.is_claimed).length})`
                      : `ARCHIVE (${archivedQuests.length})`}
                  </button>
                ))}
              </div>

              {/* Filters */}
              {tab === 'active' && (
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => setFilterCat('ALL')}
                    className={`text-[10px] px-3 py-1.5 rounded font-black uppercase border transition-all
                      ${filterCat === 'ALL' ? 'bg-white text-black border-white' : 'border-white/10 opacity-40 hover:opacity-70'}`}>
                    ALL
                  </button>
                  {(Object.keys(CATEGORY_CONFIG) as Category[]).map(c => (
                    <button key={c} onClick={() => setFilterCat(c)}
                      className={`text-[10px] px-3 py-1.5 rounded font-black uppercase border transition-all
                        ${filterCat === c ? `${CATEGORY_CONFIG[c].color} border-current` : 'border-white/10 opacity-40 hover:opacity-70'}`}>
                      {c}
                    </button>
                  ))}
                  <div className="w-px bg-white/10 mx-1" />
                  <button onClick={() => setFilterDiff('ALL')}
                    className={`text-[10px] px-3 py-1.5 rounded font-black uppercase border transition-all
                      ${filterDiff === 'ALL' ? 'bg-white text-black border-white' : 'border-white/10 opacity-40 hover:opacity-70'}`}>
                    ALL DIFF
                  </button>
                  {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map(d => (
                    <button key={d} onClick={() => setFilterDiff(d)}
                      className={`text-[10px] px-3 py-1.5 rounded font-black uppercase border transition-all
                        ${filterDiff === d ? DIFFICULTY_CONFIG[d].color + ' border-current' : 'border-white/10 opacity-40 hover:opacity-70'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {tab === 'active' && activeQuests.map(q => (
                  <QuestCard
                    key={q.id} q={q} theme={theme} user={user} currentUserName={currentUserName}
                    onSecure={secureBounty} onTerminate={terminateBounty} onReact={reactToQuest}
                    onComment={setCommentTarget} onExpire={expireQuest} onConfirmDuo={confirmDuo}
                  />
                ))}

                {tab === 'active' && activeQuests.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 opacity-20">
                    <p className="text-6xl font-black italic uppercase">NO MISSIONS</p>
                    <p className="text-xs font-black uppercase mt-2 tracking-widest">DEPLOY YOUR FIRST GOAL</p>
                  </motion.div>
                )}

                {tab === 'archive' && archivedQuests.map(q => (
                  <motion.div key={q.id} layout initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
                    className="bg-black/20 border border-white/5 rounded-[8px] p-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black opacity-40 uppercase">{q.category} — {q.difficulty}</p>
                      <h4 className="text-2xl font-black italic uppercase line-through opacity-60">{q.goal}</h4>
                      {q.is_claimed
                        ? <p className="text-[10px] font-black uppercase opacity-40 mt-1">DONE — {q.claimed_by}</p>
                        : <p className="text-[10px] font-black uppercase text-red-400/60 mt-1">EXPIRED UNCLAIMED</p>
                      }
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-2xl font-black ${theme.text}`}>
                        +{q.points || DIFFICULTY_CONFIG[q.difficulty || 'EASY'].points}
                      </p>
                      <p className="text-[10px] opacity-30 font-black uppercase">PTS</p>
                    </div>
                  </motion.div>
                ))}

                {tab === 'archive' && archivedQuests.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 opacity-20">
                    <p className="text-4xl font-black italic uppercase">ARCHIVE EMPTY</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VaultGame;
