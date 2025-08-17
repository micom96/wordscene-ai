<template>
  <div class="relative inline-block" @mouseleave="closePopover">
    <span
      @mouseover="openPopover"
      class="text-blue-600 font-bold underline decoration-dotted cursor-pointer"
    >
      {{ annotation.recommendedChuimsae }}
    </span>
    <div v-if="isOpen" class="absolute z-10 bottom-full mb-2 w-72 p-4 bg-white rounded-lg shadow-xl border border-gray-200" ref="popoverRef">
      <p class="text-sm font-semibold text-gray-800 mb-3">
        "{{ annotation.englishWord }}"의 뉘앙스 선택:
      </p>
      <ul class="space-y-1 max-h-40 overflow-y-auto mb-3">
        <li v-for="option in allOptions" :key="option">
          <button @click="save(option)" class="w-full text-left p-2 text-sm text-gray-800 rounded hover:bg-blue-100 transition-colors">
            {{ option }}
          </button>
        </li>
      </ul>
      <div class="border-t pt-3">
        <p class="text-xs text-gray-500 mb-1">다른 뉘앙스 직접 입력:</p>
        <div class="flex gap-2">
          <input
            type="text"
            v-model="customNuance"
            placeholder="직접 입력..."
            class="flex-grow p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
            @keyup.enter="saveCustom"
          />
          <button
            @click="saveCustom"
            :disabled="!customNuance.trim()"
            class="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onClickOutside } from '@vueuse/core';

const props = defineProps({
  annotation: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['save-word']);

const isOpen = ref(false);
const customNuance = ref('');
const popoverRef = ref(null);

const allOptions = computed(() => {
  // Ensure no duplicates and recommended is first
  const options = new Set([props.annotation.recommendedChuimsae, ...props.annotation.options]);
  return Array.from(options);
});

const save = (koreanNuance) => {
  emit('save-word', {
    english: props.annotation.englishWord,
    korean: koreanNuance,
  });
  closePopover();
};

const saveCustom = () => {
  if (customNuance.value.trim()) {
    save(customNuance.value.trim());
  }
};

const openPopover = () => {
  isOpen.value = true;
};

const closePopover = () => {
  isOpen.value = false;
  customNuance.value = ''; // Reset custom input on close
};

// Close popover when clicking outside
onClickOutside(popoverRef, () => {
    if (isOpen.value) {
        closePopover();
    }
});
</script>