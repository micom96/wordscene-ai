<template>
  <button
    @click="$emit('select-tab', tab)"
    :class="[
      'flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100',
      isActive
        ? 'bg-blue-600 text-white shadow-lg'
        : 'bg-white text-gray-700 hover:bg-blue-100'
    ]"
  >
    <component :is="icon" class="w-5 h-5" />
    <span>{{ label }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  tab: String,
  label: String,
  icon: Object,
  activeTab: String,
});

defineEmits(['select-tab']);

const isActive = computed(() => props.activeTab === props.tab);
</script>