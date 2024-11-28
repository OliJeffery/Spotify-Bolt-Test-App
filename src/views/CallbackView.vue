<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <p>Processing login...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  try {
    authStore.handleCallback();
    router.push('/albums');
  } catch (error) {
    console.error('Authentication failed:', error);
    router.push('/');
  }
});
</script>