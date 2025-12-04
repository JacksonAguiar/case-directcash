import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Trash2, RefreshCw, DollarSign, TrendingUp, Plus, X } from 'lucide-react';
import { eventsApi, extractValidationErrors, type ValidationError } from '../services/api';
import type { Event } from '../types/event';

export function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'payment' | 'upsell'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<ValidationError[]>([]);
  const [formData, setFormData] = useState({
    type: 'payment' as 'payment' | 'upsell',
    name: '',
    email: '',
    age: 0,
    value: '' as number | '',
    timestamp: new Date().toISOString().slice(0, 16)
  });

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (dateFrom) params.append('date_from', dateFrom);
    if (dateTo) params.append('date_to', dateTo);
    if (typeFilter !== 'all') params.append('type', typeFilter);
    
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    window.history.pushState({}, '', newUrl);
  }, [dateFrom, dateTo, typeFilter]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
      };
      console.log('Fetching events with filters:', filters);
      const data = await eventsApi.getEvents(filters);
      console.log('Events received:', data);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, typeFilter]);

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

  const getFieldError = (fieldName: string): string | undefined => {
    const error = formErrors.find(err => err.field === fieldName);
    return error?.message;
  };

  const clearFieldError = (fieldName: string) => {
    setFormErrors(prev => prev.filter(err => err.field !== fieldName));
  };

  const closeForm = () => {
    setShowAddForm(false);
    setFormErrors([]);
    setFormData({
      type: 'payment',
      name: '',
      age: 0,
      email: '',
      value: '',
      timestamp: new Date().toISOString().slice(0, 16)
    });
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormErrors([]);
    
    try {
      const newEvent = await eventsApi.createEvent({
        ...formData,
        value: formData.value === '' ? 0 : formData.value,
        timestamp: new Date(formData.timestamp).toISOString(),
        createdAt: new Date().toISOString()
      });
      setEvents([newEvent, ...events]);
      setShowAddForm(false);
      setFormData({
        type: 'payment',
        name: '',
        age: 0,
        email: '',
        value: '',
        timestamp: new Date().toISOString().slice(0, 16)
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error creating event:', error);
      const validationErrors = extractValidationErrors(error);
      if (validationErrors.length > 0) {
        setFormErrors(validationErrors);
      } else {
        alert('Erro ao criar evento');
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') as 'payment' | 'upsell' | null;
    const dateFromParam = urlParams.get('date_from') || '';
    const dateToParam = urlParams.get('date_to') || '';
    
    setTypeFilter(type || 'all');
    setDateFrom(dateFromParam);
    setDateTo(dateToParam);
  }, []);

  useEffect(() => {
    fetchEvents();
    updateUrl();
  }, [fetchEvents, updateUrl]);

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

<div className="flex-1 min-w-[150px]">
              <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value as 'all' | 'payment' | 'upsell');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">Todos</option>
                <option value="payment">Vendas</option>
                <option value="upsell">Upsells</option>
              </select>
            </div>

            <button 
              onClick={fetchEvents}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-95 whitespace-nowrap"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Carregando...' : 'Atualizar'}
            </button>

            <button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-5 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus size={18} />
              Adicionar Evento
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

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Adicionar Evento</h2>
                <button
                  onClick={closeForm}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Evento
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => {
                      setFormData({...formData, type: e.target.value as 'payment' | 'upsell'});
                      clearFieldError('type');
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      getFieldError('type') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="payment">Venda</option>
                    <option value="upsell">Upsell</option>
                  </select>
                  {getFieldError('type') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('type')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Cliente
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({...formData, name: e.target.value});
                      clearFieldError('name');
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      getFieldError('name') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {getFieldError('name') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value});
                      clearFieldError('email');
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      getFieldError('email') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {getFieldError('email') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Idade
                  </label>
                  <input
                    id="age"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({...formData, age: value === '' ? 0 : parseFloat(value) || 0});
                      clearFieldError('age');
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      getFieldError('value') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {getFieldError('age') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('value')}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
                    Valor (R$)
                  </label>
                  <input
                    id="value"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({...formData, value: value === '' ? '' : parseFloat(value) || 0});
                      clearFieldError('value');
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      getFieldError('value') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {getFieldError('value') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('value')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 mb-2">
                    Data da Compra
                  </label>
                  <input
                    id="timestamp"
                    type="datetime-local"
                    value={formData.timestamp}
                    onChange={(e) => {
                      setFormData({...formData, timestamp: e.target.value});
                      clearFieldError('timestamp');
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      getFieldError('timestamp') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {getFieldError('timestamp') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('timestamp')}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    {submitting ? 'Salvando...' : 'Adicionar Evento'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
