import React from 'react';
import BigBag from '../Assets/bigbag.webp';
import kontener from '../Assets/kontener.webp';
import toaleta from '../Assets/toaleta.png';

const Offer = () => {
  // Stałe konfiguracje dla łatwiejszej edycji
  const CONFIG = {
    colors: {
      yellow: 'text-yellow-400',
      yellowBorder: 'border-yellow-400',
      bgCard: 'bg-[#1E1D1C]',
      textGray: 'text-gray-400'
    },
    // Stałe wysokości dla wyrównania elementów w rzędzie
    heights: {
      title: 'min-h-[80px]',      // Stała wysokość dla tytułu
      prices: 'min-h-[100px]',    // Stała wysokość dla sekcji cen
      features: 'min-h-[220px]',  // Stała wysokość dla listy punktów
      footer: 'min-h-[70px]'      // Stała wysokość dla tekstu na samym dole
    }
  };

  const offerData = [
    {
      img: BigBag,
      title: 'BIG-BAG 1m³',
      clean: '299zł brutto',
      mixed: '390zł brutto',
      features: ['Pojemność: 1m³', 'Wytrzymały materiał', 'Łatwy w transporcie', 'Szybki odbiór'],
      button: 'ZAMÓW BIG-BAG'
    },
    {
      img: kontener,
      title: 'Kontener 7m³',
      clean: '390 zł brutto',
      mixed: '1390 zł brutto',
      features: ['Pojemność: 7m³', 'Stabilna konstrukcja', 'Ekspresowy wywóz', 'Szybki odbiór'],
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
    <div id="offer" className='relative bg-[#111111] px-4 md:px-8 w-full overflow-hidden pb-16'>
      
      {/* Efekt tła */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[1000px] bg-yellow-400 opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />

      <h2 className='text-center text-white text-3xl md:text-4xl font-bold pt-16 relative z-10 uppercase tracking-widest'>
        Nasza oferta
      </h2>

      {/* Grid responsywny: 1 kolumna na mobile, 2 na tabletach, 3 na desktopie */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16 max-w-[1300px] mx-auto relative z-10">
        {offerData.map((item, index) => (
          <div
            key={index}
            className={`${CONFIG.colors.bgCard} flex flex-col items-center p-6 md:p-8 rounded-xl shadow-2xl border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:border-yellow-400/30 group`}
          >
            {/* ZDJĘCIE - Responsywne skalowanie */}
            <div className='w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden outline outline-[3px] outline-yellow-600/40 outline-offset-[12px] shadow-[0_0_50px_rgba(0,0,0,0.5)] group-hover:outline-yellow-500 transition-all'>
              <img src={item.img} alt={item.title} className='w-full h-full object-cover transform group-hover:scale-110 transition-duration-700' />
            </div>

            {/* TYTUŁ - Stała wysokość zapewnia wyrównanie cen */}
            <h3 className={`mt-14 ${CONFIG.colors.yellow} font-black text-2xl text-center uppercase tracking-tighter ${CONFIG.heights.title} flex items-center`}>
              {item.title}
            </h3>
            
            {/* CENY - Stała wysokość zapewnia wyrównanie listy */}
            <div className={`${CONFIG.heights.prices} flex flex-col items-center justify-center text-center w-full`}>
                {item.clean ? (
                  <div className="space-y-1">
                    <p className='text-white text-sm md:text-base'><span className={`font-bold ${CONFIG.colors.textGray} text-xs uppercase mr-2`}>Gruz:</span>{item.clean}</p>
                    <p className='text-white text-sm md:text-base'><span className={`font-bold ${CONFIG.colors.textGray} text-xs uppercase mr-2`}>Zmieszane:</span>{item.mixed}</p>
                    <p className='text-gray-500 text-[10px] mt-2 italic'>(VAT 8% wliczony)</p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm italic">Cena ustalana indywidualnie</p>
                )}
            </div>

            {/* LISTA CECH - Stała wysokość zapewnia wyrównanie przycisków */}
            <div className={`w-full ${CONFIG.heights.features} mt-6 flex flex-col justify-start`}>
              <ul className="text-gray-200 space-y-3 text-sm md:text-base mx-auto inline-block">
                {item.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start group/item">
                    <span className={`${CONFIG.colors.yellow} mr-3 font-bold`}>✓</span>
                    <span className="group-hover/item:text-white transition-colors">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* STOPKA KARTY - Przycisk + Info */}
            <div className="w-full mt-auto">
              <a href={item.button === 'ZADZWOŃ' ? "tel:799091000" : "#order"}>
                <button className={`w-full py-4 font-black ${CONFIG.colors.yellow} border-2 ${CONFIG.colors.yellowBorder} rounded-lg hover:bg-yellow-400 hover:text-black transition-all duration-300 uppercase tracking-widest text-sm shadow-lg hover:shadow-yellow-400/20`}>
                  {item.button}
                </button>
              </a>

              <p className={`mt-6 text-center text-white/50 text-[10px] leading-relaxed ${CONFIG.heights.footer} flex items-center justify-center px-4`}>
                {index === 2 
                  ? "Obsługa osób prywatnych i firm. Cena zależna od czasu i lokalizacji."
                  : "BRAK ZGODY NA: azbest, papę, opony, wełnę mineralną, eternit. Masz takie odpady? Zadzwoń!"
                }
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Dolny tekst responsywny */}
      <div className='mt-16 text-white text-center relative z-10 px-4'>
        <p className="text-lg md:text-xl font-light italic opacity-80">
          Transport na terenie Białegostoku <span className={`${CONFIG.colors.yellow} font-bold uppercase not-italic`}>Gratis!</span>
        </p>
        <p className="text-xs text-gray-500 mt-2">Poza miastem wycena indywidualna.</p>
      </div>
    </div>
  );
};

export default Offer;