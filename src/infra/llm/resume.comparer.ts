import { ai } from "./llm.client";

export const generateComparison = async (
    resumeText: string,
    jobDescription: string
) => {
    const prompt = `
You are an ATS expert.

Compare the resume with the job description.

Return STRICT JSON only with:
- matchScore (0-100)
- missingSkills (array)
- strengths (array)
- improvementSuggestions (array)

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

    return response.text;
};
