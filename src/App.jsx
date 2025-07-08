import React, { Suspense, lazy } from 'react';
import MainPage from './Components/MainPage';
import Navbar from './Components/Navbar';
import Offer from './Components/Offer';

// Lazy-loaded komponenty:
const Order = lazy(() => import('./Components/Order'));
const Contact = lazy(() => import('./Components/Contact'));
const Footer = lazy(() => import('./Components/Footer'));

function App() {
  return (
    <div className="font-Main">
      <Navbar />
      <MainPage />
      <Offer />

      <Suspense fallback={<div className="text-center text-white py-8">Ładowanie formularza...</div>}>
        <Order />
      </Suspense>

      <Suspense fallback={<div className="text-center text-white py-8">Ładowanie sekcji kontaktowej...</div>}>
        <Contact />
      </Suspense>

      <Suspense fallback={<div className="text-center text-white py-8">Ładowanie stopki...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
