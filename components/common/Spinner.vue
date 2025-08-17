<template>
  <div
    :class="['animate-spin rounded-full h-5 w-5 border-b-2', colorClass]"
    role="status"
    aria-label="loading"
  >
     <span class="sr-only">Loading...</span>
  </div>
</template>

<script setup>
defineProps({
    colorClass: {
        type: String,
        default: 'border-white'
    }
})
</script>