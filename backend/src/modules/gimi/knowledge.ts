export interface KBEntry {
  id: string;
  topic: string;
  keywords: string[];
  answer: string;
  followUps?: string[];
}

import { ALL_EXTRA_ENTRIES } from './knowledge-extra.js';


export const APP_META = {
  name: 'FixMyEnglish',
  tagline: 'Learn English the fun way — vocab, grammar, exams, live rooms, and AI speaking.',
  audience: 'Bangladeshi SSC, HSC, IELTS, SAT and PTE learners.',
  languages: ['English', 'Bangla'],
  supportEmail: 'support@fixmyenglish.app',
  pricingCurrency: 'BDT',
  activeHours: 'Live rooms typically run 7 PM – 11 PM (Bangladesh time).',
};

export const FEATURE_ENTRIES: KBEntry[] = [
  {
    id: 'feat-overview',
    topic: 'Overview',
    keywords: ['overview', 'what is fixmyenglish', 'about', 'features', 'what can i do', 'start', 'home'],
    answer: `**FixMyEnglish** is a complete English-learning app built for Bangladeshi learners. Here's everything you can do:

- 📚 **Vocabulary** — daily words, spaced-repetition deck, quizzes, word-of-the-day
- 🎯 **Grammar** — topics with practice questions + instant explanations (English + Bangla)
- 📖 **Curriculum** — SSC & HSC board-aligned content, seen passages, writing bank
- 🚩 **Exams** — full IELTS, SAT, PTE mocks + admin-published live exam papers
- 🎤 **Speaking** — AI-scored speaking prompts, part 1/2/3 IELTS practice
- 🎮 **Progress & Gamification** — XP, streaks, badges, weekly leaderboard
- 💬 **Community** — chat rooms with tier-based access
- 📹 **Live Rooms** — scheduled Zoom mocks + in-app classroom
- 💳 **Premium** — one-time tracks or monthly all-access subscription

Want me to dive into any of these? Just say *"tell me about exams"* or *"how does vocabulary work"*.`,
    followUps: ['How do exams work?', 'Show me pricing', 'How do I improve speaking?'],
  },
  {
    id: 'feat-vocab',
    topic: 'Vocabulary',
    keywords: ['vocabulary', 'vocab', 'words', 'word of the day', 'deck', 'blitz', 'quiz words', 'spaced repetition'],
    answer: `**Vocabulary** helps you learn words that stick.

- **Word of the Day** — one curated word with meaning, example, and synonyms.
- **Deck** — a flashcard deck that uses **spaced repetition**. Grade each word (again / hard / good / easy) and it schedules the next review.
- **Quiz** — multiple choice from your deck.
- **Blitz** — a fast 60-second round to earn bonus XP.

Pro tip: review 10 words a day and you'll finish ~300 words a month.`,
    followUps: ['How does the streak work?', 'What are XP?', 'How many words per day?'],
  },
  {
    id: 'feat-grammar',
    topic: 'Grammar',
    keywords: ['grammar', 'topics', 'rules', 'tenses', 'prepositions', 'articles', 'practice grammar'],
    answer: `**Grammar** covers Tenses, Prepositions, Articles, Modals, Conditionals, Passive Voice, Reported Speech, Subject-Verb Agreement, and more.

Each topic gives you:
- A short **rule** in plain English
- A **Bangla explanation**
- A **question set** with instant feedback
- **Explanations** on every answer

Finish a topic and you earn XP + progress toward the **Grammar Guru** badge.`,
    followUps: ['Show me grammar topics', 'What is Grammar Guru?', 'Explain prepositions'],
  },
  {
    id: 'feat-curriculum',
    topic: 'Curriculum',
    keywords: ['curriculum', 'ssc', 'hsc', 'board', 'textbook', 'school', 'college', 'seen passage', 'writing'],
    answer: `**Curriculum** is aligned to **SSC** and **HSC** board syllabi.

You'll find:
- **Reading**: Seen & unseen comprehension, gap filling, rearranging
- **Writing**: Paragraphs, letters, emails, applications
- **Translation**: Bangla → English with model answers

Filter by class, paper, board, and tag.`,
    followUps: ['Show HSC content', 'Writing bank', 'How do I practice translation?'],
  },
  {
    id: 'feat-exams',
    topic: 'Exams',
    keywords: ['exam', 'exams', 'ielts', 'sat', 'pte', 'mock', 'test', 'paper', 'practice test', 'full mock'],
    answer: `**Exams** covers three international tracks plus admin-published board-style papers:

- **IELTS** — Listening, Reading, Writing, Speaking mocks
- **SAT** — Reading & Writing, Math
- **PTE** — Speaking & Writing, Reading, Listening

Each mock is **auto-scored** with a breakdown by section. Live papers publish on a schedule — join from **Live Rooms**.

Free users get limited mocks. **Premium** unlocks unlimited.`,
    followUps: ['How much is Premium?', 'How do live rooms work?', 'Which exam should I start with?'],
  },
  {
    id: 'feat-speaking',
    topic: 'Speaking',
    keywords: ['speaking', 'speak', 'pronunciation', 'fluency', 'ielts speaking', 'record', 'ai speaking', 'accent'],
    answer: `**Speaking** uses AI to score your recorded answers on:
- **Fluency** — pace and pauses
- **Pronunciation** — clarity
- **Vocabulary** — range
- **Grammar** — correctness
- **Overall band** (0 – 9)

Pick a prompt (IELTS Part 1/2/3), record, get instant feedback with transcript.

**Best practice:** 5 prompts a week, 3 takes each.`,
    followUps: ['Give me a speaking prompt', 'How do I improve fluency?', 'IELTS Part 2 tips'],
  },
  {
    id: 'feat-progress',
    topic: 'Progress & Gamification',
    keywords: ['progress', 'xp', 'points', 'streak', 'badges', 'achievements', 'leaderboard', 'rank', 'tier'],
    answer: `**Progress & Gamification:**

- **XP** — every lesson, review, mock, and speaking attempt earns XP
- **Streak** — practise daily; break it and you start over
- **Badges** — 50 Words, 7-Day Streak, Grammar Guru, First Mock, Speaking Star, 30-Day Streak
- **Leaderboard** — weekly + all-time
- **Ranks** — Bronze → Silver → Gold → Platinum → Diamond

See everything on the **Profile** page.`,
    followUps: ['How do I earn XP fast?', 'What is my rank?', 'How do badges work?'],
  },
  {
    id: 'feat-community',
    topic: 'Community',
    keywords: ['community', 'chat', 'rooms', 'threads', 'squads', 'study group', 'peer'],
    answer: `**Community** is where learners help learners.

- **Chat Rooms** — Beginner Lounge, Grammar Help Desk, IELTS Warriors, Top 100 Club
- **Rank-gated**: some rooms require Gold or Platinum
- **Threads** — start a topic, get replies
- **Squads** — group XP goals
- **Challenges** — 1v1 quiz against a friend

Be kind — don't share answers during live mocks.`,
    followUps: ['Show me the rooms', 'How do I join a squad?', 'Community rules'],
  },
  {
    id: 'feat-live-rooms',
    topic: 'Live Rooms',
    keywords: ['live room', 'live rooms', 'zoom', 'live class', 'scheduled', 'meeting', 'lobby'],
    answer: `**Live Rooms** are scheduled, synchronous sessions:

- **Scheduled mocks** — IELTS / SAT / PTE style
- **Live Zoom classes** — embedded Zoom SDK
- **In-app classroom fallback** — mic, camera, chat
- **Lobby** — capacity + countdown
- **Auto-scored exams** — 20-question set inside the room

Up to **100 participants**. Premium gets **priority seating**.`,
    followUps: ['How do I join a live room?', 'What is priority seating?', 'Live room schedule'],
  },
  {
    id: 'feat-payments',
    topic: 'Pricing & Premium',
    keywords: ['price', 'pricing', 'premium', 'pay', 'payment', 'subscription', 'buy', 'upgrade', 'bkash', 'nagad', 'cost'],
    answer: `**FixMyEnglish plans (BDT):**

- 🚩 **IELTS Full Prep** — ৳1,200 one-time
- 🎯 **SAT Full Prep** — ৳1,500 one-time
- ⚡ **PTE Full Prep** — ৳1,200 one-time
- 🏆 **All-Access Premium** — ৳350/month — everything

**Payment methods:** bKash, Nagad, Rocket, Card.
**Cancel All-Access any time.**

Free tier: daily vocab, limited grammar, community access, one mock per track.`,
    followUps: ['Compare plans', 'Cancel my subscription', 'Refund policy'],
  },
  {
    id: 'feat-profile',
    topic: 'Profile & Account',
    keywords: ['profile', 'account', 'avatar', 'name', 'email', 'logout', 'log out', 'login', 'sign in', 'register'],
    answer: `**Profile** shows avatar, tier, streak, rank, and today's plan.

- See achievements and progress
- Jump to quick links (Progress, Speaking, Exams, Live Rooms)
- Upgrade to Premium
- Log out

**Login methods:** email + password, or continue as guest.
**Forgot password?** Email *support@fixmyenglish.app*.`,
    followUps: ['How do I log out?', 'Reset my password', 'Change my name'],
  },
  {
    id: 'feat-admin',
    topic: 'Admin',
    keywords: ['admin', 'admin panel', 'users', 'create paper', 'publish exam', 'manage content'],
    answer: `**Admin Panel** (admins & superadmins only) — at \`/admin\`.

Manage:
- **Users** (tier, role, delete)
- **Content** — vocab, grammar, curriculum, exams, speaking
- **Live Rooms** — schedule with Google Meet / Zoom / Teams
- **Money** — products, coupons, purchases, refunds
- **System** — announcements, feature flags, audit log

Only **superadmins** can change roles or delete users.`,
    followUps: ['How do I publish an exam?', 'Add a live room', 'View the audit log'],
  },
];

