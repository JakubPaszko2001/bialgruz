import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../Components/Supabase';
import { FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown, FaFilePdf } from 'react-icons/fa';

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [editOrder, setEditOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewArchive, setViewArchive] = useState(false);

  // Wyszukiwarka
  const [searchTerm, setSearchTerm] = useState('');

  // Sortowanie
  const [sortBy, setSortBy] = useState(null); // nazwa pola
  const [sortDir, setSortDir] = useState('asc'); // 'asc' | 'desc'

  // ===== Kolumny w tabeli (kolejność w UI/PDF) =====
  const allFields = [
    'name', 'forname', 'phone', 'email', 'nip',
    'rodzajuslugi', 'rodzajodpadu', 'address', 'postcode', 'city',
    'koordynaty', // <— NOWE
    'message', 'platnosc', 'szacowany', 'dataDostawy',
    'numerKontenera', 'numerZlecenia', 'Status', 'dataUtworzenia'
  ];

  useEffect(() => {
  if (isModalOpen) {
    const { style } = document.body;
    const prev = style.overflow;
    style.overflow = 'hidden';
    return () => { style.overflow = prev; };
  }
  }, [isModalOpen]);

  const labelFor = (field) => {
    switch (field) {
      case 'name': return 'Imię';
      case 'forname': return 'Nazwisko';
      case 'phone': return 'Telefon';
      case 'email': return 'E-mail';
      case 'nip': return 'NIP';
      case 'rodzajuslugi': return 'Rodzaj usługi';
      case 'rodzajodpadu': return 'Rodzaj odpadu';
      case 'address': return 'Adres';
      case 'postcode': return 'Kod pocztowy';
      case 'city': return 'Miasto';
      case 'koordynaty': return 'Koordynaty';
      case 'message': return 'Wiadomość';
      case 'platnosc': return 'Płatność';
      case 'szacowany': return 'Szacowany koszt dostawy';
      case 'dataDostawy': return 'Data dostawy';
      case 'numerKontenera': return 'Numer kontenera';
      case 'numerZlecenia': return 'Numer zlecenia';
      case 'Status': return 'Status';
      case 'dataUtworzenia': return 'Data utworzenia';
      default: return field;
    }
  };

  const searchableFields = [
    'name', 'forname', 'phone', 'email', 'nip',
    'address', 'postcode', 'city', 'koordynaty', // <— dodane
    'numerZlecenia', 'numerKontenera',
    'rodzajuslugi', 'rodzajodpadu',
    'message', 'platnosc', 'Status'
  ];

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('Zamówienia')
      .select('*')
      .order('id', { ascending: false });

    if (!error) setOrders(data || []);
    else console.error('Błąd pobierania danych:', error.message);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEdit = (order) => {
    setEditOrder({ ...order });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const { id, ...updatedData } = editOrder;
    const original = orders.find((o) => o.id === id);

    if (!original) {
      setIsModalOpen(false);
      await fetchOrders();
      return;
    }

    let hasChanged = false;
    for (const key in updatedData) {
      if (updatedData[key] !== (original || {})[key]) {
        hasChanged = true;
        break;
      }
    }

    if (!hasChanged) {
      setIsModalOpen(false);
      return;
    }

    const { error } = await supabase.from('Zamówienia').update(updatedData).eq('id', id);
    if (!error) {
      setIsModalOpen(false);
      fetchOrders();
    } else {
      console.error(error.message);
    }
  };

  const confirmDelete = (id) => setDeleteTarget(id);

  const handleDelete = async () => {
    if (deleteTarget == null) return;
    const { error } = await supabase.from('Zamówienia').delete().eq('id', deleteTarget);
    setDeleteTarget(null);
    if (!error) fetchOrders();
    else console.error('Błąd usuwania:', error.message);
  };

  // ===== Helpery =====
  const normalize = (val) =>
    (val ?? '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  const digitsOnly = (val) => (val ?? '').toString().replace(/\D/g, '');
  const isValidDate = (d) => d instanceof Date && !isNaN(d.valueOf());
  const toDateMaybe = (v) => {
    if (!v) return null;
    const d = new Date(v);
    return isValidDate(d) ? d : null;
  };
  const toNumberMaybe = (v) => {
    if (typeof v === 'number') return Number.isFinite(v) ? v : null;
    const s = String(v).replace(',', '.').replace(/[^\d.-]/g, '');
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : null;
  };

  // Filtrowanie
  const filteredOrders = useMemo(() => {
    const term = normalize(searchTerm);
    const termDigits = digitsOnly(searchTerm);

    const searched = !term && !termDigits
      ? orders
      : orders.filter((order) => {
          const haystack =
            searchableFields.map((f) => normalize(order?.[f])).join(' ') +
            ' ' +
            digitsOnly(order?.phone);

          const parts = term.split(/\s+/).filter(Boolean);
          const textMatch = term ? haystack.includes(term) : false;
          const allPartsMatch = parts.length ? parts.every((p) => haystack.includes(p)) : false;
          const phoneMatch = termDigits ? haystack.includes(termDigits) : false;

          return (term ? textMatch || allPartsMatch : false) || (termDigits ? phoneMatch : false);
        });

    // aktywne vs archiwum
    return searched.filter((order) =>
      normalize(order?.Status) === (viewArchive ? 'zrealizowane' : '___active___')
        ? true
        : viewArchive
        ? false
        : normalize(order?.Status) !== 'zrealizowane'
    );
  }, [orders, searchTerm, viewArchive]);

  // Sortowanie
  const sortedOrders = useMemo(() => {
    if (!sortBy) return filteredOrders;

    const collator = new Intl.Collator('pl', { numeric: true, sensitivity: 'base' });
    const dateFields = new Set(['dataUtworzenia', 'dataDostawy']);

    const arr = [...filteredOrders];
    arr.sort((a, b) => {
      const av = a?.[sortBy];
      const bv = b?.[sortBy];

      if (dateFields.has(sortBy)) {
        const ad = toDateMaybe(av);
        const bd = toDateMaybe(bv);
        if (ad && bd) return ad - bd;
        if (ad) return 1;
        if (bd) return -1;
        return 0;
      }

      const an = toNumberMaybe(av);
      const bn = toNumberMaybe(bv);
      if (an !== null && bn !== null) {
        if (an < bn) return -1;
        if (an > bn) return 1;
        return 0;
      }

      const as = av == null ? '' : String(av);
      const bs = bv == null ? '' : String(bv);
      return collator.compare(as, bs);
    });

    if (sortDir === 'desc') arr.reverse();
    return arr;
  }, [filteredOrders, sortBy, sortDir]);

  const handleSort = (field) => {
    if (sortBy !== field) {
      setSortBy(field);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortBy(null);
      setSortDir('asc');
    }
  };

  const renderSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className="inline-block ml-1 opacity-60" />;
    return sortDir === 'asc' ? <FaSortUp className="inline-block ml-1" /> : <FaSortDown className="inline-block ml-1" />;
  };

  // ===== PDF =====
  const handleDownloadPdf = async (order) => {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const fontUrl = '/fonts/Roboto-Regular.ttf'; // albo '/fonts/DejaVuSans.ttf'
    const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
    const toBase64 = (ab) => {
      const u8 = new Uint8Array(ab);
      let s = '';
      for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
      return btoa(s);
    };
    const fontBase64 = toBase64(fontBytes);

    const FONT_FILE = 'Roboto-Regular.ttf';
    const FONT_NAME = 'RobotoPL';

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.addFileToVFS(FONT_FILE, fontBase64);
    doc.addFont(FONT_FILE, FONT_NAME, 'normal');
    doc.setFont(FONT_NAME, 'normal');

    doc.setFontSize(18);
    doc.text('Karta zlecenia', 40, 40);

    const rows = allFields.map((f) => [labelFor(f), String(order?.[f] ?? '')]);

    autoTable(doc, {
      startY: 80,
      head: [['Pole', 'Wartosc']],
      body: rows,
      styles: { font: FONT_NAME, fontSize: 10, cellPadding: 6, valign: 'middle' },
      headStyles: { font: FONT_NAME, fillColor: [234, 179, 8], textColor: 0, halign: 'left' },
      columnStyles: { 0: { cellWidth: 160 } },
      theme: 'grid',
      tableLineColor: [234, 179, 8],
      tableLineWidth: 0.5,
    });

    doc.save(`zlecenie_${order?.numerZlecenia || order?.id || 'pdf'}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white px-4 py-8 font-Main overflow-x-auto">
      {/* Nagłówek */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-yellow-500">Zamówienia</h1>
          <button
            className={`px-4 py-2 rounded font-semibold text-sm transition ${
              viewArchive
                ? 'bg-yellow-600 text-black'
                : 'bg-[#2c2c2c] border border-yellow-500 text-yellow-400'
            }`}
            onClick={() => setViewArchive(!viewArchive)}
          >
            {viewArchive ? 'Pokaż aktywne' : 'Archiwum'}
          </button>
        </div>

        {/* Wyszukiwarka */}
        <div className="w-full md:w-[420px] flex items-stretch gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Szukaj: imię, nazwisko, telefon, e-mail, NIP, adres, miasto, koordynaty..."
            className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-yellow-500 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-yellow-200/60"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
              title="Wyczyść"
            >
              Wyczyść
            </button>
          )}
        </div>
      </div>

      <table className="w-full border border-yellow-400 text-sm">
        <thead>
          <tr className="bg-[#2c2c2c] text-yellow-400">
            {allFields.map((field) => (
              <th key={field} className="border border-yellow-400 px-2 py-1 capitalize select-none">
                <button
                  onClick={() => handleSort(field)}
                  className="w-full text-left hover:text-yellow-200 flex items-center"
                  title={`Sortuj po: ${labelFor(field)}`}
                >
                  <span>{labelFor(field)}</span>
                  {renderSortIcon(field)}
                </button>
              </th>
            ))}
            <th className="border border-yellow-400 px-2 py-1">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order) => (
            <tr key={order.id} className="bg-[#1f1f1f] border-t border-yellow-300">
              {allFields.map((field) => (
                <td key={field} className="px-2 py-1 border border-yellow-400 whitespace-nowrap">
                  {field === 'dataUtworzenia' && order[field]
                    ? new Date(order[field]).toLocaleDateString('pl-PL')
                    : field === 'dataDostawy' && order[field]
                    ? new Date(order[field]).toLocaleDateString('pl-PL')
                    : order[field] ?? ''}
                </td>
              ))}
              <td className="px-2 py-1 border border-yellow-400 whitespace-nowrap text-center">
                <button
                  onClick={() => handleEdit(order)}
                  className="text-yellow-400 hover:text-yellow-200 mr-2"
                  title="Edytuj"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => confirmDelete(order.id)}
                  className="text-red-400 hover:text-red-200 mr-2"
                  title="Usuń"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => handleDownloadPdf(order)}
                  className="text-rose-400 hover:text-rose-200"
                  title="Pobierz PDF"
                >
                  <FaFilePdf />
                </button>
              </td>
            </tr>
          ))}

          {sortedOrders.length === 0 && (
            <tr>
              <td colSpan={allFields.length + 1} className="text-center text-yellow-200 py-6">
                Brak wyników {searchTerm ? <>dla: <span className="font-semibold">{searchTerm}</span></> : '' }
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/70 overscroll-contain">
          <div className="flex items-stretch justify-center p-0 sm:p-8 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] min-h-[100svh]">
            {/* KARTA MODALA = kolumny: header | content (scroll) | footer (na dole) */}
            <div className="w-full sm:max-w-2xl bg-[#2c2c2c] text-white sm:rounded-xl overflow-hidden border border-yellow-500/60 sm:shadow-xl flex flex-col h-[100svh] sm:h-auto sm:max-h-[85vh]">
              {/* Header (cienki) */}
              <div className="shrink-0 bg-[#2c2c2c] border-b border-yellow-500/40 px-3 py-2 flex items-center justify-between">
                <h2 className="text-base sm:text-xl font-bold text-yellow-500">Edytuj zamówienie</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-yellow-400 hover:text-yellow-200 text-xl leading-none px-2"
                  aria-label="Zamknij"
                >
                  ×
                </button>
              </div>
              {/* Treść (scrolluje się) */}
              <div className="flex-1 overflow-y-auto px-3 py-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allFields.map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium mb-1 capitalize text-yellow-400">
                        {labelFor(field)}
                      </label>
                      {field === 'Status' ? (
                        <select
                          value={editOrder?.Status || 'Do realizacji'}
                          onChange={(e) => setEditOrder({ ...editOrder, Status: e.target.value })}
                          className="w-full px-3 py-2 min-h-[40px] bg-[#1a1a1a] border border-yellow-500 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                          <option value="Do realizacji">Do realizacji</option>
                          <option value="Podstawiony">Podstawiony</option>
                          <option value="Do odbioru">Do odbioru</option>
                          <option value="Zrealizowane">Zrealizowane</option>
                        </select>
                      ) : field === 'platnosc' ? (
                        <select
                          value={editOrder?.platnosc || ''}
                          onChange={(e) => setEditOrder({ ...editOrder, platnosc: e.target.value })}
                          className="w-full px-3 py-2 min-h-[40px] bg-[#1a1a1a] border border-yellow-500 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                          <option value="">— wybierz —</option>
                          <option value="gotówka">Gotówka</option>
                          <option value="karta">Karta</option>
                          <option value="przelew">Przelew</option>
                        </select>
                      ) : field === 'dataDostawy' ? (
                        <input
                          type="date"
                          value={editOrder?.dataDostawy ? String(editOrder.dataDostawy).slice(0, 10) : ''}
                          onChange={(e) => setEditOrder({ ...editOrder, dataDostawy: e.target.value })}
                          className="w-full px-3 py-2 min-h-[40px] bg-[#1a1a1a] border border-yellow-500 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={editOrder?.[field] || ''}
                          onChange={(e) => setEditOrder({ ...editOrder, [field]: e.target.value })}
                          className="w-full px-3 py-2 min-h-[40px] bg-[#1a1a1a] border border-yellow-500 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Footer – NA SAMYM DOLE, ŚREDNIA WYSOKOŚĆ */}
              <div className="shrink-0 bg-[#2c2c2c] border-t border-yellow-500/40 px-3 py-2 flex justify-end gap-2">
                <button
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 text-sm rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Anuluj
                </button>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1.5 text-sm rounded font-bold"
                  onClick={handleSave}
                >
                  Zapisz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {deleteTarget && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-[#2c2c2c] text-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center border border-red-500">
            <h2 className="text-xl font-bold mb-4 text-red-400">Potwierdź usunięcie</h2>
            <p className="mb-6">Czy na pewno chcesz usunąć to zamówienie?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Anuluj
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold"
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
