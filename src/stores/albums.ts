import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Album } from '@/types';
import { useAuthStore } from './auth';
import axios from 'axios';
import Parser from 'rss-parser';
import { format } from 'date-fns';

const parser = new Parser();
const PITCHFORK_RSS = 'https://pitchfork.com/rss/reviews/albums/';

export const useAlbumStore = defineStore('albums', () => {
  const albums = ref<Album[]>([]);
  const filters = ref({
    year: '',
    genre: '',
    type: '',
    favorited: false,
    listened: false
  });

  const authStore = useAuthStore();

  const filteredAlbums = computed(() => {
    return albums.value.filter(album => {
      if (filters.value.year && album.releaseDate.slice(0, 4) !== filters.value.year) return false;
      if (filters.value.genre && !album.genres.includes(filters.value.genre)) return false;
      if (filters.value.type && album.type !== filters.value.type) return false;
      if (filters.value.favorited && !album.isFavorited) return false;
      if (filters.value.listened && !album.isListened) return false;
      return true;
    });
  });

  const fetchPitchforkReviews = async () => {
    try {
      const feed = await parser.parseURL(PITCHFORK_RSS);
      // Process feed and match with Spotify albums
      // Implementation details here
    } catch (error) {
      console.error('Error fetching Pitchfork reviews:', error);
    }
  };

  const getOrCreateYearlyPlaylist = async (year: string) => {
    const playlistName = `Top Albums ${year}`;
    
    try {
      // Get user's playlists
      const { data: playlists } = await axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: { Authorization: `Bearer ${authStore.accessToken}` }
      });

      // Find existing playlist
      const existingPlaylist = playlists.items.find(p => p.name === playlistName);
      if (existingPlaylist) return existingPlaylist.id;

      // Create new playlist if not found
      const { data: newPlaylist } = await axios.post(
        `https://api.spotify.com/v1/me/playlists`,
        {
          name: playlistName,
          description: `Favorite album tracks from ${year}`,
          public: false
        },
        {
          headers: { Authorization: `Bearer ${authStore.accessToken}` }
        }
      );

      return newPlaylist.id;
    } catch (error) {
      console.error('Error managing playlist:', error);
      throw error;
    }
  };

  const toggleFavorite = async (albumId: string) => {
    const album = albums.value.find(a => a.id === albumId);
    if (!album) return;

    try {
      // Toggle favorite status
      album.isFavorited = !album.isFavorited;

      if (album.isFavorited) {
        // Save album to Spotify library
        await axios.put(
          'https://api.spotify.com/v1/me/albums',
          { ids: [albumId] },
          {
            headers: { Authorization: `Bearer ${authStore.accessToken}` }
          }
        );

        // Follow artists
        for (const artist of album.artists) {
          await axios.put(
            'https://api.spotify.com/v1/me/following',
            { ids: [artist.id], type: 'artist' },
            {
              headers: { Authorization: `Bearer ${authStore.accessToken}` }
            }
          );
        }

        // Get album tracks and their popularity
        const { data: tracksData } = await axios.get(
          `https://api.spotify.com/v1/albums/${albumId}/tracks`,
          {
            headers: { Authorization: `Bearer ${authStore.accessToken}` }
          }
        );

        // Get detailed track information including popularity
        const trackPromises = tracksData.items.map(track =>
          axios.get(`https://api.spotify.com/v1/tracks/${track.id}`, {
            headers: { Authorization: `Bearer ${authStore.accessToken}` }
          })
        );

        const trackResponses = await Promise.all(trackPromises);
        const tracks = trackResponses.map(response => response.data);
        
        // Find the most popular track from the album
        const mostPopularTrack = tracks.reduce((prev, current) => 
          (current.popularity > prev.popularity) ? current : prev
        );

        // Add to yearly playlist
        const year = format(new Date(album.releaseDate), 'yyyy');
        const playlistId = await getOrCreateYearlyPlaylist(year);
        
        await axios.post(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            uris: [mostPopularTrack.uri]
          },
          {
            headers: { Authorization: `Bearer ${authStore.accessToken}` }
          }
        );
      } else {
        // Remove album from library when unfavorited
        await axios.delete(
          'https://api.spotify.com/v1/me/albums',
          {
            data: { ids: [albumId] },
            headers: { Authorization: `Bearer ${authStore.accessToken}` }
          }
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      album.isFavorited = !album.isFavorited; // Revert on error
    }
  };

  return {
    albums,
    filters,
    filteredAlbums,
    fetchPitchforkReviews,
    toggleFavorite
  };
});