import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Trash2, RefreshCw, DollarSign, TrendingUp } from 'lucide-react';
import { eventsApi } from '../services/api';
import type { Event } from '../types/event';

export function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const filters = {
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      };
      const data = await eventsApi.getEvents(filters);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este evento?')) return;
    
    try {
      await eventsApi.deleteEvent(id);
      setEvents(events.filter((e: Event) => e.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Erro ao excluir evento');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const totalRevenue = events.reduce((sum: number, event: Event) => sum + event.value, 0);
  const paymentCount = events.filter((e: Event) => e.type === 'payment').length;
  const upsellCount = events.filter((e: Event) => e.type === 'upsell').length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Clientes</h1>
          <p className="text-gray-600">Acompanhamento de vendas e upsells</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
              <DollarSign size={24} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
              <DollarSign size={24} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Vendas</p>
              <p className="text-2xl font-bold text-gray-900">{paymentCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white">
              <TrendingUp size={24} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Upsells</p>
              <p className="text-2xl font-bold text-gray-900">{upsellCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-2">
                Data Inicial
              </label>
              <input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-2">
                Data Final
              </label>
              <input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button 
              onClick={fetchEvents}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-95 whitespace-nowrap"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Carregando...' : 'Atualizar'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">E-mail</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Data da Compra</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-600">
                      {loading ? 'Carregando...' : 'Nenhum evento encontrado'}
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                          event.type === 'payment' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {event.type === 'payment' ? 'Venda' : 'Upsell'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{event.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{event.email}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {event.value.toLocaleString('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {format(new Date(event.timestamp), 'dd/MM/yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(event.id)}
                          title="Excluir evento"
                          className="inline-flex items-center justify-center p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
