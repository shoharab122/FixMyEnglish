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
    keywords: ['pte vs ielts', 'pte or ielts', 'which is easier', 'pte easier'],
    answer: `**PTE is often easier to score higher on** — especially for Asian speakers — but it's less widely accepted.

| Feature | PTE | IELTS |
|---|---|---|
| Speaking | To a machine | To a human |
| Result time | 2–5 days | 13 days |
| Validity | 2 years | 2 years |
| Accepted by | Australia, NZ, most UK unis | All UK/Aus/Canada, US |
| Cost | ~$200 | ~$245 |

**Choose PTE if:** you're naturally shy, hate face-to-face exams, and need fast results.
**Choose IELTS if:** you need a UK spouse/family/student visa, or a US or Canada visa.

You can try **free mocks** of both in the Exams page to feel the format.`,
  },
  {
    id: 'strategy-sat-math',
    topic: 'SAT Math strategy',
    keywords: ['sat math', 'sat score', 'sat tips', 'sat section'],
    answer: `**SAT is scored 400–1600** (Reading & Writing 200–800 + Math 200–800).

**Math tips (usually the fastest section to improve):**
- Master **linear equations**, **ratios**, and **percentages** — they're ~40% of the test
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
    keywords: ['ssc', 'hsc', 'board exam', 'board tips', 'bangladesh board'],
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
    keywords: ['speaking band 7', 'speaking tips', 'ielts speaking tips', 'fluency tips', 'how to speak better'],
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
    keywords: ['vocabulary tips', 'remember words', 'learn vocab', 'spaced repetition'],
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
    keywords: ['study plan', '30 day plan', 'how to prepare', 'study routine', 'schedule'],
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

1. **"Discusss" vs "discuss"** — only 2 s's. And "discuss **about**" is wrong → just "discuss".
2. **"Return back"** — redundant. Just "return" or "come back".
3. **"Discuss about the matter"** → "discuss the matter".
4. **"I am agree"** → "I agree" (agree is a verb, not adjective).
5. **"Since 5 years"** → "for 5 years" (duration) vs "since 2019" (starting point).
6. **"I didn't went"** → "I didn't go" (after "didn't", use base form).
7. **"He is my cousin brother"** → just "cousin".
8. **"Come to home"** → "come home".
9. **"Every students"** → "every student" (singular after every).
10. **"I am boring"** vs **"I am bored"** — "boring" = you cause boredom; "bored" = you feel it.

**How to break these:** keep a small notebook of *only your own mistakes*. Review it weekly. Awareness alone fixes 60% of them.`,
  },
];

export const ACCOUNT_ENTRIES: KBEntry[] = [
  {
    id: 'account-streak-protect',
    topic: 'Protecting your streak',
    keywords: ['streak protection', 'keep streak', 'streak freeze', 'miss a day'],
    answer: `**Streak rules:**
- You need **1 activity per day** (Bangladesh time, midnight reset)
- Even a single vocab review counts
- Missing a full day resets to 0

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
    keywords: ['tier', 'upgrade tier', 'change tier', 'free to premium'],
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
  {
    id: 'account-mobile-install',
    topic: 'Install on phone',
    keywords: ['install app', 'add to home', 'pwa', 'make it app', 'offline app'],
    answer: `**FixMyEnglish is a web app** — no download needed, but you can make it *feel* like a real app:

**iPhone / iPad:**
1. Open in **Safari**
2. Tap the **Share** button (□↑)
3. Scroll down → **Add to Home Screen**
4. Rename → Add

**Android:**
1. Open in **Chrome**
2. Tap the **three-dot menu** (⋮)
3. Tap **Add to Home screen**
4. Confirm

You'll get:
- An app icon on your home screen
- Full-screen (no browser chrome)
- Fast launch

It works on any size — from iPhone SE to iPad Pro.`,
  },
];

export const ALL_EXTRA_ENTRIES: KBEntry[] = [
  ...EXAM_STRATEGY_ENTRIES,
  ...ACCOUNT_ENTRIES,
];
