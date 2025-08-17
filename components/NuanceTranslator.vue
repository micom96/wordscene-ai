<template>
  <Card>
    <div class="flex items-center gap-3 mb-4">
      <IconMessage class="w-8 h-8 text-blue-600" />
      <h2 class="text-2xl font-bold">Nuance Translator</h2>
    </div>
    <p class="text-gray-600 mb-6">
      Translate English sentences into Korean with nuanced expressions. Click the highlighted words to explore feelings and save them to your wordbook.
    </p>

    <div class="flex flex-col md:flex-row gap-2">
      <textarea
        v-model="sentence"
        placeholder="e.g., He could probably finish the work."
        class="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        rows="2"
        @keyup.enter="handleTranslate"
      ></textarea>
      <button
        @click="handleTranslate"
        :disabled="isLoading"
        class="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        <Spinner v-if="isLoading" />
        <IconSparkles v-else />
        <span>Translate</span>
      </button>
    </div>

    <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>

    <div v-if="isLoading" class="mt-6 text-center">
        <Spinner colorClass="border-blue-500" />
        <p class="text-gray-500 mt-2">AI is thinking about the nuances...</p>
    </div>

    <div v-if="result" class="mt-6 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Translation Result</h3>
      <p class="text-lg md:text-xl leading-loose text-gray-700">
          <template v-for="(word, index) in processedTranslation">
              <InteractiveWord 
                  v-if="word.isAnnotated" 
                  :key="`${word.text}-${index}`" 
                  :annotation="word.annotation" 
                  @save-word="onSaveWord"
                  />
              <span v-else :key="`text-${index}`">{{ word.text }}</span>
          </template>
      </p>
    </div>
    
    <div v-if="showSaveConfirmation" class="fixed bottom-10 right-10 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl transition-transform duration-300 animate-bounce">
      Saved to Wordbook!
    </div>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getNuanceTranslation } from '../services/geminiService';
import { saveWord } from '../services/wordbookService';
import IconMessage from './icons/IconMessage.vue';
import IconSparkles from './icons/IconSparkles.vue';
import Spinner from './common/Spinner.vue';
import Card from './common/Card.vue';
import InteractiveWord from './InteractiveWord.vue';
import { useUserStore } from '../stores/user'

const userStore = useUserStore();
const sentence = ref('');
const result = ref(null);
const isLoading = ref(false);
const error = ref(null);
const showSaveConfirmation = ref(false);

const handleTranslate = async () => {
  if (!sentence.value.trim()) {
    error.value = 'Please enter a sentence to translate.';
    return;
  }
  isLoading.value = true;
  error.value = null;
  result.value = null;
  try {
    const translationResult = await getNuanceTranslation(sentence.value);
    result.value = translationResult;
  } catch (err) {
    error.value = err.message || 'An unknown error occurred.';
  } finally {
    isLoading.value = false;
  }
};

const annotationMap = computed(() => {
  if (!result.value) return new Map();
  // Ensure we handle multiple words with the same chuimsae by creating a unique key
  return new Map(result.value.annotatedWords.map(a => [`${a.recommendedChuimsae}_${a.englishWord}`, a]));
});

const processedTranslation = computed(() => {
    if (!result.value) return [];
    
    const parts = [];
    let processedText = result.value.fullTranslation;

    // Sort annotations by their position in the sentence to handle them in order
    const sortedAnnotations = [...result.value.annotatedWords].sort((a, b) => {
        const indexA = processedText.indexOf(a.recommendedChuimsae);
        const indexB = processedText.indexOf(b.recommendedChuimsae);
        return indexA - indexB;
    });

    let lastIndex = 0;
    sortedAnnotations.forEach(annotation => {
        const chuimsae = annotation.recommendedChuimsae;
        const index = processedText.indexOf(chuimsae, lastIndex);

        if (index !== -1) {
            // Add the text part before the annotated word
            if (index > lastIndex) {
                parts.push({ isAnnotated: false, text: processedText.substring(lastIndex, index) });
            }
            // Add the annotated word itself
            parts.push({ isAnnotated: true, text: chuimsae, annotation });
            lastIndex = index + chuimsae.length;
        }
    });

    // Add any remaining text after the last annotation
    if (lastIndex < processedText.length) {
        parts.push({ isAnnotated: false, text: processedText.substring(lastIndex) });
    }

    // Fallback for cases where the logic might fail
    if (parts.length === 0 && processedText) {
        return [{ isAnnotated: false, text: processedText }];
    }
    
    return parts;
});


const onSaveWord = (word) => {
    saveWord(word, userStore.user);
    showSaveConfirmation.value = true;
    setTimeout(() => {
        showSaveConfirmation.value = false;
    }, 2000);
}
</script>