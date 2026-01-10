'use client';

import React, { useState, useEffect } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { useRouter } from 'next/navigation';
import { Eye, Search, CheckCircle, XCircle, Clock, FileText, Calculator } from 'lucide-react';
import { getApiEndpoint } from '@/lib/api';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface QuoteRequest {
  id: number;
  email: string;
  customer_name: string | null;
  status: 'pending' | 'quoted' | 'approved' | 'rejected';
  is_read: boolean;
  calculated_brutto: number | null;
  admin_quote_price: number | null;
  created_at: string;
}

interface QuoteDetails extends QuoteRequest {
  customer_phone: string | null;
  comment: string | null;
  necklace_data: {
    threads: Array<{
      thread_number: number;
      length_cm: number;
      beads: Array<{ bead_id: number; position: number }>;
    }>;
    clasp: { bead_id: number } | null;
  };
  admin_notes: string | null;
  admin_quote_currency: string;
  calculated_netto: number | null;
  updated_at: string | null;
  quoted_at: string | null;
  user_id: number | null;
  necklace_configuration_id: number | null;
}

interface BeadCalculation {
  bead_id: number;
  name: string;
  quantity: number;
  price_netto: number;
  price_brutto: number;
  total_netto: number;
  total_brutto: number;
}

interface QuoteCalculation {
  beads: BeadCalculation[];
  total_netto: number;
  total_brutto: number;
  currency: string;
}

