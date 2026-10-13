import type { KBEntry } from './knowledge.js';

export const EXAM_STRATEGY_ENTRIES: KBEntry[] = [
  {
    id: 'strategy-ielts-band',
    topic: 'IELTS band scores',
    keywords: ['ielts band', 'band score', 'band 7', 'band 8', 'ielts score', 'how is ielts scored'],
    answer: `**IELTS bands** go 0–9 in 0.5 steps:

- **6.0** — competent (most unis accept with extra English)
- **6.5** — good (common undergrad requirement)
- **7.0** — very good (most Master's programs)
- **8.0+** — excellent (competitive programs, some visas)

**Your overall band = average of the 4 sections**, rounded to the nearest 0.5.

**Tips to jump a band:**
- **Writing:** learn ~10 task-2 structures inside out. Band 7 needs clear paragraphs + linking words + specific examples.
- **Speaking:** extend answers to 3+ sentences. Band 7 wants range, not perfection.
- **Listening:** practise *numbers + names* — the most common trap.
- **Reading:** skim (2 min) → scan per question. Don't read every word.`,
    followUps: ['IELTS Writing tips', 'IELTS Speaking Part 2', 'How long to prepare?'],
  },
  {
    id: 'strategy-pte-vs-ielts',
    topic: 'PTE vs IELTS',
    keywords: ['pte vs ielts', 'ielts vs pte', 'pte or ielts', 'which is easier', 'pte easier'],
    answer: `**Neither is "easier" for everyone** — pick the one your target university or visa accepts, then the format that suits you.

| | PTE | IELTS |
|---|---|---|
| Speaking | To a computer | To a human examiner |
| Results | Usually within days | Days to ~2 weeks, by format |
| Validity | 2 years | 2 years |

**PTE suits you if:** you're shy with face-to-face exams, like computer-based tests and want quick results.
**IELTS suits you if:** you prefer a human examiner, or your institution/visa asks for IELTS (some UK visa routes need the UKVI version).

⚠️ Fees, acceptance and formats change — **always check the official requirement** of your university or immigration body first.

Try the **free mocks** of both on \`/exams\` to feel the difference.`,
    followUps: ['Which exam should I start with?', 'IELTS band scores', 'How long to prepare?'],
  },
  {
    id: 'strategy-sat-math',
    topic: 'SAT Math strategy',
    keywords: ['sat math', 'sat score', 'sat tips', 'sat section'],
    answer: `**SAT is scored 400–1600** (Reading & Writing 200–800 + Math 200–800).

**Math tips (usually the fastest section to improve):**
- Master **linear equations**, **ratios**, and **percentages** — they show up a lot
- Learn to use the **built-in calculator** efficiently
- **Skip-and-come-back**: don't burn 3 minutes on one hard question
- Do 2–3 **full practice tests** under timed conditions
- Every wrong answer, write the *rule* you missed — you'll find patterns

**Reading & Writing tips:**
- The **evidence** must be in the passage — no outside knowledge
- Eliminate answers with *extreme* language ("always", "never")
- Grammar questions: read each option in the sentence out loud mentally

**Score goals:** 1200+ opens most US unis; 1400+ is competitive.`,
  },
  {
    id: 'strategy-ssc-hsc',
    topic: 'SSC / HSC board tips',
    keywords: ['ssc', 'hsc', 'board exam', 'board tips', 'bangladesh board', 'seen passage', 'seen comprehension', 'seen passages', 'gap filling', 'rearranging'],
    answer: `**Board exam strategy (SSC / HSC):**

**Seen comprehension (SSC):**
- Answer in **full sentences** unless told otherwise
- "Choose the best answer" — pick the one with *same meaning*, not same words
- For "information transfer", keep it short: subject + verb + object

**Gap filling with clues:**
- Read the whole passage once *before* filling
- The clue word tells you the *form* — (v) means verb, (n) noun, (adj) adjective
- Don't change the meaning — the passage has to make sense end-to-end

**Rearranging:**
- Find the **topic sentence** first (usually general, no pronouns)
- Look for **linking words** (then, next, however)
- Match **pronouns to previous nouns** — "he" comes *after* the name

**Writing:**
- Paragraph = **topic sentence + 3-4 supporting + conclusion**
- Letters: formal → "Dear Sir", "Yours faithfully"; informal → "Dear X", "Best wishes"
- Translation: keep it **simple and correct** — 10 simple sentences beat 3 complex mistakes`,
  },
  {
    id: 'strategy-speaking-band7',
    topic: 'Speaking band 7+',
    keywords: ['speaking band 7', 'speaking tips', 'ielts speaking tips', 'fluency tips', 'how to speak better', 'improve fluency', 'speak fluently', 'speaking fluency', 'band 7 tips'],
    answer: `**How to hit Speaking Band 7+:**

**Fluency (25%):**
- Speak at a **steady pace** — not fast, not slow
- Use **fillers** when needed: "Well…", "That's a good question…", "Let me think…"
- NEVER go silent for more than 2 seconds

**Lexical resource (25%):**
- Learn **topic-specific vocabulary**: education, technology, travel, environment
- Use **collocations** ("make a decision", "take a break" not "do a decision")
- Mix in **idioms** — even 2-3 shows range

**Grammar (25%):**
- Show **variety**: past, present, future, conditionals
- "If I had more time, I would…" — Band 7 loves this structure
- Small mistakes are OK, but don't repeat the same one

**Pronunciation (25%):**
- Not about accent — about **clarity**
- Stress the **content words**, not "the" or "a"
- Pause at **commas**, not at random

**Best practice:** record yourself, listen back, note 3 fixes per attempt. Iterate.`,
  },
  {
    id: 'strategy-vocab-retention',
    topic: 'Vocabulary retention',
    keywords: ['vocabulary tips', 'tips to remember words', 'remember words', 'learn vocab', 'how many words per day', 'words per day', 'memorize words'],
    answer: `**The 5-3-1 method for word retention:**

1. **Day 1** — learn 10 new words (only 10 — resist the urge to do 30)
2. **Day 2** — review them with **spaced repetition** (FixMyEnglish's deck does this automatically)
3. **Day 3** — write *your own* sentence for each
4. **Day 5** — read them, cover the meaning, recall
5. **Day 7** — quick blitz quiz

**Why this works:**
- Reviewing at *increasing intervals* fights the forgetting curve
- Using words in **your own sentences** moves them from short-term to long-term memory
- **Blitz mode** stress-tests recall under time pressure

**Realistic targets:**
- Casual: 5 words/day → +150/month
- Serious: 15 words/day → +450/month
- Exam prep: 30 words/day → +900/month (but 2h/day)

Track *words you actually used in writing/speaking*, not just words you saw.`,
  },
  {
    id: 'strategy-30-day-plan',
    topic: '30-day study plan',
    keywords: ['study plan', '30 day plan', 'how to prepare', 'study routine', 'study timetable', 'give me a study plan'],
    answer: `**30-day FixMyEnglish study plan (1 hour/day):**

**Week 1 — Foundation**
- Mon/Wed/Fri: 15 min vocab + 20 min grammar topic + 15 min reading
- Tue/Thu: 30 min mock section (Reading) + review wrong answers
- Sat: Speaking practice (3 prompts) + review
- Sun: Light — review deck only

**Week 2 — Skill building**
- Add 20 min **Writing** practice (1 task per day)
- Alternate focus: Task 1 (Mon/Wed), Task 2 (Tue/Thu)

**Week 3 — Full mocks**
- 2 full mock exams (spread 3 days apart)
- Review each wrong answer — write *why* you got it wrong

**Week 4 — Polish**
- Weak-area drills only (no new content)
- 1 full mock at the start + 1 near the end
- Speaking daily: 2 prompts, record + listen

**Golden rule:** more important than total hours is *never missing 2 days in a row*.`,
  },
  {
    id: 'strategy-common-mistakes',
    topic: 'Common Bangladeshi learner mistakes',
    keywords: ['common mistakes', 'typical mistakes', 'bangla mistakes', 'wrong grammar'],
    answer: `**Top mistakes Bangladeshi learners make in English:**

1. **"Discuss about the matter"** → "discuss the matter" (no *about*).
2. **"Return back"** → "return" or "come back" (*re-* already means back).
3. **"I am agree"** → "I agree" (*agree* is a verb).
4. **"Since 5 years"** → "for 5 years" (duration) vs "since 2019" (starting point).
5. **"I didn't went"** → "I didn't go" (base verb after *didn't*).
6. **"He is my cousin brother"** → "my cousin".
7. **"Come to home"** → "come home".
8. **"Every students"** → "every student" (singular after *every*).
9. **"I am boring"** vs **"I am bored"** — *boring* = you cause boredom; *bored* = you feel it.
10. **"Open the light"** → "turn on the light".

**How to break these:** keep a small notebook of *only your own mistakes*. Review it weekly — noticing a mistake is half of fixing it.`,
  },
];

