<template>
  <Card>
    <div class="flex items-center gap-3 mb-4">
      <IconBook class="w-8 h-8 text-green-600" />
      <h2 class="text-2xl font-bold">Word Explorer</h2>
    </div>
    <p class="text-gray-600 mb-6">
      Discover the origins and conversational nuances of English words. Enter a word to see its analysis.
    </p>

    <div class="flex flex-col md:flex-row gap-2">
      <input
        type="text"
        v-model="word"
        @keyup.enter="handleExplore"
        placeholder="e.g., transport, incredible, could"
        class="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
      />
      <button
        @click="handleExplore"
        :disabled="isLoading"
        class="flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 disabled:bg-green-300 disabled:cursor-not-allowed"
      >
        <Spinner v-if="isLoading" />
        <IconSearch v-else />
        <span>Explore</span>
      </button>
    </div>

    <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
    
    <div v-if="isLoading" class="mt-6 text-center">
        <Spinner colorClass="border-green-500" />
        <p class="text-gray-500 mt-2">단어의 뜻과 역사, 뉘앙스를 분석하고 있어요...</p>
    </div>

    <div v-if="definition || result" class="mt-6 grid grid-cols-1 gap-8">
      <!-- Definition Card -->
      <div v-if="definition" class="p-6 bg-sky-50 rounded-lg">
        <h3 class="text-xl font-bold text-gray-800 mb-3">Definition: <span class="font-semibold text-sky-700">{{ word }}</span></h3>
        <p class="font-semibold text-gray-600 italic">{{ definition.partOfSpeech }}</p>
        <p class="mt-3 text-lg text-gray-800">{{ definition.definition }}</p>
        <p class="mt-1 text-gray-500">{{ definition.definitionKorean }}</p>
      </div>

      <!-- Etymology & Related Words -->
      <div v-if="result" class="grid md:grid-cols-2 gap-6">
        <div class="p-4 bg-green-50 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Etymology Analysis</h3>
          <div class="space-y-2">
            <p><span class="font-semibold text-green-800">Prefix:</span> {{ result.prefix }}</p>
            <p><span class="font-semibold text-green-800">Root:</span> {{ result.root }}</p>
            <p><span class="font-semibold text-green-800">Suffix:</span> {{ result.suffix }}</p>
          </div>
          <p class="mt-4 text-sm text-gray-600 italic">"{{ result.explanation }}"</p>
          <p class="mt-2 text-sm text-gray-500 italic">"{{ result.explanationKorean }}"</p>
        </div>
      </div>
      <div class="p-4 bg-yellow-50 rounded-lg">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Related Words</h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="relatedWord in result.relatedWords" :key="relatedWord" class="bg-yellow-200 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
            {{ relatedWord }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="nuances && nuances.length > 0" class="mt-6">
        <div class="p-6 bg-blue-50 rounded-lg">
            <div class="flex items-center gap-3 mb-4">
                <IconMessage class="w-7 h-7 text-blue-600" />
                <h3 class="text-xl font-bold text-gray-800">Conversational Nuances</h3>
            </div>
            <div class="space-y-4">
                <div v-for="(item, index) in nuances" :key="index" class="p-4 border-l-4 border-blue-200 bg-white rounded-r-md shadow-sm">
                    <p class="font-semibold text-blue-800">{{ item.nuance }} <span class="text-blue-700 text-sm font-medium">({{ item.nuanceKorean }})</span></p>
                    <p class="text-sm text-gray-600 mt-2">{{ item.explanation }}</p>
                    <p class="text-sm text-gray-500 mt-1">{{ item.explanationKorean }}</p>
                    <div class="mt-3 text-sm italic bg-gray-50 p-2 rounded">
                        <p class="text-gray-800" v-html="highlightWordInExample(item.example, word)"></p>
                        <p class="text-gray-600 mt-1">{{ item.exampleKorean }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import { getEtymology, getWordNuances, getWordDefinition } from '../services/geminiService'; // getWordDefinition 추가
import IconBook from './icons/IconBook.vue';
import IconSearch from './icons/IconSearch.vue';
import IconMessage from './icons/IconMessage.vue';
import Spinner from './common/Spinner.vue';
import Card from './common/Card.vue';

const word = ref('');
const result = ref(null);
const nuances = ref(null);
const definition = ref(null); // definition 추가
const isLoading = ref(false);
const error = ref(null);

const handleExplore = async () => {
  if (!word.value.trim()) {
    error.value = 'Please enter a word to explore.';
    return;
  }
  isLoading.value = true;
  error.value = null;
  result.value = null;
  nuances.value = null;
  definition.value = null; // 초기화
  try {
    const [etymologyResult, nuancesResult, definitionResult] = await Promise.all([
        getEtymology(word.value),
        getWordNuances(word.value),
        getWordDefinition(word.value) // 뜻 가져오기
    ]);
    result.value = etymologyResult;
    nuances.value = nuancesResult;
    definition.value = definitionResult; // 뜻 저장
  } catch (err) {
    error.value = err.message || 'An unknown error occurred.';
  } finally {
    isLoading.value = false;
  }
};

const highlightWordInExample = (example, wordToHighlight) => {
    if (!example || !wordToHighlight) return example;
    const regex = new RegExp(`\\b(${wordToHighlight})\\b`, 'gi');
    return example.replace(regex, `<strong class="text-blue-600 font-bold">$1</strong>`);
};
</script>