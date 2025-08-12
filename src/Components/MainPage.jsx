import React from 'react'
import bgMain from '../Assets/bg-main23.webp'
const MainPage = () => {
  return (
    <div style={{ backgroundImage: `url(${bgMain})` }} id='main' className='relative bg-cover bg-center w-full min-h-screen max-h-screen bg-black flex flex-col items-center justify-center px-[20px] overflow-hidden'>

      {/* ŚWIATŁO Z BLUREM */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] lg:w-[900px] lg:h-[900px] bg-gray-500 opacity-10 blur-[150px] lg:blur-[400px] rounded-full"></div>
      </div>

      <h1 className='mt-8 text-center text-4xl md:text-5xl font-extrabold uppercase bg-gradient-to-t from-[#f5f5f5] via-[#9ca3af] to-[#4b5563] text-transparent bg-clip-text tracking-wide z-10'>
        WYWÓZ <br /> GRUZU I ODPADÓW ZMIESZANYCH
      </h1>

      <p style={{ willChange: 'transform' }} fetchPriority="high" className='text-xl text-gray-200 text-center font-light py-8 max-w-md mx-auto z-10'>
        Oferujemy wynajem Big Bagów (1 m³) oraz kontenerów (7 m³) na czysty gruz i odpady zmieszane. Obsługujemy powiat białostocki i okolice. Profesjonalna obsługa, najniższe ceny!
      </p>

      <a href="#order">
        <button className="relative z-10 px-12 py-4 font-semibold text-black bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-xl shadow-lg transition duration-300 transform hover:shadow-[0_8px_20px_rgba(255,255,0,0.4)] hover:brightness-110">
          ZAMÓW TERAZ
        </button>
      </a>
      <p className='text-white text-center mt-8 z-10'>lub zadzwoń</p>

      <div className="mt-8 text-center text-5xl md:text-5xl font-extrabold uppercase text-gray-400 tracking-wide z-10">
        <h2>799 091 000</h2>
        <h2>799 092 000</h2>
        <h2>799 093 000</h2>
        <h2 className="text-sm">BDO: 000672099</h2>
      </div>
    </div>
  )
}

export default MainPage
