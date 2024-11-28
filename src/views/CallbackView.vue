<template>
  <div class="min-h-screen flex items-center justify-center dark:bg-scythe-black bg-white">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-scythe-red border-t-transparent mx-auto mb-4"></div>
      <p class="dark:text-white text-scythe-black">Connecting to Spotify...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAlbumStore } from '@/stores/albums';

const router = useRouter();
const authStore = useAuthStore();
const albumStore = useAlbumStore();

onMounted(async () => {
  try {
    const token = authStore.handleCallback();
    if (token) {
      await albumStore.fetchPitchforkReviews();
      router.push('/albums');
    } else {
      throw new Error('No token received');
    }
  } catch (error) {
    console.error('Authentication failed:', error);
    router.push('/');
  }
});
</script>