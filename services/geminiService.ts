import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Converts a File object to a Base64 string required by the Gemini API.
 */
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzePhotoMemory = async (photoFile: File): Promise<string> => {
  try {
    const ai = getGeminiClient();
    const imageBase64 = await fileToGenerativePart(photoFile);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Using efficient vision model
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: photoFile.type,
              data: imageBase64
            }
          },
          {
            text: "扮演一位情感细腻的叙述者。简要描述这张照片的氛围，并为它写一段简短、怀旧的中文配文（50字以内）。"
          }
        ]
      }
    });

    return response.text || "无法分析记忆。";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("连接记忆档案失败。");
  }
};