import { ai } from "./llm.client";
import { buildResumePrompt } from "./resume.prompt";

export const analyzeWithLLM = async (sections: any, scores: any) => {
  const prompt = buildResumePrompt(sections, scores);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt
  });

  return response.text;
};
