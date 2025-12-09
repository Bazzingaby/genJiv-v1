import { GoogleGenAI, Type } from "@google/genai";
import { SpeciesData, QuizQuestion } from "../types";

// Helper to get the API key
const getApiKey = () => {
  const key = process.env.API_KEY;
  if (!key) {
    console.error("API_KEY not found in environment variables");
    return "";
  }
  return key;
};

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const generateSpeciesData = async (animalName: string): Promise<SpeciesData> => {
  if (!animalName) throw new Error("Animal name is required");

  // We want JSON output, but we also want to use Google Search for accuracy.
  // Google Search tool doesn't support responseSchema in the same request easily with strict JSON mode in all cases.
  // We will ask for JSON in the prompt and use regex to extract it to allow the tool to function.
  
  const prompt = `
    Generate detailed educational information about the animal: "${animalName}".
    
    You MUST return the result as a valid JSON object strictly following this structure:
    {
      "commonName": "string",
      "scientificName": "string",
      "habitat": "string",
      "diet": [
        {"name": "Food Source 1", "percentage": 40, "color": "#hexcode"},
        {"name": "Food Source 2", "percentage": 30, "color": "#hexcode"},
        ...
      ],
      "conservationStatus": "one of: Least Concern, Near Threatened, Vulnerable, Endangered, Critically Endangered, Extinct",
      "populationEstimate": "string (include source/year if possible)",
      "geographicRange": "string description of where they live",
      "funFacts": ["fact 1", "fact 2", "fact 3"],
      "description": "A short, child-friendly description (approx 50 words)."
    }

    Use the Google Search tool to find the most up-to-date conservation status and population numbers.
    Do not include markdown formatting like \`\`\`json or \`\`\`. Just return the raw JSON string.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
      },
    });

    const text = response.text || "{}";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    // Extract URLs from grounding
    const groundingUrls = groundingChunks
      ?.map((chunk) => chunk.web?.uri)
      .filter((url): url is string => !!url) || [];

    // Clean up potential markdown code blocks
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const data = JSON.parse(jsonStr) as SpeciesData;
    data.groundingUrls = groundingUrls;
    
    return data;
  } catch (error) {
    console.error("Error generating species data:", error);
    throw error;
  }
};

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
  const prompt = `Create a fun, educational 3-question quiz about: ${topic}.
  Target audience: Kids aged 8-12.
  Return strictly a JSON array of objects. No markdown.
  Structure:
  [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": number (0-3),
      "explanation": "string"
    }
  ]`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

export const editWildlifeImage = async (imageBase64: string, instruction: string): Promise<string> => {
  try {
    // Remove header if present
    const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image", // Standard for editing tasks
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png",
              data: base64Data
            }
          },
          {
            text: `Edit this image: ${instruction}. Make it look high quality and realistic.`
          }
        ]
      }
    });

    // Check for image in response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};

export const generateWildlifeImage = async (prompt: string): Promise<string> => {
  try {
    // Using Pro Image Preview for high quality generation
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
            aspectRatio: "4:3",
            imageSize: "1K"
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}