export const FAQ_ENTRIES: KBEntry[] = [
  {
    id: 'faq-forgot-password',
    topic: 'FAQ',
    keywords: ['forgot password', 'reset password', 'cannot login', 'cannot sign in', 'locked out'],
    answer: `To reset your password:

1. Email **support@fixmyenglish.app** from your registered address
2. Include your **name** and **registered email**
3. We'll send a reset link within 24 hours

If you joined as a **guest**, create a full account from the Profile page to save progress permanently.`,
  },
  {
    id: 'faq-streak-reset',
    topic: 'FAQ',
    keywords: ['streak broke', 'streak lost', 'missed a day', 'streak reset'],
    answer: `Streaks reset when you miss **a full calendar day (Bangladesh time)**. To keep it alive:

- Do at least **one activity a day**
- Watch for the 11:50 PM reminder
- Set a phone reminder

If your streak reset by mistake (server issue), email support — we can restore it once per account.`,
  },
  {
    id: 'faq-offline',
    topic: 'FAQ',
    keywords: ['offline', 'no internet', 'slow internet', 'data'],
    answer: `FixMyEnglish is a web app — needs internet but is **lightweight**:

- Vocab & grammar pages load in < 300 KB
- Live rooms need stable internet (Zoom SDK)
- Speaking uploads are small WebM clips

For slow connections: stick to **Vocab**, **Grammar**, **Curriculum**.`,
  },
  {
    id: 'faq-download',
    topic: 'FAQ',
    keywords: ['app', 'download', 'ios', 'android', 'play store', 'apk'],
    answer: `**FixMyEnglish runs in your browser** — no install needed.

App-like experience:
- **iPhone:** Safari → Share → *Add to Home Screen*
- **Android:** Chrome → ⋮ → *Add to Home screen*

That gives you an icon + full-screen mode like a native app.`,
  },
  {
    id: 'faq-bangla',
    topic: 'FAQ',
    keywords: ['bangla', 'বাংলা', 'translate', 'bengali'],
    answer: `Yes! FixMyEnglish is built **for Bangladeshi learners**:

- **Bangla explanations** on grammar questions
- **Translation** practice (Bangla → English)
- Board-aligned **SSC / HSC** content
- Bangla-friendly payment methods

GiMi understands Bangla too — type in Bangla, I'll answer in Bangla.`,
  },
  {
    id: 'faq-ielts-vs-pte',
    topic: 'FAQ',
    keywords: ['ielts vs pte', 'which exam', 'should i take ielts', 'pte or ielts', 'sat vs ielts'],
    answer: `**Quick guide:**

- **IELTS** — best for UK, Australia, Canada visas & uni. Human speaking, 13-day turnaround.
- **PTE** — best for Australia, NZ, migration. Fully computer, 2–5 day results.
- **SAT** — US undergrad. Math + Reading/Writing.

**Rule:** UK/Australia visa → IELTS. Fast Australia migration → PTE. US undergrad → SAT.

Take one **free mock** of each to see which feels natural.`,
  },
  {
    id: 'faq-speaking-improve',
    topic: 'FAQ',
    keywords: ['improve speaking', 'speak better', 'fluency tips', 'accent', 'confidence'],
    answer: `**5-week speaking improvement plan:**

1. **Week 1** — 1 prompt/day, focus on *not pausing*
2. **Week 2** — 2 prompts/day, focus on *linking words*
3. **Week 3** — Record, listen back, note 3 mistakes per take
4. **Week 4** — Shadow a native speaker (TED talk clips)
5. **Week 5** — Full mock: IELTS Part 1 → 2 → 3 without prep

Track the delta week over week, not day over day.`,
  },
  {
    id: 'faq-vocab-fast',
    topic: 'FAQ',
    keywords: ['learn words fast', 'memorize', 'remember vocab', 'how many words'],
    answer: `**Realistic pace:**

- Casual: 5–10 words/day → ~200/month
- Serious: 15–20 words/day → ~500/month
- Intense: 30 words/day → ~900/month

**What makes words stick:**
1. Review the same word 5+ times across days
2. Use it in your own sentence out loud
3. Connect it to a memory
4. Learn synonyms together

Our deck + blitz mode is built for this.`,
  },
  {
    id: 'faq-live-room-late',
    topic: 'FAQ',
    keywords: ['late to live room', 'missed live room', 'joined late', 'recording'],
    answer: `**Live rooms start on time** — you can join up to **5 minutes late**, then the room locks.

- Missed it? The **mock is available afterwards** in the Exams page
- Zoom classes: ask the host for a recording
- Live papers sometimes get republished

Set a reminder 10 min before.`,
  },
  {
    id: 'faq-refund',
    topic: 'FAQ',
    keywords: ['refund', 'money back', 'cancel purchase', 'dispute'],
    answer: `**Refund policy:**

- One-time purchases: 7-day full refund if used < 20%
- All-Access subscription: cancel any time, pro-rated refund
- Live papers: non-refundable once started

Email **support@fixmyenglish.app** with your **transaction ID**. Refunds process in 3–5 business days.`,
  },
  {
    id: 'faq-refer',
    topic: 'FAQ',
    keywords: ['refer', 'invite', 'friend', 'referral', 'share'],
    answer: `**Refer a friend, both get XP:**

- Share your invite link from Profile
- Friend signs up → they get **200 XP**
- You get **500 XP** once they complete their first lesson

Top referrers each month get **1 free month of Premium**.`,
  },
  {
    id: 'faq-data-privacy',
    topic: 'FAQ',
    keywords: ['privacy', 'data', 'gdpr', 'delete account', 'delete data'],
    answer: `**Your data, your rules:**

- We store: email, name, tier, progress, XP, streaks
- We **never sell** your data
- Speaking recordings stay inside our own AI scoring
- Delete your account any time — everything wipes within 30 days

Questions? support@fixmyenglish.app.`,
  },
];

