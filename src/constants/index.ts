export const COMPANY = {
  name: 'MAXIM CODE',
  displayName: 'Maxim Code',
  tagline: 'Building Future Innovators',
  website: 'https://maximcode.app',
  email: 'codemaxim82@gmail.com',
  address: 'Tamil Nadu, India',
  cin: 'MSME Registered',
};

export const FOUNDER = {
  name: 'S. Prashant',
  title: 'Maxim Code',
  company: 'Maxim Code',
};

export const OFFER_SIGNER = {
  name: 'S. Rahul',
  title: 'Sales Executive',
  company: 'Maxim Code',
};

export const DOMAIN_SKILLS: Record<string, string[]> = {
  'Web Development': ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Node.js', 'MongoDB'],
  'App Development': ['Flutter', 'Firebase', 'REST APIs', 'UI/UX Design', 'Dart', 'Mobile Development'],
  'Python': ['Python', 'Automation', 'Data Handling', 'Scripting', 'Libraries & Frameworks', 'Problem Solving'],
  'Digital Marketing': ['SEO', 'Social Media Marketing', 'Analytics', 'Campaign Management', 'Content Strategy', 'Google Ads'],
  'AI/ML': ['Python', 'Machine Learning', 'Data Analytics', 'AI Tools', 'Deep Learning', 'Data Science'],
  'Data Science': ['Python', 'Pandas', 'NumPy', 'Data Visualization', 'Statistical Analysis', 'Machine Learning'],
  'Cybersecurity': ['Network Security', 'Ethical Hacking', 'Penetration Testing', 'Security Protocols', 'Linux', 'Cryptography'],
  'UI/UX Design': ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Wireframing', 'Design Systems'],
  'Cloud Computing': ['AWS', 'Azure', 'GCP', 'DevOps', 'Docker', 'Kubernetes'],
  'Blockchain': ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3.js', 'DeFi', 'Cryptography'],
};

export const DOMAIN_RESPONSIBILITIES: Record<string, string[]> = {
  'Web Development': [
    'Design and develop responsive web applications using modern frameworks and technologies',
    'Write clean, maintainable, and well-documented code following industry best practices',
    'Collaborate with UI/UX designers to implement pixel-perfect frontend interfaces',
    'Integrate RESTful APIs and third-party services into web applications',
    'Perform code reviews, debugging, and optimization of web components',
    'Participate in agile development cycles, sprint planning, and team meetings',
  ],
  'App Development': [
    'Develop cross-platform mobile applications using Flutter and Dart',
    'Integrate Firebase backend services including authentication and real-time database',
    'Implement responsive and intuitive user interface designs following Material Design guidelines',
    'Consume and integrate RESTful APIs for dynamic data fetching',
    'Test, debug, and optimize app performance across multiple devices',
    'Participate in regular stand-ups and contribute to team sprint goals',
  ],
  'Python': [
    'Develop Python scripts for automation, data processing, and workflow optimization',
    'Work with popular Python libraries including Pandas, NumPy, and Matplotlib',
    'Build and maintain data pipelines and automation workflows',
    'Write unit tests and documentation for all developed modules',
    'Collaborate with the team to identify automation opportunities',
    'Present findings and progress reports to senior developers',
  ],
  'Digital Marketing': [
    'Plan and execute digital marketing campaigns across social media platforms',
    'Conduct keyword research and implement on-page and off-page SEO strategies',
    'Analyze marketing data and generate performance reports using Google Analytics',
    'Create engaging content calendars and manage social media accounts',
    'Monitor campaign performance and optimize for maximum ROI',
    'Assist in email marketing campaigns and newsletter management',
  ],
  'AI/ML': [
    'Research, design, and implement machine learning models for real-world applications',
    'Preprocess, clean, and analyze datasets using Python and data science libraries',
    'Evaluate model performance and fine-tune hyperparameters for optimal accuracy',
    'Collaborate on AI-driven projects involving NLP, computer vision, or predictive analytics',
    'Document model architectures, experiments, and results thoroughly',
    'Stay updated with latest AI/ML trends and integrate new techniques into projects',
  ],
};

const getDefaultResponsibilities = (role: string, domain: string): string[] => [
  `Contribute to ${domain} projects under the guidance of senior team members at Maxim Code`,
  `Develop technical skills and apply them to live projects in the ${domain} domain`,
  'Collaborate with cross-functional teams and participate in regular team meetings',
  'Document work progress, technical decisions, and project outcomes',
  'Follow company standards, coding guidelines, and professional best practices',
  'Present weekly progress reports and participate in project reviews',
];

export const getResponsibilitiesForDomain = (domain: string, role: string): string[] => {
  return DOMAIN_RESPONSIBILITIES[domain] || getDefaultResponsibilities(role, domain);
};

export const getSkillsForDomain = (domain: string): string[] => {
  return DOMAIN_SKILLS[domain] || ['Technical Skills', 'Problem Solving', 'Team Collaboration', 'Communication', 'Time Management', 'Professional Development'];
};

export const DOMAINS = Object.keys(DOMAIN_SKILLS);
