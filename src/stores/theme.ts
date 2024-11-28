import { defineStore } from 'pinia';
import { ref } from 'vue';
import { usePreferredDark } from '@vueuse/core';

export const useThemeStore = defineStore('theme', () => {
  const preferredDark = usePreferredDark();
  const isDark = ref(true); // Default to dark mode

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  return {
    isDark,
    toggleTheme
  };
});