export const ACCOUNT_ENTRIES: KBEntry[] = [
  {
    id: 'account-streak-protect',
    topic: 'Protecting your streak',
    keywords: ['streak protection', 'protect streak', 'miss a day', 'missed a day', 'lost my streak', 'streak broke', 'restore streak'],
    answer: `**Streak rules:**
- You need **1 activity per day** (Bangladesh time, midnight reset)
- Even a single vocab review counts
- Missing a full day resets to 0 — **Premium** gets 1 automatic freeze per week

**Protect it:**
- Set a phone reminder for **9 PM**
- Before bed, open the app and do 1 minute of vocab — that's enough
- If you're travelling: do it in the morning
- The app shows a **reminder** at 11:50 PM if you haven't practised

**Restore:** if the streak broke due to a **server issue** (not you), email support — we can restore it **once per account**.`,
  },
  {
    id: 'account-tier',
    topic: 'Changing tier',
    keywords: ['tier', 'upgrade tier', 'change tier', 'free to premium', 'upgrade', 'how do i upgrade', 'cancel subscription', 'cancel any time', 'downgrade'],
    answer: `**Your tier** decides which content you can access.

- **Guest** — browse, limited features, no save
- **Free** — full vocab + grammar, community, 1 mock per track
- **Premium** — everything + unlimited mocks + AI speaking + priority live rooms

**Upgrade any time:**
1. Go to **Pricing** in the sidebar
2. Pick a plan → checkout
3. Your account updates **instantly** (no logout needed)

**Downgrade / cancel:** All-Access can be cancelled any time — you keep access until the end of the billing period.`,
  },
];

