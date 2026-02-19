# 🎬 Cinevo - Advanced Movie Recommendation System

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://Alfiya-AT.github.io/cinevo-movie-recommendation-system/)
[![Vercel](https://img.shields.io/badge/deploy-vercel-black.svg)](https://cinevo-movie-recommendation-system.vercel.app)

Cinevo is a premium, Netflix-inspired cinematic streaming platform built with **React.js**, **Tailwind CSS 4**, and **Redux Toolkit**. It provides a pixel-perfect user interface with professional animations and real-time data integration via The Movie Database (TMDB).

## ✨ Features

- 🎬 **Premium UI**: Professional-grade landing page, vibrant billboard, and dynamic content rows.
- 🎨 **Anime Avatars**: Personalized profile selection with iconic anime character emojis (🦊, ⚔️, 👒).
- 🔍 **Real-time Search**: Debounced search with history and multi-category results.
- 📽️ **Show Details**: Interactive modal with HD backdrops, similar recommendations, and cast info.
- 📑 **My List**: Personal watchlist persisted across sessions (Local Storage / SQL Ready).
- 🛡️ **Secure Auth**: Full Signup/Login flow with **Bcrypt** hashing and **JWT** session management.
- 📱 **Fully Responsive**: Optimized for Mobile, Tablet, and Desktop.

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS 4, Framer Motion
- **State**: Redux Toolkit
- **Backend**: Node.js, Express.js, Helmet
- **Database**: Aiven Cloud MySQL
- **Auth**: JWT, Bcrypt.js
- **API**: The Movie Database (TMDB) API

## 📸 Screenshots

*(Add screenshots here)*

## 🚀 Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Alfiya-AT/cinevo-movie-recommendation-system.git
   cd cinevo-movie-recommendation-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add:
   ```env
   VITE_TMDB_API_KEY=your_key
   VITE_TMDB_ACCESS_TOKEN=your_token
   VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
   VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

   AIVEN_HOST=your-service.aivencloud.com
   AIVEN_PORT=your_port
   AIVEN_USER=avnadmin
   AIVEN_PASSWORD=your_password
   AIVEN_DATABASE=defaultdb
   JWT_SECRET=your_jwt_secret
   ```

4. **Initialize Database**:
   Run the SQL commands provided in `server/db/schema.sql` on your Aiven MySQL console.

5. **Run the Application**:
   - Frontend: `npm run dev`
   - Backend: `npm run server`

## 📡 API Configuration

This project uses the TMDB API. Ensure you have a valid API Key and Access Token from [TMDB Settings](https://www.themoviedb.org/settings/api).

## 📄 License

This project is licensed under the MIT License.
