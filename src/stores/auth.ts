import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { UserProfile } from '@/types';

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = `${window.location.origin}/callback`;
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-library-modify',
  'user-follow-modify'
].join(' ');

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('spotify_access_token'));
  const userProfile = ref<UserProfile | null>(null);

  const login = () => {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('spotify_auth_state', state);

    const params = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      response_type: 'token',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      state
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  const handleCallback = (): string | null => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    const state = params.get('state');
    const storedState = localStorage.getItem('spotify_auth_state');

    if (!token || state !== storedState) {
      throw new Error('Authentication failed');
    }

    accessToken.value = token;
    localStorage.setItem('spotify_access_token', token);
    localStorage.removeItem('spotify_auth_state');
    
    return token;
  };

  const logout = () => {
    accessToken.value = null;
    userProfile.value = null;
    localStorage.removeItem('spotify_access_token');
  };

  const isAuthenticated = (): boolean => {
    return !!accessToken.value;
  };

  return {
    accessToken,
    userProfile,
    login,
    logout,
    handleCallback,
    isAuthenticated
  };
});