import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import MainPage from './Components/MainPage';
import Navbar from './Components/Navbar';
import Offer from './Components/Offer';
import Order from './Components/Order';
import Contact from './Components/Contact';
import Footer from './Components/Footer';

import AdminLogin from './Admin/AdminLogin';
import AdminPanel from './Admin/AdminPanel';
import PrivateRoute from './Admin/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Strona główna */}
        <Route
          path="/"
          element={
            <div className="font-Main">
              <Navbar />
              <MainPage />
              <Offer />
              <Order />
              <Contact />
              <Footer />
            </div>
          }
        />

        {/* Panel logowania */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Panel administratora (zabezpieczony) */}
        <Route
          path="/admin-panel"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