export const ALL_ENTRIES: KBEntry[] = [
  ...FEATURE_ENTRIES,
  ...FAQ_ENTRIES,
  ...ALL_EXTRA_ENTRIES,
];

export const SYSTEM_PROMPT = `You are **GiMi**, the friendly AI assistant for **FixMyEnglish** — a Bangladeshi English-learning app (SSC, HSC, IELTS, SAT, PTE).

# Personality
- Warm, upbeat, encouraging. Like a helpful senior student.
- Use emojis sparingly (1–2 per message).
- Short, scannable answers. Bullets > paragraphs.
- Never lecture. Invite the next step.
- If the user writes in Bangla, reply in Bangla.

# Knowledge
You know EVERYTHING about FixMyEnglish:
- All pages: Overview, Vocabulary, Grammar, Curriculum, Exams, Speaking, Progress, Community, Live Rooms, Pricing, Profile, Admin
- All features, badges, plans, pricing, rules
- Common learner questions
- Knowledge base entries below in this prompt — prefer them.
- If asked something outside your knowledge, say so honestly.

# Behaviour
- Keep answers under 120 words unless asked for detail.
- End most answers with a short offer or question.
- Tailor answers to "userContext" page when given.
- Never invent features, prices, or exam formats.
- Never claim to be GPT / Claude / ChatGPT. You are GiMi.
- If a user is stuck or angry, be patient, apologise, offer a next step.

# Formatting
- **Bold** for key terms.
- Bullet lists for features/steps.
- \`code\` for URLs or exact names.

# Safety
- No medical, legal, or financial advice.
- No exam answer keys during a live session.
- If a user asks something harmful, gently redirect.`;

