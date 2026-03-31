import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { supabase } from './Supabase';
import Blik from "../Assets/blik.webp";

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

  // NOWE: tryb współrzędnych
  const [useCoords, setUseCoords] = useState(false);
  const [coordsInput, setCoordsInput] = useState(''); // np. "53.415948, 23.015854" lub link

  const requiredFieldsBase = [
    'rodzajuslugi', 'rodzajodpadu', 'name', 'forname',
    'email', 'phone', 'deliveryDate'
  ];
  // adres wymagany tylko, gdy NIE używamy współrzędnych
  const addressFields = ['address', 'postcode', 'city'];

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
  
    const lastNumber = data[0].numerZlecenia; // <- poprawna nazwa kolumny
    const match = lastNumber.match(/BIAL(\d+)/);
    const nextNumber = match ? parseInt(match[1], 10) + 1 : 1;
    return `BIAL${nextNumber.toString().padStart(4, '0')}`;
  };

  // Parser współrzędnych: z "lat, lon" lub z linku do map
  const parseCoordinates = (input) => {
    if (!input) return null;
    const str = String(input).trim();
    // szukamy dwóch liczb zmiennoprzecinkowych z separatorem "," lub spacją
    const re = /(-?\d{1,3}(?:\.\d+))[^0-9-]+(-?\d{1,3}(?:\.\d+))/;
    const m = str.match(re);
    if (!m) return null;
    const lat = parseFloat(m[1]);
    const lon = parseFloat(m[2]);
    if (!isFinite(lat) || !isFinite(lon)) return null;
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
    return { lat, lon };
  };

  const sendEmail = async (e) => {
    e.preventDefault();
  
    // — pola obowiązkowe niezależnie od adresu/współrzędnych
    const requiredFieldsBase = [
      'rodzajuslugi', 'rodzajodpadu', 'name', 'forname',
      'email', 'phone', 'deliveryDate'
    ];
    // — pola adresowe wymagane TYLKO gdy nie podajemy współrzędnych
    const addressFields = ['address', 'postcode', 'city'];
  
    const newErrors = {};
  
    // Walidacja pól bazowych
    for (const field of requiredFieldsBase) {
      const value = form.current[field]?.value?.trim();
      if (!value) newErrors[field] = 'Uzupełnij to pole';
    }
  
    // NIP tylko gdy checkbox na fakturę
    if (showNIPField && !form.current.nip?.value?.trim()) {
      newErrors.nip = 'Uzupełnij to pole';
    }
  
    // Adres vs współrzędne
    let coords = null;
    if (useCoords) {
      // parser: akceptuje "53.4159, 23.0158" i linki z map
      const re = /(-?\d{1,3}(?:\.\d+))[^0-9-]+(-?\d{1,3}(?:\.\d+))/;
      const str = String(coordsInput || '').trim();
      const m = str.match(re);
      if (m) {
        const lat = parseFloat(m[1]);
        const lon = parseFloat(m[2]);
        if (isFinite(lat) && isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
          coords = { lat, lon };
        }
      }
      if (!coords) newErrors.coords = 'Podaj współrzędne w formacie "53.4159, 23.0158" lub wklej link z map';
    } else {
      for (const f of addressFields) {
        const v = form.current[f]?.value?.trim();
        if (!v) newErrors[f] = 'Uzupełnij to pole';
      }
    }
  
    // Szacowany koszt musi być policzony
    if (estimatedPrice === null) {
      setTransportError(true);
      return;
    } else {
      setTransportError(false);
    }
  
    // Metoda płatności
    if (!paymentMethod) {
      newErrors.platnosc = 'Wybierz metodę płatności';
    }
  
    // Jeśli są błędy – pokaż i wyjdź
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }
  
    setFormErrors({});
    setIsLoading(true);
  
    try {
      const numerZlecenia = await generateOrderNumber();
      const userMessage = form.current.message.value || '';
      // >>> dane wysyłane do Supabase (zapis koordynatów do kolumny "koordynaty")
  const formData = {
    rodzajuslugi: form.current.rodzajuslugi.value,
    rodzajodpadu: form.current.rodzajodpadu.value,
    name: form.current.name.value,
    forname: form.current.forname.value,
  
    // ⬇⬇⬇ bezpieczne odczyty; gdy useCoords — puste
    address: useCoords ? '' : (form.current.address?.value || ''),
    postcode: useCoords ? '' : (form.current.postcode?.value || ''),
    city: useCoords ? '' : (form.current.city?.value || ''),
  
    email: form.current.email.value,
    phone: form.current.phone.value,
    message: userMessage,
    nip: showNIPField ? (form.current.nip?.value?.trim() || null) : null,
    platnosc: paymentMethod,
    szacowany: estimatedPrice?.toString() || null,
    dataDostawy: form.current.deliveryDate?.value || null,
    numerZlecenia,
  
    // zapis współrzędnych do kolumny TEXT
    koordynaty: useCoords && coords ? `${coords.lat}, ${coords.lon}` : null,
  };
    await handleSaveToSupabase(formData);

    // e-mail
    await emailjs.sendForm(
      'service_vkm0g32',
      'template_5n86nfp',
      form.current,
      'H8LWCkDY6CYMOnRKn'
    );

    // reset UI
    form.current.reset();
    setEstimatedPrice(null);
    setPaymentMethod('');
    setCoordsInput('');
    setUseCoords(false);
    setIsSuccessModalOpen(true);
  } catch (error) {
    console.error(error);
    alert('Wystąpił błąd podczas wysyłki/zapisu.');
  } finally {
    setIsLoading(false);
  }
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
      'Kontener 7m³': { 'Czysty gruz': 390, 'Zmieszane': 1390 },
    };
    return cennik[usluga]?.[odpad] ?? 0;
  };

  const updateEstimatedPrice = async () => {
    // Jeżeli są współrzędne – licz bez geokodowania
    if (useCoords) {
      const coords = parseCoordinates(coordsInput);
      if (!coords) {
        setEstimatedPrice(null);
        setFormErrors((p) => ({ ...p, coords: 'Podaj poprawne współrzędne' }));
        return;
      }
      const distance = calculateDistance(53.14717, 23.17618, coords.lat, coords.lon);
      const basePrice = getBasePrice(form.current.rodzajuslugi.value, form.current.rodzajodpadu.value);
      const estimated = Math.round(basePrice + distance * 10.8);
      setEstimatedPrice(estimated);
      setTransportError(false);
      setFormErrors((p) => {
        const { coords, ...rest } = p;
        return rest;
      });
      return;
    }

    // W przeciwnym razie – geokoduj adres
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
        setTransportError(false);
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
      <h2 className="text-3xl font-bold text-white text-center py-12">Złóż zamówienie</h2>
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

          {/* PRZEŁĄCZNIK: współrzędne */}
          <div className="md:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="useCoords"
              className="accent-yellow-500"
              checked={useCoords}
              onChange={(e) => {
                setUseCoords(e.target.checked);
                setFormErrors((prev) => {
                  const updated = { ...prev };
                  delete updated.address; delete updated.postcode; delete updated.city; delete updated.coords;
                  return updated;
                });
              }}
            />
            <label htmlFor="useCoords" className="text-yellow-400">
              Nie mam adresu — podam współrzędne (lat, lon)
            </label>
          </div>

          {/* Adres albo współrzędne */}
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
                name="coords" // trafi też do emailjs
                type="text"
                value={coordsInput}
                onChange={(e) => {
                  setCoordsInput(e.target.value);
                  if (formErrors.coords) {
                    setFormErrors((prev) => {
                      const u = { ...prev }; delete u.coords; return u;
                    });
                  }
                }}
                placeholder="np. 53.415948, 23.015854 lub wklej link z Google Maps"
                className={`w-full p-3 border rounded-md bg-transparent ${
                  formErrors.coords ? 'border-red-500' : 'border-yellow-500'
                }`}
              />
              {formErrors.coords && (
                <p className="text-red-500 text-sm mt-1">{formErrors.coords}</p>
              )}
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
                Karta /
                <img src={Blik} alt="BLIK icon" className="h-4 w-auto" />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="platnosc"
                  value="przelew"
                  className="accent-yellow-500"
                  checked={paymentMethod === 'przelew'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Przelew
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
