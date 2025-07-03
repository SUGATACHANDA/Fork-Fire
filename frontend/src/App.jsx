/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// Import Public Pages
import HomePage from './pages/public/HomePage';
import RecipePage from './pages/public/RecipePage';
import AllRecipesPage from './pages/public/AllRecipesPage';
import LoginPage from './pages/public/LoginPage';
import SignupPage from './pages/public/SignupPage';

// Import Private/User Pages
import FavoritesPage from './pages/user/FavouritesPage';

// Import Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageRecipes from './pages/admin/ManageRecipes';
import RecipeForm from './pages/admin/RecipeForm';
import ManageCategories from './pages/admin/ManageCategories';
import ManageFaqs from './pages/admin/ManageFaqs';
import SendNewsletterPage from './pages/admin/SendNewsletterPage';
import { AnimatePresence, motion } from 'framer-motion';

// Import Route Guards
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import NewsletterModal from './components/layout/NewsletterModal';
import CookieConsent from "./components/layout/CookieConsent"
import Preloader from './components/layout/Preloader';

function App() {
  // No more `useLocation` or conditional logic for header/footer here!

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check sessionStorage to see if the preloader has run in this session
    const hasLoaded = sessionStorage.getItem('preloader_complete');

    if (hasLoaded) {
      setIsLoading(false); // If it has, skip the preloader
    } else {
      // If it hasn't, the Preloader component will handle the state change
    }
  }, []);

  // This function will be called by the Preloader when its animation finishes
  const handleLoadingComplete = () => {
    sessionStorage.setItem('preloader_complete', 'true');
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {isLoading ? (
          <Preloader onComplete={handleLoadingComplete} />
        ) : (
          <motion.div
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NewsletterModal />
            <CookieConsent />
            <Routes>
              {/* --- Public Routes: All nested routes will have the PublicLayout --- */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="recipes" element={<AllRecipesPage />} />
                <Route path="recipe/:id" element={<RecipePage />} />

                {/* Private user routes can also share the public layout */}
                <Route path="" element={<PrivateRoute />}>
                  <Route path="favorites" element={<FavoritesPage />} />
                </Route>
              </Route>

              {/* --- Standalone Auth Routes (they don't need a header/footer) --- */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* --- Admin Routes: All nested admin routes will have the AdminLayout --- */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route path="" element={<AdminLayout />}>
                  {/* The index route automatically redirects /admin to /admin/dashboard */}
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="recipes" element={<ManageRecipes />} />
                  <Route path="recipes/new" element={<RecipeForm />} />
                  <Route path="recipes/edit/:id" element={<RecipeForm />} />
                  <Route path="categories" element={<ManageCategories />} />
                  <Route path="faqs" element={<ManageFaqs />} />
                  <Route path="newsletter" element={<SendNewsletterPage />} />
                </Route>
              </Route>

              {/* You can add a 404 Not Found page here */}
              {/* <Route path="*" element={<NotFoundPage />} /> */}

            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;