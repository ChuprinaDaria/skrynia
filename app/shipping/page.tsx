import React from 'react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-cinzel text-4xl md:text-5xl text-ivory mb-4">
              Доставка та Оплата
            </h1>
            <p className="font-inter text-sage text-lg">
              Інформація про доставку та способи оплати
            </p>
          </div>

          <div className="space-y-8">
            <section className="bg-footer-black border border-sage/20 rounded-sm p-8">
              <h2 className="font-cinzel text-2xl text-ivory mb-4">Доставка</h2>
              <div className="space-y-4 text-sage font-inter">
                <p>
                  Ми відправляємо замовлення по всьому Європейському Союзу через надійні
                  кур'єрські служби.
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-oxblood mt-1">✓</span>
                    <span>Безкоштовна доставка при замовленні від 1000 zł</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-oxblood mt-1">✓</span>
                    <span>Стандартна доставка: 50 zł (3-5 робочих днів)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-oxblood mt-1">✓</span>
                    <span>Експрес доставка: 100 zł (1-2 робочі дні)</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="bg-footer-black border border-sage/20 rounded-sm p-8">
              <h2 className="font-cinzel text-2xl text-ivory mb-4">Способи оплати</h2>
              <div className="space-y-4 text-sage font-inter">
                <p>Ми приймаємо наступні способи оплати:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-oxblood mt-1">✓</span>
                    <span>Кредитні/дебетові картки (Visa, Mastercard)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-oxblood mt-1">✓</span>
                    <span>PayPal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-oxblood mt-1">✓</span>
                    <span>Банківський переказ</span>
                  </li>
                </ul>
                <p className="text-sm italic">
                  Усі платежі захищені SSL-шифруванням
                </p>
              </div>
            </section>

            <section className="bg-footer-black border border-sage/20 rounded-sm p-8">
              <h2 className="font-cinzel text-2xl text-ivory mb-4">Повернення</h2>
              <div className="space-y-4 text-sage font-inter">
                <p>
                  Ми хочемо, щоб ви були задоволені своєю покупкою. Якщо з якоїсь причини
                  ви не задоволені, ви можете повернути товар протягом 14 днів.
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-oxblood mt-1">✓</span>
                    <span>14 днів на повернення</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-oxblood mt-1">✓</span>
                    <span>Товар має бути в оригінальному стані</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-oxblood mt-1">✓</span>
                    <span>Повне відшкодування коштів</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
