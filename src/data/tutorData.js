const makeResource = (topic, sites) => ({
  youtube: ['Full course', 'Beginner tutorial', 'Practice and projects'].map(label => ({
    label: `${topic} ${label}`,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${topic} ${label}`)}`,
  })),
  sites: sites.map((url, index) => ({ label: `${topic} ${['official guide', 'interactive course', 'reference'][index]}`, url })),
})

export const RESOURCE_LIBRARY = {
  JavaScript: makeResource('JavaScript', ['https://javascript.info/', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', 'https://web.dev/learn/javascript']),
  Python: makeResource('Python', ['https://docs.python.org/3/tutorial/', 'https://realpython.com/', 'https://www.kaggle.com/learn/python']),
  Git: makeResource('Git', ['https://git-scm.com/book/en/v2', 'https://skills.github.com/', 'https://www.atlassian.com/git/tutorials']),
  'Data Structures': makeResource('Data Structures', ['https://visualgo.net/en', 'https://cp-algorithms.com/', 'https://www.geeksforgeeks.org/data-structures/']),
  'System Design': makeResource('System Design', ['https://github.com/donnemartin/system-design-primer', 'https://www.educative.io/blog/complete-guide-to-system-design', 'https://highscalability.com/']),
  'REST APIs': makeResource('REST APIs', ['https://developer.mozilla.org/en-US/docs/Glossary/REST', 'https://restfulapi.net/', 'https://swagger.io/resources/articles/best-practices-in-api-design/']),
  Testing: makeResource('Software Testing', ['https://testing-library.com/docs/', 'https://jestjs.io/docs/getting-started', 'https://martinfowler.com/testing/']),
  SQL: makeResource('SQL', ['https://sqlbolt.com/', 'https://mode.com/sql-tutorial/', 'https://www.w3schools.com/sql/']),
  Statistics: makeResource('Statistics', ['https://seeing-theory.brown.edu/', 'https://www.khanacademy.org/math/statistics-probability', 'https://www.statquest.org/']),
  'Machine Learning': makeResource('Machine Learning', ['https://developers.google.com/machine-learning/crash-course', 'https://scikit-learn.org/stable/user_guide.html', 'https://course.fast.ai/']),
  'Data Visualization': makeResource('Data Visualization', ['https://www.data-to-viz.com/', 'https://public.tableau.com/app/learn', 'https://observablehq.com/']),
  'User Research': makeResource('User Research', ['https://www.nngroup.com/articles/user-research-methods/', 'https://www.usability.gov/what-and-why/user-research.html', 'https://www.ideou.com/blogs/inspiration/ux-research']),
  Figma: makeResource('Figma', ['https://help.figma.com/hc/en-us', 'https://www.figma.com/resources/learn-design/', 'https://www.designsystems.com/']),
  Prototyping: makeResource('UX Prototyping', ['https://www.figma.com/resource-library/what-is-prototyping/', 'https://www.nngroup.com/articles/prototyping/', 'https://www.interaction-design.org/literature/topics/prototyping']),
  Accessibility: makeResource('Web Accessibility', ['https://web.dev/learn/accessibility/', 'https://www.w3.org/WAI/fundamentals/accessibility-intro/', 'https://webaim.org/intro/']),
  'Design Systems': makeResource('Design Systems', ['https://designsystemsrepo.com/', 'https://m3.material.io/', 'https://carbondesignsystem.com/']),
  'Product Strategy': makeResource('Product Strategy', ['https://www.productplan.com/glossary/product-strategy/', 'https://www.productschool.com/resources/product-strategy', 'https://www.mindtheproduct.com/']),
  'Data Analysis': makeResource('Data Analysis', ['https://www.khanacademy.org/math/statistics-probability', 'https://www.coursera.org/articles/what-is-data-analysis', 'https://mode.com/sql-tutorial/']),
  Agile: makeResource('Agile Scrum', ['https://www.scrum.org/resources/what-is-scrum', 'https://www.atlassian.com/agile', 'https://agilemanifesto.org/']),
  Linux: makeResource('Linux', ['https://linuxjourney.com/', 'https://linuxcommand.org/', 'https://ubuntu.com/tutorials']),
  Docker: makeResource('Docker', ['https://docs.docker.com/get-started/', 'https://labs.play-with-docker.com/', 'https://docs.docker.com/']),
  Kubernetes: makeResource('Kubernetes', ['https://kubernetes.io/docs/tutorials/', 'https://killercoda.com/kubernetes', 'https://kubernetes.io/docs/home/']),
  AWS: makeResource('AWS Cloud', ['https://aws.amazon.com/getting-started/', 'https://explore.skillbuilder.aws/learn', 'https://aws.amazon.com/training/']),
  'CI/CD': makeResource('CI CD', ['https://docs.github.com/en/actions', 'https://www.jenkins.io/doc/tutorials/', 'https://about.gitlab.com/topics/ci-cd/']),
  Networking: makeResource('Computer Networking', ['https://beej.us/guide/bgnet/', 'https://www.cloudflare.com/learning/network-layer/what-is-the-network-layer/', 'https://skillsforall.com/course/networking-basics']),
  Cryptography: makeResource('Cryptography', ['https://cryptohack.org/', 'https://www.khanacademy.org/computing/computer-science/cryptography', 'https://www.crypto101.io/']),
  'Incident Response': makeResource('Cybersecurity Incident Response', ['https://www.cisa.gov/topics/cyber-threats-and-advisories', 'https://www.sans.org/blog/incident-response/', 'https://attack.mitre.org/']),
  'Deep Learning': makeResource('Deep Learning', ['https://www.deeplearningbook.org/', 'https://course.fast.ai/', 'https://pytorch.org/tutorials/']),
  MLOps: makeResource('MLOps', ['https://ml-ops.org/', 'https://madewithml.com/', 'https://mlflow.org/docs/latest/ml/tracking/']),
  'React Native': makeResource('React Native', ['https://reactnative.dev/docs/getting-started', 'https://expo.dev/learn', 'https://reactnative.dev/docs/tutorial']),
  'UI Design': makeResource('UI Design', ['https://m3.material.io/', 'https://lawsofux.com/', 'https://www.interaction-design.org/literature/topics/ui-design']),
  'Performance Optimization': makeResource('Web Performance Optimization', ['https://web.dev/fast/', 'https://developer.mozilla.org/en-US/docs/Learn/Performance', 'https://pagespeed.web.dev/']),
}

const module = (id, title, duration, topics) => ({ id, title, duration, topics })

export const COURSE_PLANS = {
  swe: {
    title: 'Software Engineering Launch Plan',
    subtitle: 'From coding fundamentals to production-ready systems.',
    modules: [
      module('foundations', 'Build your base', '3 weeks', ['JavaScript', 'Git', 'Data Structures']),
      module('engineering', 'Ship reliable features', '4 weeks', ['REST APIs', 'Testing', 'SQL']),
      module('systems', 'Think at scale', '3 weeks', ['System Design']),
    ],
  },
  ds: {
    title: 'Data Science Launch Plan',
    subtitle: 'Turn questions into analysis, models, and decisions.',
    modules: [
      module('foundations', 'Learn the language of data', '3 weeks', ['Python', 'Statistics', 'SQL']),
      module('insight', 'Find and explain patterns', '4 weeks', ['Machine Learning', 'Data Visualization']),
      module('systems', 'Design data products', '2 weeks', ['System Design']),
    ],
  },
  ux: {
    title: 'UX Design Launch Plan',
    subtitle: 'Move from user questions to thoughtful, tested interfaces.',
    modules: [
      module('research', 'Understand the user', '3 weeks', ['User Research', 'Accessibility']),
      module('craft', 'Make the experience', '4 weeks', ['Figma', 'Prototyping', 'Design Systems']),
    ],
  },
  pm: {
    title: 'Product Management Launch Plan',
    subtitle: 'Practice turning ambiguous problems into focused outcomes.',
    modules: [
      module('discovery', 'Choose the right problem', '3 weeks', ['User Research', 'Data Analysis']),
      module('strategy', 'Set direction', '3 weeks', ['Product Strategy', 'Agile']),
      module('systems', 'Understand the product underneath', '2 weeks', ['System Design']),
    ],
  },
  devops: {
    title: 'DevOps Engineering Launch Plan',
    subtitle: 'Build the habits and infrastructure that keep software moving.',
    modules: [
      module('foundations', 'Own the environment', '3 weeks', ['Linux', 'Networking']),
      module('delivery', 'Automate delivery', '4 weeks', ['Docker', 'CI/CD', 'AWS']),
      module('scale', 'Operate at scale', '3 weeks', ['Kubernetes', 'System Design']),
    ],
  },
  cyber: {
    title: 'Cybersecurity Launch Plan',
    subtitle: 'Build a practical defensive mindset from network to response.',
    modules: [
      module('foundations', 'See the attack surface', '3 weeks', ['Networking', 'Linux']),
      module('defense', 'Protect and investigate', '4 weeks', ['Cryptography', 'Incident Response']),
    ],
  },
  ml: {
    title: 'ML Engineering Launch Plan',
    subtitle: 'Move from model intuition to dependable machine learning systems.',
    modules: [
      module('foundations', 'Learn the math and tools', '4 weeks', ['Python', 'Statistics', 'Machine Learning']),
      module('models', 'Build better models', '4 weeks', ['Deep Learning', 'MLOps']),
      module('systems', 'Design the full pipeline', '2 weeks', ['System Design']),
    ],
  },
  mobile: {
    title: 'Mobile Development Launch Plan',
    subtitle: 'Design, build, test, and ship an app people want to keep using.',
    modules: [
      module('foundations', 'Build the interface', '3 weeks', ['JavaScript', 'UI Design']),
      module('apps', 'Make it feel native', '4 weeks', ['React Native', 'Testing']),
      module('quality', 'Make it fast', '2 weeks', ['Performance Optimization']),
    ],
  },
  'system-design': {
    title: 'System Design Masterclass',
    subtitle: 'Learn how reliable, scalable products are designed from the ground up.',
    modules: [
      module('fundamentals', 'Design fundamentals', '3 weeks', ['System Design', 'Networking']),
      module('building-blocks', 'Use the building blocks', '3 weeks', ['REST APIs', 'SQL', 'Docker']),
      module('case-studies', 'Practice real architectures', '3 weeks', ['Data Structures', 'CI/CD']),
    ],
  },
}