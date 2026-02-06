import { normalizeResumeText } from "./text.normalizer";

/**
 * Final extracted resume sections (V1)
 */
export interface ResumeSections {
  summary?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  projects?: string;
  other?: string;
}

/**
 * Section header aliases (heuristic-first)
 */
const SECTION_HEADERS: Record<keyof Omit<ResumeSections, "other">, string[]> = {
  summary: ["summary", "professional summary", "about me"],
  experience: ["experience", "work experience", "employment"],
  education: ["education", "academic background"],
  skills: ["skills", "technical skills", "core skills"],
  projects: ["projects", "personal projects"],
};

/**
 * Skill keywords (expandable later or from config)
 */
const SKILL_KEYWORDS = [
  "javascript", "typescript", "python", "java", "c++",
  "react", "node", "express", "next", "sql", "mongodb",
  "aws", "docker", "git", "prisma", "postgres", "django",
];

/**
 * Experience heuristic (years / date ranges)
 */
const DATE_REGEX = /\b(19|20)\d{2}\b/;

/**
 * Main section extraction logic
 */
export const extractSections = (rawText: string): ResumeSections => {
  const text = normalizeResumeText(rawText);

  const detectedSections: {
    key: keyof ResumeSections;
    index: number;
  }[] = [];

  // 1. Detect section header positions
  for (const [sectionKey, headers] of Object.entries(SECTION_HEADERS)) {
    for (const header of headers) {
      const match = new RegExp(`\\n${header}\\n`, "i").exec(text);
      if (match?.index !== undefined) {
        detectedSections.push({
          key: sectionKey as keyof ResumeSections,
          index: match.index,
        });
        break;
      }
    }
  }

  // 2. Sort by appearance order
  detectedSections.sort((a, b) => a.index - b.index);

  const sections: ResumeSections = {};

  // 3. Extract content between headers
  for (let i = 0; i < detectedSections.length; i++) {
    const current = detectedSections[i];
    const next = detectedSections[i + 1];

    const start = current.index;
    const end = next ? next.index : text.length;

    const content = text
      .slice(start, end)
      .split("\n")
      .slice(1)
      .join("\n")
      .trim();

    if (!content) continue;

    if (current.key === "skills") {
      sections.skills = content
        .split(/[,•\n]/)
        .map(s => s.trim())
        .filter(Boolean);
    } else {
      sections[current.key] = content;
    }
  }

  // 4. Heuristic fallback (no headers detected)
  if (Object.keys(sections).length === 0) {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

    const skills = lines.filter(line =>
      SKILL_KEYWORDS.some(skill => line.includes(skill))
    );

    const experience = lines.filter(line => DATE_REGEX.test(line));

    return {
      skills: skills.length ? skills : undefined,
      experience: experience.length ? experience.join("\n") : undefined,
      other: lines.join("\n"),
    };
  }

  // 5. Capture leftover content
  if (!sections.other) {
    sections.other = text;
  }

  return sections;
};
