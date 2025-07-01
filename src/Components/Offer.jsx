import React from 'react'
import BigBag from '../Assets/bigbag.webp';
import kontener from '../Assets/kontener.webp';
import wywoz from '../Assets/wywoz.webp';

const Offer = () => {
  return (
    <div className='bg-[#111111] px-[20px] w-full'>
      <h1 className='text-center text-white text-3xl font-bold pt-8'>Nasza oferta</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 max-w-[1280px] mx-auto">
        {[{
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
        }, {
          img: kontener,
          title: 'Kontener 7m³',
          clean: '399 zł brutto',
          mixed: '1390 zł brutto',
          features: [
            'Pojemność: 7m³',
            'Stabilna konstrukcja',
            'Ekspresowy wywóz',
            'Szybki odbiór'
          ],
          button: 'ZAMÓW KONTENER'
        }, {
          img: wywoz,
          title: 'Wywóz odpadów',
          clean: null,
          mixed: null,
          description: 'Kompleksowa usługa wywozu i utylizacji odpadów budowlanych. Dbamy o środowisko i przestrzegamy wszystkich norm.',
          features: [
            'Wywóz azbestu, papy, opon, wełny mineralnej, eternitu, świetlówek, części samochodowych itp.',
            'Ekologiczna utylizacja',
            'Konkurencyjne ceny',
            'Terminowa realizacja'
          ],
          button: 'ZAMÓW KONTENER'
        }].map((item, index) => (
            <div
              key={index}
              className='bg-[#1E1D1C] flex flex-col items-center p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in max-w-[400px] w-full mx-auto md:max-w-none'
            >
            <div className='w-full rounded-full overflow-hidden outline outline-[3px] outline-yellow-600/55 outline-offset-[13px] shadow-[0_0_0_16px_rgba(255,255,0,0.08)]'>
              <img src={item.img} alt={item.title} loading="lazy" className='w-full h-auto' />
            </div>
            <h2 className='mt-12 text-[#FFD700] font-bold text-2xl text-center'>{item.title}</h2>
            {item.clean && <p className='mt-8 text-white'><span className='font-bold text-xs'>ODPAD CZYSTY:</span> {item.clean}</p>}
            {item.mixed && <p className='text-white'><span className='font-bold text-xs'>ODPAD ZMIESZANY:</span> {item.mixed}</p>}
            {(item.clean || item.mixed) && (
              <p className='text-white mt-8 text-sm'>(ceny zawierają wliczony VAT 8%)</p>
            )}
            {item.description && (
              <p className='text-white text-center mt-8'>{item.description}</p>
            )}
            <ul className="text-gray-100 space-y-2 text-base mt-8 self-start">
              {item.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-yellow-400 mr-2">✔</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="mt-8 px-8 py-3 font-bold text-yellow-400 border-2 border-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition duration-300 shadow-[0_0_12px_rgba(255,255,0,0.2)]">{item.button}</button>
            {index !== 2 && (
              <p className='mt-8 text-center text-white text-xs'>UWAGA! Nie przyjmujemy odpadów takich jak: azbest, papa, opony, wełna mineralna, eternit, świetlówki, części samochodowe. Jeżeli masz takie odpady, zadzwoń, a my się tym zajmiemy!</p>
            )}
          </div>
        ))}
      </div>

      <p className='py-8 text-white text-xl text-center'>
        Trasy poza miasto Białystok wyceniane są indywidualnie, zapraszamy do kontaktu telefonicznego lub e-mailowego.
      </p>
    </div>
  )
}

export default Offer;
