import React from 'react'
import Slogan from '../Assets/BialgruzSlogan.webp'

const Footer = () => {
  return (
     <footer className="bg-[#111111] text-white px-6 py-10 text-center border-t-2 border-yellow-500">
      <p className="text-yellow-400 text-2xl font-bold">BIALGRUZ.PL</p>
      <p className="mt-4 text-gray-300">
        Zajmujemy się profesjonalnym wywozem gruzu i odpadów budowlanych.
        Oferujemy BIG-BAGi 1m³ oraz kontenery 7m³.
      </p>
      <hr className="border-t border-gray-600 my-6 w-2/3 mx-auto" />
      <p className="text-sm text-gray-400">© 2025 BIAL-GRUZ. Wszelkie prawa zastrzeżone.</p>
      <p className="text-sm text-gray-400">Strona stworzona przez: Jakub Paszko</p>
      <p className="text-sm text-gray-400">BDO: 000672099</p>
      <img src={Slogan} alt="Bialgruz Slogan" className="mx-auto mt-6 max-w-[300px]" />
    </footer>
  )
}

export default Footer