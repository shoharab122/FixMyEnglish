import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { VOCAB_SEED } from '../src/modules/vocab/seed.js';
import { GRAMMAR_SEED } from '../src/modules/grammar/seed.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding…');

  /* ---------- Vocabulary ---------- */
  for (const v of VOCAB_SEED) {
    await prisma.vocabWord.upsert({
      where: { word: v.word },
      create: {
        word: v.word, meaningEn: v.meaningEn, example: v.example,
        pos: v.pos, synonyms: v.synonyms,
        textbookUnit: v.textbookUnit ?? undefined,
      },
      update: {},
    });
  }

  /* ---------- Grammar topics + questions ---------- */
  const slugToId: Record<string, string> = {};
  let order = 0;
  for (const t of GRAMMAR_SEED.topics) {
    const topic = await prisma.grammarTopic.upsert({
      where: { slug: t.slug },
      create: { slug: t.slug, name: t.name, category: t.category, order: order++ },
      update: { name: t.name, category: t.category },
    });
    slugToId[t.slug] = topic.id;
  }
  for (const q of GRAMMAR_SEED.questions) {
    const topicId = slugToId[q.topicSlug];
    if (!topicId) continue;
    const existing = await prisma.grammarQuestion.findFirst({
      where: { topicId, prompt: q.prompt },
    });
    if (existing) continue;
    await prisma.grammarQuestion.create({
      data: {
        topicId, prompt: q.prompt, options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explain, banglaExplain: q.banglaExplain,
      },
    });
  }

  /* ---------- Curriculum ---------- */
  const curriculumItems = [
    { classLevel: 'SSC', paper: '1st Paper', topic: 'Seen Comprehension',     tag: 'Reading', type: 'question_set' },
    { classLevel: 'SSC', paper: '1st Paper', topic: 'Gap Filling with Clues', tag: 'Grammar', type: 'question_set' },
    { classLevel: 'SSC', paper: '1st Paper', topic: 'Rearranging Sentences',  tag: 'Grammar', type: 'question_set' },
    { classLevel: 'HSC', paper: '2nd Paper', topic: 'Completing Sentences',   tag: 'Grammar', type: 'question_set' },
    { classLevel: 'HSC', paper: '2nd Paper', topic: 'Right Form of Verbs',    tag: 'Grammar', type: 'question_set' },
    { classLevel: 'HSC', paper: '2nd Paper', topic: 'Your Aim in Life',       tag: 'Writing', type: 'paragraph' },
    { classLevel: 'HSC', paper: '2nd Paper', topic: 'A Letter to a Friend',   tag: 'Writing', type: 'letter' },
    { classLevel: 'SSC', paper: '2nd Paper', topic: 'Translation (BN → EN)',  tag: 'Writing', type: 'translation', body: 'সে প্রতিদিন সকালে হাঁটে।', modelAnswer: 'He walks every morning.' },
  ];
  for (const c of curriculumItems) {
    const existing = await prisma.curriculumContent.findFirst({ where: { topic: c.topic } });
    if (existing) continue;
    await prisma.curriculumContent.create({ data: c as any });
  }

  /* ---------- Exam tracks + sample sets ---------- */
  const tracks = [
    { slug: 'ielts', name: 'IELTS', icon: 'flag', sections: [
      { section: 'Listening', mins: 30 }, { section: 'Reading', mins: 60 },
      { section: 'Writing', mins: 60 },   { section: 'Speaking', mins: 15 },
    ]},
    { slug: 'sat', name: 'SAT', icon: 'target', sections: [
      { section: 'Reading & Writing', mins: 64 }, { section: 'Math', mins: 70 },
    ]},
    { slug: 'pte', name: 'PTE', icon: 'zap', sections: [
      { section: 'Speaking & Writing', mins: 77 }, { section: 'Reading', mins: 32 }, { section: 'Listening', mins: 45 },
    ]},
  ];
  for (const t of tracks) {
    const track = await prisma.examTrack.upsert({
      where: { slug: t.slug },
      create: { slug: t.slug, name: t.name, icon: t.icon },
      update: {},
    });
    for (const s of t.sections) {
      const existing = await prisma.examSet.findFirst({ where: { trackId: track.id, section: s.section } });
      if (existing) continue;
      const set = await prisma.examSet.create({
        data: {
          trackId: track.id, title: `${t.name} ${s.section}`,
          section: s.section, durationMinutes: s.mins,
          isPremium: s.section !== 'Reading',
        },
      });
      await prisma.examQuestion.createMany({
        data: [
          { examSetId: set.id, orderIndex: 0, prompt: 'The sun ___ in the east every morning.', options: ['rise','rises','rising','rose'], correctAnswer: 'rises', points: 1 },
          { examSetId: set.id, orderIndex: 1, prompt: 'She has been living here ___ 2015.',   options: ['from','since','for','at'],  correctAnswer: 'since', points: 1 },
        ],
      });
    }
  }

  /* ---------- Speaking prompts ---------- */
  const existingPrompts = await prisma.speakingPrompt.count();
  if (existingPrompts === 0) {
    await prisma.speakingPrompt.createMany({
      data: [
        { trackSlug: 'ielts',   category: 'part1', promptText: 'What is your full name?', prepSeconds: 0, responseSeconds: 30 },
        { trackSlug: 'ielts',   category: 'part1', promptText: 'Where are you from?', prepSeconds: 0, responseSeconds: 30 },
        { trackSlug: 'ielts',   category: 'part2', promptText: 'Describe a place you visited recently that you really enjoyed.', prepSeconds: 60, responseSeconds: 120 },
        { trackSlug: 'ielts',   category: 'part3', promptText: 'How has technology changed the way people communicate?', prepSeconds: 0, responseSeconds: 60 },
        { trackSlug: 'general', category: 'conversation', promptText: 'Tell me a little about your hometown.', prepSeconds: 0, responseSeconds: 45 },
      ],
    });
  }

  /* ---------- Achievements ---------- */
  const achievements = [
    { code: 'words_50',    title: '50 Words Mastered', icon: '📚', description: 'Learn 50 new words' },
    { code: 'streak_7',    title: '7-Day Streak',      icon: '🔥', description: 'Practise 7 days in a row' },
    { code: 'grammar_90',  title: 'Grammar Guru',      icon: '✓',  description: 'Score 90% on 20 exercises' },
    { code: 'mock_first',  title: 'First Mock Exam',   icon: '🎯', description: 'Complete any full mock' },
    { code: 'speak_band7', title: 'Speaking Star',     icon: '✦',  description: 'Get a Band 7 on speaking' },
    { code: 'streak_30',   title: '30-Day Streak',     icon: '⚡', description: 'Practise 30 days in a row' },
  ];
  for (const a of achievements) {
    await prisma.achievement.upsert({ where: { code: a.code }, create: a, update: {} });
  }

  /* ---------- Chat rooms ---------- */
  const rooms = [
    { slug: 'beginner-lounge', name: 'Beginner Lounge',   minRank: 'Bronze',   topic: 'Casual English chat',    liveCount: 24 },
    { slug: 'grammar-desk',    name: 'Grammar Help Desk', minRank: 'Bronze',   topic: 'Ask grammar questions',  liveCount: 12 },
    { slug: 'ielts-warriors',  name: 'IELTS Warriors',    minRank: 'Gold',     topic: 'IELTS strategy & mocks', liveCount: 41, isLocked: true },
    { slug: 'top-100',         name: 'Top 100 Club',      minRank: 'Platinum', topic: 'Elite study circle',     liveCount: 8,  isLocked: true },
  ];
  for (const r of rooms) {
    await prisma.chatRoom.upsert({ where: { slug: r.slug }, create: r as any, update: {} });
  }

  /* ---------- Study groups ---------- */
  const groupCount = await prisma.studyGroup.count();
  if (groupCount === 0) {
    await prisma.studyGroup.createMany({
      data: [
        { name: 'Vocab Vikings',     crest: 'V', memberCount: 6, groupXpCurrent: 3400, groupXpGoal: 5000 },
        { name: 'Grammar Guardians', crest: 'G', memberCount: 4, groupXpCurrent: 1200, groupXpGoal: 3000 },
        { name: 'Speaking Stars',    crest: 'S', memberCount: 5, groupXpCurrent: 2100, groupXpGoal: 4000 },
      ],
    });
  }

  /* ---------- Live rooms ---------- */
  const liveRooms = [
    { title: 'IELTS Mock — Reading & Writing', level: 'IELTS',    durationMins: 165, maxSeats: 100, status: 'scheduled' },
    { title: 'SAT Math Sprint — Geometry',     level: 'SAT',      durationMins: 70,  maxSeats: 60,  status: 'scheduled' },
    { title: 'PTE Listening Practice',         level: 'PTE',      durationMins: 45,  maxSeats: 40,  status: 'scheduled' },
    { title: 'Speaking Club — Fluency Drills', level: 'Speaking', durationMins: 60,  maxSeats: 30,  status: 'live' },
  ];
  for (const r of liveRooms) {
    const existing = await prisma.liveRoom.findFirst({ where: { title: r.title } });
    if (existing) continue;
    await prisma.liveRoom.create({ data: r });
  }

  /* ---------- Products ---------- */
  const products = [
    { slug: 'ielts',      name: 'IELTS Full Prep',    tagline: 'Everything you need for all four IELTS sections.', type: 'ielts_mock',   priceBdt: 1200, period: 'one-time', strikeBdt: 1600, icon: 'flag',   featured: false, features: ['Listening, Reading, Writing, Speaking mocks','AI speaking scoring','Personalized study plan','Lifetime access to updates'] },
    { slug: 'sat',        name: 'SAT Full Prep',      tagline: 'Reading, Writing and Math on one shared engine.',  type: 'sat_mock',     priceBdt: 1500, period: 'one-time', strikeBdt: 2000, icon: 'target', featured: false, features: ['Reading, Writing, Math mocks','Score analytics dashboard','Weak-area drills','Full-length practice exams'] },
    { slug: 'pte',        name: 'PTE Full Prep',      tagline: 'All PTE sections with AI speaking feedback.',      type: 'pte_mock',     priceBdt: 1200, period: 'one-time', strikeBdt: 1600, icon: 'zap',    featured: false, features: ['All sections, unlimited mocks','AI speaking scoring','Adaptive study plan','Progress analytics'] },
    { slug: 'all-access', name: 'All-Access Premium', tagline: 'Every track, every feature, every month.',         type: 'subscription', priceBdt: 350,  period: '/ month',  strikeBdt: null, icon: 'trophy', featured: true,  features: ['IELTS, SAT and PTE — every track','Unlimited full-length mocks','AI speaking scoring','Live exam rooms priority seating','Cancel anytime'] },
  ];
  for (const p of products) {
    await prisma.product.upsert({ where: { slug: p.slug }, create: p as any, update: {} });
  }

  /* ---------- Demo users ---------- */
  const demo = [
    { email: 'demo@coach.bd', password: 'demo1234', name: 'Rina Akter',   tier: 'premium' as const },
    { email: 'free@coach.bd', password: 'free1234', name: 'Arif Hossain', tier: 'free' as const },
  ];
  for (const d of demo) {
    const existing = await prisma.user.findUnique({ where: { email: d.email } });
    if (existing) continue;
    const u = await prisma.user.create({
      data: { email: d.email, passwordHash: await bcrypt.hash(d.password, 10), name: d.name, tier: d.tier },
    });
    await prisma.streak.create({ data: { userId: u.id, currentStreak: 7, longestStreak: 12 } });
  }

  console.log('✅ Seed complete');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
