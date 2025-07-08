import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { supabase } from './Supabase';

const Order = () => {
  const form = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      rodzajuslugi: form.current.rodzajuslugi.value,
      rodzajodpadu: form.current.rodzajodpadu.value,
      name: form.current.name.value,
      forname: form.current.forname.value,
      address: form.current.address.value,
      postcode: form.current.postcode.value,
      city: form.current.city.value,
      email: form.current.email.value,
      phone: form.current.phone.value,
      message: form.current.message.value,
    };

    await handleSaveToSupabase(formData);

    emailjs
      .sendForm(
        'service_vkm0g32',
        'template_5n86nfp',
        form.current,
        'H8LWCkDY6CYMOnRKn'
      )
      .then(
        () => {
          form.current.reset();
          setIsSuccessModalOpen(true); // ⬅️ otwieramy modal
        },
        (error) => {
          alert('Błąd wysyłki: ' + error.text);
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSaveToSupabase = async (data) => {
    const { error } = await supabase.from('Zamówienia').insert([
      {
        ...data,
        Status: 'Nowe',
      },
    ]);

    if (error) {
      console.error('Błąd zapisu:', error.message);
      alert('Błąd zapisu do bazy danych!');
    } else {
      console.log('Zapisano do bazy');
    }
  };

  return (
    <div id="order" className="w-full bg-[#222222] px-[20px] pb-12 relative">
      <h1 className="text-3xl font-bold text-white text-center py-12">Złóż zamówienie</h1>

      <div className="bg-[#1E1D1C] text-white max-w-4xl mx-auto p-6 rounded-xl shadow-[0_0_20px_rgba(255,255,0,0.1)]">
        <form
          ref={form}
          onSubmit={sendEmail}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* pola formularza (bez zmian) */}
          <div className="md:col-span-2">
            <label className="text-yellow-400">Rodzaj usługi:</label>
            <select name="rodzajuslugi" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent">
              <option className="text-black">BIG-BAG 1m³</option>
              <option className="text-black">Kontener 7m³</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-yellow-400">Rodzaj odpadów:</label>
            <select name="rodzajodpadu" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent">
              <option className="text-black">Czysty gruz</option>
              <option className="text-black">Zmieszane</option>
            </select>
          </div>

          <div>
            <label className="text-yellow-400">Imię:</label>
            <input name="name" type="text" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent" />
          </div>

          <div>
            <label className="text-yellow-400">Nazwisko:</label>
            <input name="forname" type="text" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent" />
          </div>

          <div className="md:col-span-2">
            <label className="text-yellow-400">Adres dostawy:</label>
            <input name="address" type="text" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent" />
          </div>

          <div>
            <label className="text-yellow-400">Kod pocztowy:</label>
            <input name="postcode" type="text" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent" />
          </div>

          <div>
            <label className="text-yellow-400">Miejscowość:</label>
            <input name="city" type="text" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent" />
          </div>

          <div>
            <label className="text-yellow-400">Email:</label>
            <input name="email" type="email" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent" />
          </div>

          <div>
            <label className="text-yellow-400">Telefon:</label>
            <input name="phone" type="tel" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent" />
          </div>

          <div className="md:col-span-2">
            <label className="text-yellow-400">Uwagi:</label>
            <textarea name="message" rows="4" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent resize-none"></textarea>
          </div>

          <div className="md:col-span-2 text-center mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`relative z-10 px-12 py-4 font-semibold text-black bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-xl shadow-lg transition duration-300 transform hover:shadow-[0_8px_20px_rgba(255,255,0,0.4)] hover:brightness-110 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Wysyłanie...
                </div>
              ) : (
                'ZAMÓW TERAZ'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ✅ MODAL POTWIERDZENIA */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center">
          <div className="bg-[#1E1E1E] text-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-yellow-500">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Zamówienie wysłane!</h2>
            <p className="mb-6">Dziękujemy za skorzystanie z naszej usługi. Skontaktujemy się z Tobą wkrótce.</p>
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded shadow"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
