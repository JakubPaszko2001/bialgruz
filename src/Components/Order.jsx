import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { supabase } from './Supabase';
import Blik from "../Assets/blik.webp";

// Definicja dostępnych odpadów dla konkretnych usług - poza komponentem
const DOSTEPNE_ODPADY = {
  'BIG-BAG 1m³': ['Czysty gruz', 'Zmieszane'],
  'Kontener 5m³': ['Czysty gruz', 'Zmieszane'],
  'Kontener 7m³': ['Zmieszane'], // Tutaj brak gruzu - opcja zniknie z listy
};

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

  // Śledzenie wybranej usługi dla dynamicznego filtrowania
  const [selectedService, setSelectedService] = useState('BIG-BAG 1m³');

  // Tryb współrzędnych
  const [useCoords, setUseCoords] = useState(false);
  const [coordsInput, setCoordsInput] = useState('');

  // Generator numeru zlecenia
  const generateOrderNumber = async () => {
    const { data, error } = await supabase
      .from('Zamówienia')
      .select('numerZlecenia, id')
      .order('id', { ascending: false })
      .limit(1);
  
    if (error) {
      console.error('Błąd podczas pobierania ostatniego numeru zlecenia:', error);
      return 'BIAL0001';
    }
  
    if (!data?.length || !data[0]?.numerZlecenia) return 'BIAL0001';
  
    const lastNumber = data[0].numerZlecenia;
    const match = lastNumber.match(/BIAL(\d+)/);
    const nextNumber = match ? parseInt(match[1], 10) + 1 : 1;
    return `BIAL${nextNumber.toString().padStart(4, '0')}`;
  };

  // Parser współrzędnych
  const parseCoordinates = (input) => {
    if (!input) return null;
    const str = String(input).trim();
    const re = /(-?\d{1,3}(?:\.\d+))[^0-9-]+(-?\d{1,3}(?:\.\d+))/;
    const m = str.match(re);
    if (!m) return null;
    const lat = parseFloat(m[1]);
    const lon = parseFloat(m[2]);
    if (!isFinite(lat) || !isFinite(lon)) return null;
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
    return { lat, lon };
  };

  // Obliczanie dystansu (Haversine)
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

  // --- AKTUALNY CENNIK ---
  const getBasePrice = (usluga, odpad) => {
    const cennik = {
      'BIG-BAG 1m³': { 'Czysty gruz': 299, 'Zmieszane': 390 },
      'Kontener 5m³': { 'Czysty gruz': 390, 'Zmieszane': 1190 },
      'Kontener 7m³': { 'Zmieszane': 1390 },
    };
    return cennik[usluga]?.[odpad] ?? null;
  };

  // Funkcja obliczająca cenę szacunkową
  const updateEstimatedPrice = async () => {
    const service = selectedService; // Bierzemy wartość ze stanu Reacta
    const waste = form.current.rodzajodpadu.value;
    const basePrice = getBasePrice(service, waste);

    // Jeśli kombinacja nie istnieje w cenniku
    if (basePrice === null) {
      setEstimatedPrice(null);
      setTransportError(true);
      return;
    }

    if (useCoords) {
      const coords = parseCoordinates(coordsInput);
      if (!coords) {
        setEstimatedPrice(null);
        setFormErrors((p) => ({ ...p, coords: 'Podaj poprawne współrzędne' }));
        return;
      }
      const distance = calculateDistance(53.14717, 23.17618, coords.lat, coords.lon);
      const estimated = Math.round(basePrice + distance * 10.8);
      setEstimatedPrice(estimated);
      setTransportError(false);
      setFormErrors((p) => {
        const { coords, ...rest } = p;
        return rest;
      });
      return;
    }

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
        const estimated = Math.round(basePrice + distance * 10.8);
        setEstimatedPrice(estimated);
        setTransportError(false);
      } else {
        setEstimatedPrice(null);
      }
    } catch (error) {
      console.error('Błąd geokodowania:', error);
      setEstimatedPrice(null);
    }
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    const requiredFieldsBase = ['rodzajuslugi', 'rodzajodpadu', 'name', 'forname', 'email', 'phone', 'deliveryDate'];
    const addressFields = ['address', 'postcode', 'city'];
    const newErrors = {};

    for (const field of requiredFieldsBase) {
      const value = form.current[field]?.value?.trim();
      if (!value) newErrors[field] = 'Uzupełnij to pole';
    }

    if (showNIPField && !form.current.nip?.value?.trim()) {
      newErrors.nip = 'Uzupełnij to pole';
    }

    let coords = null;
    if (useCoords) {
      coords = parseCoordinates(coordsInput);
      if (!coords) newErrors.coords = 'Podaj współrzędne lub link';
    } else {
      for (const f of addressFields) {
        const v = form.current[f]?.value?.trim();
        if (!v) newErrors[f] = 'Uzupełnij to pole';
      }
    }

    if (estimatedPrice === null) {
      setTransportError(true);
      return;
    }

    if (!paymentMethod) {
      newErrors.platnosc = 'Wybierz metodę płatności';
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const numerZlecenia = await generateOrderNumber();
      const formData = {
        rodzajuslugi: form.current.rodzajuslugi.value,
        rodzajodpadu: form.current.rodzajodpadu.value,
        name: form.current.name.value,
        forname: form.current.forname.value,
        address: useCoords ? '' : (form.current.address?.value || ''),
        postcode: useCoords ? '' : (form.current.postcode?.value || ''),
        city: useCoords ? '' : (form.current.city?.value || ''),
        email: form.current.email.value,
        phone: form.current.phone.value,
        message: form.current.message.value || '',
        nip: showNIPField ? (form.current.nip?.value?.trim() || null) : null,
        platnosc: paymentMethod,
        szacowany: estimatedPrice?.toString() || null,
        dataDostawy: form.current.deliveryDate?.value || null,
        numerZlecenia,
        koordynaty: useCoords && coords ? `${coords.lat}, ${coords.lon}` : null,
      };

      await handleSaveToSupabase(formData);

      await emailjs.sendForm(
        'service_vkm0g32',
        'template_5n86nfp',
        form.current,
        'H8LWCkDY6CYMOnRKn'
      );

      form.current.reset();
      setEstimatedPrice(null);
      setPaymentMethod('');
      setCoordsInput('');
      setUseCoords(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error(error);
      alert('Wystąpił błąd podczas wysyłki.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToSupabase = async (data) => {
    const { error } = await supabase
      .from('Zamówienia')
      .insert([{ ...data, Status: 'Do realizacji' }]);
    if (error) console.error('Błąd zapisu:', error.message);
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
        onInput={() => {
          if (formErrors[name]) {
            setFormErrors((prev) => {
              const updated = { ...prev };
              delete updated[name];
              return updated;
            });
          }
        }}
      />
      {formErrors[name] && <p className="text-red-500 text-sm mt-1">{formErrors[name]}</p>}
    </div>
  );

  return (
    <div id="order" className="w-full bg-[#222222] px-[20px] pb-12 relative">
      <h2 className="text-3xl font-bold text-white text-center py-12">Złóż zamówienie</h2>
      <div className="bg-[#1E1D1C] text-white max-w-4xl mx-auto p-6 rounded-xl shadow">
        <form ref={form} onSubmit={sendEmail} className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* RODZAJ USŁUGI - Zmodyfikowany pod React State */}
          <div className="md:col-span-2">
            <label htmlFor="rodzajuslugi" className="text-yellow-400">Rodzaj usługi:</label>
            <select 
              id="rodzajuslugi" 
              name="rodzajuslugi" 
              value={selectedService}
              className="w-full p-3 border border-yellow-500 rounded-md bg-transparent text-white"
              onChange={(e) => { 
                setSelectedService(e.target.value); 
                setEstimatedPrice(null); 
                setTransportError(false); 
              }}
            >
              <option className="text-black">BIG-BAG 1m³</option>
              <option className="text-black">Kontener 5m³</option>
              <option className="text-black">Kontener 7m³</option>
            </select>
          </div>

          {/* RODZAJ ODPADU - Teraz dynamicznie filtrowany */}
          <div className="md:col-span-2">
            <label htmlFor="rodzajodpadu" className="text-yellow-400">Rodzaj odpadów:</label>
            <select 
              id="rodzajodpadu" 
              name="rodzajodpadu" 
              className="w-full p-3 border border-yellow-500 rounded-md bg-transparent text-white"
              onChange={() => { setEstimatedPrice(null); setTransportError(false); }}
            >
              {DOSTEPNE_ODPADY[selectedService].map((odpad) => (
                <option key={odpad} className="text-black">{odpad}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <input type="checkbox" id="naFakture" className="accent-yellow-500" onChange={(e) => setShowNIPField(e.target.checked)} />
            <label htmlFor="naFakture" className="text-yellow-400">Chcę otrzymać fakturę VAT</label>
          </div>

          {/* PRZEŁĄCZNIK WSPÓŁRZĘDNYCH */}
          <div className="md:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="useCoords"
              className="accent-yellow-500"
              checked={useCoords}
              onChange={(e) => {
                setUseCoords(e.target.checked);
                setEstimatedPrice(null);
                setFormErrors((prev) => {
                  const updated = { ...prev };
                  delete updated.address; delete updated.postcode; delete updated.city; delete updated.coords;
                  return updated;
                });
              }}
            />
            <label htmlFor="useCoords" className="text-yellow-400">Nie mam adresu — podam współrzędne</label>
          </div>

          {!useCoords ? (
            <>
              {renderInput('address', 'Adres dostawy')}
              {renderInput('postcode', 'Kod pocztowy')}
              {renderInput('city', 'Miejscowość')}
            </>
          ) : (
            <div className="md:col-span-2">
              <label htmlFor="coords" className="text-yellow-400">Współrzędne (lat, lon) lub link do map:</label>
              <input
                id="coords"
                name="coords"
                type="text"
                value={coordsInput}
                onChange={(e) => { setCoordsInput(e.target.value); setEstimatedPrice(null); }}
                placeholder="53.415, 23.015"
                className={`w-full p-3 border rounded-md bg-transparent border-yellow-500`}
              />
            </div>
          )}

          {renderInput('name', 'Imię')}
          {renderInput('forname', 'Nazwisko')}
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
              className={`w-full p-3 border rounded-md bg-transparent text-white border-yellow-500`}
              min={new Date().toISOString().split("T")[0]}
            />
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
                Szacowany koszt: <strong>{estimatedPrice} zł</strong>
              </p>
            )}
            {transportError && (
              <p className="text-red-500 text-sm mt-2">
                {getBasePrice(selectedService, form.current.rodzajodpadu.value) === null 
                  ? "Ta usługa (Gruz) nie jest dostępna dla wybranego gabarytu." 
                  : "Najpierw oblicz koszt dostawy."}
              </p>
            )}
          </div>

          <div className="md:col-span-2 mt-4">
            <label className="block text-yellow-400 font-medium mb-1">Forma płatności:</label>
            <div className="flex gap-4">
              {['gotówka', 'karta', 'przelew'].map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="platnosc"
                    value={method}
                    className="accent-yellow-500"
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  {method === 'karta' ? <span>Karta / <img src={Blik} alt="BLIK" className="h-4 inline" /></span> : method}
                </label>
              ))}
            </div>
            {formErrors.platnosc && <p className="text-red-500 text-sm mt-1">{formErrors.platnosc}</p>}
          </div>

          <div className="md:col-span-2 text-sm bg-[#2B2B2B] p-4 rounded-lg border border-yellow-500 space-y-2">
            <label className="flex items-start gap-2"><input type="checkbox" required className="mt-1 accent-yellow-500" /> Zgoda na fakturę e-mail</label>
            <label className="flex items-start gap-2"><input type="checkbox" required className="mt-1 accent-yellow-500" /> Odpowiedzialność za odpady</label>
            <label className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 accent-yellow-500" />
              <span>Akceptuję <button type="button" onClick={() => setIsRegulaminOpen(true)} className="underline text-yellow-400">Regulamin</button> oraz <button type="button" onClick={() => setIsRODOModalOpen(true)} className="underline text-yellow-400">RODO</button></span>
            </label>
          </div>

          <div className="md:col-span-2 text-center mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-12 py-4 font-semibold text-black bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-xl shadow-lg transition hover:brightness-110 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Wysyłanie...' : 'ZAMÓW TERAZ'}
            </button>
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
            <h2 className="text-2xl font-bold mb-6 text-yellow-400 text-center">REGULAMIN ŚWIADCZENIA USŁUG – BIALGRUZ</h2>
            
            <div className="space-y-6 text-sm leading-relaxed text-gray-200">

              <section>
                <p><strong>§1. Postanowienia ogólne</strong><br />
                1. Niniejszy Regulamin określa zasady świadczenia usług wywozu gruzu, odpadów budowlanych oraz innych odpadów przez firmę BIALGRUZ.<br />
                2. Klientem może być osoba fizyczna, osoba prawna lub jednostka organizacyjna, która zawarła z firmą BIALGRUZ umowę ustną, pisemną, telefoniczną lub mailową.<br />
                3. Korzystając z usług BIALGRUZ, Klient akceptuje postanowienia niniejszego Regulaminu.</p>
              </section>
            
              <section>
                <p><strong>§2. Zakres usług</strong><br />
                1. Firma BIALGRUZ świadczy usługi podstawienia, odbioru i wywozu:<br />
                – kontenerów na gruz czysty (beton, cegły, pustaki, dachówki, tynki, kamienie);<br />
                – kontenerów na odpady zmieszane (płyty G-K, szyby, okna, tworzywa szczuczne, materiały izolacyjne);<br />
                – worków typu Big-Bag (1 m³) na gruz lub odpady.<br />
                2. Odbiór odpadów odbywa się zgodnie z harmonogramem uzgodnionym z Klientem.<br />
                3. BIALGRUZ nie odbiera odpadów komunalnych, tekstylnych ani niebezpiecznych (azbest, papa, odpady medyczne, płyny, opony, części samochodowe, elektroodpady).<br />
                4. Kontener podstawiany jest na okres 2 tygodni kalendarzowych z możliwością przedłużenia za dodatkową opłatą.</p>
              </section>
            
              <section>
                <p><strong>§3. Zamówienie usługi</strong><br />
                1. Zamówienie można złożyć telefonicznie, mailowo lub przez formularz na stronie internetowej.<br />
                2. W zamówieniu należy podać:<br />
                – adres podstawienia kontenera,<br />
                – numer kontaktowy,<br />
                – rodzaj odpadów,<br />
                – przewidywany czas wynajmu kontenera,<br />
                – adres mailowy,<br />
                – sposób płatności (gotówka / przelew).<br />
                3. BIALGRUZ zastrzega sobie prawo do odmowy realizacji zlecenia w przypadku:<br />
                – braku dostępnych kontenerów;<br />
                – utrudnionego dojazdu;<br />
                – podejrzenia nielegalnego charakteru odpadów;<br />
                – nieuzgodnionej rezygnacji z usługi na mniej niż 12h przed realizacją (koszt manipulacyjny 100 zł netto).</p>
              </section>
            
              <section>
                <p><strong>§4. Ceny i płatności</strong><br />
                1. Ceny ustalane są indywidualnie i przekazywane Klientowi przed realizacją zlecenia.<br />
                2. Płatności można dokonać:<br />
                – gotówką przy podstawieniu;<br />
                – szybkim przelewem (BLIK) lub kartą płatniczą przy podstawieniu;<br />
                – przelewem (do 3 dni od wystawienia faktury).<br />
                3. Cena zawiera: podstawienie, odbiór, utylizację odpadów do 4 ton oraz wynajem na 2 tygodnie.<br />
                4. Każdy dodatkowy tydzień wynajmu to koszt 200 zł brutto.<br />
                5. W przypadku przekroczenia limitu wagowego lub stwierdzenia niedozwolonych odpadów, naliczane są dodatkowe opłaty (minimum 800 zł netto).</p>
              </section>
            
              <section>
                <p><strong>§5. Obowiązki Klienta</strong><br />
                1. Klient zobowieduje się do:<br />
                – nieprzekraczania wysokości kontenera przy załadunku (oraz limitu wagowego);<br />
                – niewrzucania odpadów zakazanych;<br />
                – zapewnienia dostępu do kontenera w dniu odbioru.<br />
                2. W przypadku podstawienia worka Big-Bag – ustawienia go w miejscu bezpiecznym, stabilnym i umożliwiającym odbiór.<br />
                3. W przypadku braku możliwości odbioru kontenera z winy Klienta naliczana będzie opłata postojowa 100 zł netto za każdy dzień zwłoki + 50 zł netto za podjazd na terenie Białegostoku, a poza nim +10 zł netto/km.<br />
                4. Klient odpowiada za szkody w kontenerze oraz terenie, na którym został ustawiony.</p>
              </section>
            
              <section>
                <p><strong>§6. Obowiązki firmy BIALGRUZ</strong><br />
                1. Firma zobowiązuje się do podstawienia kontenera w uzgodnionym terminie, odbioru w umówionym czasie oraz legalnej utylizacji odpadów.<br />
                2. Firma nie ponosi odpowiedzialności za opóźnienia wynikłe z przyczyn niezależnych (pogoda, korki, awarie, siła wyższa).</p>
              </section>
            
              <section>
                <p><strong>§7. Reklamacje i odpowiedzialność</strong><br />
                1. Reklamacje należy zgłaszać w ciągu 3 dni roboczych.<br />
                2. Czas rozpatrzenia: do 14 dni roboczych.<br />
                3. Odpowiedzialność firmy ogranicza się do wartości usługi.<br />
                4. W przypadku braku kontaktu z Klientem przez 48h firma może samodzielnie odebrać kontener.</p>
              </section>
            
              <section>
                <p><strong>§8. Przetwarzanie danych osobowych</strong><br />
                1. Administratorem danych osobowych jest firma BIALGRUZ.<br />
                2. Dane przetwarzane są zgodnie z RODO wyłącznie w celu realizacji zleceń.<br />
                3. Klient ma prawo do wglądu, poprawiania i usuwania danych.</p>
              </section>
            
              <section>
                <p><strong>§9. Postanowienia końcowe</strong><br />
                1. Spory rozstrzygane będą przez sąd właściwy dla siedziby BIALGRUZ.<br />
                2. Prawem właściwym jest prawo polskie.<br />
                3. Regulamin wchodzi w życie z dniem publikacji.</p>
              </section>
            
              <hr className="border-yellow-500/30 my-4" />
            
              <div className="text-center space-y-1 text-yellow-400 font-medium pb-4">
                <p>Kontakt: biuro@bialgruz.pl</p>
                <p>799-091-000 | 799-092-000 | 799-093-000</p>
                <p>BDO: 000672099</p>
              </div>
            
            </div>
            <button 
              onClick={() => setIsRegulaminOpen(false)} 
              className="absolute top-4 right-4 text-yellow-400 text-3xl hover:scale-110 transition-transform"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {isRODOModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex items-center justify-center px-4">
          <div className="bg-[#1E1E1E] text-white p-6 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-yellow-500 relative">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400 text-center">Polityka RODO – BIALGRUZ</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p><strong>Administrator danych:</strong> Administratorem danych osobowych jest firma BIALGRUZ.</p>
              <p><strong>Cel przetwarzania:</strong> Dane są przetwarzane w celu realizacji usług, kontaktu z klientem, wystawienia faktury oraz archiwizacji zamówień.</p>
              <p><strong>Okres przechowywania:</strong> Dane będą przechowywane przez okres maksymalnie 5 lat od daty realizacji zamówienia.</p>
              <p><strong>Podstawy prawne:</strong> Przetwarzanie danych odbywa się zgodnie z art. 6 ust. 1 lit. a, b i c RODO.</p>
              <p><strong>Prawa użytkownika:</strong> Masz prawo do wglądu, poprawienia, usunięcia lub ograniczenia przetwarzania danych oraz wniesienia sprzeciwu wobec ich przetwarzania.</p>
              <p><strong>Kontakt:</strong> W sprawach związanych z danymi osobowymi prosimy o kontakt: <span className="text-yellow-400">kontakt@bialgruz.pl</span></p>
            </div>
            <button onClick={() => setIsRODOModalOpen(false)} className="absolute top-3 right-3 text-yellow-400 text-xl">×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;