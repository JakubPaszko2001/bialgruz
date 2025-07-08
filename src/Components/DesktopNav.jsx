import { useEffect } from "react";
import Logo from "../Assets/Logo_Bialgruz.webp";

const DesktopNav = () => {
  useEffect(() => {
    const nav = document.querySelector(".navbar");
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Zmiana tła, gdy ruszysz w dół z pozycji 0
      if (currentScrollY > 0) {
        nav.classList.add("bg-black");
        nav.classList.remove("bg-transparent");
      } else {
        nav.classList.remove("bg-black");
        nav.classList.add("bg-transparent");
      }

      // Chowanie lub pokazywanie paska na podstawie kierunku
      if (lastScrollY < currentScrollY) {
        nav.classList.add("-translate-y-[100%]");
      } else {
        nav.classList.remove("-translate-y-[100%]");
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="desktop-navbar navbar hidden xl:flex fixed top-0 left-0 w-full z-50 border-b border-yellow-500 bg-transparent transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto px-8 h-[72px]">
        {/* LOGO */}
        <div className="flex items-center">
          <img src={Logo} alt="Bialgruz Logo" className="max-w-[260px] xl:ml-[28px]" />
        </div>

        {/* NAVIGATION */}
        <ul className="flex space-x-8 text-yellow-400 font-semibold text-sm uppercase">
          <li><a href="#main" className="hover:text-white transition">Strona główna</a></li>
          <li><a href="#offer" className="hover:text-white transition">Oferta</a></li>
          <li><a href="#order" className="hover:text-white transition">Zamówienie</a></li>
          <li><a href="#contact" className="hover:text-white transition">Kontakt</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default DesktopNav;
