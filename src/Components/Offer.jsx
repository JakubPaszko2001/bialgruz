import React from 'react'
import BigBag from '../Assets/bigbag.webp';
import kontener from '../Assets/kontener.webp';
import toaleta from '../Assets/toaleta.png'; // Upewnij się, że masz ten plik w Assets

const Offer = () => {
  const offerData = [
    {
      img: BigBag,
      title: 'BIG-BAG 1m³',
      clean: '299zł brutto',
      mixed: '390zł brutto',
      features: [
        'Pojemność: 1m³',
        'Wytrzymały materiał',
        'Łatwy w transporcie',
        'Szybki odbiór'
      ],
      button: 'ZAMÓW BIG-BAG'
    },
    {
      img: kontener,
      title: 'Kontener 7m³',
      clean: '390 zł brutto',
      mixed: '1390 zł brutto',
      features: [
        'Pojemność: 7m³',
        'Stabilna konstrukcja',
        'Ekspresowy wywóz',
        'Szybki odbiór'
      ],
      button: 'ZAMÓW KONTENER'
    },
    {
      img: toaleta,
      title: 'Wynajem toalet przenośnych',
      clean: null,
      mixed: null,
      features: [
        'Wynajem na budowy, działki i eventy',
        'Szybka dostawa w Białymstoku',
        'Regularny serwis i dezynfekcja',
        'Wynajem krótko i długoterminowy',
        'Uzupełnianie papieru i zapachów',
        'Dostawa nawet tego samego dnia',
        'Obsługa całego woj. podlaskiego'
      ],
      button: 'ZADZWOŃ'
    }
  ];

  return (
    <div id="offer" className='relative bg-[#111111] px-[20px] w-full overflow-hidden pb-12'>

      {/* ŻÓŁTE ŚWIATŁO TŁA */}
      <div className="absolute left-1/2 top-0 transform -translate-x-1/2 lg:left-0 lg:-top-1/2 w-[1500px] h-[1500px] bg-yellow-400 opacity-5 blur-[200px] rounded-full pointer-events-none z-0" />

      <h2 className='text-center text-white text-3xl font-bold pt-12 relative z-10 uppercase tracking-wider'>Nasza oferta</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-[1280px] mx-auto relative z-10 items-stretch">
        {offerData.map((item, index) => (
          <div
            key={index}
            className='bg-[#1E1D1C] flex flex-col items-center p-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,255,0,0.15)] hover:brightness-105 w-full mx-auto'
          >
            {/* ZDJĘCIE */}
            <div className='w-full rounded-full overflow-hidden outline outline-[3px] outline-yellow-600/55 outline-offset-[13px] shadow-[0_0_0_16px_rgba(255,255,0,0.08)]'>
              <img src={item.img} alt={item.title} loading="lazy" className='w-full h-auto' />
            </div>

            {/* TYTUŁ I CENY */}
            <p className='mt-12 text-[#FFD700] font-bold text-2xl text-center uppercase'>{item.title}</p>
            
            <div className="min-h-[80px] flex flex-col items-center justify-center">
                {item.clean && <p className='mt-4 text-white'><span className='font-bold text-xs text-gray-400'>GRUZ CZYSTY:</span> {item.clean}</p>}
                {item.mixed && <p className='text-white'><span className='font-bold text-xs text-gray-400'>ODPAD ZMIESZANY:</span> {item.mixed}</p>}
                {(item.clean || item.mixed) && (
                  <p className='text-gray-500 mt-2 text-xs'>(ceny zawierają VAT 8%)</p>
                )}
            </div>

            {/* LISTA CECH */}
            <ul className="text-gray-100 space-y-2 text-base mt-6 self-start w-full">
              {item.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-yellow-400 mr-2">✔</span>
                  <span className="text-sm md:text-base">{feature}</span>
                </li>
              ))}
            </ul>

            {/* SEKCJA DOLNA - PRZYCISK I INFO (Zawsze na dole) */}
            <div className="mt-auto w-full">
              <a href={item.button === 'ZADZWOŃ' ? "tel:799091000" : "#order"} className="block w-full">
                <button className="mt-8 px-8 py-3 font-bold text-yellow-400 border-2 border-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition duration-300 shadow-[0_0_12px_rgba(255,255,0,0.2)] w-full uppercase tracking-tighter">
                  {item.button}
                </button>
              </a>

              <p className='mt-6 text-center text-white text-[10px] leading-relaxed min-h-[50px] flex items-center justify-center opacity-80 italic'>
                {index === 2 
                  ? "Obsługujemy osoby prywatne, firmy, deweloperów i organizatorów eventów. Cena uzależniona od okresu najmu i lokalizacji."
                  : "UWAGA! Nie przyjmujemy odpadów takich jak: azbest, papa, opony, wełna mineralna, eternit, świetlówki, części samochodowe. Jeżeli masz takie odpady, zadzwoń!"
                }
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className='py-12 text-white text-lg md:text-xl text-center relative z-10 max-w-4xl mx-auto font-light italic'>
        Trasy poza miasto Białystok wyceniane są indywidualnie. <br className="hidden md:block" />
        <span className="text-yellow-400 font-bold uppercase">Transport na terenie Białegostoku GRATIS!</span>
      </p>
    </div>
  )
}

export default Offer;