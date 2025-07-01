import { useEffect } from "react";
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
    <nav className="!hidden fixed top-0 left-1/2 -translate-x-1/2 xl:block z-50">
      <div className="navbar flex flex-col xl:flex-row justify-around items-center w-[50vw] h-[10vh] px-10 bg-black/10 rounded-br-xl rounded-bl-xl border-b-1 border-gray-500 backdrop-blur-md transition-transform duration-300 !px-4 text-white text-lg">
        <a href="#game-elements" className="cursor-pointer">Game Elements</a>
        <a href="#trailer" className="cursor-pointer">Trailer</a>
        <a href="#how-to-play" className="cursor-pointer">How to play</a>
        <a href="#gallery" className="cursor-pointer">Gallery</a>
      </div>
    </nav>
  );
};

export default DesktopNav;
