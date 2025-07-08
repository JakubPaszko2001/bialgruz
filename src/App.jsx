import MainPage from './Components/MainPage';
import Navbar from './Components/Navbar';
import Offer from './Components/Offer';
import Order from './Components/Order';
import Contact from './Components/Contact';
import Footer from './Components/Footer';
function App() {
  return (
    <div className='font-Main'>
      <Navbar />
      <MainPage />
      <Offer />
      <Order />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
