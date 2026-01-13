'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  FileText,
  LogOut,
  Share2,
  Mail,
  Circle,
  FileQuestion,
  BookOpen,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  {
    href: '/admin',
    label: 'Дашборд',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/products',
    label: 'Товари',
    icon: Package,
  },
  {
    href: '/admin/categories',
    label: 'Категорії',
    icon: Package,
  },
  {
    href: '/admin/blog',
    label: 'Блог',
    icon: BookOpen,
  },
  {
    href: '/admin/orders',
    label: 'Замовлення',
    icon: ShoppingCart,
  },
  {
    href: '/admin/made-to-order',
    label: 'Під Замовлення',
    icon: FileText,
  },
  {
    href: '/admin/beads',
    label: 'Бусини',
    icon: Circle,
  },
  {
    href: '/admin/quotes',
    label: 'Запити на Прорахунок',
    icon: FileQuestion,
  },
  {
    href: '/admin/customers',
    label: 'Клієнти',
    icon: Users,
  },
  {
    href: '/admin/social-links',
    label: 'Соціальні Мережі',
    icon: Share2,
  },
  {
    href: '/admin/contact-info',
    label: 'Контакти',
    icon: Mail,
  },
  {
    href: '/admin/settings',
    label: 'Налаштування',
    icon: Settings,
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  };

  const handleLinkClick = () => {
    // Закриваємо меню при кліку на посилання на мобільних
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  // Закриваємо меню при зміні розміру вікна на десктоп
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 bg-footer-black border border-sage/20 rounded-sm text-sage hover:text-ivory hover:bg-deep-black/50 transition-colors pointer-events-auto"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay для мобільних */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-[55]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <nav
        className={`fixed left-0 top-0 h-full w-64 bg-footer-black border-r border-sage/20 pt-20 z-[60] transition-transform duration-300 ease-in-out pointer-events-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Navigation Items */}
          <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
                    isActive
                      ? 'bg-oxblood/20 text-oxblood border-l-2 border-oxblood'
                      : 'text-sage hover:bg-deep-black/50 hover:text-ivory'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-inter font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className="px-4 py-4 border-t border-sage/20">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-sage hover:bg-deep-black/50 hover:text-oxblood rounded-sm transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-inter font-medium">Вийти</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

