import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from './store/slices/authSlice';
import DetailModal from './components/DetailModal';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const BrowsePage = lazy(() => import('./pages/BrowsePage'));
const MyListPage = lazy(() => import('./pages/MyListPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const VideoPlayerPage = lazy(() => import('./pages/VideoPlayerPage'));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('cinevo_token')) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-cinevo-black text-white">
      <Suspense fallback={
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-cinevo-red border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/my-list" element={<MyListPage />} />
          <Route path="/profiles" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/watch/:id" element={<VideoPlayerPage />} />
        </Routes>
      </Suspense>

      <DetailModal />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '4px',
          },
        }}
      />
    </div>
  );
}

export default App;
