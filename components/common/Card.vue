<template>
  <div :class="['bg-white rounded-xl shadow-lg p-6 md:p-8 transition-all duration-300 ease-in-out', customClass]">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  customClass: {
    type: String,
    default: ''
  }
});
</script>
