<template>
  <Card>
    <div class="flex items-center gap-3 mb-4">
      <IconSparkles class="w-8 h-8 text-purple-600" />
      <h2 class="text-2xl font-bold">Story Weaver</h2>
    </div>
    <p class="text-gray-600 mb-6">
      Turn words into a story and a scene. Enter a few words separated by commas, and let AI bring them to life.
    </p>

    <div class="flex flex-col md:flex-row gap-2">
      <input
        type="text"
        v-model="words"
        @keyup.enter="handleGenerate"
        placeholder="e.g., dragon, castle, brave"
        class="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
      />
      <button
        @click="handleGenerate"
        :disabled="isLoading"
        class="flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 disabled:bg-purple-300 disabled:cursor-not-allowed"
      >
        <Spinner v-if="isLoading" />
        <IconSparkles v-else />
        <span>Generate</span>
      </button>
    </div>

    <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
    
    <div v-if="isLoading || story || imageUrl" class="mt-6 grid lg:grid-cols-2 gap-6 items-start">
      <!-- Story Section -->
      <div class="p-6 bg-purple-50 rounded-lg min-h-[200px] flex flex-col">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Generated Story</h3>
        <div v-if="story">
            <p class="text-gray-700 leading-relaxed">{{ story }}</p>
            <hr class="my-4 border-purple-200">
            <p class="text-gray-600 leading-relaxed">{{ storyKorean }}</p>
        </div>
        <div v-else class="flex-grow flex items-center justify-center">
            <div class="text-center text-gray-500">
                <Spinner colorClass="border-purple-500" />
                <p class="mt-2">AI is weaving a tale...</p>
            </div>
        </div>
      </div>

      <!-- Image Section -->
      <div class="p-6 bg-indigo-50 rounded-lg min-h-[200px] flex flex-col">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Associative Scene</h3>
        <img v-if="imageUrl" :src="imageUrl" alt="AI generated scene" class="w-full h-auto rounded-md shadow-lg object-cover"/>
        <div v-else class="flex-grow flex items-center justify-center">
            <div class="text-center text-gray-500">
                <Spinner colorClass="border-indigo-500" />
                <p class="mt-2">AI is painting a picture...<br/>(This may take a moment)</p>
            </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import { generateStoryAndImagePrompt, generateImage } from '../services/geminiService';
import IconSparkles from './icons/IconSparkles.vue';
import Spinner from './common/Spinner.vue';
import Card from './common/Card.vue';

const words = ref('');
const story = ref(null);
const storyKorean = ref(null);
const imageUrl = ref(null);
const isLoading = ref(false);
const error = ref(null);

const handleGenerate = async () => {
  if (!words.value.trim()) {
    error.value = 'Please enter at least one word.';
    return;
  }
  isLoading.value = true;
  error.value = null;
  story.value = null;
  storyKorean.value = null;
  imageUrl.value = null;
  
  try {
    const wordList = words.value.split(',').map(w => w.trim()).filter(Boolean);
    const { story: generatedStory, storyKorean: generatedStoryKorean, imagePrompt } = await generateStoryAndImagePrompt(wordList);
    story.value = generatedStory;
    storyKorean.value = generatedStoryKorean;
    
    const generatedImageUrl = await generateImage(imagePrompt);
    imageUrl.value = generatedImageUrl;

  } catch (err) {
    error.value = err.message || 'An unknown error occurred.';
  } finally {
    isLoading.value = false;
  }
};
</script>