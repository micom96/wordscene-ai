<template>
  <header class="flex items-center justify-between px-6 py-4 bg-white shadow">
    <div class="flex items-center gap-2">
      <IconLogo />
      <span class="font-bold text-xl text-indigo-700">WordScene AI</span>
    </div>
    <div>
      <template v-if="user">
        <span class="mr-4 text-gray-600">Hello, {{ user.email }}</span>
        <button @click="$emit('logout')" class="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Logout</button>
      </template>
      <template v-else>
        <button @click="$emit('show-auth')" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Sign Up / Log In</button>
      </template>
    </div>
  </header>
</template>

<script setup>
defineProps({
  user: Object
});
</script>
