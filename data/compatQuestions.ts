export interface CompatOption {
  label: string;
  /** Group tag for scoring — options with the same tag are "compatible" */
  tag: string;
}

export interface CompatQuestion {
  id: string;
  dimension: string;
  text: string;
  options: CompatOption[];
}

export const DIMENSIONS = [
  "Love Language",
  "Conflict Style",
  "Life Vision",
  "Intimacy",
  "Financial Values",
  "Social Energy",
  "Independence",
  "Growth Mindset",
] as const;

export type Dimension = (typeof DIMENSIONS)[number];

export const DIMENSION_META: Record<
  Dimension,
  { icon: string; color: string; description: string }
> = {
  "Love Language": {
    icon: "💕",
    color: "#ec4899",
    description: "How you give and receive love",
  },
  "Conflict Style": {
    icon: "⚡",
    color: "#f97316",
    description: "How you handle disagreements",
  },
  "Life Vision": {
    icon: "🌅",
    color: "#eab308",
    description: "Where you see your future",
  },
  Intimacy: {
    icon: "🔥",
    color: "#ef4444",
    description: "Physical and emotional closeness",
  },
  "Financial Values": {
    icon: "💰",
    color: "#22c55e",
    description: "How you think about money",
  },
  "Social Energy": {
    icon: "🎭",
    color: "#3b82f6",
    description: "Your social needs and style",
  },
  Independence: {
    icon: "🦋",
    color: "#8b5cf6",
    description: "Togetherness vs personal space",
  },
  "Growth Mindset": {
    icon: "🌱",
    color: "#14b8a6",
    description: "How you approach change and growth",
  },
};

// ── Questions ────────────────────────────────────────────────────

