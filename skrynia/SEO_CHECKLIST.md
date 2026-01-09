# SEO Checklist - Скриня Пані Дарії

## ✅ Виконано

### 1. Технічне SEO
- [x] **Meta tags** - title, description, keywords для всіх сторінок
- [x] **Open Graph** - теги для Facebook, LinkedIn
- [x] **Twitter Cards** - summary_large_image для Twitter
- [x] **Viewport** - правильний viewport для мобільних
- [x] **Theme Color** - колір браузера для PWA
- [x] **Canonical URLs** - канонічні URL для всіх сторінок
- [x] **Hreflang** - альтернативні мовні версії (UA, EN, DE, PL)

### 2. Структуровані дані (Schema.org)
- [x] **Organization** - інформація про компанію
- [x] **WebSite** - SearchAction для пошуку
- [x] **Store** - інформація про магазин
- [x] **Product** - детальна інформація про товари
- [x] **BreadcrumbList** - хлібні крихти для навігації
- [x] **ItemList** - списки товарів
- [x] **AboutPage** - сторінка "Про нас"
- [x] **Offer** - пропозиції товарів з ціною
- [x] **AggregateRating** - рейтинги товарів
- [x] **Review** - відгуки клієнтів

### 3. Файли SEO
- [x] **sitemap.ts** - динамічний sitemap.xml з усіма сторінками
- [x] **robots.ts** - robots.txt з правилами для ботів
- [x] **manifest.json** - PWA маніфест
- [x] **browserconfig.xml** - для Windows tiles

### 4. Оптимізація швидкості (Core Web Vitals)
- [x] **Кешування** - статичні файли кешуються на 1 рік
- [x] **Компресія** - gzip/brotli компресія увімкнена
- [x] **Lazy Loading** - зображення завантажуються ліниво
- [x] **Priority Loading** - критичні зображення завантажуються першими
- [x] **Image Optimization** - WebP/AVIF формати
- [x] **Preconnect** - попереднє з'єднання з fonts.googleapis.com
- [x] **DNS Prefetch** - попередній DNS для аналітики

### 5. Доступність (Accessibility)
- [x] **Alt тексти** - описові alt для всіх зображень
- [x] **Aria labels** - aria-label для інтерактивних елементів
- [x] **Semantic HTML** - header, main, section, article, nav, footer
- [x] **Skip links** - для клавіатурної навігації
- [x] **Focus management** - правильний focus для форм

### 6. Безпека
- [x] **X-Content-Type-Options** - nosniff
- [x] **X-Frame-Options** - SAMEORIGIN
- [x] **X-XSS-Protection** - увімкнено
- [x] **Referrer-Policy** - strict-origin-when-cross-origin
- [x] **Power-by Header** - вимкнено

---

## 📋 Потрібно зробити

### 1. Створити графіку
- [ ] **OG Image** - `/public/images/og/og-image.jpg` (1200x630px)
- [ ] **OG Image Square** - `/public/images/og/og-image-square.jpg` (1200x1200px)
- [ ] **Favicon** - `/public/favicon.ico`
- [ ] **App Icons** - `/public/icons/icon-*.png` (всі розміри)
- [ ] **Apple Touch Icon** - `/public/icons/apple-touch-icon.png` (180x180px)

### 2. Налаштувати домен
- [ ] Змінити `NEXT_PUBLIC_SITE_URL` на реальний домен
- [ ] Налаштувати SSL сертифікат
- [ ] Налаштувати www -> non-www редірект

### 3. Верифікація
- [ ] **Google Search Console** - додати verification код
- [ ] **Bing Webmaster** - додати verification код
- [ ] **Yandex Webmaster** - додати verification код

### 4. Аналітика
- [ ] Підключити Google Analytics 4
- [ ] Підключити Google Tag Manager
- [ ] Налаштувати цілі та конверсії

### 5. Контент
- [ ] Додати реальні відгуки клієнтів
- [ ] Додати FAQ секцію
- [ ] Створити блог для SEO контенту
- [ ] Оптимізувати тексти під ключові слова

### 6. Локальне SEO
- [ ] Створити Google Business Profile
- [ ] Додати адресу та контакти в Schema.org
- [ ] Отримати відгуки в Google

---

## 🔧 Команди для перевірки

```bash
# Перевірити sitemap
curl https://yourdomain.com/sitemap.xml

# Перевірити robots.txt
curl https://yourdomain.com/robots.txt

# Перевірити manifest.json
curl https://yourdomain.com/manifest.json
```

## 🔗 Інструменти для тестування

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema.org Validator**: https://validator.schema.org/
3. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
4. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
5. **Google PageSpeed Insights**: https://pagespeed.web.dev/
6. **Lighthouse**: Chrome DevTools > Lighthouse
7. **WAVE Accessibility**: https://wave.webaim.org/

## 📝 Примітки

- Всі мета-теги оновлюються автоматично залежно від вибраної мови
- JSON-LD структуровані дані генеруються динамічно для кожного товару
- Sitemap включає всі сторінки та альтернативні мовні версії

