import { useEffect, useState } from 'react';
import { supabase } from '../Components/Supabase';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [editOrder, setEditOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewArchive, setViewArchive] = useState(false);

  const allFields = [
    'name', 'forname', 'phone', 'email', 'nip',
    'rodzajuslugi', 'rodzajodpadu', 'address', 'postcode', 'city',
    'message', 'platnosc', 'szacowany', 'dataDostawy', 'numerKontenera', 'numerZlecenia', 'Status', 'dataUtworzenia'
  ];

  const fetchOrders = async () => {
    const { data, error } = await supabase.from('Zamówienia').select('*');
    if (!error) setOrders(data);
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
    let hasChanged = false;

    for (const key in updatedData) {
      if (updatedData[key] !== original[key]) {
        hasChanged = true;
        break;
      }
    }

    if (!hasChanged) return setIsModalOpen(false);

    const { error } = await supabase
      .from('Zamówienia')
      .update(updatedData)
      .eq('id', id);

    if (!error) {
      setIsModalOpen(false);
      fetchOrders();
    } else {
      console.error(error.message);
    }
  };

  const confirmDelete = (id) => setDeleteTarget(id);

  const handleDelete = async () => {
    const { error } = await supabase.from('Zamówienia').delete().eq('id', deleteTarget);
    setDeleteTarget(null);
    if (!error) fetchOrders();
    else console.error('Błąd usuwania:', error.message);
  };

  const filteredOrders = orders.filter(order =>
    viewArchive ? order.Status?.toLowerCase() === 'zrealizowane' : order.Status?.toLowerCase() !== 'zrealizowane'
  );

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white px-4 py-8 font-Main overflow-x-auto">
      <div className="flex items-center justify-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-yellow-500">Zamówienia</h1>
        <button
          className={`px-4 py-2 rounded font-semibold text-sm transition ${
            viewArchive ? 'bg-yellow-600 text-black' : 'bg-[#2c2c2c] border border-yellow-500 text-yellow-400'
          }`}
          onClick={() => setViewArchive(!viewArchive)}
        >
          {viewArchive ? 'Pokaż aktywne' : 'Archiwum'}
        </button>
      </div>

      <table className="w-full border border-yellow-400 text-sm">
        <thead>
          <tr className="bg-[#2c2c2c] text-yellow-400">
            {allFields.map(field => (
              <th key={field} className="border border-yellow-400 px-2 py-1 capitalize">
                {field === 'szacowany'
                  ? 'Szacowany koszt dostawy'
                  : field === 'platnosc'
                  ? 'Płatność'
                  : field === 'dataDostawy'
                  ? 'Data dostawy'
                  : field === 'numerKontenera'
                  ? 'Numer kontenera'
                  : field === 'numerZlecenia'
                  ? 'Numer zlecenia'
                  : field}
              </th>
            ))}
            <th className="border border-yellow-400 px-2 py-1">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.id} className="bg-[#1f1f1f] border-t border-yellow-300">
              {allFields.map(field => (
                <td key={field} className="px-2 py-1 border border-yellow-400 whitespace-nowrap">
                  {field === 'dataUtworzenia' && order[field]
                    ? new Date(order[field]).toLocaleDateString('pl-PL') // formatowanie daty
                    : order[field] || ''}
                </td>
              ))}
              <td className="px-2 py-1 border border-yellow-400 whitespace-nowrap text-center">
                <button onClick={() => handleEdit(order)} className="text-yellow-400 hover:text-yellow-200 mr-2" title="Edytuj">
                  <FaEdit />
                </button>
                <button onClick={() => confirmDelete(order.id)} className="text-red-400 hover:text-red-200" title="Usuń">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-[9999] flex items-center justify-center bg-black bg-opacity-70 overflow-auto py-10">
          <div className="bg-[#2c2c2c] text-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <h2 className="text-2xl font-bold mb-6 text-yellow-500 text-center">Edytuj zamówienie</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allFields.map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1 capitalize text-yellow-400">
                    {field === 'szacowany'
                      ? 'Szacowany koszt dostawy'
                      : field === 'platnosc'
                      ? 'Płatność'
                      : field === 'dataDostawy'
                      ? 'Data dostawy'
                      : field === 'numerKontenera'
                      ? 'Numer kontenera'
                      : field === 'numerZlecenia'
                      ? 'Numer zlecenia'
                      : field}
                  </label>
                  {field === 'Status' ? (
                    <select
                      value={editOrder.Status || 'Do realizacji'}
                      onChange={(e) => setEditOrder({ ...editOrder, Status: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-yellow-500 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="Do realizacji">Do realizacji</option>
                      <option value="Podstawiony">Podstawiony</option>
                      <option value="Do odbioru">Do odbioru</option>
                      <option value="Zrealizowane">Zrealizowane</option>
                    </select>
                  ) : field === 'platnosc' ? (
                    <select
                      value={editOrder.platnosc || ''}
                      onChange={(e) => setEditOrder({ ...editOrder, platnosc: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-yellow-500 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="karta">Karta</option>
                      <option value="gotówka">Gotówka</option>
                    </select>
                  ) : field === 'dataDostawy' ? (
                    <input
                      type="date"
                      value={editOrder.dataDostawy?.slice(0, 10) || ''}
                      onChange={(e) => setEditOrder({ ...editOrder, dataDostawy: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-yellow-500 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  ) : (
                    <input
                      type="text"
                      value={editOrder[field] || ''}
                      onChange={(e) => setEditOrder({ ...editOrder, [field]: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-yellow-500 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded mr-3"
                onClick={() => setIsModalOpen(false)}
              >
                Anuluj
              </button>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-bold"
                onClick={handleSave}
              >
                Zapisz
              </button>
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
