'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import Button from '@/components/ui/Button';
import ProductCard, { Product } from '@/components/product/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://runebox.eu';

// Sample product data - in real app, this would be fetched based on slug
const productData = {
  id: '1',
  title: 'Намисто з натурального коралу "Алатир"',
  titleEn: 'Natural Coral Necklace "Alatyr"',
  price: 1200,
  currency: 'zł',
  images: [
    '/images/products/coral-necklace-1.jpg',
    '/images/products/coral-necklace-2.jpg',
    '/images/products/coral-necklace-3.jpg',
    '/images/products/coral-necklace-4.jpg',
  ],
  category: 'ukrainian',
  materials: ['Натуральний корал', 'Срібло 925 проби', 'Вощений шнур'],
  isHandmade: true,
  slug: 'coral-necklace-alatyr',
  description:
    'Унікальне намисто з натурального коралу та срібла 925 проби. Кожна намистина відшліфована вручну, оздоблена автентичними слов\'янськими символами, відлитими за старовинними техніками. Довжина регулюється від 45 до 50 см.',
  legend: {
    title: 'Легенда Символу Алатир',
    content:
      'Алатир — священний символ центру Всесвіту у слов\'янській міфології. Це камінь-алатир, що впав з небес і на якому викарбувані закони Всесвіту. Вісімка променів символізує вісім напрямків світу та нескінченний рух енергії. Носіння цього символу приносить гармонію, захист і зв\'язок з предками.',
  },
  specifications: [
    { label: 'Матеріал намистин', value: 'Натуральний корал (Середземномор\'я)' },
    { label: 'Підвіска', value: 'Срібло 925, вага 8г' },
    { label: 'Розмір підвіски', value: '3.5 × 3.5 см' },
    { label: 'Довжина', value: 'Регулюється 45-50 см' },
    { label: 'Застібка', value: 'Срібна карабін' },
  ],
};

// Related products
const relatedProducts: Product[] = [
  {
    id: '4',
    title: 'Сережки "Сонячний Знак"',
    price: 680,
    currency: 'zł',
    image: '/images/products/ukrainian-earrings-1.jpg',
    category: 'ukrainian',
    materials: ['Срібло 925', 'Позолота'],
    isHandmade: true,
    slug: 'solar-sign-earrings',
  },
  {
    id: '7',
    title: 'Браслет "Оберіг"',
    price: 890,
    currency: 'zł',
    image: '/images/products/ukrainian-bracelet-1.jpg',
    category: 'ukrainian',
    materials: ['Срібло 925', 'Корал'],
    isHandmade: true,
    slug: 'protection-bracelet',
  },
];

// Generate JSON-LD for product
const generateProductJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: productData.title,
  description: productData.description,
  image: productData.images.map((img) => `${siteUrl}${img}`),
  sku: productData.slug,
  mpn: productData.id,
  brand: {
    '@type': 'Brand',
    name: 'Скриня Пані Дарії',
  },
  category: 'Jewelry > Necklaces',
  material: productData.materials.join(', '),
  isHandmade: true,
  offers: {
    '@type': 'Offer',
    url: `${siteUrl}/products/${productData.slug}`,
    priceCurrency: 'PLN',
    price: productData.price.toFixed(2),
    priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@type': 'Organization',
      name: 'Скриня Пані Дарії',
    },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: ['PL', 'DE', 'UA', 'CZ', 'SK', 'AT', 'NL', 'BE', 'FR'],
      },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: {
          '@type': 'QuantitativeValue',
          minValue: 1,
          maxValue: 3,
          unitCode: 'DAY',
        },
        transitTime: {
          '@type': 'QuantitativeValue',
          minValue: 2,
          maxValue: 7,
          unitCode: 'DAY',
        },
      },
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: '0',
        currency: 'EUR',
      },
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: ['PL', 'DE', 'UA'],
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 14,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn',
    },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '47',
    bestRating: '5',
    worstRating: '1',
  },
  review: [
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Олена',
      },
      reviewBody: 'Чудове намисто! Якість на найвищому рівні, дуже задоволена покупкою.',
    },
  ],
});

