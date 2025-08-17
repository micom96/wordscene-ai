<template>
  <Card>
    <div class="flex items-center gap-3 mb-4">
      <IconWordbook class="w-8 h-8 text-indigo-600" />
      <h2 class="text-2xl font-bold">My Wordbook</h2>
    </div>
    <p class="text-gray-600 mb-6">
      Here are the nuanced words you've saved. Review them anytime to strengthen your memory.
    </p>

    <div class="mb-8 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
      <h3 class="font-semibold text-lg text-indigo-800 mb-3">Add a New Word</h3>
      <form @submit.prevent="handleAddWord" class="flex flex-col sm:flex-row gap-2 items-center">
        <input type="text" v-model="newEnglishWord" placeholder="English Word" class="flex-grow w-full sm:w-auto p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500" required>
        <input type="text" v-model="newKoreanWord" placeholder="Korean Nuance / Translation" class="flex-grow w-full sm:w-auto p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500" required>
        <button type="submit" class="w-full sm:w-auto bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
          Add Word
        </button>
      </form>
    </div>

    <div v-if="savedWords.length === 0" class="text-center py-10 px-6 bg-gray-50 rounded-lg">
        <p class="text-gray-500">Your wordbook is empty.</p>
        <p class="text-gray-400 text-sm mt-1">Go to the Nuance Translator to save new words!</p>
    </div>

    <div v-else class="space-y-3">
        <div v-for="word in savedWords" :key="word.english" class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div>
                <p class="font-semibold text-indigo-800 text-lg">{{ word.english }}</p>
                <p class="text-gray-600">{{ word.korean }}</p>
            </div>
            <button @click="handleRemove(word.english)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" aria-label="Remove word">
                <IconTrash class="w-5 h-5" />
            </button>
        </div>
    </div>
  </Card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getWordbook, removeWord, saveWord } from '../services/wordbookService';
import Card from './common/Card.vue';
import IconWordbook from './icons/IconWordbook.vue';
import IconTrash from './icons/IconTrash.vue';
import { useUserStore } from '../stores/user'

const userStore = useUserStore();

const savedWords = ref([]);
const newEnglishWord = ref('');
const newKoreanWord = ref('');

const handleAddWord = async () => {
  if (newEnglishWord.value.trim() && newKoreanWord.value.trim()) {
    await saveWord({
      english: newEnglishWord.value.trim(),
      korean: newKoreanWord.value.trim(),
    }, userStore.user);
    newEnglishWord.value = '';
    newKoreanWord.value = '';
    loadWords();
  }
};

const loadWords = async () => {
  savedWords.value = await getWordbook(userStore.user);
};

const handleRemove = (englishWord) => {
  removeWord(englishWord, userStore.user);
  loadWords(); // Refresh the list
};

onMounted(() => {
  loadWords();
});
</script>