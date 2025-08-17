
import { GoogleGenAI, Type } from "@google/genai";
import type { EtymologyData, NuanceTranslationResponse, WordNuance, StoryResponse, WordDefinition } from '../types';

// Vite uses `import.meta.env` to access environment variables.
// They must be prefixed with VITE_ to be exposed to the client.
if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY environment variable is not set. Please create a .env file.");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const getEtymology = async (word: string): Promise<EtymologyData> => {
    try {
        const prompt = `Analyze the English word '${word}'. Provide its etymology including prefix, root, and suffix. If a part doesn't exist, use "N/A". Also, give a simple explanation of how they combine, and provide a Korean translation for that explanation. Finally, list 5 related words that share a similar root or prefix/suffix. Return the result as a JSON object.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        prefix: { type: Type.STRING },
                        root: { type: Type.STRING },
                        suffix: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        explanationKorean: { type: Type.STRING },
                        relatedWords: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["prefix", "root", "suffix", "explanation", "explanationKorean", "relatedWords"]
                },
            },
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as EtymologyData;

    } catch (error) {
        console.error("Error fetching etymology:", error);
        throw new Error("Failed to analyze the word. Please try again.");
    }
};

export const getWordNuances = async (word: string): Promise<WordNuance[]> => {
    try {
        const prompt = `
        For the English word "${word}", find at least 3 common conversational nuances.
        For each nuance, provide: 
        1. A short title in English ("nuance"). 
        2. A Korean translation of the title ("nuanceKorean"). 
        3. A simple one-sentence explanation in English ("explanation"). 
        4. A Korean translation of the explanation ("explanationKorean"). 
        5. A clear example sentence in English ("example"). 
        6. A Korean translation of the example sentence ("exampleKorean"). 
        Return the result as a JSON array of objects.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            nuance: { 
                                type: Type.STRING,
                                description: "The title of the nuance, e.g., 'Expressing Possibility'."
                            },
                             nuanceKorean: { 
                                type: Type.STRING,
                                description: "Korean translation of the nuance title."
                            },
                            explanation: {
                                type: Type.STRING,
                                description: "A simple explanation of the nuance."
                            },
                            explanationKorean: {
                                type: Type.STRING,
                                description: "Korean translation of the explanation."
                            },
                            example: {
                                type: Type.STRING,
                                description: "An example sentence showcasing the nuance."
                            },
                            exampleKorean: {
                                type: Type.STRING,
                                description: "Korean translation of the example sentence."
                            }
                        },
                        required: ["nuance", "nuanceKorean", "explanation", "explanationKorean", "example", "exampleKorean"]
                    }
                },
            },
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as WordNuance[];

    } catch (error) {
        console.error(`Error fetching nuances for "${word}":`, error);
        throw new Error("Failed to find conversational nuances. The word might be too uncommon.");
    }
};

export const getWordDefinition = async (word: string): Promise<WordDefinition> => {
    try {
        const prompt = `For the English word "${word}", provide its primary part of speech (e.g., noun, verb, adjective), a simple English definition, and a Korean translation of the definition. Return the result as a JSON object.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        partOfSpeech: { type: Type.STRING },
                        definition: { type: Type.STRING },
                        definitionKorean: { type: Type.STRING },
                    },
                    required: ["partOfSpeech", "definition", "definitionKorean"]
                },
            },
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as WordDefinition;

    } catch (error) {
        console.error(`Error fetching definition for "${word}":`, error);
        throw new Error("Failed to get the word's definition.");
    }
};


export const generateStoryAndImagePrompt = async (words: string[]): Promise<StoryResponse> => {
    try {
        const prompt = `You are a creative storyteller for young students. Create a short, simple, and engaging story (under 100 words) that includes all of the following English words: ${words.join(', ')}. After the English story, provide a full Korean translation of it. 단 번역할 때 단어어순대로 번역할것. 예를들어 \"princess like a ball\" => \"공주는 좋아했어요. 공을\". Finally, create a descriptive, vivid prompt for an AI image generator that captures the main scene of the story. The image prompt should be in English. Return a single JSON object with three keys: "story" (the English story), "storyKorean" (the Korean translation), and "imagePrompt" (the image generation prompt).`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        story: { type: Type.STRING },
                        storyKorean: { type: Type.STRING },
                        imagePrompt: { type: Type.STRING }
                    },
                    required: ["story", "storyKorean", "imagePrompt"]
                },
            },
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error generating story:", error);
        throw new Error("Failed to generate a story. Please check your words and try again.");
    }
};


export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate an image. The prompt might be too complex.");
    }
};

export const getNuanceTranslation = async (sentence: string): Promise<NuanceTranslationResponse> => {
    try {
        const prompt = `You are an expert linguist AI for Korean students learning English. Your task is to translate the following English sentence into Korean with special 'chuimsae' (뉘앙스/추임새) annotations.
        
        English Sentence: "${sentence}"

        Follow these rules precisely:
        1. Translate the full sentence into natural Korean. For learning, try to keep the word order as close to the original English as possible without sounding too awkward.
        2. Identify specific English words (like auxiliary verbs, adverbs, key adjectives) that carry special nuance.
        3. For each identified word, provide a recommended Korean 'chuimsae' that captures its feeling in context. Also provide a few alternative chuimsae.
        4. Return a single JSON object with two keys: "fullTranslation" and "annotatedWords".
           - "fullTranslation": The complete translated sentence with your recommended chuimsae already included.
           - "annotatedWords": An array of objects. Each object corresponds to an English word you identified and must have these keys:
             - "englishWord": The original English word (e.g., "could").
             - "recommendedChuimsae": The best Korean chuimsae for this context (e.g., "아마"). This chuimsae MUST be present in the 'fullTranslation'.
             - "options": An array of other possible chuimsae (e.g., ["혹시", "어쩌면", "~했을지도"]). The first option should be the recommended one.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        fullTranslation: { type: Type.STRING },
                        annotatedWords: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    englishWord: { type: Type.STRING },
                                    recommendedChuimsae: { type: Type.STRING },
                                    options: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    }
                                },
                                required: ["englishWord", "recommendedChuimsae", "options"]
                            }
                        }
                    },
                    required: ["fullTranslation", "annotatedWords"]
                },
            },
        });
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error fetching nuance translation:", error);
        throw new Error("Failed to get nuance translation. Please try again.");
    }
};