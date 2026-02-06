import { ResumeSections } from "../section.extractor";

export interface ResumeScore {
  atsScore: number;
  structureScore: number;
  readabilityScore: number;
  totalScore: number;
}

const ATS_KEYWORDS = [
  "javascript", "typescript", "python", "react",
  "node", "express", "sql", "aws", "docker"
];

const calculateAtsScore = (sections: ResumeSections): number => {
  const text = Object.values(sections)
    .flat()
    .join(" ")
    .toLowerCase();

  let matches = 0;

  for (const keyword of ATS_KEYWORDS) {
    if (text.includes(keyword)) matches++;
  }

  return Math.min(100, (matches / ATS_KEYWORDS.length) * 100);
};

const calculateStructureScore = (sections: ResumeSections): number => {
  const requiredSections: (keyof ResumeSections)[] = [
    "summary",
    "experience",
    "skills",
    "education",
  ];

  let present = 0;

  for (const section of requiredSections) {
    if (sections[section]) present++;
  }

  return (present / requiredSections.length) * 100;
};

const calculateReadabilityScore = (sections: ResumeSections): number => {
  const textLength = Object.values(sections)
    .flat()
    .join(" ").length;

  if (textLength < 300) return 40;
  if (textLength > 3000) return 60;
  return 90;
};

export const scoreResume = (sections: ResumeSections): ResumeScore => {
  const atsScore = calculateAtsScore(sections);
  const structureScore = calculateStructureScore(sections);
  const readabilityScore = calculateReadabilityScore(sections);

  const totalScore =
    atsScore * 0.4 +
    structureScore * 0.4 +
    readabilityScore * 0.2;

  return {
    atsScore: Math.round(atsScore),
    structureScore: Math.round(structureScore),
    readabilityScore: Math.round(readabilityScore),
    totalScore: Math.round(totalScore),
  };
};
