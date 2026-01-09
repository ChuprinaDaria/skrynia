'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

const termsContent: Record<string, any> = {
  UA: {
    title: 'Регламент інтернет-магазину RuneBox',
    sections: [
      {
        title: '§1 Дані продавця',
        content: (
          <>
            <p className="mb-4">
              <strong>Назва:</strong> DARIA CHUPRINA<br/>
              <strong>NIP:</strong> 8982319083<br/>
              <strong>REGON:</strong> 54139005400000<br/>
              <strong>Адреса:</strong> ul. Wojciecha Gersona 9/7, 51-664 Wrocław, Польща<br/>
              <strong>Email:</strong> runebox@lazysoft.pl<br/>
              <strong>Телефон:</strong> +48 727 842 737
            </p>
          </>
        ),
      },
      {
        title: '§2 Визначення',
        content: (
          <>
            <p className="mb-2">
              <strong>Інтернет-магазин</strong> – веб-сайт, доступний за адресою runebox.eu, де продавець надає послуги електронної комерції.
            </p>
            <p className="mb-2">
              <strong>Клієнт</strong> – фізична особа, юридична особа або організаційна одиниця без статусу юридичної особи, яка використовує послуги інтернет-магазину.
            </p>
            <p className="mb-2">
              <strong>Товар</strong> – етнічні продукти, біжутерія з рунами та інші вироби, доступні в інтернет-магазині.
            </p>
          </>
        ),
      },
      {
        title: '§3 Умови оплати',
        content: (
          <>
            <p className="mb-2">
              Магазин приймає платежі через систему Przelewy24.
            </p>
            <p className="mb-2">
              <strong>Оператор платежів:</strong> PayPro S.A., ul. Kanclerska 15, 60-327 Poznań.
            </p>
            <p className="mb-2">
              Доступні методи: онлайн-перекази, BLIK, платіжні картки (Visa, Mastercard).
            </p>
            <p className="mb-2">
              <strong>Оператор платіжних карток:</strong> PayPro SA Agent Rozliczeniowy, ul. Pastelowa 8, 60-198 Poznań, KRS 0000347935, NIP 7792369887, REGON 301345068.
            </p>
          </>
        ),
      },
      {
        title: '§4 Доставка',
        content: (
          <>
            <p className="mb-2">Доступні методи доставки:</p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>InPost Paczkomaty (Польща)</li>
              <li>Poczta Polska</li>
              <li>Nova Poshta (Україна)</li>
              <li>DHL (міжнародна)</li>
            </ul>
          </>
        ),
      },
      {
        title: '§5 Право відступу від договору',
        content: (
          <>
            <p className="mb-2">
              Клієнт має право відступити від договору протягом 14 днів без вказання причини.
            </p>
            <p className="mb-2">
              <Link href="/odstapienie" className="text-oxblood hover:underline">
                Форма відступу від договору
              </Link>
            </p>
          </>
        ),
      },
      {
        title: '§6 Рекламації',
        content: (
          <>
            <p className="mb-2">
              Рекламації можна подавати на адресу: <a href="mailto:runebox@lazysoft.pl" className="text-oxblood hover:underline">runebox@lazysoft.pl</a>
            </p>
            <p className="mb-2">
              Рекламація буде розглянута протягом 14 робочих днів.
            </p>
          </>
        ),
      },
    ],
  },
  EN: {
    title: 'RuneBox Online Store Terms & Conditions',
    sections: [
      {
        title: '§1 Seller Information',
        content: (
          <>
            <p className="mb-4">
              <strong>Name:</strong> DARIA CHUPRINA<br/>
              <strong>NIP:</strong> 8982319083<br/>
              <strong>REGON:</strong> 54139005400000<br/>
              <strong>Address:</strong> ul. Wojciecha Gersona 9/7, 51-664 Wrocław, Poland<br/>
              <strong>Email:</strong> runebox@lazysoft.pl<br/>
              <strong>Phone:</strong> +48 727 842 737
            </p>
          </>
        ),
      },
      {
        title: '§2 Definitions',
        content: (
          <>
            <p className="mb-2">
              <strong>Online Store</strong> – website available at runebox.eu where the seller provides e-commerce services.
            </p>
            <p className="mb-2">
              <strong>Client</strong> – natural person, legal entity or organizational unit without legal personality using the online store services.
            </p>
            <p className="mb-2">
              <strong>Product</strong> – ethnic products, rune jewelry and other items available in the online store.
            </p>
          </>
        ),
      },
      {
        title: '§3 Payment Terms',
        content: (
          <>
            <p className="mb-2">
              The store accepts payments through Przelewy24 system.
            </p>
            <p className="mb-2">
              <strong>Payment Operator:</strong> PayPro S.A., ul. Kanclerska 15, 60-327 Poznań.
            </p>
            <p className="mb-2">
              Available methods: online transfers, BLIK, payment cards (Visa, Mastercard).
            </p>
            <p className="mb-2">
              <strong>Card Payment Operator:</strong> PayPro SA Agent Rozliczeniowy, ul. Pastelowa 8, 60-198 Poznań, KRS 0000347935, NIP 7792369887, REGON 301345068.
            </p>
          </>
        ),
      },
      {
        title: '§4 Delivery',
        content: (
          <>
            <p className="mb-2">Available delivery methods:</p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>InPost Paczkomaty (Poland)</li>
              <li>Poczta Polska</li>
              <li>Nova Poshta (Ukraine)</li>
              <li>DHL (International)</li>
            </ul>
          </>
        ),
      },
      {
        title: '§5 Right of Withdrawal',
        content: (
          <>
            <p className="mb-2">
              The client has the right to withdraw from the contract within 14 days without giving a reason.
            </p>
            <p className="mb-2">
              <Link href="/odstapienie" className="text-oxblood hover:underline">
                Withdrawal Form
              </Link>
            </p>
          </>
        ),
      },
      {
        title: '§6 Complaints',
        content: (
          <>
            <p className="mb-2">
              Complaints can be submitted to: <a href="mailto:runebox@lazysoft.pl" className="text-oxblood hover:underline">runebox@lazysoft.pl</a>
            </p>
            <p className="mb-2">
              The complaint will be reviewed within 14 business days.
            </p>
          </>
        ),
      },
    ],
  },
  DE: {
    title: 'AGB des Online-Shops RuneBox',
    sections: [
      {
        title: '§1 Verkäuferdaten',
        content: (
          <>
            <p className="mb-4">
              <strong>Name:</strong> DARIA CHUPRINA<br/>
              <strong>NIP:</strong> 8982319083<br/>
              <strong>REGON:</strong> 54139005400000<br/>
              <strong>Adresse:</strong> ul. Wojciecha Gersona 9/7, 51-664 Wrocław, Polen<br/>
              <strong>Email:</strong> runebox@lazysoft.pl<br/>
              <strong>Telefon:</strong> +48 727 842 737
            </p>
          </>
        ),
      },
      {
        title: '§2 Definitionen',
        content: (
          <>
            <p className="mb-2">
              <strong>Online-Shop</strong> – Website unter runebox.eu, auf der der Verkäufer E-Commerce-Dienste anbietet.
            </p>
            <p className="mb-2">
              <strong>Kunde</strong> – natürliche Person, juristische Person oder Organisationseinheit ohne Rechtspersönlichkeit, die die Dienste des Online-Shops nutzt.
            </p>
            <p className="mb-2">
              <strong>Produkt</strong> – ethnische Produkte, Runenschmuck und andere Artikel, die im Online-Shop erhältlich sind.
            </p>
          </>
        ),
      },
      {
        title: '§3 Zahlungsbedingungen',
        content: (
          <>
            <p className="mb-2">
              Der Shop akzeptiert Zahlungen über das Przelewy24-System.
            </p>
            <p className="mb-2">
              <strong>Zahlungsbetreiber:</strong> PayPro S.A., ul. Kanclerska 15, 60-327 Poznań.
            </p>
            <p className="mb-2">
              Verfügbare Methoden: Online-Überweisungen, BLIK, Zahlungskarten (Visa, Mastercard).
            </p>
            <p className="mb-2">
              <strong>Kartenzahlungsbetreiber:</strong> PayPro SA Agent Rozliczeniowy, ul. Pastelowa 8, 60-198 Poznań, KRS 0000347935, NIP 7792369887, REGON 301345068.
            </p>
          </>
        ),
      },
      {
        title: '§4 Lieferung',
        content: (
          <>
            <p className="mb-2">Verfügbare Liefermethoden:</p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>InPost Paczkomaty (Polen)</li>
              <li>Poczta Polska</li>
              <li>Nova Poshta (Ukraine)</li>
              <li>DHL (International)</li>
            </ul>
          </>
        ),
      },
      {
        title: '§5 Widerrufsrecht',
        content: (
          <>
            <p className="mb-2">
              Der Kunde hat das Recht, innerhalb von 14 Tagen ohne Angabe von Gründen vom Vertrag zurückzutreten.
            </p>
            <p className="mb-2">
              <Link href="/odstapienie" className="text-oxblood hover:underline">
                Widerrufsformular
              </Link>
            </p>
          </>
        ),
      },
      {
        title: '§6 Beschwerden',
        content: (
          <>
            <p className="mb-2">
              Beschwerden können an folgende Adresse gesendet werden: <a href="mailto:runebox@lazysoft.pl" className="text-oxblood hover:underline">runebox@lazysoft.pl</a>
            </p>
            <p className="mb-2">
              Die Beschwerde wird innerhalb von 14 Werktagen bearbeitet.
            </p>
          </>
        ),
      },
    ],
  },
  PL: {
    title: 'Regulamin sklepu internetowego RuneBox',
    sections: [
      {
        title: '§1 Dane sprzedawcy',
        content: (
          <>
            <p className="mb-4">
              <strong>Nazwa:</strong> DARIA CHUPRINA<br/>
              <strong>NIP:</strong> 8982319083<br/>
              <strong>REGON:</strong> 54139005400000<br/>
              <strong>Adres:</strong> ul. Wojciecha Gersona 9/7, 51-664 Wrocław, Polska<br/>
              <strong>Email:</strong> runebox@lazysoft.pl<br/>
              <strong>Telefon:</strong> +48 727 842 737
            </p>
          </>
        ),
      },
      {
        title: '§2 Definicje',
        content: (
          <>
            <p className="mb-2">
              <strong>Sklep internetowy</strong> – serwis internetowy dostępny pod adresem runebox.eu, gdzie sprzedawca świadczy usługi handlu elektronicznego.
            </p>
            <p className="mb-2">
              <strong>Klient</strong> – osoba fizyczna, prawna lub jednostka organizacyjna bez osobowości prawnej korzystająca z usług sklepu internetowego.
            </p>
            <p className="mb-2">
              <strong>Towar</strong> – produkty etniczne, biżuteria z runami i inne wyroby dostępne w sklepie internetowym.
            </p>
          </>
        ),
      },
      {
        title: '§3 Warunki płatności',
        content: (
          <>
            <p className="mb-2">
              Sklep przyjmuje płatności przez system Przelewy24.
            </p>
            <p className="mb-2">
              <strong>Operatorem płatności</strong> jest PayPro S.A., ul. Kanclerska 15, 60-327 Poznań.
            </p>
            <p className="mb-2">
              Dostępne metody: przelewy online, BLIK, karty płatnicze (Visa, Mastercard).
            </p>
            <p className="mb-2">
              <strong>Operatorem kart płatniczych</strong> jest PayPro SA Agent Rozliczeniowy, ul. Pastelowa 8, 60-198 Poznań, KRS 0000347935, NIP 7792369887, REGON 301345068.
            </p>
          </>
        ),
      },
      {
        title: '§4 Dostawa',
        content: (
          <>
            <p className="mb-2">Dostępne metody dostawy:</p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>InPost Paczkomaty (Polska)</li>
              <li>Poczta Polska</li>
              <li>Nova Poshta (Ukraina)</li>
              <li>DHL (międzynarodowa)</li>
            </ul>
          </>
        ),
      },
      {
        title: '§5 Prawo odstąpienia od umowy',
        content: (
          <>
            <p className="mb-2">
              Klient ma prawo odstąpić od umowy w terminie 14 dni bez podania przyczyny.
            </p>
            <p className="mb-2">
              <Link href="/odstapienie" className="text-oxblood hover:underline">
                Wzór formularza odstąpienia
              </Link>
            </p>
          </>
        ),
      },
      {
        title: '§6 Reklamacje',
        content: (
          <>
            <p className="mb-2">
              Reklamacje można składać na adres: <a href="mailto:runebox@lazysoft.pl" className="text-oxblood hover:underline">runebox@lazysoft.pl</a>
            </p>
            <p className="mb-2">
              Reklamacja zostanie rozpatrzona w ciągu 14 dni roboczych.
            </p>
          </>
        ),
      },
    ],
  },
};

export default function RegulaminPage() {
  const { t, language } = useLanguage();
  const content = termsContent[language] || termsContent['PL'];

  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-rutenia text-4xl md:text-5xl text-ivory mb-12 text-center">
            {content.title}
          </h1>
          
          <div className="space-y-8 text-ivory">
            {content.sections.map((section: any, index: number) => (
              <section key={index} className="bg-footer-black/50 p-6 rounded-lg border border-sage/20">
                <h2 className="font-rutenia text-2xl text-oxblood mb-4">
                  {section.title}
                </h2>
                <div className="text-sage leading-relaxed">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

