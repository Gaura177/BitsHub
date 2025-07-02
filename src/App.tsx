import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';
import { FeatureSection } from './components/FeatureSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CartModal } from './components/CartModal';
import { UserProfile } from './components/UserProfile';
import { AdminPanel } from './components/AdminPanel';
import { AddedToCartNotification } from './components/AddedToCartNotification';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Welcome to BitsHub
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Your One-Stop Shop for Premium Electronics
              </p>
              <p className="text-lg opacity-80">
                Discover the latest laptops, accessories, and headphones from top brands
              </p>
            </div>
          </section>

          {/* Products Section */}
          <section id="products-section" className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ProductGrid />
            </div>
          </section>

          {/* Features Section */}
          <FeatureSection />
        </main>

        <Footer />

        {/* Modals */}
        <AuthModal />
        <CartModal />
        <UserProfile />
        <AdminPanel />
        <AddedToCartNotification />
      </div>
    </AppProvider>
  );
}

export default App;