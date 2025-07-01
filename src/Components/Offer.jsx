import React from 'react'
import BigBag from '../Assets/bigbag.webp';
import kontener from '../Assets/kontener.webp';
import wywoz from '../Assets/wywoz.webp';
const Offer = () => {
  return (
    <div className='bg-[#111111] px-[20px] w-screen'>
        <h1 className='text-center text-white'>Nasza oferta</h1>
        <div className='bg-[#1E1D1C] mx-[20px] mt-8 flex justify-center items-center flex-col p-8 rounded-lg'>
            <div className='w-full rounded-full overflow-hidden outline outline-[3px] outline-yellow-600/55 outline-offset-[13px] shadow-[0_0_0_16px_rgba(255,255,0,0.08)] '>
                <img src={BigBag} alt="Big Bag z gruzem - do wynajęcia" />
            </div>
            <h2 className='mt-12 text-[#FFD700] font-bold text-2xl'>BIG-BAG 1m³</h2>
            <p className='mt-8 text-white'><span className='font-bold text-xs'>ODPAD CZYSTY:</span> 299zł brutto</p>
            <p className='text-white'><span className='font-bold text-xs'>ODPAD ZMIESZANY:</span> 390zł brutto</p>
            <p className='text-white mt-8 text-sm'>(ceny zawierają wliczony VAT 8%)</p>
            <p className='text-center text-white font-bold text-xs mt-2'>Ceny obejmują teren Białegostoku. Dalsze rejony wyceniane są indywidualnie</p>
            <p className='text-center text-white mt-8'>Idealny do mniejszych remontów i porządków. Pojemność 1m³ pozwala na wywóz gruzu i odpadów budowlanych.</p>
            <ul className="text-gray-100 space-y-2 text-base mt-8 self-start">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✔</span>
                  Pojemność: 1m³
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✔</span>
                  Wytrzymały materiał
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✔</span>
                  Łatwy w transporcie
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✔</span>
                  Szybki odbiór
                </li>
            </ul>
            <button className="mt-8 px-8 py-3 font-bold text-yellow-400 border-2 border-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition duration-300 shadow-[0_0_12px_rgba(255,255,0,0.2)]">ZAMÓW BIG-BAG</button>
            <p className='mt-8 text-center text-white'>UWAGA! Nie przyjmujemy odpadów takich jak: azbest, papa, opony, wełna mineralna, eternit, świetlówki, części samochodowe. Jeżeli masz takie odpady, zadzwoń, a my się tym zajmiemy!</p>
        </div>
        <div className='bg-[#1E1D1C] mx-[20px] mt-8 flex justify-center items-center flex-col py-8 px-6 rounded-lg'>
            <div className='w-full rounded-full overflow-hidden outline outline-[3px] outline-yellow-600/55 outline-offset-[13px] shadow-[0_0_0_16px_rgba(255,255,0,0.08)] '>
                <img src={kontener} alt="Kontener 7m³ - do wynajęcia" />
            </div>
            <h2 className='mt-12 text-[#FFD700] font-bold text-2xl'>Kontener 7m³</h2>
            <p className='mt-8 text-white'><span className='font-bold text-sm'>ODPAD CZYSTY:</span> 399 zł brutto</p>
            <p className='text-white'><span className='font-bold text-sm'>ODPAD ZMIESZANY:</span> 1390 zł brutto</p>
            <p className='text-white mt-8 text-sm'>(ceny zawierają wliczony VAT 8%)</p>
            <p className='text-center text-white font-bold text-xs mt-2'>Ceny obejmują teren Białegostoku. Dalsze rejony wyceniane są indywidualnie</p>
            <p className='text-center text-white mt-8'>Doskonałe rozwiązanie dla większych projektów budowlanych i remontowych. Duża pojemność pozwala na efektywne gromadzenie odpadów.</p>
            <ul className="text-gray-100 space-y-2 text-base mt-8 self-start">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✔</span>
                  Pojemność: 7m³
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✔</span>
                  Stabilna konstrukcja
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✔</span>
                  Ekspresowy wywóz
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✔</span>
                  Szybki odbiór
                </li>
            </ul>
            <button className="mt-8 px-8 py-3 font-bold text-yellow-400 border-2 border-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition duration-300 shadow-[0_0_12px_rgba(255,255,0,0.2)]">ZAMÓW KONTENER</button>
            <p className='mt-8 text-center text-white'>UWAGA! Nie przyjmujemy odpadów takich jak: azbest, papa, opony, wełna mineralna, eternit, świetlówki, części samochodowe. Jeżeli masz takie odpady, zadzwoń, a my się tym zajmiemy!</p>
        </div>
        <div className='bg-[#1E1D1C] mx-[20px] mt-8 flex justify-center items-center flex-col p-8 rounded-lg'>
            <div className='w-full rounded-full overflow-hidden outline outline-[3px] outline-yellow-600/55 outline-offset-[13px] shadow-[0_0_0_16px_rgba(255,255,0,0.08)] '>
                <img src={wywoz} alt="Kontener 7m³ - do wynajęcia" />
            </div>
            <h2 className='mt-12 text-[#FFD700] font-bold text-2xl'>Wywóz odpadów</h2>
            <p className='text-center text-white mt-8'>Kompleksowa usługa wywozu i utylizacji odpadów budowlanych. Dbamy o środowisko i przestrzegamy wszystkich norm.</p>
            <ul className="text-gray-100 space-y-2 text-base mt-8 self-start">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✔</span>
                  <div>
                  Wywóz azbestu, papy, opon, wełny mineralnej, eternitu, świetlówek, części samochodowych itp.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2 ">✔</span>
                  Ekologiczna utylizacja
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✔</span>
                  Konkurencyjne ceny
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✔</span>
                  Terminowa realizacja
                </li>
            </ul>
            <button className="mt-8 px-8 py-3 font-bold text-yellow-400 border-2 border-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition duration-300 shadow-[0_0_12px_rgba(255,255,0,0.2)]">ZAMÓW KONTENER</button>
        </div>
        <p className='py-8 text-white text-xl text-center'>Trasy poza miasto Białystok wyceniane są indywidualnie, zapraszamy do kontaktu telefonicznego lub e-mailowego.</p>
    </div>
  )
}

export default Offer