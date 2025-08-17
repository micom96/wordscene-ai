<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white/50 backdrop-blur-sm p-4 rounded-full shadow-md mb-8 flex items-center justify-center flex-wrap gap-2 md:gap-4">
      <NavButton :tab="AppTab.Translator" label="Nuance Translator" :icon="IconMessage" :active-tab="activeTab" @select-tab="activeTab = $event" />
      <NavButton :tab="AppTab.Explorer" label="Word Explorer" :icon="IconBook" :active-tab="activeTab" @select-tab="activeTab = $event" />
      <NavButton :tab="AppTab.Story" label="Story Weaver" :icon="IconSparkles" :active-tab="activeTab" @select-tab="activeTab = $event" />
      <NavButton :tab="AppTab.Wordbook" label="My Wordbook" :icon="IconWordbook" :active-tab="activeTab" @select-tab="activeTab = $event" />
    </div>
    
    <NuanceTranslator v-if="activeTab === AppTab.Translator" :isMember="isMember" />
    <WordExplorer v-if="activeTab === AppTab.Explorer" :isMember="isMember" />
    <StoryWeaver v-if="activeTab === AppTab.Story" :isMember="isMember" />
    <MyWordbook v-if="activeTab === AppTab.Wordbook" :isMember="isMember" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { AppTab } from '../types';
import NavButton from '../components/NavButton.vue';
import NuanceTranslator from '../components/NuanceTranslator.vue';
import WordExplorer from '../components/WordExplorer.vue';
import StoryWeaver from '../components/StoryWeaver.vue';
import MyWordbook from '../components/MyWordbook.vue';

import IconBook from '../components/icons/IconBook.vue';
import IconMessage from '../components/icons/IconMessage.vue';
import IconSparkles from '../components/icons/IconSparkles.vue';
import IconWordbook from '../components/icons/IconWordbook.vue';

import { useUserStore } from '../stores/user'

const userStore = useUserStore();

const isMember = computed(() => !!userStore.user);

const activeTab = ref(AppTab.Translator);
</script>