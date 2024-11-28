import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Album } from '@/types';
import { useAuthStore } from './auth';
import axios from 'axios';
import { scrapePitchforkReviews } from '@/utils/pitchforkScraper';

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
    if (!authStore.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const reviews = await scrapePitchforkReviews();
      albums.value = []; // Clear existing albums

      // Process reviews and match with Spotify albums
      for (const review of reviews) {
        try {
          // Search Spotify for the album
          const { data: searchResults } = await axios.get(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(`album:${review.albumName} artist:${review.artist}`)}&type=album&limit=1`,
            {
              headers: { Authorization: `Bearer ${authStore.accessToken}` }
            }
          );

          if (searchResults.albums.items.length > 0) {
            const spotifyAlbum = searchResults.albums.items[0];

            // Get full album details from Spotify
            const { data: fullAlbumData } = await axios.get(
              `https://api.spotify.com/v1/albums/${spotifyAlbum.id}`,
              {
                headers: { Authorization: `Bearer ${authStore.accessToken}` }
              }
            );

            // Add album to our list with Pitchfork review data
            albums.value.push({
              id: fullAlbumData.id,
              name: fullAlbumData.name,
              artists: fullAlbumData.artists,
              releaseDate: fullAlbumData.release_date,
              images: fullAlbumData.images,
              genres: fullAlbumData.genres,
              type: fullAlbumData.album_type,
              isFavorited: false,
              isListened: false,
              pitchforkReview: review
            });
          }
        } catch (error) {
          console.error(`Error processing album ${review.albumName}:`, error);
          continue; // Skip this album and continue with the next one
        }
      }
    } catch (error) {
      console.error('Error fetching Pitchfork reviews:', error);
      throw error;
    }
  };

  const toggleFavorite = async (albumId: string) => {
    if (!authStore.accessToken) {
      throw new Error('Not authenticated');
    }

    const album = albums.value.find(a => a.id === albumId);
    if (!album) return;

    try {
      // Toggle favorite status
      album.isFavorited = !album.isFavorited;

      if (album.isFavorited) {
        // Save album to user's library
        await axios.put(
          `https://api.spotify.com/v1/me/albums?ids=${albumId}`,
          {},
          {
            headers: { Authorization: `Bearer ${authStore.accessToken}` }
          }
        );

        // Follow all artists from the album
        const artistIds = album.artists.map(artist => artist.id);
        if (artistIds.length > 0) {
          await axios.put(
            `https://api.spotify.com/v1/me/following?type=artist`,
            { ids: artistIds },
            {
              headers: { Authorization: `Bearer ${authStore.accessToken}` }
            }
          );
        }

        // Get album tracks to find the most popular one
        const { data: tracksData } = await axios.get(
          `https://api.spotify.com/v1/albums/${albumId}/tracks`,
          {
            headers: { Authorization: `Bearer ${authStore.accessToken}` }
          }
        );

        if (tracksData.items.length > 0) {
          // Get track details to find popularity
          const trackDetails = await Promise.all(
            tracksData.items.map(track =>
              axios.get(`https://api.spotify.com/v1/tracks/${track.id}`, {
                headers: { Authorization: `Bearer ${authStore.accessToken}` }
              })
            )
          );

          // Find most popular track
          const mostPopularTrack = trackDetails.reduce((prev, current) =>
            (current.data.popularity > prev.data.popularity) ? current : prev
          ).data;

          // Create or get the yearly playlist
          const year = new Date().getFullYear();
          const playlistName = `Top Albums ${year}`;

          // Get user's playlists
          const { data: playlists } = await axios.get(
            'https://api.spotify.com/v1/me/playlists',
            {
              headers: { Authorization: `Bearer ${authStore.accessToken}` }
            }
          );

          let playlist = playlists.items.find(p => p.name === playlistName);

          // Create playlist if it doesn't exist
          if (!playlist) {
            const { data: newPlaylist } = await axios.post(
              `https://api.spotify.com/v1/me/playlists`,
              {
                name: playlistName,
                description: `Most popular tracks from my favorite albums of ${year}`,
                public: false
              },
              {
                headers: { Authorization: `Bearer ${authStore.accessToken}` }
              }
            );
            playlist = newPlaylist;
          }

          // Add the most popular track to the playlist
          await axios.post(
            `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
            {
              uris: [`spotify:track:${mostPopularTrack.id}`]
            },
            {
              headers: { Authorization: `Bearer ${authStore.accessToken}` }
            }
          );
        }
      } else {
        // Remove album from user's library
        await axios.delete(
          `https://api.spotify.com/v1/me/albums?ids=${albumId}`,
          {
            headers: { Authorization: `Bearer ${authStore.accessToken}` }
          }
        );
      }
    } catch (error) {
      // Revert the favorite status if any operation fails
      album.isFavorited = !album.isFavorited;
      console.error('Error toggling favorite:', error);
      throw error;
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