export default function QuotesPage() {
  const router = useRouter();

  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<QuoteDetails | null>(null);
  const [calculation, setCalculation] = useState<QuoteCalculation | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);

  const [responseForm, setResponseForm] = useState({
    admin_notes: '',
    admin_quote_price: 0,
    admin_quote_currency: 'PLN',
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchQuotes();
  }, []);

  const fetchQuotes = async (status?: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      let url = '/api/v1/quotes';
      if (status && status !== 'all') {
        url += `?status_filter=${status}`;
      }

      const res = await fetch(getApiEndpoint(url), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setQuotes(data);
      } else if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    fetchQuotes(status);
  };

  const fetchQuoteDetails = async (id: number) => {
    const token = localStorage.getItem('admin_token');

    try {
      const [detailsRes, calcRes] = await Promise.all([
        fetch(getApiEndpoint(`/api/v1/quotes/${id}`), {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(getApiEndpoint(`/api/v1/quotes/${id}/calculation`), {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (detailsRes.ok && calcRes.ok) {
        const details = await detailsRes.json();
        const calc = await calcRes.json();

        setSelectedQuote(details);
        setCalculation(calc);
        setIsDetailsModalOpen(true);

        // Refresh list to update read status
        fetchQuotes(statusFilter === 'all' ? undefined : statusFilter);
      } else {
        alert('Не вдалося завантажити деталі запиту');
      }
    } catch (error) {
      console.error('Failed to fetch quote details:', error);
      alert('Помилка при завантаженні деталей запиту');
    }
  };

  const openRespondModal = () => {
    if (!selectedQuote || !calculation) return;

    setResponseForm({
      admin_notes: selectedQuote.admin_notes || '',
      admin_quote_price: selectedQuote.admin_quote_price || calculation.total_brutto,
      admin_quote_currency: selectedQuote.admin_quote_currency || 'PLN',
    });
    setIsRespondModalOpen(true);
  };

  const handleRespondSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;

    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(
        getApiEndpoint(`/api/v1/quotes/${selectedQuote.id}/respond`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(responseForm),
        }
      );

      if (res.ok) {
        const updated = await res.json();
        setSelectedQuote(updated);
        setIsRespondModalOpen(false);
        fetchQuotes(statusFilter === 'all' ? undefined : statusFilter);
        alert('Відповідь надіслано клієнту!');
      } else {
        const error = await res.json();
        alert(`Помилка: ${error.detail || 'Не вдалося надіслати відповідь'}`);
      }
    } catch (error) {
      console.error('Failed to respond to quote:', error);
      alert('Помилка при відправці відповіді');
    }
  };

  const updateQuoteStatus = async (id: number, status: string) => {
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(getApiEndpoint(`/api/v1/quotes/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        if (selectedQuote && selectedQuote.id === id) {
          const updated = await res.json();
          setSelectedQuote(updated);
        }
        fetchQuotes(statusFilter === 'all' ? undefined : statusFilter);
      } else {
        alert('Не вдалося оновити статус');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.id.toString().includes(searchQuery)
  );

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Очікує';
      case 'quoted':
        return 'Прораховано';
      case 'approved':
        return 'Підтверджено';
      case 'rejected':
        return 'Відхилено';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-coral/20 text-coral';
      case 'quoted':
        return 'bg-sage/20 text-sage';
      case 'approved':
        return 'bg-sage/30 text-ivory';
      case 'rejected':
        return 'bg-oxblood/20 text-oxblood';
      default:
        return 'bg-sage/10 text-sage';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('uk-UA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-deep-black">
      <AdminNav />
      <div className="ml-64 pt-20 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-cinzel text-4xl text-ivory mb-2">
              Запити на Прорахунок Намиста
            </h1>
            <p className="text-sage/70">Переглядайте та відповідайте на запити клієнтів</p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleStatusFilterChange('all')}
                className={`px-4 py-2 rounded-sm transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-oxblood text-ivory'
                    : 'bg-deep-black border border-sage/30 text-ivory hover:border-sage'
                }`}
              >
                Всі
              </button>
              <button
                onClick={() => handleStatusFilterChange('pending')}
                className={`px-4 py-2 rounded-sm transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-oxblood text-ivory'
                    : 'bg-deep-black border border-sage/30 text-ivory hover:border-sage'
                }`}
              >
                Очікує
              </button>
              <button
                onClick={() => handleStatusFilterChange('quoted')}
                className={`px-4 py-2 rounded-sm transition-colors ${
                  statusFilter === 'quoted'
                    ? 'bg-oxblood text-ivory'
                    : 'bg-deep-black border border-sage/30 text-ivory hover:border-sage'
                }`}
              >
                Прораховано
              </button>
              <button
                onClick={() => handleStatusFilterChange('approved')}
                className={`px-4 py-2 rounded-sm transition-colors ${
                  statusFilter === 'approved'
                    ? 'bg-oxblood text-ivory'
                    : 'bg-deep-black border border-sage/30 text-ivory hover:border-sage'
                }`}
              >
                Підтверджено
              </button>
              <button
                onClick={() => handleStatusFilterChange('rejected')}
                className={`px-4 py-2 rounded-sm transition-colors ${
                  statusFilter === 'rejected'
                    ? 'bg-oxblood text-ivory'
                    : 'bg-deep-black border border-sage/30 text-ivory hover:border-sage'
                }`}
              >
                Відхилено
              </button>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage/50" />
              <input
                type="text"
                placeholder="Пошук за ID, email або ім'ям..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
              />
            </div>
          </div>

          {/* Quotes Table */}
          {loading ? (
            <div className="text-center py-12 text-sage/70">Завантаження...</div>
          ) : filteredQuotes.length === 0 ? (
            <div className="text-center py-12 text-sage/70">
              Запити не знайдено
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-sage/30">
                  <tr>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">ID</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Статус</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Клієнт</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Email</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Автопідрахунок</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Ваша Ціна</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Дата</th>
                    <th className="text-left py-4 px-4 text-ivory font-cinzel">Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className={`border-b border-sage/10 hover:bg-deep-black/50 ${
                        !quote.is_read ? 'bg-oxblood/5' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-ivory font-medium">#{quote.id}</span>
                          {!quote.is_read && (
                            <span className="w-2 h-2 rounded-full bg-oxblood"></span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-sm ${getStatusColor(
                            quote.status
                          )}`}
                        >
                          {getStatusLabel(quote.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-ivory">
                        {quote.customer_name || '-'}
                      </td>
                      <td className="py-3 px-4 text-sage/70">{quote.email}</td>
                      <td className="py-3 px-4 text-ivory">
                        {quote.calculated_brutto
                          ? `${quote.calculated_brutto.toFixed(2)} PLN`
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-sage">
                        {quote.admin_quote_price
                          ? `${quote.admin_quote_price.toFixed(2)} PLN`
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-sage/70">
                        {formatDate(quote.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => fetchQuoteDetails(quote.id)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-sage/20 text-sage hover:bg-sage/30 rounded-sm transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Деталі
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quote Details Modal */}
      {isDetailsModalOpen && selectedQuote && calculation && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedQuote(null);
            setCalculation(null);
          }}
          title={`Запит #${selectedQuote.id}`}
        >
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Customer Info */}
            <div className="border-b border-sage/20 pb-4">
              <h3 className="text-lg font-cinzel text-ivory mb-3">Інформація про клієнта</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-sage/70">Ім'я:</span>
                  <p className="text-ivory">{selectedQuote.customer_name || '-'}</p>
                </div>
                <div>
                  <span className="text-sage/70">Email:</span>
                  <p className="text-ivory">{selectedQuote.email}</p>
                </div>
                <div>
                  <span className="text-sage/70">Телефон:</span>
                  <p className="text-ivory">{selectedQuote.customer_phone || '-'}</p>
                </div>
                <div>
                  <span className="text-sage/70">Статус:</span>
                  <select
                    value={selectedQuote.status}
                    onChange={(e) => updateQuoteStatus(selectedQuote.id, e.target.value)}
                    className="mt-1 px-2 py-1 bg-deep-black border border-sage/30 text-ivory rounded-sm text-sm"
                  >
                    <option value="pending">Очікує</option>
                    <option value="quoted">Прораховано</option>
                    <option value="approved">Підтверджено</option>
                    <option value="rejected">Відхилено</option>
                  </select>
                </div>
              </div>
              {selectedQuote.comment && (
                <div className="mt-3">
                  <span className="text-sage/70 text-sm">Коментар:</span>
                  <p className="text-ivory mt-1 bg-sage/5 p-2 rounded-sm">
                    {selectedQuote.comment}
                  </p>
                </div>
              )}
            </div>

            {/* Necklace Configuration */}
            <div className="border-b border-sage/20 pb-4">
              <h3 className="text-lg font-cinzel text-ivory mb-3">Конфігурація намиста</h3>
              <div className="text-sm space-y-2">
                <p className="text-sage/70">
                  Кількість ниток: {selectedQuote.necklace_data.threads.length}
                </p>
                {selectedQuote.necklace_data.threads.map((thread) => (
                  <div key={thread.thread_number} className="bg-sage/5 p-2 rounded-sm">
                    <p className="text-ivory">
                      Нитка {thread.thread_number}: {thread.length_cm} см, {thread.beads.length}{' '}
                      бусин
                    </p>
                  </div>
                ))}
                {selectedQuote.necklace_data.clasp && (
                  <p className="text-sage/70">
                    Застібка: Бусина ID {selectedQuote.necklace_data.clasp.bead_id}
                  </p>
                )}
              </div>
            </div>

            {/* Price Calculation */}
            <div className="border-b border-sage/20 pb-4">
              <h3 className="text-lg font-cinzel text-ivory mb-3 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Автоматичний Підрахунок
              </h3>
              <div className="space-y-2">
                {calculation.beads.map((bead) => (
                  <div
                    key={bead.bead_id}
                    className="flex justify-between text-sm bg-sage/5 p-2 rounded-sm"
                  >
                    <div>
                      <p className="text-ivory">{bead.name}</p>
                      <p className="text-sage/70 text-xs">
                        {bead.quantity} × {bead.price_brutto.toFixed(2)} PLN
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-ivory">{bead.total_brutto.toFixed(2)} PLN</p>
                      <p className="text-sage/70 text-xs">
                        Нетто: {bead.total_netto.toFixed(2)} PLN
                      </p>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-3 border-t border-sage/20">
                  <span className="font-cinzel text-ivory">Разом:</span>
                  <div className="text-right">
                    <p className="text-xl font-bold text-sage">
                      {calculation.total_brutto.toFixed(2)} {calculation.currency}
                    </p>
                    <p className="text-xs text-sage/70">
                      Нетто: {calculation.total_netto.toFixed(2)} {calculation.currency}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Response */}
            {selectedQuote.admin_notes || selectedQuote.admin_quote_price ? (
              <div className="bg-oxblood/10 p-4 rounded-sm">
                <h3 className="text-lg font-cinzel text-ivory mb-3">Ваша Відповідь</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-sage/70">Запропонована ціна:</span>
                    <p className="text-xl font-bold text-sage">
                      {selectedQuote.admin_quote_price?.toFixed(2)}{' '}
                      {selectedQuote.admin_quote_currency}
                    </p>
                  </div>
                  {selectedQuote.admin_notes && (
                    <div>
                      <span className="text-sage/70">Нотатки:</span>
                      <p className="text-ivory mt-1">{selectedQuote.admin_notes}</p>
                    </div>
                  )}
                  {selectedQuote.quoted_at && (
                    <p className="text-sage/70 text-xs">
                      Відправлено: {formatDate(selectedQuote.quoted_at)}
                    </p>
                  )}
                </div>
              </div>
            ) : null}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setIsDetailsModalOpen(false)}>
                Закрити
              </Button>
              <Button onClick={openRespondModal}>
                {selectedQuote.admin_quote_price ? 'Оновити Відповідь' : 'Надіслати Відповідь'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Respond Modal */}
      {isRespondModalOpen && selectedQuote && calculation && (
        <Modal
          isOpen={isRespondModalOpen}
          onClose={() => setIsRespondModalOpen(false)}
          title="Відповідь клієнту"
        >
          <form onSubmit={handleRespondSubmit} className="space-y-4">
            <div className="bg-sage/5 p-3 rounded-sm mb-4">
              <p className="text-sm text-sage/70">Автоматичний підрахунок:</p>
              <p className="text-2xl font-bold text-sage">
                {calculation.total_brutto.toFixed(2)} {calculation.currency}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory mb-1">
                Ваша ціна (PLN) <span className="text-oxblood">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={responseForm.admin_quote_price}
                onChange={(e) =>
                  setResponseForm({
                    ...responseForm,
                    admin_quote_price: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory mb-1">
                Нотатки для клієнта <span className="text-oxblood">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={responseForm.admin_notes}
                onChange={(e) =>
                  setResponseForm({ ...responseForm, admin_notes: e.target.value })
                }
                className="w-full px-3 py-2 bg-deep-black border border-sage/30 text-ivory rounded-sm focus:outline-none focus:border-oxblood"
                placeholder="Додайте деталі про час виготовлення, доставку тощо..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsRespondModalOpen(false)}
              >
                Скасувати
              </Button>
              <Button type="submit">Надіслати Клієнту</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
