import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "@/components/organisms/Layout";

// Lazy load all page components
const Home = lazy(() => import("@/components/pages/Home"));
const Search = lazy(() => import("@/components/pages/Search"));
const Library = lazy(() => import("@/components/pages/Library"));
const Playlists = lazy(() => import("@/components/pages/Playlists"));
const CreatePlaylist = lazy(() => import("@/components/pages/CreatePlaylist"));
const PlaylistDetail = lazy(() => import("@/components/pages/PlaylistDetail"));
const AlbumDetail = lazy(() => import("@/components/pages/AlbumDetail"));
const LikedSongs = lazy(() => import("@/components/pages/LikedSongs"));
const NowPlaying = lazy(() => import("@/components/pages/NowPlaying"));
const Queue = lazy(() => import("@/components/pages/Queue"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark via-surface to-dark">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
);

// Main routes configuration
const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "search",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Search />
      </Suspense>
    ),
  },
  {
    path: "library",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Library />
      </Suspense>
    ),
  },
  {
    path: "playlists",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Playlists />
      </Suspense>
    ),
  },
  {
    path: "playlists/create",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <CreatePlaylist />
      </Suspense>
    ),
  },
  {
    path: "playlist/:id",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PlaylistDetail />
      </Suspense>
    ),
  },
  {
    path: "album/:id",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AlbumDetail />
      </Suspense>
    ),
  },
  {
    path: "liked",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LikedSongs />
      </Suspense>
    ),
  },
  {
    path: "now-playing",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NowPlaying />
      </Suspense>
    ),
  },
  {
    path: "queue",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Queue />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    ),
  },
];

// Create router configuration
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes,
  },
];

export const router = createBrowserRouter(routes);