import React from 'react'

const MainPage = () => {
  return (
    <div className='w-screen min-h-screen max-h-screen bg-black flex flex-col items-center justify-center px-[20px]'>
      <h1 className='mt-8 text-center text-4xl md:text-5xl font-extrabold uppercase bg-gradient-to-t from-[#f5f5f5] via-[#9ca3af] to-[#4b5563] text-transparent bg-clip-text tracking-wide'>WYWÓZ <br /> GRUZU I ODPADÓW ZMIESZANYCH</h1>
      <p className='text-xl bg-black text-gray-200 text-center font-light py-8 max-w-sm mx-auto rounded-lg'>Oferujemy wynajem Big Bagów (1 m³) oraz kontenerów (7 m³) na czysty gruz i odpady zmieszane. Obsługujemy powiat białostocki i okolice. Profesjonalna obsługa, najniższe ceny!</p>
      <button className="relative px-12 py-4 font-semibold text-black bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-xl shadow-lg hover:brightness-105 transition duration-300 drop-shadow-[0px_1px_5px_rgba(255,255,0,0.4)]">ZAMÓW TERAZ</button>
      <p className='text-white text-center mt-8'>lub zadzwoń</p>
      <div className="mt-8 text-center text-5xl md:text-5xl font-extrabold uppercase text-gray-400 tracking-wide">
        <h2 className=''>799 091 000</h2>
        <h2 className=''>799 092 000</h2>
        <h2 className=''>799 093 000</h2>
      </div>
    </div>
  )
}

export default MainPage