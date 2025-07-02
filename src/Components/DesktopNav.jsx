import { useEffect } from "react";
import Logo from "../Assets/Logo_Bialgruz.webp";
const DesktopNav = () => {
  const menuOpen = true;
  useEffect(() => {
    const nav = document.querySelector(".navbar");
    let lastScrollY = window.scrollY;
    window.addEventListener("scroll", () => {
      if (lastScrollY < window.scrollY) {
        nav.classList.add("-translate-y-[100%]");
      } else {
        nav.classList.remove("-translate-y-[100%]");
      }

      lastScrollY = window.scrollY;
    });
  });
  return (
 <nav className="desktop-navbar navbar hidden xl:flex fixed top-0 left-0 w-full z-50 border-b border-yellow-500 bg-black transition-transform duration-300">
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