/* ============================================================
   App how-tos — every suggestion chip lands on a real answer
   ============================================================ */
export const APP_HELP_ENTRIES: KBEntry[] = [
  {
    id: 'app-about',
    topic: 'What is FixMyEnglish',
    keywords: ['what is fixmyenglish', 'about the app', 'about fixmyenglish', 'what can you do', 'what does this app do', 'who made', 'app features'],
    answer: `**FixMyEnglish** is an English-learning web app for **SSC, HSC, IELTS, SAT and PTE** learners in Bangladesh.

- 📚 **Vocabulary** — flashcards, quizzes, Blitz, dictionary
- ✍️ **Grammar** — ~2,000 exercises with Bangla explanations
- 🎓 **Curriculum** — board-style SSC/HSC practice
- 🎯 **Exams** — timed IELTS, SAT and PTE mocks
- 🗣️ **Speaking** — instant IELTS-style feedback
- 🏆 **Progress, ranks and streaks** to keep you going
- 👥 **Community and live rooms** to learn together

And I'm **GiMi** — ask me about any page, study advice, grammar, or exam strategy.`,
    followUps: ['Where do I start?', 'Show me pricing', 'Give me a study plan'],
  },
  {
    id: 'app-getting-started',
    topic: 'Where to start',
    keywords: ['where do i start', 'where to start', 'getting started', 'get started', 'what can i do first', 'new here', 'how to use', 'first step', 'begin', 'start learning', 'কিভাবে শুরু', 'শুরু করব'],
    answer: `**Your first day (about 30 minutes):**

1. Open \`/\` and tap **Start learning**
2. \`/vocabulary\` → do **10 flashcards** (+5 XP each)
3. \`/grammar\` → pick one topic, do **10 exercises**
4. \`/exams\` → set your **exam date** if you have one (unlocks the countdown + daily plan)
5. Check \`/progress\` to see your XP and streak

**Pick a path:**
- **SSC / HSC** → \`/curriculum\` first (choose paper + board)
- **IELTS / PTE / SAT** → \`/exams\`, then \`/speaking\`

Hit the **100 XP daily goal** and your streak is safe. What are you preparing for?`,
    followUps: ['Which exam should I start with?', 'How do I earn XP fast?', 'Give me a study plan'],
  },
  {
    id: 'app-navigation',
    topic: 'Finding your way around',
    keywords: ['navigation', 'menu', 'sidebar', 'bottom nav', 'find page', 'search', 'notifications', 'shortcut', 'ctrl k', 'voice input', 'clear chat', 'how do i find'],
    answer: `**Getting around:**

- **Desktop** — sidebar on the left; **mobile** — bottom navigation bar
- **Search** — jump straight to a page or topic
- **Notifications** — updates and reminders
- **Profile menu** (top bar) — your account and log out
- **GiMi** — tap the ✦ bubble, or press **⌘K / Ctrl+K** on desktop

**In this chat:** 🎤 tap the mic to speak your question, 🗑 clears the chat, and each reply has **copy** and **regenerate** buttons. Drag the top bar down on mobile to close.`,
  },
  {
    id: 'app-guest-register',
    topic: 'Register, login and guest mode',
    keywords: ['how do i register', 'register', 'sign up', 'signup', 'create account', 'login', 'log in', 'sign in', 'is there a free plan', 'free plan', 'what is guest mode', 'guest mode', 'guest'],
    answer: `**Three ways in** (\`/login\`):

- **Guest mode** — try the app right away, no account. You can browse with limited features, but **progress isn't saved**.
- **Free account** — full vocab + grammar, community, and 1 mock per track. **Progress, XP and streak are saved.**
- **Premium** — everything, plus unlimited mocks, AI speaking and priority live rooms.

**To register:** open \`/login\` and choose the register / create-account option. Already a guest? Create a full account from \`/profile\` so your progress stays with you.

Yes — there's a **free plan**, and it's a great way to start.`,
    followUps: ['Show me pricing', 'How do I upgrade?', 'How do I reset my password?'],
  },
  {
    id: 'app-bangla-support',
    topic: 'Bangla support',
    keywords: ['bangla', 'bengali', 'বাংলা', 'bangla version', 'in bangla', 'translate to bangla', 'বাংলায়'],
    answer: `**Bangla is built in:**

- \`/grammar\` — every explanation has a 🇧🇩 **Bangla version** (toggle in the header)
- \`/curriculum\` — **Translation practice** (Bangla → English) and a Writing Bank
- **Me** — write in Bangla (or Banglish) and I'll answer the same way 😊

আপনি বাংলায় প্রশ্ন করতে পারেন — আমি বাংলায় উত্তর দেব।`,
  },
  {
    id: 'app-support',
    topic: 'Contact support',
    keywords: ['contact support', 'customer support', 'support email', 'report a bug', 'bug', 'problem with app', 'something is broken', 'not working', 'সাপোর্ট'],
    answer: `**Need a human?** Email **support@fixmyenglish.app**.

Include: your **name**, **registered email**, what happened, and a **screenshot** if you can.

**Typical turnaround:**
- Password reset link — within 24 hours
- Refunds — 3–5 business days after approval

**Quick fixes first:** refresh the page, log out and back in, and check your internet — most glitches clear up.`,
  },
  {
    id: 'app-live-schedule',
    topic: 'Live class times and priority seating',
    keywords: ['when do classes run', 'class time', 'class schedule', 'live class time', 'priority seating', 'live room schedule', 'live class'],
    answer: `**Live classes** usually run **7 PM – 11 PM Bangladesh time**. Check \`/live-rooms\` for the exact schedule and countdown.

**How it works:**
- Tap **Join Live Class** → the lobby shows capacity and a countdown
- **Priority seating** — Premium users get seats first when a room is full
- Guests can join without an account

Tip: join **5 minutes early** and test your internet. Live rooms need a stable connection.`,
    followUps: ['How do live rooms work?', 'How do I upgrade?', 'Which room should I join?'],
  },
  {
    id: 'app-payment',
    topic: 'Payment methods and coupons',
    keywords: ['payment methods', 'payment', 'bkash', 'nagad', 'stripe', 'coupon', 'promo code', 'discount', 'credit card', 'debit card', 'how to pay', 'পেমেন্ট', 'বিকাশ', 'নগদ'],
    answer: `**You can pay with:** **bKash**, **Nagad**, **Card**, or **Stripe**.

**How:** \`/pricing\` → pick a plan → checkout → pay. Your account upgrades **instantly**.

- 🎟 **Coupons** — enter the code at checkout
- 🛡 **7-day money-back promise**
- ❌ **All-Access** can be cancelled any time

Payment stuck or charged twice? Email **support@fixmyenglish.app** with your **transaction ID**.`,
    followUps: ['Show me pricing', 'Refund policy', 'Which plan is best for me?'],
  },
  {
    id: 'app-plan-chooser',
    topic: 'Which plan is best',
    keywords: ['which plan', 'which plan is best', 'which plan is best for ielts', 'best plan', 'ielts plan', 'sat plan', 'pte plan', 'all access', 'all-access', 'premium worth it', 'is premium worth it', 'plan for me', 'দাম', 'প্রাইস'],
    answer: `**Quick guide:**

- **Just one exam** (IELTS, SAT or PTE) → the **one-time Full Prep** for that track: IELTS ৳1,200 · SAT ৳1,500 · PTE ৳1,200
- **More than one exam, or you want AI speaking, unlimited mocks and priority live rooms** → **All-Access Premium, ৳350/month**
- **Just starting or on a budget** → stay on **Free** and try 1 mock per track first

**For IELTS:** Full Prep is great if you'll study 1–3 months. Sticking around longer or mixing in speaking practice? All-Access can be cheaper per month.

Prices can change — check \`/pricing\`. You also have a **7-day money-back promise**.`,
    followUps: ['Payment methods', 'Refund policy', 'Can I cancel any time?'],
  },
  {
    id: 'app-my-data',
    topic: 'Your own stats (rank, XP, streak, badges)',
    keywords: ['show me my rank', 'what is my rank', 'my current rank', 'show me my streak', 'what is my streak', 'show me my badges', 'my badges', 'my xp', 'how much xp do i have', 'my score', 'my progress', 'my stats', 'how am i doing'],
    answer: `I can't see your personal numbers from here — but they're one tap away:

- \`/progress\` — **streak, XP today, rank, recent scores, weekly chart, badges, weak areas**
- \`/profile\` — **tier, achievements, XP toward today's goal**

Paste your numbers here (e.g. *"Streak 4, XP 60, rank Sprout"*) and I'll tell you what to do next to level up. 🚀`,
    followUps: ['How do I earn XP fast?', 'How is my rank calculated?', 'What badges can I unlock?'],
  },
  {
    id: 'app-xp-fast',
    topic: 'Earning XP fast',
    keywords: ['earn xp fast', 'how do i earn xp fast', 'earn more xp', 'get xp fast', 'reach 100 xp', 'daily goal', 'xp goal', 'level up fast', 'rank up'],
    answer: `**Easy ways to hit your 100 XP daily goal:**

- ⚡ **5 correct Blitz answers = 75 XP** (30 seconds!)
- 🗣 **1 speaking attempt = 20 XP**
- 📚 **1 flashcard = 5 XP**

→ That's **100 XP in under 5 minutes**.

**Longer sessions:** 10 correct grammar questions = 100 XP, or 10 correct quiz answers = 100 XP.

**Rank up:** Sprout at 150 XP, Tree at 400, Champion at 1,000, Legend at 2,500. Consistent 100 XP days get you to Tree in about 4 days.`,
    followUps: ['How is my rank calculated?', 'How does Blitz work?', 'How does the streak work?'],
  },
  {
    id: 'app-leaderboard',
    topic: 'Leaderboard',
    keywords: ['leaderboard', 'top 100', 'ranking list', 'who is first', 'scoreboard'],
    answer: `**Leaderboards** show up in two places:

- **Live rooms** — the live leaderboard updates as people submit exam answers
- **Ranks** — your rank (Seedling → Legend) is based on total XP and appears on the leaderboard

Higher ranks also unlock **Gold** and **Platinum** community rooms. Keep a steady daily XP habit and you'll climb.`,
  },
  {
    id: 'app-community-guide',
    topic: 'Community rooms, squads and rules',
    keywords: ['which room should i join', 'which room', 'how do squads work', 'squads', 'squad', 'community rules', 'ielts warriors', 'top 100 club', 'beginner lounge', 'grammar help desk', 'threads'],
    answer: `**Which room?**
- **Beginner Lounge** — new here? Start here (open to all)
- **Grammar Help Desk** — stuck on a rule? Ask here (open to all)
- **IELTS Warriors** — Gold rank
- **Top 100 Club** — Platinum rank

**Squads** (Vocab Vikings, Grammar Guardians, Speaking Stars) share a **group XP goal** — everyone's practice counts toward the team.

**Community rules:**
- Be kind and respectful
- Never share answers during a live exam
- Everything is admin-moderated

Tip: posting one question a day in **Threads** is a great habit.`,
  },
  {
    id: 'app-admin-guide',
    topic: 'Admin tasks',
    keywords: ['how do i publish an exam', 'publish an exam', 'publish exam', 'add a live room', 'add live room', 'schedule live room', 'view the audit log', 'audit log', 'add coupon', 'create coupon', 'announcement', 'feature flag'],
    answer: `**Admin tasks** (\`/admin\` — admins and superadmins only):

- **Publish an exam** → **Content → Exam Papers**
- **Add a live room** → **Live Rooms** — schedule it with Google Meet, Zoom or Teams
- **Coupons / products / purchases** → **Money**
- **Announcements and feature flags** → **System**
- **Audit log** → **System → Audit Log** (every admin action is recorded)

Only **superadmins** can delete users. Don't see \`/admin\`? Your account needs an admin role.`,
  },
];

