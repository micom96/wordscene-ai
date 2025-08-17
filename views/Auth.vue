<template>
  <div class="max-w-md mx-auto">
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-center">Sign Up / Log In</h2>
      <form @submit.prevent="handleAuth">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input v-model="email" id="email" type="email" placeholder="you@example.com" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input v-model="password" id="password" type="password" placeholder="******************" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <p v-if="authError" class="text-red-500 text-xs italic mb-4">{{ authError }}</p>
        <div class="flex items-center justify-between gap-4">
          <button @click="authMode = 'login'" type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
            Log In
          </button>
          <button @click="authMode = 'signup'" type="submit" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase';

const router = useRouter();

const email = ref('');
const password = ref('');
const authError = ref('');
const authMode = ref('login');

const handleAuth = async () => {
  authError.value = '';
  const { error } = authMode.value === 'signup'
    ? await supabase.auth.signUp({ email: email.value, password: password.value })
    : await supabase.auth.signInWithPassword({ email: email.value, password: password.value });

  if (error) {
    authError.value = error.message;
    return;
  }
  router.push('/');
};
</script>