export const buildResumePrompt = (sections: any, scores: any) => `
You are a professional resume reviewer.
Resume sections:
${JSON.stringify(sections, null, 2)}

Scores:
${JSON.stringify(scores, null, 2)}

Return JSON with:
{
  "summarySuggestions": [],
  "skillsSuggestions": [],
  "experienceSuggestions": [],
  "projectsSuggestions": [],
  "overallAdvice": ""
}
`;