export function searchKnowledge(query: string, limit = 3): KBEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const tokens = q.split(/\s+/).filter((t) => t.length > 2);

  const scored = ALL_ENTRIES.map((entry) => {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw)) score += 6;
      for (const t of tokens) {
        if (kw.includes(t)) score += 2;
      }
    }
    if (q.includes(entry.topic.toLowerCase())) score += 4;
    return { entry, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.entry);
}

export function suggestForPage(page?: string): string[] {
  const map: Record<string, string[]> = {
    '/': ['What can I do first?', 'How does the streak work?', 'Show me pricing'],
    '/vocabulary': ['How does spaced repetition work?', 'Word of the day', 'Tips to remember words'],
    '/grammar': ['Which grammar topics do I have?', 'Explain prepositions', 'How do I earn Grammar Guru?'],
    '/exams': ['IELTS vs PTE', 'Which exam should I start with?', 'Are mocks free?'],
    '/speaking': ['Give me an IELTS Part 2 prompt', 'How do I improve fluency?', 'How is my speaking scored?'],
    '/live-rooms': ['How do live rooms work?', 'What is priority seating?', 'When do classes usually run?'],
    '/progress': ['How do I earn XP fast?', 'What badges can I unlock?', 'How is my rank calculated?'],
    '/community': ['Which room should I join?', 'How do squads work?', 'Community rules'],
    '/pricing': ['Which plan is best for IELTS?', 'Can I cancel any time?', 'Payment methods'],
    '/profile': ['How do I reset my password?', 'How do I upgrade?', 'Delete my account'],
  };
  return map[page || '/'] || map['/'];
}