/* ============================================================
   Exam help — IELTS / PTE / SAT / board
   ============================================================ */
export const EXAM_HELP_ENTRIES: KBEntry[] = [
  {
    id: 'exam-which-first',
    topic: 'Which exam should I start with',
    keywords: ['which exam should i start with', 'which exam', 'which test', 'ielts or pte', 'should i take ielts', 'what exam do i need'],
    answer: `**It depends on your goal:**

- 🎓 **Study in UK/Canada/Australia, or migrate** → IELTS or PTE (check what your target accepts)
- 🇺🇸 **US undergraduate** → SAT (plus an English test like IELTS)
- 📘 **School exams** → SSC/HSC practice in \`/curriculum\`

**Not sure yet?** Take a **free mock** of IELTS and PTE on \`/exams\`, see which feels more natural, then check your university's requirement.

**Always confirm the required score and test type** on the official website before booking.`,
    followUps: ['IELTS vs PTE', 'How long to prepare?', 'IELTS band scores'],
  },
  {
    id: 'exam-mock-scoring',
    topic: 'How mocks are scored',
    keywords: ['how are mocks scored', 'mock score', 'mock scoring', 'mock exam score', 'auto scored'],
    answer: `**Mocks on \`/exams\`:**

- ⏱ **Timed** like the real thing
- ✅ **Auto-scored** the moment you finish
- 🔀 **Shuffled per user** — nobody sees the same order
- 🔴 **LIVE papers** (red badge) are real running papers

**Use your score like this:** it's a **practice estimate**, not an official prediction. Review every wrong answer and write *why* you missed it — that's where the improvement is.

Set your **exam date** to unlock the countdown ring and a daily study plan.`,
  },
  {
    id: 'exam-how-long',
    topic: 'How long to prepare',
    keywords: ['how long to prepare', 'how long to study', 'how many months', 'how many weeks', 'when to book', 'preparation time', 'prepare for ielts'],
    answer: `**Rough guide** (varies a lot by person):

- Raising your band by **0.5** usually takes **4–8 weeks** of steady practice
- Going from **5.5 → 7** often takes **3–4 months**
- Already near your target? **3–4 weeks** of focused mocks may be enough

**Make it count:**
1. Take a **diagnostic mock** now
2. Find your weakest section
3. Study **1 hour/day** — consistency beats cramming
4. Take a full mock every week or two

Book the real exam when your mock scores are **at or above target for 2–3 mocks in a row**.`,
    followUps: ['Give me a study plan', 'IELTS band scores', 'Exam day tips'],
  },
  {
    id: 'exam-ielts-writing',
    topic: 'IELTS Writing tips',
    keywords: ['ielts writing', 'ielts writing tips', 'task 1', 'task 2', 'essay structure', 'writing task', 'how to write essay'],
    answer: `**IELTS Writing — 60 minutes, 2 tasks:**

**Task 1** (~20 min, 150+ words)
- *Academic:* describe a chart/graph/process — overview first, then key details
- *General:* write a letter — match the tone (formal/informal)

**Task 2** (~40 min, 250+ words) — worth **twice as much**
1. **Intro** — paraphrase the question + your position
2. **Body 1** — main point + explanation + example
3. **Body 2** — second point + example
4. **Conclusion** — restate your view

**Band 7 habits:** clear paragraphs, linking words (*however, as a result*), specific examples, and **leave 3 minutes to proofread** (articles, plurals, tenses).`,
    followUps: ['IELTS Speaking Part 2', 'IELTS Reading and Listening tips', 'Common mistakes'],
  },
  {
    id: 'exam-ielts-part2',
    topic: 'IELTS Speaking Part 2 example',
    keywords: ['ielts part 2 example', 'ielts speaking part 2', 'part 2', 'cue card', 'long turn', 'speaking part 2'],
    answer: `**Part 2 = the long turn:** you get a cue card, **1 minute** to prepare, then speak for **1–2 minutes**.

**Sample card:** *Describe a teacher who helped you.*

**Structure it (use the card's prompts):**
- **Who** — "I'd like to talk about my English teacher, Mr Rahman."
- **When/where** — "He taught me in Class 9…"
- **What he did** — "He made grammar fun by using real-life examples…"
- **Why it mattered** — "Because of him, I stopped being afraid of speaking."

**Tips:**
- Use your minute to jot **keywords only**
- Keep talking until the examiner stops you
- If you run out: add a **feeling** or a **small story**

Practise on \`/speaking\` — you'll get a band estimate and a fault report.`,
    followUps: ['How do I improve fluency?', 'Speaking band 7+', 'How am I scored?'],
  },
  {
    id: 'exam-ielts-reading-listening',
    topic: 'IELTS Reading and Listening tips',
    keywords: ['ielts reading', 'ielts listening', 'reading tips', 'listening tips', 'true false not given', 'matching headings', 'skimming', 'scanning'],
    answer: `**Reading (60 min, 3 passages)**
- **Skim** the passage for 1–2 min, then **scan** for each question's keywords
- **True / False / Not Given:** *False* = the passage says the **opposite**; *Not Given* = it **doesn't say**
- Don't spend more than **20 minutes** per passage

**Listening (30 min + transfer time)**
- Read the questions **before** the audio starts
- Watch for **numbers, names and spelling** — the classic traps
- Answers come **in order** — if you miss one, move on

**Both:** write answers exactly as asked (word limits matter), and don't leave blanks — guess.`,
  },
  {
    id: 'exam-pte-tips',
    topic: 'PTE tips',
    keywords: ['pte tips', 'pte speaking', 'pte writing', 'pte reading', 'pte listening', 'describe image', 'repeat sentence', 'read aloud', 'pte score'],
    answer: `**PTE is fully computer-based** — a machine scores your speaking too, so **clarity and fluency** beat fancy accents.

- **Read Aloud / Repeat Sentence** — steady pace, don't stop to fix mistakes
- **Describe Image** — 3 parts: what it shows → 2–3 key details → conclusion; keep talking for the full time
- **Writing** — follow the word limit exactly and check grammar and spelling
- **Listening/Reading** — practise summarising what you hear/read in one sentence

**Do a few full mocks** — format and timing take practice. Try the free PTE mock on \`/exams\`.`,
    followUps: ['IELTS vs PTE', 'How long to prepare?', 'Exam day tips'],
  },
  {
    id: 'exam-day-tips',
    topic: 'Exam day tips',
    keywords: ['exam day', 'day before exam', 'night before exam', 'exam tips', 'before the exam', 'last minute', 'exam checklist', 'exam anxiety', 'exam stress', 'nervous', 'scared of exam', 'panic'],
    answer: `**The day before:**
- Light revision only — **no new topics**
- Pack ID, admit card and pens; plan your route
- Sleep early. A rested brain beats 2 extra hours of cramming.

**On the day:**
- Arrive early and eat something light
- Read instructions **twice**
- Skip hard questions and come back
- Breathing trick: **in for 4, out for 6** — repeat 3 times

**Feeling anxious?** That's normal — it means you care. Pick **one** small task (the first question) and start. Momentum calms nerves.

You've practised for this. You've got it. 💪`,
    followUps: ['I feel discouraged', 'Give me a study plan', 'How long to prepare?'],
  },
  {
    id: 'exam-translation',
    topic: 'Translation tips',
    keywords: ['translation tips', 'translation', 'bangla to english', 'translate sentence', 'translation practice'],
    answer: `**Bangla → English translation, step by step:**

1. **Read the whole sentence** first
2. Find the **subject, verb and tense**
3. Translate the **meaning**, not word-for-word
4. Check **articles, prepositions and verb forms**
5. Re-read: does it sound natural?

**Rules of thumb:**
- Simple and correct beats long and risky
- Keep the same tense as the original
- Learn common patterns ("আমি ... করছি" → *I am ...ing*)

Practise daily in \`/curriculum\` → **Translation practice**.`,
  },
  {
    id: 'exam-ssc-hsc-writing',
    topic: 'SSC vs HSC writing',
    keywords: ['ssc vs hsc writing', 'ssc vs hsc', 'paragraph writing', 'letter writing', 'application writing', 'composition', 'writing bank', 'dialogue', 'story writing'],
    answer: `**Writing in SSC/HSC** usually covers paragraphs, letters/applications, dialogues, stories and compositions. The mix and depth differ by level, so **check your board's latest syllabus**.

**Universal tips:**
- **Paragraph:** topic sentence + 3–4 supporting sentences + conclusion
- **Formal letter:** *Dear Sir* … *Yours faithfully*; **informal:** *Dear X* … *Best wishes*
- **Plan 2 minutes** before writing; **proofread 2 minutes** after
- Use linking words (*firstly, moreover, therefore*)

Browse model answers in \`/curriculum\` → **Writing Bank**.`,
    followUps: ['Translation tips', 'SSC / HSC board tips', 'Common mistakes'],
  },
];

