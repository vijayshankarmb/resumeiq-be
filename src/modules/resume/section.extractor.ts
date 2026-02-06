import { normalizeResumeText } from "./text.normalizer";

export interface ResumeSections {
  summary?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  projects?: string;
  other?: string;
}

const SECTION_HEADERS: Record<keyof Omit<ResumeSections, "other">, string[]> = {
  summary: ["summary", "professional summary", "about me"],
  experience: ["experience", "work experience", "employment"],
  education: ["education", "academic background"],
  skills: ["skills", "technical skills", "core skills"],
  projects: ["projects", "personal projects"],
};

const SKILL_KEYWORDS = [
  "javascript", "typescript", "python", "java", "c++",
  "react", "node", "express", "next", "sql", "mongodb",
  "aws", "docker", "git", "prisma", "postgres", "django",
];

const DATE_REGEX = /\b(19|20)\d{2}\b/;

export const extractSections = (rawText: string): ResumeSections => {
  const text = normalizeResumeText(rawText);

  const detectedSections: {
    key: keyof ResumeSections;
    index: number;
  }[] = [];

  for (const [sectionKey, headers] of Object.entries(SECTION_HEADERS)) {
    for (const header of headers) {
      const regex = new RegExp(`(^|\\n)${header}\\s*:?\\s*(\\n|$)`, "i");
      const match = regex.exec(text);
      if (match?.index !== undefined) {
        const actualIndex = match[0].startsWith("\n") ? match.index + 1 : match.index;
        detectedSections.push({
          key: sectionKey as keyof ResumeSections,
          index: actualIndex,
        });
        break;
      }
    }
  }

  detectedSections.sort((a, b) => a.index - b.index);

  const sections: ResumeSections = {};

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

  if (!sections.other) {
    sections.other = text;
  }

  return sections;
};
