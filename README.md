# Pitchfork + Spotify Integration

A Vue.js application that combines Pitchfork album reviews with Spotify integration, allowing users to discover, track, and manage their favorite albums.

## Features

- 🎵 Spotify Authentication
- 📚 Pitchfork Review Integration
- ❤️ Favorite Album Management
- 🎯 Smart Playlist Creation
- 🎨 Beautiful UI with Tailwind CSS
- 🔍 Advanced Filtering Options:
  - Year
  - Genre
  - Release Type
  - Favorites
  - Listened/Not Listened

## Key Functionality

- **Spotify Integration**
  - Login with Spotify account
  - Save albums to your library
  - Follow artists automatically
  - Create dynamic playlists

- **Album Management**
  - View Pitchfork reviews
  - Mark albums as favorites
  - Track listening status
  - Filter and sort albums

- **Automatic Actions**
  - When favoriting an album:
    - Saves the album to your Spotify library
    - Follows the album's artists
    - Adds the most popular song to a yearly playlist

## Prerequisites

- Node.js (v14 or higher)
- Spotify Developer Account
- Spotify Client ID

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pitchfork-spotify-reviews
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Spotify Client ID:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   ```

4. **Set up Spotify Developer Account**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new application
   - Add `http://localhost:5173/callback` to the Redirect URIs
   - Copy the Client ID to your `.env` file

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Vue components
├── router/          # Vue Router configuration
├── stores/          # Pinia stores
│   ├── auth.ts     # Authentication store
│   └── albums.ts   # Albums management store
├── types/          # TypeScript interfaces
├── views/          # Vue views/pages
└── main.ts         # Application entry point
```

## Technology Stack

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Tailwind CSS
- Axios
- RSS Parser

## Development

- Run development server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.