'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ProductCard, { Product } from '@/components/product/ProductCard';

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

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Add to cart logic here
    alert(`Додано до кошика: ${productData.title} x${quantity}`);
  };

  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-inter text-sage">
          <Link href="/" className="hover:text-ivory transition-colors">
            Головна
          </Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-ivory transition-colors">
            Колекції
          </Link>
          <span>/</span>
          <Link
            href={`/collections/${productData.category}`}
            className="hover:text-ivory transition-colors"
          >
            {productData.category === 'ukrainian' && 'Українські'}
          </Link>
          <span>/</span>
          <span className="text-ivory">{productData.title}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-deep-black rounded-sm overflow-hidden border border-sage/20">
              <Image
                src={productData.images[selectedImage]}
                alt={productData.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-4">
              {productData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-sm overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index
                      ? 'border-oxblood shadow-oxblood-glow'
                      : 'border-sage/20 hover:border-sage'
                  }`}
                >
                  <Image src={image} alt={`${productData.title} - фото ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="inline-block px-3 py-1 bg-oxblood/20 border border-oxblood/50 rounded-sm">
              <span className="text-oxblood font-inter text-sm font-semibold">
                {productData.category === 'ukrainian' && 'Українська колекція'}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-cinzel text-3xl md:text-4xl lg:text-5xl text-ivory">{productData.title}</h1>

            {/* Price */}
            <div className="text-3xl font-semibold text-sage font-inter">
              {productData.price} {productData.currency}
            </div>

            {/* Divider */}
            <div className="h-px bg-sage/20" />

            {/* Description */}
            <p className="text-ivory font-inter leading-relaxed">{productData.description}</p>

            {/* Materials */}
            <div>
              <h3 className="font-cinzel text-lg text-ivory mb-3">Матеріали</h3>
              <div className="flex flex-wrap gap-3">
                {productData.materials.map((material, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-footer-black border border-sage/20 rounded-sm"
                  >
                    <svg className="w-4 h-4 text-sage" fill="currentColor" viewBox="0 0 20 20">
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
            <div className="h-px bg-sage/20" />

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <label className="text-ivory font-inter">Кількість:</label>
                <div className="flex items-center border border-sage/30 rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-ivory hover:bg-sage/10 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 text-ivory font-semibold border-x border-sage/30">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-ivory hover:bg-sage/10 transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button onClick={handleAddToCart} size="lg" fullWidth className="text-lg">
                Додати до кошика
              </Button>

              {/* Trust Signals */}
              <div className="space-y-2 text-sm font-inter text-sage">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Безпечна оплата</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Гарантія якості</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  <span>Безкоштовна доставка в ЄС (3-5 днів)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Legend Section */}
        <div className="mb-20">
          <div className="max-w-4xl mx-auto bg-footer-black border border-sage/20 rounded-sm p-8 md:p-12 relative overflow-hidden parchment-texture">
            {/* Decorative corner ornaments */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-oxblood/50" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-oxblood/50" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-oxblood/50" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-oxblood/50" />

            <h2 className="font-cinzel text-2xl md:text-3xl text-ivory mb-6 text-center">{productData.legend.title}</h2>
            <p className="text-ivory/85 font-inter leading-relaxed text-center max-w-3xl mx-auto">
              {productData.legend.content}
            </p>
          </div>
        </div>

        {/* Specifications */}
        <div className="mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-cinzel text-3xl text-ivory mb-8 text-center">Специфікації</h2>
            <div className="bg-footer-black border border-sage/20 rounded-sm divide-y divide-sage/20">
              {productData.specifications.map((spec, index) => (
                <div key={index} className="flex justify-between items-center p-4 hover:bg-deep-black/50 transition-colors">
                  <span className="text-sage font-inter">{spec.label}</span>
                  <span className="text-ivory font-inter font-semibold text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="font-cinzel text-3xl text-ivory mb-8 text-center">Схожі Вироби</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
