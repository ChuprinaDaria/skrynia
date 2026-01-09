'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Button from '@/components/ui/Button';
import { getApiEndpoint } from '@/lib/api';

const withdrawalContent: Record<string, any> = {
  UA: {
    title: 'Форма відступу від договору',
    form: {
      name: 'Ім\'я та прізвище',
      address: 'Адреса',
      orderNumber: 'Номер замовлення',
      orderDate: 'Дата укладення договору',
      productName: 'Назва товару',
      statement: 'Надаю інформацію про мій відступ від договору купівлі-продажу наступного товару:',
      submit: 'Відправити',
      submitting: 'Відправка...',
      success: 'Ваш запит прийнято! Ми зв\'яжемося з вами найближчим часом.',
    },
  },
  EN: {
    title: 'Withdrawal Form',
    form: {
      name: 'Full Name',
      address: 'Address',
      orderNumber: 'Order Number',
      orderDate: 'Contract Date',
      productName: 'Product Name',
      statement: 'I hereby inform you of my withdrawal from the sales contract for the following product:',
      submit: 'Submit',
      submitting: 'Submitting...',
      success: 'Your request has been received! We will contact you shortly.',
    },
  },
  DE: {
    title: 'Widerrufsformular',
    form: {
      name: 'Vollständiger Name',
      address: 'Adresse',
      orderNumber: 'Bestellnummer',
      orderDate: 'Vertragsdatum',
      productName: 'Produktname',
      statement: 'Hiermit teile ich Ihnen meinen Widerruf vom Kaufvertrag für folgendes Produkt mit:',
      submit: 'Absenden',
      submitting: 'Wird gesendet...',
      success: 'Ihre Anfrage wurde erhalten! Wir werden uns in Kürze bei Ihnen melden.',
    },
  },
  PL: {
    title: 'Formularz odstąpienia od umowy',
    form: {
      name: 'Imię i nazwisko',
      address: 'Adres',
      orderNumber: 'Numer zamówienia',
      orderDate: 'Data zawarcia umowy',
      productName: 'Nazwa produktu',
      statement: 'Niniejszym informuję o moim odstąpieniu od umowy sprzedaży następującego towaru:',
      submit: 'Wyślij',
      submitting: 'Wysyłanie...',
      success: 'Twoje żądanie zostało przyjęte! Skontaktujemy się z Tobą wkrótce.',
    },
  },
};

export default function OdstapieniePage() {
  const { t, language } = useLanguage();
  const content = withdrawalContent[language] || withdrawalContent['PL'];
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    orderNumber: '',
    orderDate: '',
    productName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch(getApiEndpoint('/api/v1/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: '', // Withdrawal form doesn't require email
          subject: `Withdrawal Request - Order ${formData.orderNumber}`,
          message: `Withdrawal request:\n\nName: ${formData.name}\nAddress: ${formData.address}\nOrder Number: ${formData.orderNumber}\nOrder Date: ${formData.orderDate}\nProduct: ${formData.productName}`,
        }),
      });

      setIsSuccess(true);
      setFormData({
        name: '',
        address: '',
        orderNumber: '',
        orderDate: '',
        productName: '',
      });
    } catch (error) {
      console.error('Error submitting withdrawal form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-rutenia text-4xl md:text-5xl text-ivory mb-12 text-center">
            {content.title}
          </h1>

          {isSuccess ? (
            <div className="bg-footer-black/50 p-6 rounded-lg border border-sage/20 text-center">
              <p className="text-ivory text-lg mb-4">{content.form.success}</p>
              <Button onClick={() => setIsSuccess(false)} className="mx-auto">
                {language === 'UA' ? 'Відправити ще один запит' : language === 'PL' ? 'Wyślij kolejne żądanie' : language === 'DE' ? 'Weitere Anfrage senden' : 'Submit another request'}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-footer-black/50 p-6 rounded-lg border border-sage/20">
                <label className="block text-ivory mb-2">
                  {content.form.name} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-black border border-sage/30 rounded text-ivory focus:outline-none focus:border-oxblood"
                />
              </div>

              <div className="bg-footer-black/50 p-6 rounded-lg border border-sage/20">
                <label className="block text-ivory mb-2">
                  {content.form.address} *
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-deep-black border border-sage/30 rounded text-ivory focus:outline-none focus:border-oxblood"
                />
              </div>

              <div className="bg-footer-black/50 p-6 rounded-lg border border-sage/20">
                <label className="block text-ivory mb-2">
                  {content.form.orderNumber} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-black border border-sage/30 rounded text-ivory focus:outline-none focus:border-oxblood"
                />
              </div>

              <div className="bg-footer-black/50 p-6 rounded-lg border border-sage/20">
                <label className="block text-ivory mb-2">
                  {content.form.orderDate} *
                </label>
                <input
                  type="date"
                  required
                  value={formData.orderDate}
                  onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-black border border-sage/30 rounded text-ivory focus:outline-none focus:border-oxblood"
                />
              </div>

              <div className="bg-footer-black/50 p-6 rounded-lg border border-sage/20">
                <label className="block text-ivory mb-2">
                  {content.form.productName} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-black border border-sage/30 rounded text-ivory focus:outline-none focus:border-oxblood"
                />
              </div>

              <div className="bg-footer-black/50 p-6 rounded-lg border border-sage/20">
                <p className="text-sage mb-4">{content.form.statement}</p>
                <p className="text-ivory font-semibold">{formData.productName || '...'}</p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? content.form.submitting : content.form.submit}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

