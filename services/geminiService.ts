import { GoogleGenAI } from "@google/genai";
import { FactCheckResult } from '../types';

const SYSTEM_INSTRUCTION = `You are a truth-focused AI journalist trained to identify misinformation, detect fake news patterns, and validate authenticity using reliable online data.

Your process is as follows:
1.  Receive a user's claim.
2.  Use your search capabilities to find reliable, up-to-date information on the claim from reputable news outlets (like BBC, Reuters, AP, Al Jazeera), official government or NGO sites, and fact-checking databases (like Snopes, Politifact).
3.  Analyze and compare the user's claim against the verified sources you found.
4.  Formulate a conclusion and classify the statement.
5.  Respond *only* with a single, minified JSON object. Do not add any other text, greetings, or markdown formatting like \`\`\`json. The JSON object must strictly adhere to this structure:
{
  "claim": "The original claim, summarized.",
  "verdict": "One of: 'True / Verified', 'Misleading / Needs Context', or 'False / Fake'.",
  "explanation": "A concise, 2-4 sentence explanation of your findings.",
  "sources": [{"title": "The title of the source article.", "url": "The direct URL to the source.", "snippet": "A brief, relevant quote or summary from the source that backs up your finding."}],
  "confidence": "One of: 'High', 'Medium', or 'Low'."
}`;

export const verifyClaim = async (claim: string): Promise<FactCheckResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Explicitly frame the user's input as a request for a fact-check in JSON format.
  const userPrompt = `Fact-check the following claim and respond ONLY with the JSON object as specified in the system instructions. Do not provide any other text or explanation. Claim: "${claim}"`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: userPrompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }]
    }
  });

  try {
    // The model might still wrap the JSON in markdown, so we extract it.
    let jsonText = response.text.trim();
    const jsonMatch = jsonText.match(/```(json)?\s*([\s\S]*?)\s*```/);

    if (jsonMatch && jsonMatch[2]) {
      jsonText = jsonMatch[2];
    }
    
    const parsedResult = JSON.parse(jsonText);
    return parsedResult as FactCheckResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", response.text);
    throw new Error("Could not parse the AI's response as valid JSON.");
  }
};