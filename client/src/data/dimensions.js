export const dimensions = [
  {
    id: 'leadership',
    name: 'Leadership & Governance',
    icon: '👥',
    description: 'Clear accountability, transparent processes, and commitment from leadership',
    questions: [
      { id: 'l1', text: 'We have a designated person or team responsible for AI strategy' },
      { id: 'l2', text: 'AI decisions are made through a clear, documented process' },
      { id: 'l3', text: 'Leadership actively discusses AI in regular meetings' },
      { id: 'l4', text: 'We involve teachers, parents, and students in AI governance' },
    ],
  },
  {
    id: 'policy',
    name: 'Policy & Ethics',
    icon: '📋',
    description: 'Written guidelines for AI use with clear ethical boundaries',
    questions: [
      { id: 'p1', text: 'We have a published AI acceptable use policy for staff' },
      { id: 'p2', text: 'We have clear academic integrity guidelines for AI use' },
      { id: 'p3', text: 'Student data protection is addressed when using AI tools' },
      { id: 'p4', text: 'We review and update our AI policies regularly' },
    ],
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure & Resources',
    icon: '🔧',
    description: 'Technical foundation and financial commitment for AI adoption',
    questions: [
      { id: 'i1', text: 'Our internet connectivity reliably supports AI-powered tools' },
      { id: 'i2', text: 'Staff and students have adequate device access' },
      { id: 'i3', text: 'We have dedicated budget for AI tools and training' },
      { id: 'i4', text: 'We have a process for evaluating and procuring AI solutions' },
    ],
  },
  {
    id: 'capacity',
    name: 'Staff Capacity',
    icon: '🎓',
    description: 'Teachers have knowledge, skills, and confidence to use AI effectively',
    questions: [
      { id: 'c1', text: 'Staff have received formal AI training' },
      { id: 'c2', text: 'Teachers feel confident using AI for planning and feedback' },
      { id: 'c3', text: 'Staff can critically evaluate AI outputs' },
      { id: 'c4', text: 'We have support structures when teachers encounter AI challenges' },
    ],
  },
  {
    id: 'curriculum',
    name: 'Curriculum & Pedagogy',
    icon: '📚',
    description: 'AI meaningfully integrated into teaching and learning',
    questions: [
      { id: 'cu1', text: 'AI is addressed somewhere in our curriculum' },
      { id: 'cu2', text: 'Students learn WITH AI, ABOUT AI, and TO EVALUATE AI' },
      { id: 'cu3', text: 'Our assessments have been redesigned for the AI era' },
      { id: 'cu4', text: 'AI is transforming pedagogy, not just replacing existing tools' },
    ],
  },
];

export const quickWins = {
  leadership: [
    'Designate an AI lead (even a part-time role)',
    'Add AI to your standing leadership meeting agenda',
    'Create a simple decision-making flowchart for new AI tools',
  ],
  policy: [
    'Adapt an existing AI acceptable use template for your school',
    'Run a staff session on academic integrity and AI',
    'Audit which AI tools are currently in use and what data they access',
  ],
  infrastructure: [
    'Test your bandwidth with AI tools during peak hours',
    'Survey current device availability across staff and students',
    'Create an inventory of AI tools already in use at your school',
  ],
  capacity: [
    'Start a voluntary AI exploration group for interested staff',
    'Share one AI tool demo per staff meeting',
    'Partner with another school that is further along in AI adoption',
  ],
  curriculum: [
    'Pilot AI integration in one subject area this term',
    'Redesign one assessment to be AI-appropriate',
    'Run a student AI literacy workshop',
  ],
};

export const readinessLevels = [
  { min: 0, max: 40, label: 'Foundation Building', color: '#ef4444', description: 'Focus on governance and policy first' },
  { min: 41, max: 60, label: 'Early Adoption', color: '#f97316', description: 'Build staff capacity while strengthening infrastructure' },
  { min: 61, max: 80, label: 'Active Implementation', color: '#eab308', description: "Scale what's working; address remaining gaps" },
  { min: 81, max: 100, label: 'Transformation', color: '#22c55e', description: 'Lead innovation; share learning with others' },
];

export const likertLabels = {
  1: 'Strongly Disagree',
  2: 'Disagree',
  3: 'Neutral',
  4: 'Agree',
  5: 'Strongly Agree',
};
