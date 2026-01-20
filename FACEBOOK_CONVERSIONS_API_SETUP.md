# Facebook Conversions API - Налаштування

## Що це таке?

Facebook Conversions API дозволяє надсилати події з сервера безпосередньо до Facebook, що:
- Обходить блокувальники реклами
- Підвищує точність відстеження конверсій
- Покращує якість даних для оптимізації реклами
- Забезпечує резервне відстеження, якщо Meta Pixel заблокований

## Відповідність вимогам Facebook

Наша реалізація повністю відповідає офіційним вимогам Facebook Conversions API:
- ✅ Правильний формат запитів POST до `/events` endpoint
- ✅ Хешування PII даних (email, phone, name) згідно з вимогами (SHA256)
- ✅ Email та phone передаються як масиви: `["hash"]` або `[null]`
- ✅ Підтримка дедуплікації через `event_id`
- ✅ Валідація `event_time` (не більше 7 днів назад, автоматично виправляється)
- ✅ Підтримка пакетної відправки (до 1000 подій)
- ✅ Підтримка тестових подій через `test_event_code`
- ✅ Всі обов'язкові параметри для AddToCart, ViewContent, Purchase
- ✅ Підтримка `content_type` (обов'язковий для AddToCart та ViewContent)
- ✅ Підтримка всіх параметрів user_data (email, phone, gender, city, state, country, тощо)
- ✅ **Обов'язкові поля для `action_source="website"`:**
  - `event_source_url` - автоматично додається з Referer header або request URL
  - `user_data.client_user_agent` - автоматично додається з User-Agent header

## Налаштування

### 1. Отримайте Access Token

**Важливо:** Для Conversions API потрібен **Conversions API Access Token**, а НЕ Page Access Token.

**Різниця:**
- **Conversions API Access Token** - для відправки подій через Conversions API (потрібен нам)
- **Page Access Token** - для управління Facebook сторінками (публікація постів, коментарі) - НЕ потрібен
- **Dataset Quality API Token** - для отримання метрик якості даних (окремий токен)

**Як отримати Conversions API Access Token:**

1. Перейдіть до [Facebook Business Manager](https://business.facebook.com/)
2. Відкрийте **Events Manager**
3. Виберіть ваш Pixel (ID: `1552229889398632`)
4. Перейдіть до вкладки **Settings** → **Conversions API**
5. Натисніть **"Set up manually"** або **"Use existing gateway"**
6. Якщо використовуєте існуючий шлюз:
   - Введіть URL вашого API: `https://runebox.eu/api/v1/facebook/track`
   - Натисніть **"Запустить шлюз Conversions API"**
   - Facebook перевірить підключення
7. Якщо налаштовуєте вручну:
   - Створіть **System User** або використайте існуючий
   - Додайте права доступу до Pixel
   - Згенеруйте **Conversions API Access Token** (довгостроковий)
   - **НЕ плутайте з Page Access Token!**

### 2. Додайте змінні середовища до GitHub Secrets

Змінні середовища мають бути додані до **GitHub Repository Secrets** (як і інші секрети проекту).

#### Додавання Secrets в GitHub

1. Перейдіть в ваш репозиторій на GitHub
2. Відкрийте **Settings** → **Secrets and variables** → **Actions**
3. Натисніть **New repository secret**
4. Додайте кожен секрет окремо:

```
Name: FACEBOOK_PIXEL_ID
Value: 1552229889398632

Name: FACEBOOK_ACCESS_TOKEN
Value: your_access_token_here

Name: FACEBOOK_API_VERSION
Value: v18.0

Name: FACEBOOK_DATASET_QUALITY_TOKEN
Value: your_dataset_quality_token_here
```

**Важливо:** 
- `FACEBOOK_ACCESS_TOKEN` має бути довгостроковим токеном (Long-lived token)
- Токен має мати права на `ads_management` та доступ до вашого Pixel
- **Ніколи не комітьте токени в код** - використовуйте тільки GitHub Secrets

#### Використання в Docker Compose

Змінні автоматично передаються з GitHub Secrets через CI/CD pipeline в `docker-compose.prod.yml`:

```yaml
environment:
  FACEBOOK_PIXEL_ID: ${FACEBOOK_PIXEL_ID}
  FACEBOOK_ACCESS_TOKEN: ${FACEBOOK_ACCESS_TOKEN}
  FACEBOOK_API_VERSION: ${FACEBOOK_API_VERSION:-v18.0}
```

### 3. Перезапустіть бекенд

Після додавання змінних середовища в GitHub Secrets та деплою:

```bash
# Docker
docker-compose -f docker-compose.prod.yml restart backend

# Або через CI/CD pipeline (автоматично після push)
```

## Перевірка роботи

### 1. Перевірте API endpoint

```bash
curl -X POST https://runebox.eu/api/v1/facebook/track \
  -H "Content-Type: application/json" \
  -d '{
    "event_name": "PageView",
    "event_source_url": "https://runebox.eu"
  }'
```

Очікувана відповідь:
```json
{
  "success": true,
  "event_id": "...",
  "response": {
    "events_received": 1
  }
}
```

### 2. Перевірте в Facebook Events Manager

1. Відкрийте **Events Manager** → ваш Pixel
2. Перейдіть до вкладки **Test Events**
3. Виконайте дію на сайті (додайте товар у кошик, перейдіть на checkout)
4. Перевірте, чи події з'являються в реальному часі

### 3. Використайте Test Event Code (для тестування)

1. В Events Manager → **Test Events** → скопіюйте **Test Event Code**
2. Додайте його до запиту:

```bash
curl -X POST https://runebox.eu/api/v1/facebook/track \
  -H "Content-Type: application/json" \
  -d '{
    "event_name": "AddToCart",
    "test_event_code": "TEST12345"
  }'
```

## Які події відстежуються?

### 1. ViewContent
- **Коли:** Користувач переглядає сторінку товару
- **Де:** `app/products/[slug]/ProductDetailClient.tsx`
- **Параметри:**
  - `content_name` - назва товару
  - `content_ids` - ID товару
  - `content_type` - "product" (обов'язково)
  - `value` - ціна товару
  - `currency` - валюта

### 2. AddToCart
- **Коли:** Користувач додає товар у кошик
- **Де:** `contexts/CartContext.tsx`
- **Параметри:**
  - `content_name` - назва товару
  - `content_ids` - ID товару
  - `content_type` - "product" (обов'язково)
  - `value` - ціна товару × кількість
  - `currency` - валюта
  - `num_items` - кількість товарів (завжди 1 для AddToCart)
  - `event_source_url` - автоматично (обов'язково для website)
  - `user_data.client_user_agent` - автоматично (обов'язково для website)

### 3. InitiateCheckout
- **Коли:** Користувач відкриває сторінку checkout
- **Де:** `app/checkout/page.tsx`
- **Параметри:**
  - `content_ids` - список ID товарів
  - `contents` - масив товарів з quantity та item_price
  - `value` - загальна сума
  - `currency` - валюта
  - `num_items` - загальна кількість товарів
  - `event_source_url` - автоматично (обов'язково для website)
  - `user_data.client_user_agent` - автоматично (обов'язково для website)

### 4. Purchase
- **Коли:** Замовлення успішно створено
- **Де:** `app/order-success/page.tsx`
- **Параметри:**
  - `content_ids` - список ID товарів
  - `contents` - масив товарів з quantity та item_price
  - `value` - загальна сума замовлення
  - `currency` - валюта
  - `num_items` - загальна кількість товарів
  - `user_data.email` - email користувача (для кращого matching)
  - `event_source_url` - автоматично (обов'язково для website)
  - `user_data.client_user_agent` - автоматично (обов'язково для website)

## Dataset Quality API (Рекомендовано)

Dataset Quality API дозволяє отримувати метрики якості даних, такі як:
- **Event Match Quality (EMQ)** - доля співпадіння подій між Pixel та Conversions API
- **Aggregated Event Measurement (AEM)** - агреговані метрики подій

### Налаштування Dataset Quality API

1. В Events Manager → **Settings** → **Conversions API**
2. Увімкніть **Dataset Quality API** (Recommended)
3. Згенеруйте **Dataset Quality API Token** (це окремий токен, не той самий що Conversions API Access Token)
4. Додайте токен до GitHub Secrets як `FACEBOOK_DATASET_QUALITY_TOKEN`

**Примітка:** Dataset Quality API Token може бути тим самим що Conversions API Access Token, але краще згенерувати окремий для безпеки.

### Отримання метрик

#### Event Match Quality (EMQ)

```bash
curl "https://runebox.eu/api/v1/facebook/metrics/emq?start_date=2025-01-01&end_date=2025-01-20"
```

**Відповідь:**
```json
{
  "data": [
    {
      "date": "2025-01-20",
      "emq": 0.85,
      "events_received": 1000,
      "events_matched": 850
    }
  ]
}
```

**EMQ значення:**
- `0.8-1.0` - Відмінна якість даних
- `0.6-0.8` - Добра якість даних
- `0.4-0.6` - Середня якість даних
- `<0.4` - Потрібна оптимізація

#### Aggregated Event Measurement (AEM)

```bash
curl "https://runebox.eu/api/v1/facebook/metrics/aem?start_date=2025-01-01&end_date=2025-01-20&event_type=Purchase"
```

**Відповідь:**
```json
{
  "data": [
    {
      "date": "2025-01-20",
      "event_type": "Purchase",
      "events_count": 50,
      "total_value": 5000.00,
      "currency": "PLN"
    }
  ]
}
```

## API Endpoints

### POST `/api/v1/facebook/track`

Відправка однієї події.

**Request:**
```json
{
  "event_name": "AddToCart",
  "event_id": "unique_event_id_123",
  "event_time": 1768904636,
  "event_source_url": "https://runebox.eu/products/example",
  "action_source": "website",
  "user_data": {
    "email": "user@example.com",
    "phone": "+48123456789",
    "first_name": "John",
    "last_name": "Doe",
    "city": "Warsaw",
    "state": "Mazowieckie",
    "zip_code": "00-001",
    "country": "PL",
    "gender": "m",
    "external_id": "user_123",
    "fbc": "fb.1.1234567890.AbCdEfGhIj",
    "fbp": "fb.1.1234567890.1234567890"
  },
  "custom_data": {
    "value": 99.99,
    "currency": "PLN",
    "content_ids": ["product_123"],
    "content_name": "Product Name",
    "content_type": "product",
    "num_items": 1
  },
  "test_event_code": "TEST12345"
}
```

**Важливі примітки:**
- `event_time` - Unix timestamp в секундах (не може бути більше 7 днів назад)
- `email` та `phone` в `user_data` автоматично хешуються на сервері (SHA256)
- `email` та `phone` передаються як масиви: `["hash"]` або `[null]`
- `content_type` обов'язковий для `AddToCart` та `ViewContent`
- `event_id` використовується для дедуплікації з Pixel подіями
- **Для подій з `action_source="website"` (обов'язково):**
  - `event_source_url` - обов'язковий (автоматично додається з Referer header або request)
  - `user_data.client_user_agent` - обов'язковий (автоматично додається з User-Agent header)

### POST `/api/v1/facebook/track-batch`

Відправка кількох подій одночасно (більш ефективно).

**Request:**
```json
{
  "events": [
    {
      "event_name": "AddToCart",
      "custom_data": { ... }
    },
    {
      "event_name": "PageView",
      "custom_data": { ... }
    }
  ]
}
```

## FAQ

### Чи потрібен Page Access Token?

**НІ**, Page Access Token НЕ потрібен для Conversions API.

**Що потрібно:**
- ✅ **Conversions API Access Token** (`FACEBOOK_ACCESS_TOKEN`) - для відправки подій
- ✅ **Dataset Quality API Token** (`FACEBOOK_DATASET_QUALITY_TOKEN`) - для метрик (опціонально)

**Page Access Token потрібен тільки якщо:**
- Потрібно автоматично публікувати пости на Facebook сторінці
- Потрібно керувати коментарями/повідомленнями сторінки
- Потрібна інтеграція з Facebook Pages API

Для e-commerce з Conversions API Page Access Token не потрібен.

### Які токени потрібні?

1. **Conversions API Access Token** - для відправки подій (обов'язково)
2. **Dataset Quality API Token** - для метрик якості даних (рекомендовано, але опціонально)

Обидва токени можуть бути довгостроковими (Long-lived tokens).

## Troubleshooting

### Помилка: "Facebook Conversions API not configured"
- Перевірте, чи додані змінні `FACEBOOK_PIXEL_ID` та `FACEBOOK_ACCESS_TOKEN` до GitHub Secrets
- Перезапустіть бекенд після додавання змінних

### Помилка: "Invalid access token"
- Перевірте, чи токен не застарів
- Переконайтеся, що ви використовуєте **Conversions API Access Token**, а не Page Access Token
- Переконайтеся, що токен має права на `ads_management` та доступ до Pixel
- Згенеруйте новий токен в Business Manager → Events Manager → Conversions API

### Події не з'являються в Events Manager
- Перевірте Test Events в Events Manager
- Використайте Test Event Code для тестування
- Перевірте логи бекенду на наявність помилок
- Переконайтеся, що Pixel ID правильний

### Помилка: "Event time is more than 7 days ago"
- Facebook не приймає події старші за 7 днів
- Переконайтеся, що `event_time` не більше 7 днів назад від поточного часу
- Якщо подія стара, використайте поточний час замість оригінального
- Наш код автоматично виправляє такі події, використовуючи поточний час

### Події дублюються
- Це нормально! Meta Pixel (клієнтський) та Conversions API (серверний) працюють разом
- Facebook автоматично дедуплікує події за `event_id`
- Для правильної дедуплікації:
  - `event_id` має бути однаковим для Pixel та Conversions API
  - `event_name` має бути однаковим
  - `event_time` має бути близьким (різниця не більше кількох секунд)
- Переконайтеся, що `event_id` унікальний для кожної події

## Безпека

- **Ніколи не публікуйте** `FACEBOOK_ACCESS_TOKEN` у публічних репозиторіях
- Використовуйте змінні середовища для зберігання токенів
- Регулярно оновлюйте токени (особливо якщо використовуєте короткострокові)
- Обмежте доступ до Events Manager тільки необхідним користувачам

## Документація Facebook

- [Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Event Matching](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/server-event#matching)
- [Test Events](https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api#testEvents)

