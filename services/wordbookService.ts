import type { SavedWord } from '../types';
import { supabase } from '../supabase';

const WORDBOOK_KEY = 'wordSceneAi_wordbook';

// user가 있으면 Supabase, 없으면 localStorage 사용
export const getWordbook = async (user: any): Promise<SavedWord[]> => {
  if (user) {
    try {
      const { data, error } = await supabase
        .from('wordbook')
        .select('*');
      if (error) {
        console.error("Error reading wordbook from Supabase:", error);
        return [];
      }
      return data ?? [];
    } catch (error) {
      console.error("Error reading wordbook from Supabase:", error);
      return [];
    }
  } else {
    try {
      const storedWords = localStorage.getItem(WORDBOOK_KEY);
      return storedWords ? JSON.parse(storedWords) : [];
    } catch (error) {
      console.error("Error reading wordbook from localStorage:", error);
      return [];
    }
  }
};

export const saveWord = async (word: SavedWord, user: any): Promise<void> => {
  if (user) {
    try {
      const { error } = await supabase
        .from('wordbook')
        .upsert({user_id: user.id, english: word.english, korean: word.korean}, 
          { onConflict: 'user_id, english' });
      if (error) {
        console.error("Error saving word to Supabase:", error);
      }
    } catch (error) {
      console.error("Error saving word to Supabase:", error);
    }
  } else {
    try {
      const storedWords = localStorage.getItem(WORDBOOK_KEY);
      const words: SavedWord[] = storedWords ? JSON.parse(storedWords) : [];
      const existingIndex = words.findIndex(w => w.english.toLowerCase() === word.english.toLowerCase());
      if (existingIndex > -1) {
        words[existingIndex] = word;
      } else {
        words.push(word);
      }
      localStorage.setItem(WORDBOOK_KEY, JSON.stringify(words));
    } catch (error) {
      console.error("Error saving word to localStorage:", error);
    }
  }
};

export const removeWord = async (englishWord: string, user: any): Promise<void> => {
  if (user) {
    try {
      const { error } = await supabase
        .from('wordbook')
        .delete()
        .eq('english', englishWord);
      if (error) {
        console.error("Error removing word from Supabase:", error);
      }
    } catch (error) {
      console.error("Error removing word from Supabase:", error);
    }
  } else {
    try {
      const storedWords = localStorage.getItem(WORDBOOK_KEY);
      let words: SavedWord[] = storedWords ? JSON.parse(storedWords) : [];
      words = words.filter(w => w.english.toLowerCase() !== englishWord.toLowerCase());
      localStorage.setItem(WORDBOOK_KEY, JSON.stringify(words));
    } catch (error) {
      console.error("Error removing word from localStorage:", error);
    }
  }
};