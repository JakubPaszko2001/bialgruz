import React from 'react'

const Footer = () => {
  return (
     <footer className="bg-[#111111] text-white px-6 py-10 text-center border-t-2 border-yellow-500">
      <h2 className="text-yellow-400 text-2xl font-bold">BIALGRUZ.PL</h2>
      <p className="mt-4 text-gray-300">
        Zajmujemy się profesjonalnym wywozem gruzu i odpadów budowlanych.
        Oferujemy BIG-BAGi 1m³ oraz kontenery 7m³.
      </p>
      <hr className="border-t border-gray-600 my-6 w-2/3 mx-auto" />
      <p className="text-sm text-gray-400">© 2025 BIAL-GRUZ. Wszelkie prawa zastrzeżone.</p>
    </footer>
  )
}

export default Footer