export const compatQuestions: CompatQuestion[] = [
  // ── Love Language (10) ────────────────────────────────────────
  {
    id: "ll1",
    dimension: "Love Language",
    text: "When you've had a terrible day, what would make you feel most loved?",
    options: [
      { label: "A long hug without words", tag: "touch" },
      { label: 'Hearing "I\'m proud of you"', tag: "words" },
      { label: "Them taking a task off your plate", tag: "service" },
      { label: "A surprise gift, even something small", tag: "gifts" },
      { label: "Undivided attention over dinner", tag: "time" },
    ],
  },
  {
    id: "ll2",
    dimension: "Love Language",
    text: "How do you most naturally show love to your partner?",
    options: [
      { label: "Physical affection — holding hands, hugging", tag: "touch" },
      { label: "Saying how I feel — compliments, encouragement", tag: "words" },
      { label: "Doing things for them — cooking, errands", tag: "service" },
      { label: "Picking out thoughtful gifts", tag: "gifts" },
      { label: "Spending focused time together", tag: "time" },
    ],
  },
  {
    id: "ll3",
    dimension: "Love Language",
    text: "Which of these would hurt the most if it was missing?",
    options: [
      { label: "No physical closeness for weeks", tag: "touch" },
      { label: "Never hearing words of appreciation", tag: "words" },
      { label: "My partner never helping around the house", tag: "service" },
      { label: "Never receiving a thoughtful gift", tag: "gifts" },
      { label: "My partner always being distracted around me", tag: "time" },
    ],
  },
  {
    id: "ll4",
    dimension: "Love Language",
    text: "Your partner wants to celebrate your birthday. What means the most?",
    options: [
      { label: "A slow dance in the living room", tag: "touch" },
      { label: "A handwritten letter about what I mean to them", tag: "words" },
      { label: "They handle everything so I can relax", tag: "service" },
      { label: "A meaningful, personal gift", tag: "gifts" },
      { label: "A full day with no plans, just us", tag: "time" },
    ],
  },
  {
    id: "ll5",
    dimension: "Love Language",
    text: "What makes you feel most connected after being apart?",
    options: [
      { label: "A warm embrace the moment we reunite", tag: "touch" },
      { label: 'Hearing them say "I missed you"', tag: "words" },
      { label: "Coming home to a meal they prepared", tag: "service" },
      { label: "A small souvenir or surprise they brought", tag: "gifts" },
      { label: "Sitting together catching up for hours", tag: "time" },
    ],
  },
  {
    id: "ll6",
    dimension: "Love Language",
    text: "When you're stressed, what helps you feel supported?",
    options: [
      { label: "Being held quietly", tag: "touch" },
      { label: "Reassuring words and encouragement", tag: "words" },
      { label: "My partner stepping in to help", tag: "service" },
      { label: "A care package or comfort item", tag: "gifts" },
      { label: "Them sitting with me, fully present", tag: "time" },
    ],
  },
  {
    id: "ll7",
    dimension: "Love Language",
    text: "What kind of everyday moment makes you smile?",
    options: [
      { label: "A random kiss on the forehead", tag: "touch" },
      { label: "A sweet text in the middle of the day", tag: "words" },
      { label: "Finding out they did a chore I was dreading", tag: "service" },
      { label: "A little treat left on my desk", tag: "gifts" },
      { label: "Them putting their phone away to be with me", tag: "time" },
    ],
  },
  {
    id: "ll8",
    dimension: "Love Language",
    text: "Which gesture from a partner would you remember for years?",
    options: [
      { label: "A slow, meaningful embrace during a hard time", tag: "touch" },
      { label: "A speech they gave about our relationship", tag: "words" },
      { label: "Them quietly solving a huge problem for me", tag: "service" },
      { label: "A gift that showed they truly know me", tag: "gifts" },
      { label: "An unplanned adventure just the two of us", tag: "time" },
    ],
  },
  {
    id: "ll9",
    dimension: "Love Language",
    text: "In a perfect evening together, what matters most?",
    options: [
      { label: "Cuddling on the couch", tag: "touch" },
      { label: "Deep, meaningful conversation", tag: "words" },
      { label: "Them cooking my favorite meal", tag: "service" },
      { label: "Exchanging small, meaningful presents", tag: "gifts" },
      { label: "Going somewhere new together", tag: "time" },
    ],
  },
  {
    id: "ll10",
    dimension: "Love Language",
    text: "What makes you feel most secure in a relationship?",
    options: [
      { label: "Consistent physical closeness", tag: "touch" },
      { label: "Hearing that I'm valued regularly", tag: "words" },
      { label: "Seeing my partner invest effort in us", tag: "service" },
      { label: "Receiving tokens of thoughtfulness", tag: "gifts" },
      { label: "Quality time without distractions", tag: "time" },
    ],
  },

  // ── Conflict Style (8) ────────────────────────────────────────
  {
    id: "cs1",
    dimension: "Conflict Style",
    text: "When your partner says something that hurts you, your first instinct is to:",
    options: [
      { label: "Tell them immediately how it made me feel", tag: "confront" },
      { label: "Go quiet and process it alone first", tag: "withdraw" },
      { label: "Deflect with humor or change the subject", tag: "avoid" },
      { label: "Ask them to explain what they meant", tag: "clarify" },
    ],
  },
  {
    id: "cs2",
    dimension: "Conflict Style",
    text: "During an argument, you're most likely to:",
    options: [
      { label: "Stand my ground and express my position", tag: "confront" },
      { label: "Shut down and need space", tag: "withdraw" },
      { label: "Try to smooth things over quickly", tag: "avoid" },
      { label: "Pause and try to understand their side", tag: "clarify" },
    ],
  },
  {
    id: "cs3",
    dimension: "Conflict Style",
    text: "After a disagreement, what do you need most?",
    options: [
      { label: "To talk it through until it's resolved", tag: "confront" },
      { label: "Alone time before reconnecting", tag: "withdraw" },
      { label: "To move on and not dwell on it", tag: "avoid" },
      { label: "A calm debrief about what happened", tag: "clarify" },
    ],
  },
  {
    id: "cs4",
    dimension: "Conflict Style",
    text: "When you disagree about something important, you prefer to:",
    options: [
      { label: "Hash it out right now", tag: "confront" },
      { label: "Take time to think before discussing", tag: "withdraw" },
      { label: "Compromise quickly to keep the peace", tag: "avoid" },
      { label: "Write down my thoughts before talking", tag: "clarify" },
    ],
  },
  {
    id: "cs5",
    dimension: "Conflict Style",
    text: "What frustrates you most during a conflict?",
    options: [
      { label: "When my partner won't engage", tag: "confront" },
      { label: "When I'm not given space to process", tag: "withdraw" },
      { label: "When small issues become big fights", tag: "avoid" },
      { label: "When emotions override logic", tag: "clarify" },
    ],
  },
  {
    id: "cs6",
    dimension: "Conflict Style",
    text: "How do you typically apologize?",
    options: [
      { label: "Directly — I say exactly what I did wrong", tag: "confront" },
      { label: "Quietly — through actions more than words", tag: "withdraw" },
      { label: "Quickly — I want to restore harmony fast", tag: "avoid" },
      { label: "Thoughtfully — after reflecting on what happened", tag: "clarify" },
    ],
  },
  {
    id: "cs7",
    dimension: "Conflict Style",
    text: "Your partner brings up something you did that bothered them. You:",
    options: [
      { label: "Share my perspective right away", tag: "confront" },
      { label: "Feel overwhelmed and need a moment", tag: "withdraw" },
      { label: "Apologize and try to move forward", tag: "avoid" },
      { label: "Ask questions to fully understand", tag: "clarify" },
    ],
  },
  {
    id: "cs8",
    dimension: "Conflict Style",
    text: "What's your ideal way to resolve tension?",
    options: [
      { label: "Open, honest confrontation", tag: "confront" },
      { label: "Cool off separately, then reconnect", tag: "withdraw" },
      { label: "Let it go if it's not critical", tag: "avoid" },
      { label: "Structured conversation with active listening", tag: "clarify" },
    ],
  },

  // ── Life Vision (8) ───────────────────────────────────────────
  {
    id: "lv1",
    dimension: "Life Vision",
    text: "In 5 years, what matters most to you?",
    options: [
      { label: "Career advancement and professional growth", tag: "career" },
      { label: "Starting or growing a family", tag: "family" },
      { label: "Travel, adventure, and new experiences", tag: "adventure" },
      { label: "Financial security and stability", tag: "security" },
      { label: "Creative pursuits and personal passions", tag: "creative" },
    ],
  },
  {
    id: "lv2",
    dimension: "Life Vision",
    text: "Where would you ideally live long-term?",
    options: [
      { label: "A vibrant city with lots of energy", tag: "city" },
      { label: "A quiet suburb with family nearby", tag: "suburb" },
      { label: "Somewhere rural and peaceful", tag: "rural" },
      { label: "Wherever the best opportunities are", tag: "flexible" },
      { label: "Multiple places — I want variety", tag: "nomad" },
    ],
  },
  {
    id: "lv3",
    dimension: "Life Vision",
    text: "How important is having children to you?",
    options: [
      { label: "It's my biggest dream", tag: "children-yes" },
      { label: "I'd like to, but I'm flexible on timing", tag: "children-open" },
      { label: "I'm genuinely unsure", tag: "children-unsure" },
      { label: "I'm leaning toward not having children", tag: "children-no" },
      { label: "I definitely don't want children", tag: "children-never" },
    ],
  },
  {
    id: "lv4",
    dimension: "Life Vision",
    text: "What does retirement look like for you?",
    options: [
      { label: "Travelling the world", tag: "adventure" },
      { label: "A quiet life surrounded by family", tag: "family" },
      { label: "Still working on passion projects", tag: "creative" },
      { label: "Financial freedom, no stress", tag: "security" },
      { label: "I don't think about retirement much", tag: "present" },
    ],
  },
  {
    id: "lv5",
    dimension: "Life Vision",
    text: "How do you feel about relocating for opportunities?",
    options: [
      { label: "Absolutely — growth requires flexibility", tag: "flexible" },
      { label: "Maybe, if the opportunity is big enough", tag: "open" },
      { label: "I'd prefer to stay near community and family", tag: "rooted" },
      { label: "Only if we both agree and it benefits us", tag: "together" },
    ],
  },
  {
    id: "lv6",
    dimension: "Life Vision",
    text: "What role does faith or spirituality play in your life?",
    options: [
      { label: "It's central to who I am", tag: "central" },
      { label: "It matters but isn't everything", tag: "moderate" },
      { label: "I'm spiritual but not religious", tag: "spiritual" },
      { label: "It's not really part of my life", tag: "secular" },
    ],
  },
  {
    id: "lv7",
    dimension: "Life Vision",
    text: "How ambitious are you professionally?",
    options: [
      { label: "Very — I want to reach the top of my field", tag: "career" },
      { label: "Moderately — I want success but also balance", tag: "balanced" },
      { label: "I prioritize life over career", tag: "life-first" },
      { label: "I'm entrepreneurial — I want to build something", tag: "creative" },
    ],
  },
  {
    id: "lv8",
    dimension: "Life Vision",
    text: "What's your ideal family structure?",
    options: [
      { label: "Nuclear family — just us and our children", tag: "nuclear" },
      { label: "Extended family nearby, deeply involved", tag: "extended" },
      { label: "Chosen family — close friends included", tag: "chosen" },
      { label: "Just us — partner-focused", tag: "partner" },
    ],
  },

  // ── Intimacy (8) ──────────────────────────────────────────────
  {
    id: "in1",
    dimension: "Intimacy",
    text: "How important is physical intimacy to you in a relationship?",
    options: [
      { label: "Extremely — it's how I feel most connected", tag: "high" },
      { label: "Very important, but not everything", tag: "important" },
      { label: "Moderate — I need it but not constantly", tag: "moderate" },
      { label: "It's nice but not a priority", tag: "low" },
    ],
  },
  {
    id: "in2",
    dimension: "Intimacy",
    text: "How do you feel about initiating intimacy?",
    options: [
      { label: "I love initiating and do it often", tag: "initiator" },
      { label: "I initiate sometimes, but prefer signals", tag: "balanced" },
      { label: "I prefer my partner to initiate", tag: "receiver" },
      { label: "I'm comfortable either way", tag: "flexible" },
    ],
  },
  {
    id: "in3",
    dimension: "Intimacy",
    text: "Emotional intimacy and physical intimacy — how are they connected for you?",
    options: [
      { label: "Physical closeness leads to emotional closeness", tag: "physical-first" },
      { label: "Emotional connection must come first", tag: "emotional-first" },
      { label: "They're equally important and feed each other", tag: "balanced" },
      { label: "They're somewhat separate for me", tag: "separate" },
    ],
  },
  {
    id: "in4",
    dimension: "Intimacy",
    text: "How comfortable are you talking about your intimate needs?",
    options: [
      { label: "Very — I'm open and direct", tag: "open" },
      { label: "Somewhat — I can if my partner makes space", tag: "needs-safety" },
      { label: "It's hard for me to bring it up", tag: "reserved" },
      { label: "I prefer to show rather than tell", tag: "action" },
    ],
  },
  {
    id: "in5",
    dimension: "Intimacy",
    text: "What does non-sexual intimacy look like for you?",
    options: [
      { label: "Cuddling, holding hands, physical closeness", tag: "physical" },
      { label: "Deep conversations and emotional sharing", tag: "emotional" },
      { label: "Shared activities and experiences", tag: "experiential" },
      { label: "All of the above, equally", tag: "all" },
    ],
  },
  {
    id: "in6",
    dimension: "Intimacy",
    text: "How do you feel when there's a dry spell in physical intimacy?",
    options: [
      { label: "I become anxious and need to address it", tag: "high" },
      { label: "I notice but can be patient", tag: "important" },
      { label: "It doesn't bother me much", tag: "low" },
      { label: "I focus on emotional connection instead", tag: "emotional-first" },
    ],
  },
  {
    id: "in7",
    dimension: "Intimacy",
    text: "How important is novelty and variety in your intimate life?",
    options: [
      { label: "Very — I like exploring and trying new things", tag: "adventurous" },
      { label: "Some variety is nice, but comfort matters more", tag: "balanced" },
      { label: "I prefer consistency and familiarity", tag: "consistent" },
      { label: "I'm open to whatever my partner enjoys", tag: "flexible" },
    ],
  },
  {
    id: "in8",
    dimension: "Intimacy",
    text: "What makes you feel most desired?",
    options: [
      { label: "Being told explicitly how attractive I am", tag: "verbal" },
      { label: "Physical gestures — a lingering touch, a look", tag: "physical" },
      { label: "My partner making the first move", tag: "initiative" },
      { label: "Thoughtful romantic gestures", tag: "romantic" },
    ],
  },

  // ── Financial Values (6) ──────────────────────────────────────
  {
    id: "fv1",
    dimension: "Financial Values",
    text: "You both receive an unexpected $5,000. You'd want to:",
    options: [
      { label: "Save most of it", tag: "saver" },
      { label: "Split between saving and a shared experience", tag: "balanced" },
      { label: "Invest it", tag: "investor" },
      { label: "Use it for something we've been wanting", tag: "spender" },
      { label: "Discuss together before deciding", tag: "collaborative" },
    ],
  },
  {
    id: "fv2",
    dimension: "Financial Values",
    text: "How do you feel about sharing finances as a couple?",
    options: [
      { label: "Everything should be joint", tag: "joint" },
      { label: "Mostly joint with some personal spending money", tag: "mostly-joint" },
      { label: "Split 50/50 with separate accounts", tag: "separate" },
      { label: "Proportional to income, with some independence", tag: "proportional" },
    ],
  },
  {
    id: "fv3",
    dimension: "Financial Values",
    text: "What's your approach to spending on experiences vs. things?",
    options: [
      { label: "Experiences every time — travel, dinners, events", tag: "experiences" },
      { label: "A mix, but I lean toward experiences", tag: "experience-lean" },
      { label: "I value quality things that last", tag: "things" },
      { label: "I'm frugal — I'd rather save than spend on either", tag: "saver" },
    ],
  },
  {
    id: "fv4",
    dimension: "Financial Values",
    text: "How do you feel about debt?",
    options: [
      { label: "Avoid it completely — no debt ever", tag: "debt-free" },
      { label: "Some debt is fine if managed wisely", tag: "strategic" },
      { label: "It's a normal part of life", tag: "comfortable" },
      { label: "I haven't thought about it much", tag: "unaware" },
    ],
  },
  {
    id: "fv5",
    dimension: "Financial Values",
    text: "How do you feel about supporting extended family financially?",
    options: [
      { label: "It's my duty and I do it gladly", tag: "generous" },
      { label: "Within reason, as long as it doesn't hurt us", tag: "balanced" },
      { label: "Only in emergencies", tag: "cautious" },
      { label: "Our household comes first, always", tag: "self-first" },
    ],
  },
  {
    id: "fv6",
    dimension: "Financial Values",
    text: "What does financial success look like to you?",
    options: [
      { label: "Freedom — enough to not worry", tag: "freedom" },
      { label: "Wealth — building significant assets", tag: "wealth" },
      { label: "Comfort — a nice life without excess", tag: "comfort" },
      { label: "Generosity — enough to give back", tag: "generous" },
    ],
  },

  // ── Social Energy (6) ─────────────────────────────────────────
  {
    id: "se1",
    dimension: "Social Energy",
    text: "After a long week, your ideal weekend is:",
    options: [
      { label: "Hosting friends or going to a gathering", tag: "extrovert" },
      { label: "A quiet evening just the two of us", tag: "introvert" },
      { label: "Something social on Saturday, quiet on Sunday", tag: "ambivert" },
      { label: "Solo time to recharge, then partner time", tag: "solo-first" },
    ],
  },
  {
    id: "se2",
    dimension: "Social Energy",
    text: "How often do you like socializing with other people?",
    options: [
      { label: "Multiple times a week — I thrive on it", tag: "extrovert" },
      { label: "Once or twice a week is about right", tag: "ambivert" },
      { label: "A few times a month is plenty", tag: "introvert" },
      { label: "Rarely — I prefer intimate settings", tag: "deep-introvert" },
    ],
  },
  {
    id: "se3",
    dimension: "Social Energy",
    text: "How do you feel about your partner having close friends of the opposite gender?",
    options: [
      { label: "Completely fine — trust is everything", tag: "trusting" },
      { label: "Fine as long as boundaries are clear", tag: "boundaried" },
      { label: "It makes me a little uncomfortable", tag: "cautious" },
      { label: "I'd prefer they didn't", tag: "traditional" },
    ],
  },
  {
    id: "se4",
    dimension: "Social Energy",
    text: "How important are couple friendships (other couples you hang out with)?",
    options: [
      { label: "Very — I love having a social circle together", tag: "extrovert" },
      { label: "Nice to have, but not essential", tag: "ambivert" },
      { label: "Not really my thing", tag: "introvert" },
      { label: "I prefer each of us having our own friends", tag: "independent" },
    ],
  },
  {
    id: "se5",
    dimension: "Social Energy",
    text: "How do you feel about spontaneous social plans?",
    options: [
      { label: "Love them — the more the merrier", tag: "extrovert" },
      { label: "Depends on my energy that day", tag: "ambivert" },
      { label: "I prefer planned outings with notice", tag: "introvert" },
      { label: "I'd rather stay home", tag: "deep-introvert" },
    ],
  },
  {
    id: "se6",
    dimension: "Social Energy",
    text: "How do you recharge after social events?",
    options: [
      { label: "I'm already energized — I could keep going", tag: "extrovert" },
      { label: "A little quiet time and I'm good", tag: "ambivert" },
      { label: "I need significant alone time", tag: "introvert" },
      { label: "I need quiet time with just my partner", tag: "partner-recharge" },
    ],
  },

  // ── Independence (6) ──────────────────────────────────────────
  {
    id: "id1",
    dimension: "Independence",
    text: "How much alone time do you need in a relationship?",
    options: [
      { label: "Very little — I prefer being together", tag: "together" },
      { label: "Some — a few hours a week", tag: "balanced" },
      { label: "A lot — I need regular solo time", tag: "independent" },
      { label: "It depends on the week and my stress level", tag: "flexible" },
    ],
  },
  {
    id: "id2",
    dimension: "Independence",
    text: "How do you feel about separate hobbies and interests?",
    options: [
      { label: "I'd love for us to share most hobbies", tag: "together" },
      { label: "Some shared, some separate is ideal", tag: "balanced" },
      { label: "Having our own things keeps us interesting", tag: "independent" },
      { label: "We should support each other's passions even if separate", tag: "supportive" },
    ],
  },
  {
    id: "id3",
    dimension: "Independence",
    text: "How much do you want to know about your partner's daily life?",
    options: [
      { label: "Everything — I want to hear every detail", tag: "together" },
      { label: "The highlights and the important stuff", tag: "balanced" },
      { label: "What they choose to share — I don't need it all", tag: "independent" },
      { label: "I check in, but I respect their space", tag: "respectful" },
    ],
  },
  {
    id: "id4",
    dimension: "Independence",
    text: "How do you feel about solo trips (without your partner)?",
    options: [
      { label: "I wouldn't enjoy a trip without them", tag: "together" },
      { label: "Occasionally fine, but I'd miss them", tag: "balanced" },
      { label: "Healthy and important — I'd encourage it", tag: "independent" },
      { label: "It depends on how long and where", tag: "flexible" },
    ],
  },
  {
    id: "id5",
    dimension: "Independence",
    text: "How much should partners consult each other on decisions?",
    options: [
      { label: "Almost everything — we're a team", tag: "together" },
      { label: "Big decisions together, small ones independently", tag: "balanced" },
      { label: "We trust each other to make our own calls", tag: "independent" },
      { label: "It depends on how it affects the other person", tag: "contextual" },
    ],
  },
  {
    id: "id6",
    dimension: "Independence",
    text: "What's your ideal evening routine?",
    options: [
      { label: "Doing everything together — cooking, watching, talking", tag: "together" },
      { label: "Some time together, some doing our own thing in the same room", tag: "parallel" },
      { label: "Each doing our own thing, then coming together before bed", tag: "independent" },
      { label: "It changes — some nights together, some apart", tag: "flexible" },
    ],
  },

  // ── Growth Mindset (6) ────────────────────────────────────────
  {
    id: "gm1",
    dimension: "Growth Mindset",
    text: "How do you feel about couples therapy?",
    options: [
      { label: "Everyone should do it — it's maintenance, not a fix", tag: "proactive" },
      { label: "I'm open to it if we needed it", tag: "open" },
      { label: "Only as a last resort", tag: "reluctant" },
      { label: "I'd prefer we work things out ourselves", tag: "self-reliant" },
    ],
  },
  {
    id: "gm2",
    dimension: "Growth Mindset",
    text: "When your partner gives you constructive feedback, you typically:",
    options: [
      { label: "Welcome it — I want to grow", tag: "proactive" },
      { label: "Listen but need time to process", tag: "open" },
      { label: "Get defensive at first, but come around", tag: "defensive" },
      { label: "Feel hurt — I take it personally", tag: "sensitive" },
    ],
  },
  {
    id: "gm3",
    dimension: "Growth Mindset",
    text: "How important is personal development to you?",
    options: [
      { label: "Central to my life — I'm always learning", tag: "proactive" },
      { label: "Important, but I'm not obsessive about it", tag: "moderate" },
      { label: "I grow naturally through life experience", tag: "organic" },
      { label: "I'm happy with who I am", tag: "content" },
    ],
  },
  {
    id: "gm4",
    dimension: "Growth Mindset",
    text: "How do you handle being wrong?",
    options: [
      { label: "I admit it quickly and learn from it", tag: "proactive" },
      { label: "I can admit it, but it takes a moment", tag: "open" },
      { label: "I struggle with it but I try", tag: "defensive" },
      { label: "I rarely think I'm wrong", tag: "resistant" },
    ],
  },
  {
    id: "gm5",
    dimension: "Growth Mindset",
    text: "How do you feel about reading relationship books or listening to podcasts together?",
    options: [
      { label: "Love it — let's grow together", tag: "proactive" },
      { label: "I'd try it if my partner wanted to", tag: "open" },
      { label: "Not my style, but I respect it", tag: "neutral" },
      { label: "Prefer to figure things out naturally", tag: "organic" },
    ],
  },
  {
    id: "gm6",
    dimension: "Growth Mindset",
    text: "What's your attitude toward change?",
    options: [
      { label: "I embrace it — growth requires change", tag: "proactive" },
      { label: "I adapt when needed, but prefer stability", tag: "moderate" },
      { label: "I resist it at first but eventually adjust", tag: "slow" },
      { label: "I value consistency and routine", tag: "consistent" },
    ],
  },
];

/** Get questions for a specific dimension */
export function getDimensionQuestions(dimension: Dimension): CompatQuestion[] {
  return compatQuestions.filter((q) => q.dimension === dimension);
}