/* ============================================================
   Grammar mini-lessons (offline answers to the grammar chips)
   ============================================================ */
export const GRAMMAR_HELP_ENTRIES: KBEntry[] = [
  {
    id: 'grammar-prepositions',
    topic: 'Prepositions',
    keywords: ['explain prepositions', 'prepositions', 'preposition', 'in on at', 'at on in', 'preposition of time', 'preposition of place'],
    answer: `**Prepositions of time:**
- **at** → clock times: *at 5 PM, at night*
- **on** → days/dates: *on Monday, on 5 May*
- **in** → months/years/seasons: *in June, in 2026, in winter*

**Prepositions of place:**
- **at** → a point: *at the bus stop*
- **on** → a surface: *on the table*
- **in** → inside: *in the room, in Dhaka*

**Common pairs:** *depend **on***, *good **at***, *interested **in***, *afraid **of***, *married **to***, *discuss* (no preposition!).

Practise on \`/grammar\` → **Prepositions**.`,
    followUps: ['When to use articles', 'Common tense mistakes', 'Common mistakes'],
  },
  {
    id: 'grammar-articles',
    topic: 'Articles (a, an, the)',
    keywords: ['when to use articles', 'articles', 'article', 'a an the', 'use of the', 'a or an'],
    answer: `**a / an** → one *unknown or general* thing
- **a** before a consonant **sound**: *a book, a university*
- **an** before a vowel **sound**: *an apple, an hour*

**the** → a *specific* thing both people know
- *Open **the** door.* · *The sun rises in the east.*
- Also with unique things (*the moon*), superlatives (*the best*), and rivers/oceans (*the Padma*)

**No article:**
- General plurals: *Dogs are loyal.*
- Languages, meals, most countries: *I speak Bangla. We had lunch.*

**Quick test:** one? → **a/an**. Specific? → **the**. General plural? → **nothing**.`,
  },
  {
    id: 'grammar-tense-mistakes',
    topic: 'Common tense mistakes',
    keywords: ['common tense mistakes', 'tense mistakes', 'tenses', 'tense', 'present perfect', 'past simple', 'simple past', 'which tense'],
    answer: `**Frequent tense slips:**

1. ❌ *I am living here since 2020.* → ✅ *I **have lived** here since 2020.* (since/for + present perfect)
2. ❌ *I didn't went.* → ✅ *I didn't **go**.* (base verb after *did/didn't*)
3. ❌ *She go to school.* → ✅ *She **goes**.* (add -s/-es with he/she/it)
4. ❌ *I have seen him yesterday.* → ✅ *I **saw** him yesterday.* (finished time → past simple)
5. ❌ *If I will go, I will call.* → ✅ *If I **go**, I will call.* (no *will* after *if*)

**Quick rule:** finished time (*yesterday, in 2019*) → **past simple**. Link to now (*since, for, already, yet*) → **present perfect**.`,
    followUps: ['Explain prepositions', 'When to use articles', 'Common mistakes'],
  },
  {
    id: 'grammar-conditionals',
    topic: 'Conditionals',
    keywords: ['conditionals', 'conditional', 'if clause', 'if sentences'],
    answer: `**Four conditionals:**

- **Zero** — facts: *If you heat ice, it **melts**.*
- **First** — real future: *If it rains, we **will stay** home.*
- **Second** — unreal present: *If I **had** more time, I **would learn** French.*
- **Third** — unreal past: *If I **had studied**, I **would have passed**.*

**Pattern:** *if + (tense) → (tense)* — the second tense **steps back** each level.

Band 7 speakers love the **second conditional**: *"If I could change one thing, I would…"* — use it in IELTS Speaking Part 3.`,
  },
];

