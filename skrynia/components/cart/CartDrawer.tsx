'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import type { CartItem } from '@/lib/cart';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const router = useRouter();
  const { t } = useLanguage();
  const {
    subtotal,
    subtotalBeforeDiscount,
    discountPercent,
    discountAmount,
    shipping,
    total,
    itemCount,
  } = useCart();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-deep-black/80 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-footer-black border-l border-sage/30 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-sage/20">
          <h2 id="cart-title" className="font-rutenia text-2xl text-ivory">
            {t.cart.title}
          </h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-ivory hover:text-oxblood transition-colors duration-200"
            aria-label="Close cart"
            type="button"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto min-h-0">
        {/* Cart Items */}
        <div className="p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-6">
                <svg
                  className="w-24 h-24 text-sage/30 mx-auto"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="font-rutenia text-xl text-ivory mb-2">{t.cart.empty.title}</h3>
              <p className="text-sage font-inter mb-6">
                {t.cart.empty.message}
              </p>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }} 
                variant="primary"
              >
                {t.cart.empty.continue}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-6 border-b border-sage/20 last:border-0"
                >
                  {/* Product Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 bg-deep-black rounded-sm overflow-hidden">
                    {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                        sizes="96px"
                      className="object-cover"
                    />
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center text-sage/40 font-inter text-xs"
                        aria-hidden="true"
                      >
                        No image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <h3 className="font-rutenia text-ivory text-base mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sage font-inter text-sm mb-3">
                      {item.price} {item.currency}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-sage/30 rounded-sm">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 text-ivory hover:bg-sage/10 transition-colors text-sm"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 text-ivory font-semibold border-x border-sage/30 text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-ivory hover:bg-sage/10 transition-colors text-sm"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-sage hover:text-oxblood transition-colors text-sm font-inter"
                      >
                        {t.cart.remove}
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-inter font-semibold text-ivory">
                      {item.price * item.quantity} {item.currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Footer - Totals & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-sage/20 p-6 bg-deep-black/50">
            {/* Progressive Discount Info Banner */}
            {discountPercent > 0 && (
              <div className="mb-4 p-3 bg-oxblood/20 border border-oxblood/50 rounded-sm">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-oxblood" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  <span className="text-oxblood font-inter text-sm font-semibold">
                    -{discountPercent}% {t.cart.progressiveDiscount || 'Прогресивна знижка'}!
                  </span>
                </div>
                <p className="text-sage text-xs font-inter">
                  2 {t.common.items} (-10%), 3+ {t.common.items} (-15%)
                </p>
              </div>
            )}

            {/* Discount hint when no discount yet */}
            {discountPercent === 0 && itemCount === 1 && (
              <div className="mb-4 p-3 bg-sage/10 border border-sage/30 rounded-sm">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-sage" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sage font-inter text-xs font-semibold">
                    {t.cart.addMoreForDiscount || 'Додай ще 1 товар і отримай -10%!'}
                  </span>
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-3 mb-6">
              {discountAmount > 0 && (
                <div className="flex justify-between font-inter text-sm">
                  <span className="text-sage">{t.cart.subtotalBeforeDiscount || 'Сума до знижки'}</span>
                  <span className="text-sage line-through">{subtotalBeforeDiscount.toFixed(2)} zł</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between font-inter text-sm">
                  <span className="text-oxblood">{t.cart.discount || 'Знижка'} (-{discountPercent}%)</span>
                  <span className="text-oxblood font-semibold">-{discountAmount.toFixed(2)} zł</span>
                </div>
              )}
              <div className="flex justify-between font-inter text-sm">
                <span className="text-sage">{t.cart.subtotal}</span>
                <span className="text-ivory font-semibold">{subtotal.toFixed(2)} zł</span>
              </div>
              <div className="flex justify-between font-inter text-sm">
                <span className="text-sage">{t.cart.shipping}</span>
                <span className="text-ivory">
                  {shipping === 0 ? t.cart.free : `${shipping.toFixed(2)} zł`}
                </span>
              </div>
              <div className="h-px bg-sage/20" />
              <div className="flex justify-between font-inter text-lg">
                <span className="text-ivory font-semibold">{t.cart.total}</span>
                <span className="text-ivory font-bold">{total.toFixed(2)} zł</span>
              </div>
            </div>

            {/* Free Shipping Message */}
            {shipping > 0 && subtotal < 1000 && (
              <div className="mb-4 p-3 bg-oxblood/10 border border-oxblood/30 rounded-sm">
                <p className="text-sage text-xs font-inter text-center">
                  {t.cart.addMoreForFreeShipping.replace('{amount}', String(1000 - subtotal))}
                </p>
              </div>
            )}

            {/* Auth Reminder */}
            <div className="mb-4 p-4 bg-gradient-to-r from-oxblood/20 to-oxblood/10 border border-oxblood/30 rounded-sm">
              <h3 className="font-rutenia text-ivory text-base mb-2">
                {t.cart.authReminder.title}
              </h3>
              <p className="text-sage text-xs font-inter mb-3">
                {t.cart.authReminder.message}
              </p>
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sage text-xs">
                  <svg className="w-4 h-4 text-oxblood" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  <span>{t.cart.authReminder.bonusPoints}</span>
                </div>
                <div className="flex items-center gap-2 text-sage text-xs">
                  <svg className="w-4 h-4 text-oxblood" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>{t.cart.authReminder.trackOrders}</span>
                </div>
                <div className="flex items-center gap-2 text-sage text-xs">
                  <svg className="w-4 h-4 text-oxblood" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{t.cart.authReminder.saveAddresses}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="flex-1 px-4 py-2 bg-oxblood/20 hover:bg-oxblood/30 border border-oxblood/50 text-ivory text-sm font-inter text-center rounded-sm transition-colors"
                >
                  {t.cart.authReminder.login}
                </Link>
                <Link
                  href="/register"
                  className="flex-1 px-4 py-2 bg-oxblood hover:bg-oxblood/90 text-ivory text-sm font-inter text-center rounded-sm transition-colors font-semibold"
                >
                  {t.cart.authReminder.register}
                </Link>
              </div>
            </div>

            {/* Legal Checkboxes */}
            <div className="mb-4 space-y-3">
              <label className="flex items-start gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-oxblood bg-deep-black border-sage/30 rounded focus:ring-oxblood focus:ring-2"
                  required
                />
                <span className="text-sage text-xs font-inter group-hover:text-ivory transition-colors">
                  {t.legal.acceptTerms}{' '}
                  <Link href="/regulamin" className="text-oxblood hover:underline">
                    {t.legal.terms}
                  </Link>
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToPrivacy}
                  onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                  className="mt-1 w-4 h-4 text-oxblood bg-deep-black border-sage/30 rounded focus:ring-oxblood focus:ring-2"
                  required
                />
                <span className="text-sage text-xs font-inter group-hover:text-ivory transition-colors">
                  {t.legal.acceptPrivacy}{' '}
                  <Link href="/polityka-prywatnosci" className="text-oxblood hover:underline">
                    {t.legal.privacy}
                  </Link>
                </span>
              </label>
            </div>

            {/* Checkout Button */}
            <Button
              size="lg"
              fullWidth
              className="mb-3"
              disabled={!agreedToTerms || !agreedToPrivacy}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (agreedToTerms && agreedToPrivacy) {
                  onClose(); // Close drawer first
                  setTimeout(() => {
                    router.push('/checkout');
                  }, 100); // Small delay to allow drawer to close
                }
              }}
            >
              {t.cart.checkout}
            </Button>

            {/* Continue Shopping */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-full text-center text-sage hover:text-ivory font-inter text-sm transition-colors duration-200"
              type="button"
            >
              {t.cart.continueShopping}
            </button>

            {/* Trust Signals */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-sage/60">
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{t.cart.securePayment}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <span>{t.cart.deliveryDays}</span>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
