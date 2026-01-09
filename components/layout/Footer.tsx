import React from 'react';
import Link from 'next/link';
import AlatyrIcon from '@/components/ui/icons/AlatyrIcon';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/collections', label: 'Колекції' },
    { href: '/blog', label: 'Блог' },
    { href: '/about', label: 'Про нас' },
    { href: '/shipping', label: 'Доставка' },
    { href: '/contact', label: 'Контакт' },
    { href: '/account', label: 'Кабінет' },
  ];

  const languages = [
    { code: 'UA', flag: '🇺🇦' },
    { code: 'EN', flag: '🇬🇧' },
    { code: 'DE', flag: '🇩🇪' },
    { code: 'PL', flag: '🇵🇱' },
  ];

  return (
    <footer className="bg-footer-black border-t border-sage/20 mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <AlatyrIcon size={50} variant="oxblood" />
              <div>
                <h3 className="font-cinzel text-lg text-ivory">Скриня Пані Дарії</h3>
                <p className="text-sage text-sm">Автентичні прикраси ручної роботи</p>
              </div>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-cinzel text-ivory text-lg mb-4">Навігація</h4>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ivory hover:text-oxblood transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-cinzel text-ivory text-lg mb-4">Контакт</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-center gap-2 text-ivory">
                <svg
                  className="w-4 h-4 text-sage"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a
                  href="mailto:info@skrynia.com"
                  className="hover:text-oxblood transition-colors duration-200"
                >
                  info@skrynia.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-ivory">
                <svg
                  className="w-4 h-4 text-sage"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Польща, ЄС</span>
              </li>
            </ul>
          </div>

          {/* Languages & Social Column */}
          <div>
            <h4 className="font-cinzel text-ivory text-lg mb-4">Мови</h4>
            <div className="flex gap-3 mb-6">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className="text-2xl grayscale hover:grayscale-0 transition-all duration-200 hover:scale-110"
                  aria-label={`Switch to ${lang.code}`}
                  title={lang.code}
                >
                  {lang.flag}
                </button>
              ))}
            </div>

            {/* Social Media */}
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory hover:text-oxblood transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory hover:text-oxblood transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-sage/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sage text-sm opacity-60">
            © {currentYear} Скриня Пані Дарії. Всі права захищені.
          </p>

          {/* Payment Icons */}
          <div className="flex items-center gap-4 opacity-60">
            <span className="text-sage text-xs">Приймаємо:</span>
            <div className="flex gap-2 grayscale">
              <svg className="h-6" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#1434CB" />
                <path
                  d="M20.5 10h7l-2 12h-7l2-12z"
                  fill="#fff"
                />
              </svg>
              <svg className="h-6" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#EB001B" />
                <circle cx="19" cy="16" r="7" fill="#F79E1B" />
                <circle cx="29" cy="16" r="7" fill="#FF5F00" />
              </svg>
              <svg className="h-6" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#003087" />
                <path
                  d="M14 10h4l-2 12h-4l2-12zm16 0h-4l-2 12h4l2-12z"
                  fill="#fff"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
