export enum AppTab {
  Translator = 'translator',
  Explorer = 'explorer',
  Story = 'story',
  Wordbook = 'wordbook',
}

export interface EtymologyData {
  prefix: string;
  root: string;
  suffix: string;
  explanation: string;
  explanationKorean: string;
  relatedWords: string[];
}

export interface WordNuance {
  nuance: string;
  nuanceKorean: string;
  explanation: string;
  explanationKorean: string;
  example: string;
  exampleKorean: string;
}

export interface StoryResponse {
  story: string;
  storyKorean: string;
  imagePrompt: string;
}

export interface AnnotatedWord {
  englishWord: string;
  recommendedChuimsae: string;
  options: string[];
}

export interface NuanceTranslationResponse {
  fullTranslation: string;
  annotatedWords: AnnotatedWord[];
}

export interface WordDefinition {
  partOfSpeech: string;
  definition: string;
  definitionKorean: string;
}

export interface WordbookEntry {
  english: string;
  korean: string;
}