import React, { useState, useRef, useEffect } from "react";
import NavUl from "./NavUl";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import gsap from "gsap";
import Logo from "../Assets/Logo_Bialgruz.webp";

const MobileNav = () => {
  gsap.registerPlugin();
  const [menuOpen, setMenuOpen] = useState(false);
  const asideRef = useRef();
  const navRef = useRef();

  function handleMenuOpen() {
    setMenuOpen(true);
    gsap.to(asideRef.current, { y: "0%", duration: 0.8, ease: "power1.inOut" });
  }

  function handleMenuClose() {
    setMenuOpen(false);
    gsap.to(asideRef.current, {
      y: "-100%",
      duration: 0.8,
      ease: "power1.inOut",
    });
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;
      if (window.scrollY > 0) {
        navRef.current.classList.remove("bg-transparent");
        navRef.current.classList.add("bg-black");
      } else {
        navRef.current.classList.add("bg-transparent");
        navRef.current.classList.remove("bg-black");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="xl:hidden">
      <div
        ref={navRef}
        className="fixed top-0 left-0 w-screen h-16 bg-transparent border-b-2 border-yellow-500 z-40 transition-colors duration-300"
      >
        <img
          className="w-1/2 max-w-[280px] absolute left-[20px] top-1/2 transform -translate-y-1/2"
          loading="eager"
          src={Logo}
          alt="Abyss Logo"
        />
        <button
          aria-label="Open Menu"
          onClick={handleMenuOpen}
          className="fixed top-5 right-5"
        >
          <IoMdMenu className="w-[25px] h-[25px] text-yellow-500" />
        </button>
      </div>

      <aside
        ref={asideRef}
        className="box fixed top-0 right-0 w-full h-full bg-black -translate-y-[100%] z-50"
      >
        <button
          aria-label="Close Menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={handleMenuClose}
          className="absolute top-10 right-10"
        >
          <IoMdClose className="w-[50px] h-[50px] text-yellow-500" />
        </button>
        <NavUl menuOpen={menuOpen} handleClose={handleMenuClose} />
      </aside>
    </nav>
  );
};

export default MobileNav;