// Generate breadcrumb JSON-LD
const generateBreadcrumbJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Головна',
      item: siteUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Колекції',
      item: `${siteUrl}/collections`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Українські прикраси',
      item: `${siteUrl}/collections/ukrainian`,
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: productData.title,
      item: `${siteUrl}/products/${productData.slug}`,
    },
  ],
});

export default function ProductDetailPage() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isMadeToOrder, setIsMadeToOrder] = useState(false);
  const [madeToOrderDuration, setMadeToOrderDuration] = useState<string | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    custom_text: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: Fetch product data from API to check if it's made-to-order
  // For now, using sample data
  // In production, fetch from: `/api/v1/products/${slug}`

  const handleAddToCart = () => {
    // Add to cart logic here
    alert(`Додано до кошика: ${productData.title} x${quantity}`);
  };

  const handleMadeToOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/made-to-order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: parseInt(productData.id),
          ...orderFormData,
        }),
      });

      if (response.ok) {
        alert('Ваше замовлення прийнято! Ми зв\'яжемося з вами найближчим часом.');
        setShowOrderForm(false);
        setOrderFormData({
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          custom_text: '',
          description: '',
        });
      } else {
        const error = await response.json();
        alert(`Помилка: ${error.detail || 'Не вдалося відправити замовлення'}`);
      }
    } catch (error) {
      console.error('Failed to submit order:', error);
      alert('Не вдалося відправити замовлення. Спробуйте пізніше.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* JSON-LD структуровані дані */}
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateProductJsonLd()) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbJsonLd()) }}
      />
      
      <div className="min-h-screen bg-deep-black pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb - семантична навігація */}
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm font-inter text-sage">
            <Link href="/" className="hover:text-ivory transition-colors">
              {t.product.breadcrumb.home}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/collections" className="hover:text-ivory transition-colors">
              {t.product.breadcrumb.collections}
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={`/collections/${productData.category}`}
              className="hover:text-ivory transition-colors"
            >
              {productData.category === 'ukrainian' && t.product.categories.ukrainian}
              {productData.category === 'viking' && t.product.categories.viking}
              {productData.category === 'celtic' && t.product.categories.celtic}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ivory" aria-current="page">{productData.title}</span>
          </nav>

          {/* Product Detail */}
          <article itemScope itemType="https://schema.org/Product">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
              {/* Left Column - Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <figure className="relative aspect-square bg-deep-black rounded-sm overflow-hidden border border-sage/20">
                  <Image
                    src={productData.images[selectedImage]}
                    alt={`${productData.title} - головне зображення`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    itemProp="image"
                  />
                </figure>

                {/* Thumbnail Strip */}
                <div className="grid grid-cols-4 gap-4" role="tablist" aria-label="Галерея зображень товару">
                  {productData.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      role="tab"
                      aria-selected={selectedImage === index}
                      aria-label={`Зображення ${index + 1} з ${productData.images.length}`}
                      className={`relative aspect-square rounded-sm overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === index
                          ? 'border-oxblood shadow-oxblood-glow'
                          : 'border-sage/20 hover:border-sage'
                      }`}
                    >
                      <Image 
                        src={image} 
                        alt={`${productData.title} - зображення ${index + 1}`} 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 12vw"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column - Product Info */}
              <div className="space-y-6">
                {/* Category Badge */}
                <div className="inline-block px-3 py-1 bg-oxblood/20 border border-oxblood/50 rounded-sm">
                  <span className="text-oxblood font-inter text-sm font-semibold">
                    {productData.category === 'ukrainian' && `${t.product.categories.ukrainian} ${t.product.collection}`}
                    {productData.category === 'viking' && `${t.product.categories.viking} ${t.product.collection}`}
                    {productData.category === 'celtic' && `${t.product.categories.celtic} ${t.product.collection}`}
                  </span>
                </div>

                {/* Title */}
                <h1 className="font-rutenia text-3xl md:text-4xl lg:text-5xl text-ivory" itemProp="name">
                  {productData.title}
                </h1>

                {/* Price */}
                <div className="text-3xl font-semibold text-sage font-inter" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                  <span itemProp="price" content={productData.price.toString()}>{productData.price}</span>
                  {' '}
                  <span itemProp="priceCurrency" content="PLN">{productData.currency}</span>
                  <link itemProp="availability" href="https://schema.org/InStock" />
                </div>

                {/* Divider */}
                <div className="h-px bg-sage/20" aria-hidden="true" />

                {/* Description */}
                <p className="text-ivory font-inter leading-relaxed" itemProp="description">
                  {productData.description}
                </p>

                {/* Materials */}
                <div>
                  <h2 className="font-rutenia text-lg text-ivory mb-3">{t.product.materials}</h2>
                  <div className="flex flex-wrap gap-3">
                    {productData.materials.map((material, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-footer-black border border-sage/20 rounded-sm"
                        itemProp="material"
                      >
                        <svg className="w-4 h-4 text-sage" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sage text-sm font-inter">{material}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-sage/20" aria-hidden="true" />

                {/* Quantity & Add to Cart / Made to Order */}
                <div className="space-y-4">
                  {isMadeToOrder ? (
                    <>
                      {/* Made to Order Info */}
                      {madeToOrderDuration && (
                        <div className="bg-oxblood/20 border border-oxblood/50 rounded-sm p-4 mb-4">
                          <p className="text-ivory font-inter font-semibold mb-1">Строк виготовлення:</p>
                          <p className="text-sage">{madeToOrderDuration}</p>
                        </div>
                      )}
                      
                      {/* Order Button */}
                      {!showOrderForm ? (
                        <Button 
                          onClick={() => setShowOrderForm(true)} 
                          size="lg" 
                          fullWidth 
                          className="text-lg"
                        >
                          Замовити під замовлення
                        </Button>
                      ) : (
                        /* Order Form */
                        <form onSubmit={handleMadeToOrderSubmit} className="space-y-4 bg-footer-black/50 border border-sage/20 rounded-sm p-6">
                          <h3 className="font-cinzel text-xl text-ivory mb-4">Форма замовлення</h3>
                          
                          <div>
                            <label htmlFor="customer_name" className="block text-ivory font-inter mb-2">
                              Ім'я <span className="text-oxblood">*</span>
                            </label>
                            <input
                              id="customer_name"
                              type="text"
                              required
                              value={orderFormData.customer_name}
                              onChange={(e) => setOrderFormData({ ...orderFormData, customer_name: e.target.value })}
                              className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="customer_email" className="block text-ivory font-inter mb-2">
                              Email <span className="text-oxblood">*</span>
                            </label>
                            <input
                              id="customer_email"
                              type="email"
                              required
                              value={orderFormData.customer_email}
                              onChange={(e) => setOrderFormData({ ...orderFormData, customer_email: e.target.value })}
                              className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="customer_phone" className="block text-ivory font-inter mb-2">
                              Телефон
                            </label>
                            <input
                              id="customer_phone"
                              type="tel"
                              value={orderFormData.customer_phone}
                              onChange={(e) => setOrderFormData({ ...orderFormData, customer_phone: e.target.value })}
                              className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="custom_text" className="block text-ivory font-inter mb-2">
                              Текст для нанесення (якщо потрібно)
                            </label>
                            <textarea
                              id="custom_text"
                              value={orderFormData.custom_text}
                              onChange={(e) => setOrderFormData({ ...orderFormData, custom_text: e.target.value })}
                              rows={3}
                              maxLength={500}
                              placeholder="Введіть текст, який хочете додати на прикрасу..."
                              className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                            />
                            <p className="text-sage text-xs mt-1">{orderFormData.custom_text.length}/500</p>
                          </div>
                          
                          <div>
                            <label htmlFor="description" className="block text-ivory font-inter mb-2">
                              Опис / Коментар
                            </label>
                            <textarea
                              id="description"
                              value={orderFormData.description}
                              onChange={(e) => setOrderFormData({ ...orderFormData, description: e.target.value })}
                              rows={4}
                              maxLength={2000}
                              placeholder="Опишіть свої побажання щодо виготовлення..."
                              className="w-full px-4 py-3 bg-deep-black/50 border border-sage/30 text-ivory rounded-sm focus:border-oxblood focus:outline-none"
                            />
                            <p className="text-sage text-xs mt-1">{orderFormData.description.length}/2000</p>
                          </div>
                          
                          <div className="flex gap-4">
                            <Button 
                              type="submit" 
                              size="lg" 
                              fullWidth 
                              className="text-lg"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? 'Відправка...' : 'Відправити замовлення'}
                            </Button>
                            <Button 
                              type="button" 
                              onClick={() => {
                                setShowOrderForm(false);
                                setOrderFormData({
                                  customer_name: '',
                                  customer_email: '',
                                  customer_phone: '',
                                  custom_text: '',
                                  description: '',
                                });
                              }}
                              variant="ghost"
                              size="lg"
                              className="text-lg"
                            >
                              Скасувати
                            </Button>
                          </div>
                        </form>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-4">
                        <label htmlFor="quantity" className="text-ivory font-inter">{t.product.quantity}</label>
                        <div className="flex items-center border border-sage/30 rounded-sm">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-4 py-2 text-ivory hover:bg-sage/10 transition-colors"
                            aria-label="Зменшити кількість"
                          >
                            -
                          </button>
                          <span id="quantity" className="px-6 py-2 text-ivory font-semibold border-x border-sage/30" aria-live="polite">
                            {quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-4 py-2 text-ivory hover:bg-sage/10 transition-colors"
                            aria-label="Збільшити кількість"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <Button onClick={handleAddToCart} size="lg" fullWidth className="text-lg">
                        {t.product.addToCart}
                      </Button>
                    </>
                  )}

                  {/* Trust Signals */}
                  <ul className="space-y-2 text-sm font-inter text-sage" aria-label="Переваги покупки">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Безпечна оплата</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{t.product.quality}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                      <span>{t.product.freeShipping}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </article>

          {/* The Legend Section */}
          <section className="mb-20" aria-labelledby="legend-title">
            <div className="max-w-4xl mx-auto bg-footer-black border border-sage/20 rounded-sm p-8 md:p-12 relative overflow-hidden parchment-texture">
              {/* Decorative corner ornaments */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-oxblood/50" aria-hidden="true" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-oxblood/50" aria-hidden="true" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-oxblood/50" aria-hidden="true" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-oxblood/50" aria-hidden="true" />

              <h2 id="legend-title" className="font-rutenia text-2xl md:text-3xl text-ivory mb-6 text-center">
                {t.product.legend}: {productData.legend.title}
              </h2>
              <p className="text-ivory/85 font-inter leading-relaxed text-center max-w-3xl mx-auto">
                {productData.legend.content}
              </p>
            </div>
          </section>

          {/* Specifications */}
          <section className="mb-20" aria-labelledby="specifications-title">
            <div className="max-w-4xl mx-auto">
              <h2 id="specifications-title" className="font-rutenia text-3xl text-ivory mb-8 text-center">
                {t.product.specifications}
              </h2>
              <dl className="bg-footer-black border border-sage/20 rounded-sm divide-y divide-sage/20">
                {productData.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between items-center p-4 hover:bg-deep-black/50 transition-colors">
                    <dt className="text-sage font-inter">{spec.label}</dt>
                    <dd className="text-ivory font-inter font-semibold text-right">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* Related Products */}
          <section aria-labelledby="related-products-title">
            <h2 id="related-products-title" className="font-rutenia text-3xl text-ivory mb-8 text-center">
              {t.product.related}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
