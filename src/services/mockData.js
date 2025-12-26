
export const ROLES = ['PL', 'AA', 'TA', 'DA', 'Developer', 'Designer'];
export const SKILLS = ['Java', 'Python', 'React', 'Node.js', 'AWS', 'TensorFlow', 'Figma', 'SQL', 'Spring Boot'];
export const LEVELS = ['Junior', 'Middle', 'Senior', 'Expert'];

// Helper to generate random data
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate People
export const generatePeople = (count = 50) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `P${i + 1}`,
    name: `Employee ${i + 1}`,
    role: getRandom(ROLES),
    type: Math.random() > 0.8 ? 'External' : 'Internal', // 20% External probability
    level: getRandom(LEVELS),
    department: getRandom(['Platform Team', 'AI Research', 'Service Dev', 'Data Ops', 'UX Studio']),
    email: `employee${i + 1}@knowlearn.com`,
    photo: `https://ui-avatars.com/api/?name=Employee+${i + 1}&background=random&color=fff`,
    skills: Array.from({ length: getRandomInt(2, 5) }, () => getRandom(SKILLS)).filter((v, i, a) => a.indexOf(v) === i),
    availability: getRandomInt(0, 100), // % available
    salary: getRandomInt(4000, 12000), // Monthly cost unit
    projectHistory: getRandomInt(1, 10),
    performanceRating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
    riskFactor: Math.random() > 0.8 ? 'High' : 'Low', // Simple risk
    selfIntro: "I am a passionate engineer dedicated to building scalable and efficient software solutions. Always eager to learn new technologies and apply them to solve real-world problems.",
    experience: [
      { company: "Tech Solutions Inc.", role: "Senior Developer", duration: "2019 - Present" },
      { company: "WebCorp", role: "Junior Developer", duration: "2016 - 2019" }
    ],
    // Expanded for search filtering
    projectExperienceList: Array.from({ length: getRandomInt(1, 4) }, () => `Project ${getRandom(['Alpha', 'Beta', 'Gamma', 'Delta'])}`),
    certifications: Array.from({ length: getRandomInt(0, 3) }, () => getRandom(['AWS SA', 'CKA', 'PMP', 'Google Cloud DE', 'CISSP'])).filter((v, i, a) => a.indexOf(v) === i),
    availableFrom: `2024-${getRandomInt(1, 12).toString().padStart(2, '0')}-${getRandomInt(1, 28).toString().padStart(2, '0')}`,
    education: "Computer Science, Seoul National University (2012-2016)"
  }));
};

// Generate Projects
export const generateProjects = (count = 10) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `PRJ${i + 1}`,
    name: `Project Alpha ${i + 1}`,
    requiredRole: getRandom(ROLES),
    requiredMM: getRandomInt(10, 50),
    budget: getRandomInt(100000, 500000),
    startDate: `2024-${getRandomInt(1, 12).toString().padStart(2, '0')}-01`,
    duration: getRandomInt(3, 12), // months
    status: getRandom(['Planning', 'Active', 'Completed']),
    risks: {
      schedule: getRandomInt(20, 90),
      cost: getRandomInt(20, 90),
      manpower: getRandomInt(20, 90),
      technical: getRandomInt(20, 90),
      external: getRandomInt(20, 90)
    }
  }));
};

export const MOCK_PEOPLE = generatePeople(50);
export const MOCK_PROJECTS = generateProjects(12);

export const STRATEGIES = {
  INTERNAL: 'Internal Focus',
  OUTSOURCE: 'Outsource Mix',
  COST_OP: 'Cost Optimized'
};