/* ============================================================
   Coaching — motivation, habits, confidence, study abroad
   ============================================================ */
export const COACH_ENTRIES: KBEntry[] = [
  {
    id: 'coach-motivation',
    topic: 'Feeling discouraged',
    keywords: ['i feel discouraged', 'discouraged', 'how do i motivate myself', 'motivate myself', 'motivation', 'give up', 'cant do it', 'i am not good', 'too hard', 'lost motivation', 'feeling down', 'i am bad at english', 'demotivated'],
    answer: `That feeling is **really common** — and it doesn't mean you're bad at English. It means you're **stretching**, which is exactly when learning happens. 💛

**Try this today (10 minutes):**
1. Do **one easy win** — 5 flashcards or a Blitz round
2. Check \`/progress\` and look at how far you've already come
3. Write down **one thing** you can say now that you couldn't a month ago

**Remember:** small daily practice beats big occasional effort. A **5-minute day** still keeps your streak alive.

Want me to make you a **tiny 7-day plan**?`,
    followUps: ['Give me a study plan', 'How do I stay consistent?', 'Speaking confidence'],
  },
  {
    id: 'coach-consistency',
    topic: 'Staying consistent',
    keywords: ['stay consistent', 'how do i stay consistent', 'consistency', 'procrastination', 'procrastinate', 'no time', 'study habit', 'build a habit', 'habit', 'cant focus', 'distracted'],
    answer: `**Make it easy, not heroic:**

- **Same time daily** — attach it to something (after Fajr/school/dinner)
- **Start tiny** — "just 2 minutes" gets you started more often than not
- **Phone away** — keep it in another room during your study block
- **Protect the streak** — one tiny activity counts
- **Reward yourself** — tick it off \`/progress\`, enjoy the XP

**If you miss a day:** never miss **two**. Get back the next morning with 5 minutes.

**Busy with school?** Use dead time: flashcards on the bus, a podcast while walking.`,
    followUps: ['How does the streak work?', 'Give me a study plan', 'I feel discouraged'],
  },
  {
    id: 'coach-speaking-confidence',
    topic: 'Speaking confidence',
    keywords: ['speaking confidence', 'shy', 'afraid to speak', 'fear of speaking', 'scared to speak', 'embarrassed', 'afraid of mistakes', 'fear of mistakes', 'hesitate', 'cannot speak english', 'practice speaking'],
    answer: `**Everyone makes mistakes when speaking** — fluent speakers too. The goal is to be **understood**, not perfect.

**Build confidence in 4 steps:**
1. **Talk to yourself** — describe your day in English for 2 minutes
2. **Record and listen** — pick 1 thing to improve each time
3. **Repeat after native audio** (shadowing) — copy rhythm and stress
4. **Use \`/speaking\`** — private, instant feedback, no judgement

**Phrases that buy thinking time:** *"That's an interesting question…"*, *"Let me think…"*

Tiny daily practice beats a big weekly session. You're doing better than you think. 🌟`,
    followUps: ['How do I improve fluency?', 'IELTS Speaking Part 2', 'Speaking band 7+'],
  },
  {
    id: 'coach-learn-daily',
    topic: 'Improving English without a teacher',
    keywords: ['learn english without teacher', 'improve english', 'how to improve english', 'self study', 'practice english', 'become fluent', 'english daily routine', 'think in english', 'watch movies', 'podcast', 'reading habit'],
    answer: `**A 30-minute daily routine that works:**

- 🎧 **10 min listen** — a podcast or short video (replay one clip 3×)
- 📖 **10 min read** — one short article; note 3 new words
- ✍️ **5 min write** — 3–4 sentences about your day
- 🗣 **5 min speak** — say them out loud

**Extra tips:**
- Use new words in **your own sentences** — it's what makes them stick
- Switch your phone to English
- Keep a **mistake notebook** and review weekly

Then use the app for structure: \`/vocabulary\` for words, \`/grammar\` for rules, \`/speaking\` for feedback.`,
    followUps: ['Tips to remember words', 'Give me a study plan', 'Speaking confidence'],
  },
  {
    id: 'coach-study-abroad',
    topic: 'Study abroad basics',
    keywords: ['study abroad', 'abroad', 'university abroad', 'scholarship', 'visa', 'migrate', 'immigration', 'ielts for visa', 'which country', 'masters', 'ielts score for university'],
    answer: `**A simple path:**

1. **Choose** your country and course
2. **Check each university's English requirement** (test type + minimum band, often per skill)
3. **Pick the test** they accept — IELTS or PTE
4. **Plan backwards** from the application deadline (allow time for a retake)
5. **Prepare documents** early — transcripts, SOP, references

**Typical IELTS targets:** around **6.0–6.5** for many undergrad courses and **6.5–7.0** for many Master's — but it varies a lot.

⚠️ Requirements and visa rules change — **always confirm on the university and government websites** (or with an accredited advisor).

Want help planning your English prep around your deadline?`,
    followUps: ['IELTS band scores', 'IELTS vs PTE', 'How long to prepare?'],
  },
];

