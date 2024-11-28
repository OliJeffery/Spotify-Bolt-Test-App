<template>
  <div class="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="font-serif text-4xl font-bold mb-8 dark:text-white text-scythe-black">
        Album Reviews
      </h1>
      
      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <input
          v-model="albumStore.filters.year"
          type="number"
          placeholder="Year"
          class="bg-transparent border dark:border-scythe-gray-700 border-scythe-gray-300 rounded-lg px-4 py-2 dark:text-white text-scythe-black"
        />
        <input
          v-model="albumStore.filters.genre"
          type="text"
          placeholder="Genre"
          class="bg-transparent border dark:border-scythe-gray-700 border-scythe-gray-300 rounded-lg px-4 py-2 dark:text-white text-scythe-black"
        />
        <select
          v-model="albumStore.filters.type"
          class="bg-transparent border dark:border-scythe-gray-700 border-scythe-gray-300 rounded-lg px-4 py-2 dark:text-white text-scythe-black"
        >
          <option value="">All Types</option>
          <option value="album">Albums</option>
          <option value="single">Singles</option>
        </select>
        <label class="flex items-center space-x-2">
          <input
            v-model="albumStore.filters.favorited"
            type="checkbox"
            class="form-checkbox rounded text-scythe-red"
          />
          <span class="dark:text-white text-scythe-black">Favorites Only</span>
        </label>
        <label class="flex items-center space-x-2">
          <input
            v-model="albumStore.filters.listened"
            type="checkbox"
            class="form-checkbox rounded text-scythe-red"
          />
          <span class="dark:text-white text-scythe-black">Listened Only</span>
        </label>
      </div>

      <!-- Album Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="album in albumStore.filteredAlbums"
          :key="album.id"
          class="group dark:bg-scythe-gray-800 bg-scythe-gray-100 rounded-lg overflow-hidden transition-transform hover:scale-[1.02]"
        >
          <div class="relative aspect-square">
            <img
              :src="album.images[0]?.url"
              :alt="album.name"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div class="p-6">
            <h2 class="font-serif text-xl font-bold mb-2 dark:text-white text-scythe-black">
              {{ album.name }}
            </h2>
            <p class="dark:text-scythe-gray-400 text-scythe-gray-600 mb-4">
              {{ album.artists.map(a => a.name).join(', ') }}
            </p>
            <div class="flex justify-between items-center">
              <span class="text-sm dark:text-scythe-gray-400 text-scythe-gray-600">
                {{ new Date(album.releaseDate).getFullYear() }}
              </span>
              <button
                @click="albumStore.toggleFavorite(album.id)"
                class="p-2 rounded-full hover:bg-scythe-gray-700/50 transition-colors"
                :aria-label="album.isFavorited ? 'Remove from favorites' : 'Add to favorites'"
              >
                <span :class="[
                  'text-2xl',
                  album.isFavorited ? 'text-scythe-red' : 'dark:text-scythe-gray-400 text-scythe-gray-600'
                ]">♥</span>
              </button>
            </div>
            <div v-if="album.pitchforkReview" class="mt-4 pt-4 border-t dark:border-scythe-gray-700 border-scythe-gray-300">
              <div class="flex items-center justify-between">
                <span class="font-serif text-2xl font-bold dark:text-white text-scythe-black">
                  {{ album.pitchforkReview.score.toFixed(1) }}
                </span>
                <a
                  :href="album.pitchforkReview.link"
                  target="_blank"
                  class="text-scythe-red hover:text-opacity-80 transition-colors"
                >
                  Read Review →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAlbumStore } from '@/stores/albums';

const albumStore = useAlbumStore();

onMounted(() => {
  albumStore.fetchPitchforkReviews();
});
</script>