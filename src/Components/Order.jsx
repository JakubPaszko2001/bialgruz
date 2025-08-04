import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { supabase } from './Supabase';

const Order = () => {
  const form = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isRegulaminOpen, setIsRegulaminOpen] = useState(false);
  const [showNIPField, setShowNIPField] = useState(false);
  const [transportError, setTransportError] = useState(false);
  const [isRODOModalOpen, setIsRODOModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  const requiredFields = [
    'rodzajuslugi', 'rodzajodpadu', 'name', 'forname',
    'address', 'postcode', 'city', 'email', 'phone', 'deliveryDate'
  ];

  const sendEmail = async (e) => {
    e.preventDefault();
    const newErrors = {};

    for (const field of requiredFields) {
      const value = form.current[field]?.value?.trim();
      if (!value) newErrors[field] = 'Uzupełnij to pole';
    }

    if (showNIPField && !form.current.nip?.value?.trim()) {
      newErrors.nip = 'Uzupełnij to pole';
    }

    if (estimatedPrice === null) {
      setTransportError(true);
      return;
    } else {
      setTransportError(false);
    }

    if (!paymentMethod) {
      newErrors.platnosc = 'Wybierz metodę płatności';
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setFormErrors({});
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
      nip: showNIPField ? form.current.nip?.value?.trim() || null : null,
      platnosc: paymentMethod,
      szacowany: estimatedPrice?.toString() || null,
      dataDostawy: form.current.deliveryDate?.value || null,
    };

    await handleSaveToSupabase(formData);

    emailjs
      .sendForm('service_vkm0g32', 'template_5n86nfp', form.current, 'H8LWCkDY6CYMOnRKn')
      .then(() => {
        form.current.reset();
        setEstimatedPrice(null);
        setPaymentMethod('');
        setIsSuccessModalOpen(true);
      })
      .catch((error) => {
        alert('Błąd wysyłki: ' + error.text);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSaveToSupabase = async (data) => {
    const { error } = await supabase
      .from('Zamówienia')
      .insert([{ ...data, Status: 'Do realizacji' }]);
    if (error) {
      console.error('Błąd zapisu:', error.message);
      alert('Błąd zapisu do bazy danych!');
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getBasePrice = (usluga, odpad) => {
    const cennik = {
      'BIG-BAG 1m³': { 'Czysty gruz': 299, 'Zmieszane': 390 },
      'Kontener 7m³': { 'Czysty gruz': 399, 'Zmieszane': 1390 },
    };
    return cennik[usluga]?.[odpad] ?? 0;
  };

  const updateEstimatedPrice = async () => {
    const address = form.current?.address?.value || '';
    const postcode = form.current?.postcode?.value || '';
    const city = form.current?.city?.value || '';
    const query = `${address} ${postcode} ${city}`.trim();

    if (!query || query.length < 6) {
      setEstimatedPrice(null);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (data && data[0]) {
        const { lat, lon } = data[0];
        const distance = calculateDistance(53.14717, 23.17618, parseFloat(lat), parseFloat(lon));
        const basePrice = getBasePrice(
          form.current.rodzajuslugi.value,
          form.current.rodzajodpadu.value
        );
        const estimated = Math.round(basePrice + distance * 10.8);
        setEstimatedPrice(estimated);
        setTransportError(false); // ukryj komunikat
      } else {
        setEstimatedPrice(null);
      }
    } catch (error) {
      console.error('Błąd geokodowania:', error);
      setEstimatedPrice(null);
    }
  };

  const renderInput = (name, label, type = 'text') => (
    <div>
      <label htmlFor={name} className="text-yellow-400">{label}:</label>
      <input
        id={name}
        name={name}
        type={type}
        className={`w-full p-3 border rounded-md bg-transparent ${
          formErrors[name] ? 'border-red-500' : 'border-yellow-500'
        }`}
        onInput={(e) => {
          if (formErrors[name] && e.target.value.trim() !== '') {
            setFormErrors((prev) => {
              const updated = { ...prev };
              delete updated[name];
              return updated;
            });
          }
        }}
      />
      {formErrors[name] && (
        <p className="text-red-500 text-sm mt-1">{formErrors[name]}</p>
      )}
    </div>
  );
  return (
    <div id="order" className="w-full bg-[#222222] px-[20px] pb-12 relative">
      <h1 className="text-3xl font-bold text-white text-center py-12">Złóż zamówienie</h1>
      <div className="bg-[#1E1D1C] text-white max-w-4xl mx-auto p-6 rounded-xl shadow">
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

          <div className="md:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="naFakture"
              className="accent-yellow-500"
              onChange={(e) => setShowNIPField(e.target.checked)}
            />
            <label htmlFor="naFakture" className="text-yellow-400">Chcę otrzymać fakturę VAT</label>
          </div>

          {renderInput('name', 'Imię')}
          {renderInput('forname', 'Nazwisko')}
          {renderInput('address', 'Adres dostawy')}
          {renderInput('postcode', 'Kod pocztowy')}
          {renderInput('city', 'Miejscowość')}
          {renderInput('email', 'Email', 'email')}
          {renderInput('phone', 'Telefon', 'tel')}

          {showNIPField && renderInput('nip', 'NIP')}

          <div className="md:col-span-2">
            <label htmlFor="message" className="text-yellow-400">Uwagi:</label>
            <textarea id="message" name="message" rows="3" className="w-full p-3 border border-yellow-500 rounded-md bg-transparent resize-none" />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="deliveryDate" className="text-yellow-400">Preferowana data dostawy:</label>
            <input
              type="date"
              id="deliveryDate"
              name="deliveryDate"
              className={`w-full p-3 border rounded-md bg-transparent text-white ${
                formErrors.deliveryDate ? 'border-red-500' : 'border-yellow-500'
              }`}
              min={new Date().toISOString().split("T")[0]}
            />
            {formErrors.deliveryDate && (
              <p className="text-red-500 text-sm mt-1">{formErrors.deliveryDate}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="button"
              onClick={updateEstimatedPrice}
              className="w-full md:w-auto px-6 py-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600 transition"
            >
              Oblicz szacowany koszt dostawy
            </button>
            {estimatedPrice !== null && (
              <p className="text-yellow-400 text-sm mt-2">
                Szacowany koszt dostawy: <strong>{estimatedPrice} zł</strong>
              </p>
            )}
          </div>

          <div className="md:col-span-2 mt-4">
            <label className="block text-yellow-400 font-medium mb-1">Forma płatności:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="platnosc"
                  value="gotówka"
                  className="accent-yellow-500"
                  checked={paymentMethod === 'gotówka'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Gotówka
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="platnosc"
                  value="karta"
                  className="accent-yellow-500"
                  checked={paymentMethod === 'karta'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Karta
              </label>
            </div>
            {formErrors.platnosc && (
              <p className="text-red-500 text-sm mt-1">{formErrors.platnosc}</p>
            )}
          </div>

          <div className="md:col-span-2 text-sm bg-[#2B2B2B] p-4 rounded-lg border border-yellow-500 space-y-2">
            <label className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 accent-yellow-500" />
              Wyrażam zgodę na przesłanie faktury na e-mail
            </label>
            <label className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 accent-yellow-500" />
              Jestem świadomy odpowiedzialności za przekroczenie lub niezgodność odpadów
            </label>
            <label className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 accent-yellow-500" />
              <span>Zapoznałem/łam się z <button type="button" onClick={() => setIsRegulaminOpen(true)} className="underline text-yellow-400">regulaminem firmy Bialgruz</button></span>
            </label>
            <label className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 accent-yellow-500" />
              <span>Akceptuję <button type="button" onClick={() => setIsRODOModalOpen(true)} className="underline text-yellow-400">warunki RODO</button> i wyrażam zgodę na przetwarzanie danych</span>
            </label>
          </div>

          <div className="md:col-span-2 text-center mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`relative z-10 px-12 py-4 font-semibold text-black bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-xl shadow-lg transition duration-300 transform hover:shadow-[0_8px_20px_rgba(255,255,0,0.4)] hover:brightness-110 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
            {transportError && (
              <p className="text-red-500 mt-4 text-sm">
                Najpierw oblicz szacowany koszt dostawy.
              </p>
            )}
          </div>
        </form>
      </div>

      {/* MODALE */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center">
          <div className="bg-[#1E1E1E] text-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-yellow-500">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Zamówienie wysłane!</h2>
            <p className="mb-6">Dziękujemy za skorzystanie z naszej usługi. Skontaktujemy się z Tobą wkrótce.</p>
            <button onClick={() => setIsSuccessModalOpen(false)} className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded shadow">OK</button>
          </div>
        </div>
      )}

      {isRegulaminOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex items-center justify-center px-4">
          <div className="bg-[#1E1E1E] text-white p-6 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-yellow-500 relative">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400 text-center">REGULAMIN ŚWIADCZENIA USŁUG – BIALGRUZ</h2>
            {/* ...regulamin treść tu... */}
            <button onClick={() => setIsRegulaminOpen(false)} className="absolute top-3 right-3 text-yellow-400 text-xl">×</button>
          </div>
        </div>
      )}

      {isRODOModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex items-center justify-center px-4">
          <div className="bg-[#1E1E1E] text-white p-6 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-yellow-500 relative">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400 text-center">Polityka RODO – BIALGRUZ</h2>
            {/* ...treść polityki RODO... */}
            <button onClick={() => setIsRODOModalOpen(false)} className="absolute top-3 right-3 text-yellow-400 text-xl">×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
