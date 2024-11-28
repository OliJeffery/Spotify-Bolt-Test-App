<template>
  <div class="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <h1 class="font-serif text-6xl font-bold mb-8 dark:text-white text-scythe-black">
        Scythe
      </h1>
      <p class="text-xl mb-12 dark:text-scythe-gray-300 text-scythe-gray-600 max-w-2xl mx-auto">
        Your personal music curator. Discover critically acclaimed albums and build your perfect collection.
      </p>
      <button
        @click="login"
        class="bg-scythe-red hover:bg-opacity-90 text-white font-medium py-3 px-8 rounded-full transition-all transform hover:scale-105"
      >
        Connect with Spotify
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const login = () => authStore.login();

onMounted(() => {
  if (authStore.isAuthenticated()) {
    router.push({ name: 'albums' });
  }
});
</script>