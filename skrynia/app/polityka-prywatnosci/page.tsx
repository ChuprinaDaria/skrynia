'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const privacyContent: Record<string, any> = {
  UA: {
    title: 'Політика конфіденційності',
    sections: [
      {
        title: 'Адміністратор даних',
        content: (
          <>
            <p className="mb-4">
              <strong>DARIA CHUPRINA</strong><br/>
              NIP: 8982319083<br/>
              Адреса: ul. Wojciecha Gersona 9/7, 51-664 Wrocław<br/>
              Email: <a href="mailto:runebox@lazysoft.pl" className="text-oxblood hover:underline">runebox@lazysoft.pl</a>
            </p>
          </>
        ),
      },
      {
        title: 'Цілі обробки даних',
        content: (
          <>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Реалізація замовлень (підстава: договір)</li>
              <li>Обслуговування рекламацій (підстава: договір)</li>
              <li>Маркетинг (підстава: згода)</li>
              <li>Аналітика (Google Analytics)</li>
            </ul>
          </>
        ),
      },
      {
        title: 'Період зберігання',
        content: (
          <>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Дані замовлень: 5 років (вимоги бухгалтерського обліку)</li>
              <li>Маркетингові дані: до відкликання згоди</li>
              <li>Логи сервера: 30 днів</li>
            </ul>
          </>
        ),
      },
      {
        title: 'Права користувача',
        content: (
          <>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Право доступу до даних</li>
              <li>Право на виправлення</li>
              <li>Право на видалення ("право на забуття")</li>
              <li>Право на обмеження обробки</li>
              <li>Право на перенесення даних</li>
            </ul>
          </>
        ),
      },
      {
        title: 'Cookies',
        content: (
          <>
            <p className="mb-2">Сайт використовує файли cookies для:</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Збереження кошика</li>
              <li>Аналізу трафіку (Google Analytics)</li>
              <li>Мовних налаштувань</li>
            </ul>
          </>
        ),
      },
    ],
  },
  EN: {
    title: 'Privacy Policy',
    sections: [
      {
        title: 'Data Administrator',
        content: (
          <>
            <p className="mb-4">
              <strong>DARIA CHUPRINA</strong><br/>
              NIP: 8982319083<br/>
              Address: ul. Wojciecha Gersona 9/7, 51-664 Wrocław<br/>
              Email: <a href="mailto:runebox@lazysoft.pl" className="text-oxblood hover:underline">runebox@lazysoft.pl</a>
            </p>
          </>
        ),
      },
      {
        title: 'Data Processing Purposes',
        content: (
          <>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Order fulfillment (basis: contract)</li>
              <li>Complaint handling (basis: contract)</li>
              <li>Marketing (basis: consent)</li>
              <li>Analytics (Google Analytics)</li>
            </ul>
          </>
        ),
      },
      {
        title: 'Retention Period',
        content: (
          <>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Order data: 5 years (accounting requirements)</li>
              <li>Marketing data: until consent withdrawal</li>
              <li>Server logs: 30 days</li>
            </ul>
          </>
        ),
      },
      {
        title: 'User Rights',
        content: (
          <>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Right to access data</li>
              <li>Right to rectification</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restriction of processing</li>
              <li>Right to data portability</li>
            </ul>
          </>
        ),
      },
      {
        title: 'Cookies',
        content: (
          <>
            <p className="mb-2">The website uses cookies for:</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Saving cart</li>
              <li>Traffic analysis (Google Analytics)</li>
              <li>Language settings</li>
            </ul>
          </>
        ),
      },
    ],
  },
  DE: {
    title: 'Datenschutzerklärung',
    sections: [
      {
        title: 'Datenadministrator',
        content: (
          <>
            <p className="mb-4">
              <strong>DARIA CHUPRINA</strong><br/>
              NIP: 8982319083<br/>
              Adresse: ul. Wojciecha Gersona 9/7, 51-664 Wrocław<br/>
              Email: <a href="mailto:runebox@lazysoft.pl" className="text-oxblood hover:underline">runebox@lazysoft.pl</a>
            </p>
          </>
        ),
      },
      {
        title: 'Zwecke der Datenverarbeitung',
        content: (
          <>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Bestellabwicklung (Grundlage: Vertrag)</li>
              <li>Beschwerdebearbeitung (Grundlage: Vertrag)</li>
              <li>Marketing (Grundlage: Einwilligung)</li>
              <li>Analyse (Google Analytics)</li>
            </ul>
          </>
        ),
      },
      {
        title: 'Aufbewahrungsfrist',
        content: (
          <>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Bestelldaten: 5 Jahre (Buchhaltungsanforderungen)</li>
              <li>Marketingdaten: bis zum Widerruf der Einwilligung</li>
              <li>Server-Logs: 30 Tage</li>
            </ul>
          </>
        ),
      },
      {
        title: 'Benutzerrechte',
        content: (
          <>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Recht auf Zugang zu Daten</li>
              <li>Recht auf Berichtigung</li>
              <li>Recht auf Löschung ("Recht auf Vergessenwerden")</li>
              <li>Recht auf Einschränkung der Verarbeitung</li>
              <li>Recht auf Datenübertragbarkeit</li>
            </ul>
          </>
        ),
      },
      {
        title: 'Cookies',
        content: (
          <>
            <p className="mb-2">Die Website verwendet Cookies für:</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Warenkorb speichern</li>
              <li>Verkehrsanalyse (Google Analytics)</li>
              <li>Spracheinstellungen</li>
            </ul>
          </>
        ),
      },
    ],
  },
  PL: {
    title: 'Polityka Prywatności',
    sections: [
      {
        title: 'Administrator danych',
        content: (
          <>
            <p className="mb-4">
              <strong>DARIA CHUPRINA</strong><br/>
              NIP: 8982319083<br/>
              Adres: ul. Wojciecha Gersona 9/7, 51-664 Wrocław<br/>
              Email: <a href="mailto:runebox@lazysoft.pl" className="text-oxblood hover:underline">runebox@lazysoft.pl</a>
            </p>
          </>
        ),
      },
      {
        title: 'Cele przetwarzania danych',
        content: (
          <>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Realizacja zamówień (podstawa: umowa)</li>
              <li>Obsługa reklamacji (podstawa: umowa)</li>
              <li>Marketing (podstawa: zgoda)</li>
              <li>Analityka (Google Analytics)</li>
            </ul>
          </>
        ),
      },
      {
        title: 'Okres przechowywania',
        content: (
          <>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Dane zamówień: 5 lat (wymogi księgowe)</li>
              <li>Dane marketingowe: do cofnięcia zgody</li>
              <li>Logi serwera: 30 dni</li>
            </ul>
          </>
        ),
      },
      {
        title: 'Prawa użytkownika',
        content: (
          <>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Prawo dostępu do danych</li>
              <li>Prawo do sprostowania</li>
              <li>Prawo do usunięcia ("prawo do bycia zapomnianym")</li>
              <li>Prawo do ograniczenia przetwarzania</li>
              <li>Prawo do przenoszenia danych</li>
            </ul>
          </>
        ),
      },
      {
        title: 'Cookies',
        content: (
          <>
            <p className="mb-2">Strona używa plików cookies do:</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Zapamiętywania koszyka</li>
              <li>Analizy ruchu (Google Analytics)</li>
              <li>Ustawień językowych</li>
            </ul>
          </>
        ),
      },
    ],
  },
};

export default function PolitykaPrywatnosciPage() {
  const { t, language } = useLanguage();
  const content = privacyContent[language] || privacyContent['PL'];

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

