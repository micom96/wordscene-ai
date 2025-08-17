<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
    <Header :user="user" @show-auth="goAuthPage" />
    <main class="flex-grow container mx-auto px-4 py-8">
      <router-view :user="user" />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { supabase } from './supabase';
import { useUserStore } from './stores/user';

const user = ref(null);
const router = useRouter();
const userStore = useUserStore();

const goAuthPage = () => {
  router.push('/auth');
};

const handleLogout = async () => {
  await supabase.auth.signOut();
  user.value = null;
  router.push('/');
};

onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  user.value = data?.user ?? null;
  userStore.setUser(user);
});
</script>