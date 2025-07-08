import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

const Order = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      // 'service_ga9jc3o',
      'service_vkm0g32',
      'template_5n86nfp',
      form.current,
      'H8LWCkDY6CYMOnRKn' // ← wklej swój PUBLIC KEY z EmailJS (Account > API Keys)
    ).then(
      () => {
        alert('Zamówienie wysłane!');
        form.current.reset();
      },
      (error) => {
        alert('Błąd wysyłki: ' + error.text);
      }
    );
  };

  return (
    <div id='order' className='w-full bg-[#222222] px-[20px] pb-12'>
      <h1 className='text-3xl font-bold text-white text-center py-12'>Złóż zamówienie</h1>

      <div className="bg-[#1E1D1C] text-white max-w-4xl mx-auto p-6 rounded-xl shadow-[0_0_20px_rgba(255,255,0,0.1)]">
        <form ref={form} onSubmit={sendEmail} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label htmlFor="rodzajuslugi" className="text-yellow-400">Rodzaj usługi:</label>
            <select id="rodzajuslugi" name="rodzajuslugi" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent">
              <option className="text-black">BIG-BAG 1m³</option>
              <option className="text-black">Kontener 7m³</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="rodzajodpadu" className="text-yellow-400">Rodzaj odpadów:</label>
            <select id="rodzajodpadu" name="rodzajodpadu" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent">
              <option className="text-black">Czysty gruz</option>
              <option className="text-black">Zmieszane</option>
            </select>
          </div>

          <div>
            <label htmlFor="name" className="text-yellow-400">Imię:</label>
            <input id="name" name="name" type="text" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent" />
          </div>

          <div>
            <label htmlFor="forname" className="text-yellow-400">Nazwisko:</label>
            <input id="forname" name="forname" type="text" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent" />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="address" className="text-yellow-400">Adres dostawy:</label>
            <input id="address" name="address" type="text" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent" />
          </div>

          <div>
            <label htmlFor="postcode" className="text-yellow-400">Kod pocztowy:</label>
            <input id="postcode" name="postcode" type="text" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent" />
          </div>

          <div>
            <label htmlFor="city" className="text-yellow-400">Miejscowość:</label>
            <input id="city" name="city" type="text" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent" />
          </div>

          <div>
            <label htmlFor="email" className="text-yellow-400">Email:</label>
            <input id="email" name="email" type="email" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent" />
          </div>

          <div>
            <label htmlFor="phone" className="text-yellow-400">Telefon:</label>
            <input id="phone" name="phone" type="tel" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent" />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="message" className="text-yellow-400">Uwagi:</label>
            <textarea id="message" name="message" rows="4" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent resize-none"></textarea>
          </div>

          <div className="md:col-span-2 text-center mt-4">
            <button className="relative z-10 px-12 py-4 font-semibold text-black bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-xl shadow-lg transition duration-300 transform hover:shadow-[0_8px_20px_rgba(255,255,0,0.4)] hover:brightness-110">
              ZAMÓW TERAZ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Order;
