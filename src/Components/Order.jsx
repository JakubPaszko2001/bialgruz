import React from 'react'

const Order = () => {
  return (
    <div className='w-screen bg-[#222222] px-[20px] pb-12'>
        <h1 className='text-3xl font-bold text-white text-center py-12'>Złóż zamówienie</h1>
         <div className="bg-[#1E1D1C] text-white max-w-md mx-auto p-6 rounded-xl shadow-[0_0_20px_rgba(255,255,0,0.1)]">
      <form className="flex flex-col space-y-5">
        <div>
          <label className="block text-yellow-400 font-semibold mb-1">Rodzaj usługi:</label>
          <select className="w-full p-3 bg-transparent border border-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500">
            <option className="text-black">Wybierz rodzaj usługi</option>
            <option className="text-black">BIG-BAG 1m³</option>
            <option className="text-black">Kontener 7m³</option>
          </select>
        </div>

        <div>
          <label className="block text-yellow-400 font-semibold mb-1">Rodzaj odpadów:</label>
          <select className="w-full p-3 bg-transparent border border-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500">
            <option className="text-black">Wybierz rodzaj odpadów</option>
            <option className="text-black">Czysty gruz</option>
            <option className="text-black">Zmieszane</option>
          </select>
        </div>

        <div>
          <label className="block text-yellow-400 font-semibold mb-1">Imię:</label>
          <input
            type="text"
            className="w-full p-3 bg-transparent border border-yellow-500 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-yellow-400 font-semibold mb-1">Nazwisko:</label>
          <input
            type="text"
            className="w-full p-3 bg-transparent border border-yellow-500 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-yellow-400 font-semibold mb-1">Adres dostawy:</label>
          <input
            type="text"
            placeholder="Ulica, numer domu/mieszkan"
            className="w-full p-3 bg-transparent border border-yellow-500 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-yellow-400 font-semibold mb-1">Kod pocztowy:</label>
          <input
            type="text"
            placeholder="XX-XXX"
            className="w-full p-3 bg-transparent border border-yellow-500 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-yellow-400 font-semibold mb-1">Miejscowość:</label>
          <input
            type="text"
            className="w-full p-3 bg-transparent border border-yellow-500 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-yellow-400 font-semibold mb-1">Email:</label>
          <input
            type="email"
            className="w-full p-3 bg-transparent border border-yellow-500 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-yellow-400 font-semibold mb-1">Telefon:</label>
          <input
            type="tel"
            className="w-full p-3 bg-transparent border border-yellow-500 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-yellow-400 font-semibold mb-1">Uwagi dodatkowe:</label>
          <textarea
            rows="4"
            placeholder="Podaj dodatkowe informacje, np. preferowaną godzinę odbioru"
            className="w-full p-3 bg-transparent border border-yellow-500 rounded-md placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
          ></textarea>
        </div>
         <div className="bg-[#1E1D1C] text-white p-6 rounded-xl shadow-[0_0_20px_rgba(255,255,0,0.05)] space-y-4 max-w-md mx-auto">
      <div className="flex items-start">
        <input
          type="checkbox"
          id="zgoda-faktura"
          className="mt-1 mr-3 accent-yellow-500 w-5 h-5"
        />
        <label htmlFor="zgoda-faktura" className="text-sm leading-snug">
          Wyrażam zgodę na przesłanie faktury w formie elektronicznej na podany adres e-mail
        </label>
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="zgoda-przekroczenia"
          className="mt-1 mr-3 accent-yellow-500 w-5 h-5"
        />
        <label htmlFor="zgoda-przekroczenia" className="text-sm leading-snug">
          Wyrażam zgodę i jestem świadomy, że w przypadku wykrycia po odbiorze kontenera ilości przekraczających
          wymienionych w umowie, bądź zostaną znalezione odpady niezgodne z umową liczę się z naliczeniem i
          zobowiązuję do zapłaty kar umownych.
        </label>
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="zgoda-regulamin"
          className="mt-1 mr-3 accent-yellow-500 w-5 h-5"
        />
        <label htmlFor="zgoda-regulamin" className="text-sm leading-snug">
          Zapoznałem/am się z regulaminem firmy Bialgruz i świadomie go akceptuję
        </label>
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="zgoda-rodo"
          className="mt-1 mr-3 accent-yellow-500 w-5 h-5"
        />
        <label htmlFor="zgoda-rodo" className="text-sm leading-snug">
          Wyrażam zgodę na przetwarzanie i archiwizowanie moich danych przez firmę Bialgruz przez minimum 5 lat po
          realizacji zlecenia
        </label>
      </div>
    </div>
    <button className="relative px-12 py-4 font-semibold text-black bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-xl shadow-lg hover:brightness-105 transition duration-300 drop-shadow-[0px_1px_5px_rgba(255,255,0,0.4)]">ZAMÓW TERAZ</button>
      </form>
    </div>
    </div>
  )
}

export default Order