import React from 'react';
import AlatyrIcon from '@/components/ui/icons/AlatyrIcon';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <AlatyrIcon size={120} variant="oxblood" />
            </div>
            <h1 className="font-cinzel text-4xl md:text-5xl text-ivory mb-6">
              Про Скриню Пані Дарії
            </h1>
            <p className="font-inter text-sage text-lg">
              Автентичні прикраси ручної роботи з душею та історією
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8 font-inter text-ivory leading-relaxed">
            <section>
              <h2 className="font-cinzel text-2xl md:text-3xl text-ivory mb-4">
                Наша Історія
              </h2>
              <p className="text-sage">
                Кожна прикраса в нашій колекції — це не просто аксесуар, а портал до історії наших предків.
                Ми створюємо автентичні вироби за справжніми археологічними зразками, використовуючи
                давні техніки та натуральні матеріали.
              </p>
            </section>

            <section>
              <h2 className="font-cinzel text-2xl md:text-3xl text-ivory mb-4">
                Наша Місія
              </h2>
              <p className="text-sage">
                Зберегти та передати красу слов'янської, вікінгської та кельтської культур через
                унікальні вироби ручної роботи. Кожна прикраса несе в собі символіку, силу та мудрість
                древніх традицій.
              </p>
            </section>

            <section>
              <h2 className="font-cinzel text-2xl md:text-3xl text-ivory mb-4">
                Якість та Автентичність
              </h2>
              <div className="space-y-4 text-sage">
                <p>
                  Ми використовуємо тільки натуральні матеріали:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Натуральний корал із Середземномор'я</li>
                  <li>Срібло 925 проби</li>
                  <li>Бурштин із Балтики</li>
                  <li>Натуральне каміння</li>
                </ul>
                <p>
                  Кожен виріб створюється вручну з дотриманням старовинних технік та
                  з повагою до традицій наших предків.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