/* ============================================================
   Small talk
   ============================================================ */
export const SMALLTALK_ENTRIES: KBEntry[] = [
  {
    id: 'talk-greeting',
    topic: 'Greeting',
    keywords: ['hello', 'hi', 'hey', 'hii', 'salam', 'assalamu alaikum', 'assalamualaikum', 'good morning', 'good evening', 'good afternoon', 'হ্যালো', 'আসসালামু আলাইকুম', 'সালাম'],
    answer: `Hey there! 👋 I'm **GiMi**, your FixMyEnglish guide and study buddy.

I can help with:
- 📱 **The app** — pages, plans, streaks, XP
- 📝 **English** — grammar, vocab, speaking, writing
- 🎯 **Exams** — IELTS, PTE, SAT, SSC/HSC
- 💡 **Advice** — study plans, motivation, confidence

What would you like to do today?`,
  },
  {
    id: 'talk-thanks',
    topic: 'Thanks',
    keywords: ['thanks', 'thank you', 'thx', 'ty', 'awesome', 'ধন্যবাদ'],
    answer: `You're welcome! 😊 Happy to help. Keep going — small steps every day add up.

Anything else you'd like to know?`,
  },
  {
    id: 'talk-who',
    topic: 'Who is GiMi',
    keywords: ['who are you', 'what are you', 'your name', 'are you ai', 'are you a robot', 'are you human', 'who is gimi'],
    answer: `I'm **GiMi** — the AI guide inside FixMyEnglish, built by the FixMyEnglish team. 🤖✨

I know every page of the app, can explain grammar and exam strategy, and give study advice. I'm an AI, so I can make mistakes — for payments, refunds or account issues, email **support@fixmyenglish.app**.`,
  },
];

export const ALL_EXTRA_ENTRIES: KBEntry[] = [
  ...EXAM_STRATEGY_ENTRIES,
  ...ACCOUNT_ENTRIES,
  ...APP_HELP_ENTRIES,
  ...EXAM_HELP_ENTRIES,
  ...GRAMMAR_HELP_ENTRIES,
  ...COACH_ENTRIES,
  ...SMALLTALK_ENTRIES,
];