// Simulation Logic (Mock)
export const runSimulation = (strategy, params) => {
  // Returns mock results based on strategy
  const baseCost = 1000000;
  let cost, risk, fulfillment;

  switch (strategy) {
    case STRATEGIES.INTERNAL:
      cost = baseCost * 1.2;
      risk = 20;
      fulfillment = 85;
      break;
    case STRATEGIES.OUTSOURCE:
      cost = baseCost * 0.9;
      risk = 60;
      fulfillment = 98;
      break;
    case STRATEGIES.COST_OP:
      cost = baseCost * 0.8;
      risk = 75;
      fulfillment = 90;
      break;
    default:
      cost = baseCost;
      risk = 50;
      fulfillment = 90;
  }

  // Adjust by params
  if (params.budgetLimit) {
    cost = Math.min(cost, params.budgetLimit);
  }

  return {
    strategy,
    totalCost: Math.round(cost),
    riskIndex: risk,
    fulfillmentRate: fulfillment,
    bottlenecks: ['Java Senior', 'PL'],
    recommended: risk < 40
  };
};

// AI Agent Mock Data
export const AI_SUGGESTIONS = [
  "다음 분기 PL급 인력 부족 위험이 있나요?",
  "Project Alpha 3에 적합한 대체 인력을 추천해줘",
  "현재 외주 비중을 줄이면서 비용을 절감할 방법은?"
];

export const AI_RESPONSES = {
  "default": {
    summary: "질문에 대한 분석 결과입니다.",
    evidence: "관련 데이터 없음",
    risk: "판단 불가",
    alternative: "질문을 구체화해주세요."
  },
  "다음 분기 PL급 인력 부족 위험이 있나요?": {
    summary: "네, 3분기에 PL급 인력 2명이 부족할 것으로 예상됩니다.",
    evidence: "현재 가용 PL: 5명, 3분기 필요 PL: 7명 (신규 프로젝트 2건 예정)",
    risk: "Project Beta, Gamma 착수 지연 가능성 (Risk Index: High)",
    alternative: "1. Senior 개발자 2명 PL 승급 교육 진행\n2. 프리랜서 PL 2명 3개월 단기 계약"
  },
  "Project Alpha 3에 적합한 대체 인력을 추천해줘": {
    summary: "김철수(Senior Java)가 가장 적합한 대체 인력입니다.",
    evidence: "적합도 92%, 유사 프로젝트 경험 3회, 현재 가용성 100%",
    risk: "기존 팀과의 협업 경험 부재",
    alternative: "이영희(Middle) 투입 시 멘토링 필요 (비용 15% 절감 가능)"
  },
  "현재 외주 비중을 줄이면서 비용을 절감할 방법은?": {
    summary: "내부 주니어 인력 활용 비중을 20% 늘리는 것을 제안합니다.",
    evidence: "현재 외주 비중 12.5%, 주니어 가동률 60% (여유 있음)",
    risk: "초기 생산성 저하 우려 (약 2주 적응 기간)",
    alternative: "비핵심 모듈 개발에 내부 주니어 3명 우선 투입 시 월 1,500만원 절감"
  }
};

// Generate Partners
export const generatePartners = (count = 15) => {
  const specialties = ['SI/SM', 'Cloud Infra', 'AI/Data', 'UX/UI Design', 'Mobile App'];
  const tiers = ['Tier 1 (Strategic)', 'Tier 2 (Preferred)', 'Tier 3 (General)'];

  return Array.from({ length: count }, (_, i) => ({
    id: `PTN${i + 1}`,
    name: `Partner Corp ${i + 1}`,
    specialty: getRandom(specialties),
    tier: getRandom(tiers),
    availableDevelopers: getRandomInt(5, 50),
    rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 ~ 5.0
    contractStatus: Math.random() > 0.3 ? 'Active' : 'Expired',
    description: "Specialized in enterprise system integration and cloud migration services.",
    contact: `contact@partner${i + 1}.com`,
    address: "Seoul, Samsung-dong, Trade Tower " + (i + 1) + "F",
    foundedYear: getRandomInt(2000, 2020),
    employees: getRandomInt(50, 500),
    completedProjects: getRandomInt(10, 100),
    certifications: ['ISO 27001', 'CMMI Level 3', 'AWS Partner'].slice(0, getRandomInt(1, 3))
  }));
};

export const MOCK_PARTNERS = generatePartners(15);
