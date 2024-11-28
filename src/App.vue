<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';
import { watch } from 'vue';

const authStore = useAuthStore();
const themeStore = useThemeStore();

// Apply dark mode class to html element
watch(() => themeStore.isDark, (isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, { immediate: true });
</script>

<template>
  <div class="min-h-screen transition-colors duration-200 dark:bg-scythe-black bg-white">
    <nav v-if="authStore.isAuthenticated()" 
         class="dark:bg-scythe-gray-800 bg-scythe-gray-100 border-b dark:border-scythe-gray-700 border-scythe-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="font-serif text-2xl font-bold dark:text-white text-scythe-black">
            Scythe
          </router-link>
          <div class="flex items-center space-x-4">
            <button
              @click="themeStore.toggleTheme"
              class="p-2 rounded-full hover:bg-scythe-gray-700 transition-colors"
              :aria-label="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              <span v-if="themeStore.isDark" class="text-white">☀️</span>
              <span v-else class="text-scythe-black">🌙</span>
            </button>
            <button
              @click="authStore.logout"
              class="text-sm font-medium dark:text-white text-scythe-black hover:text-scythe-red transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>