# GitHub Actions Secrets для InPost

Цей документ описує всі секрети, які потрібно додати в GitHub Actions для роботи з InPost API.

## Необхідні Secrets

### 1. InPost ShipX API Token
**Назва секрету**: `INPOST_API_TOKEN`

**Опис**: Bearer токен для доступу до InPost ShipX API та Points API.

**Як отримати**:
1. Увійдіть в Parcel Manager:
   - **Sandbox**: https://sandbox-manager.paczkomaty.pl
   - **Production**: https://manager.paczkomaty.pl
2. Перейдіть: **My Account** → **API**
3. Розгорніть секцію **ShipX API**
4. Натисніть **Generate** для створення нового токену
5. Скопіюйте токен (він використовується як Bearer token)

**Використання**: 
- Використовується для всіх запитів до ShipX API (створення відправлень, отримання трекінгу, тощо)
- Використовується для Points API (пошук пачкоматів)

---

### 2. InPost Organization ID
**Назва секрету**: `INPOST_ORGANIZATION_ID`

**Опис**: ID вашої організації в InPost.

**Як отримати**:
1. Увійдіть в Parcel Manager (sandbox або production)
2. Перейдіть: **My Account** → **API**
3. Розгорніть секцію **ShipX API**
4. Organization ID відображається в інформації про API
5. Або використайте API для отримання:
   ```bash
   # Замініть <your-api-token> на ваш реальний токен
   curl -X GET https://api-shipx-pl.easypack24.net/v1/organizations \
     -H "Authorization: Bearer <your-api-token>"
   ```

**Використання**: 
- Опціонально - якщо не вказано, система автоматично отримає ID з API
- Може бути корисним для кешування та оптимізації

---

### 3. InPost Geowidget Token
**Назва секрету**: `INPOST_GEOWIDGET_TOKEN`

**Опис**: PUBLIC токен для Geowidget (JavaScript widget для вибору пачкоматів).

**Як отримати**:
1. Увійдіть в Parcel Manager (sandbox або production)
2. Перейдіть: **My Account** → **API**
3. Розгорніть секцію **Geowidget**
4. Натисніть **Generate** для створення нового токену
5. Скопіюйте PUBLIC токен

**Важливо**: 
- Для sandbox environment при використанні localhost **не вказуйте домен** при генерації токену
- Це PUBLIC токен, який використовується на фронтенді (не секретний)

**Використання**: 
- Використовується в React компоненті `InPostGeowidget` для відображення карти з пачкоматами
- Передається як prop `token` в компонент

---

### 4. InPost Sandbox Flag
**Назва секрету**: `INPOST_SANDBOX`

**Опис**: Флаг для вибору середовища (sandbox або production).

**Значення**: 
- `true` - використовувати sandbox середовище
- `false` - використовувати production середовище

**За замовчуванням**: `true`

---

## Налаштування в GitHub Actions

### Додавання Secrets

1. Перейдіть в ваш репозиторій на GitHub
2. Відкрийте **Settings** → **Secrets and variables** → **Actions**
3. Натисніть **New repository secret**
4. Додайте кожен секрет окремо:

```
Name: INPOST_API_TOKEN
Value: ваш_токен_shipx_api

Name: INPOST_ORGANIZATION_ID
Value: ваш_organization_id

Name: INPOST_GEOWIDGET_TOKEN
Value: ваш_geowidget_token

Name: INPOST_SANDBOX
Value: true  # або false для production
```

### Використання в Workflow

Приклад використання в `.github/workflows/deploy.yml`:

```yaml
env:
  INPOST_API_TOKEN: ${{ secrets.INPOST_API_TOKEN }}
  INPOST_ORGANIZATION_ID: ${{ secrets.INPOST_ORGANIZATION_ID }}
  INPOST_GEOWIDGET_TOKEN: ${{ secrets.INPOST_GEOWIDGET_TOKEN }}
  INPOST_SANDBOX: ${{ secrets.INPOST_SANDBOX }}
```

Або в Docker Compose:

```yaml
environment:
  INPOST_API_TOKEN: ${INPOST_API_TOKEN}
  INPOST_ORGANIZATION_ID: ${INPOST_ORGANIZATION_ID}
  INPOST_GEOWIDGET_TOKEN: ${INPOST_GEOWIDGET_TOKEN}
  INPOST_SANDBOX: ${INPOST_SANDBOX:-true}
```

---

## Різниця між Sandbox та Production

### Sandbox Environment
- **Parcel Manager**: https://sandbox-manager.paczkomaty.pl
- **ShipX API**: https://api-shipx-pl.easypack24.net/v1
- **Geowidget International**: https://sandbox-global-geowidget-sdk.easypack24.net
- **Geowidget v5**: https://sandbox-easy-geowidget-sdk.easypack24.net
- Використовується для тестування та розробки
- Дані не реальні, відправлення не створюються реально

### Production Environment
- **Parcel Manager**: https://manager.paczkomaty.pl
- **ShipX API**: https://api-shipx-pl.easypack24.net/v1 (той самий URL)
- **Geowidget International**: https://geowidget.inpost-group.com
- **Geowidget v5**: https://geowidget.inpost.pl
- Використовується для реальних замовлень
- Всі операції реальні

---

## Безпека

### Рекомендації:
1. ✅ **Ніколи не комітьте токени в код**
2. ✅ Використовуйте GitHub Secrets для зберігання
3. ✅ Розрізняйте токени для sandbox та production
4. ✅ Регулярно оновлюйте токени
5. ✅ Обмежуйте доступ до secrets тільки необхідним workflow

### Geowidget Token:
- Це PUBLIC токен, який використовується на фронтенді
- Він видимий в HTML коді сторінки
- Не містить секретної інформації
- Можна використовувати в клієнтському коді

### ShipX API Token:
- Це SECRET токен, який має бути захищений
- Використовується тільки на бекенді
- Ніколи не передавайте його на фронтенд
- Зберігайте в GitHub Secrets

---

## Перевірка налаштувань

Після додавання secrets, перевірте:

1. **ShipX API**:
   ```bash
   curl -X GET https://api-shipx-pl.easypack24.net/v1/organizations \
     -H "Authorization: Bearer $INPOST_API_TOKEN"
   ```

2. **Points API**:
   ```bash
   curl -X GET "https://api-shipx-pl.easypack24.net/v1/points?limit=1" \
     -H "Authorization: Bearer $INPOST_API_TOKEN"
   ```

3. **Geowidget**: Перевірте, що widget відображається на сторінці з правильним токеном

---

---

## Facebook Conversions API Secrets

### 1. Facebook Pixel ID
**Назва секрету**: `FACEBOOK_PIXEL_ID`

**Опис**: ID вашого Facebook Pixel.

**Значення**: `1552229889398632`

**Використання**: 
- Використовується для ідентифікації Pixel в Conversions API
- Не секретний, але зберігається в Secrets для консистентності

---

### 2. Facebook Access Token
**Назва секрету**: `FACEBOOK_ACCESS_TOKEN`

**Опис**: Access Token для доступу до Facebook Conversions API.

**Як отримати**:
1. Перейдіть до [Facebook Business Manager](https://business.facebook.com/)
2. Відкрийте **Events Manager**
3. Виберіть ваш Pixel (ID: `1552229889398632`)
4. Перейдіть до **Settings** → **Conversions API**
5. Створіть **System User** або використайте існуючий
6. Додайте права доступу до Pixel
7. Згенеруйте **Access Token** (довгостроковий)

**Важливо**: 
- Токен має бути **довгостроковим** (Long-lived token)
- Токен має мати права на `ads_management` та доступ до Pixel
- **Ніколи не комітьте токен в код**

**Використання**: 
- Використовується для відправки подій до Facebook Conversions API
- Передається в HTTP заголовках при запитах до Graph API

---

### 3. Facebook API Version
**Назва секрету**: `FACEBOOK_API_VERSION`

**Опис**: Версія Facebook Graph API.

**Значення**: `v18.0` (або остання доступна версія)

**За замовчуванням**: `v18.0`

**Використання**: 
- Використовується для формування URL запитів до Graph API
- Формат: `https://graph.facebook.com/{version}/{pixel_id}/events`

---

### 4. Facebook Dataset Quality API Token
**Назва секрету**: `FACEBOOK_DATASET_QUALITY_TOKEN`

**Опис**: Токен для Dataset Quality API (для отримання метрик якості даних).

**Як отримати**:
1. Перейдіть до [Facebook Business Manager](https://business.facebook.com/)
2. Відкрийте **Events Manager**
3. Виберіть ваш Pixel (ID: `1552229889398632`)
4. Перейдіть до **Settings** → **Conversions API**
5. Увімкніть **Dataset Quality API** (Recommended)
6. Згенеруйте **Dataset Quality API Token**
7. Скопіюйте токен

**Важливо**: 
- Цей токен дозволяє отримувати метрики якості даних (EMQ, AEM)
- Не використовується для відправки подій, тільки для читання метрик
- **Ніколи не комітьте токен в код**

**Використання**: 
- Використовується для отримання Event Match Quality (EMQ) метрик
- Використовується для отримання Aggregated Event Measurement (AEM) метрик
- Дозволяє відстежувати якість даних та оптимізувати результативність

**API Endpoints**:
- `GET /api/v1/facebook/metrics/emq` - Event Match Quality метрики
- `GET /api/v1/facebook/metrics/aem` - Aggregated Event Measurement метрики

---

### Налаштування в GitHub Actions

Додайте до GitHub Secrets:

```
Name: FACEBOOK_PIXEL_ID
Value: 1552229889398632

Name: FACEBOOK_ACCESS_TOKEN
Value: ваш_access_token

Name: FACEBOOK_API_VERSION
Value: v18.0
```

### Використання в Docker Compose

```yaml
environment:
  FACEBOOK_PIXEL_ID: ${FACEBOOK_PIXEL_ID}
  FACEBOOK_ACCESS_TOKEN: ${FACEBOOK_ACCESS_TOKEN}
  FACEBOOK_API_VERSION: ${FACEBOOK_API_VERSION:-v18.0}
```

---

## Додаткова інформація

- **InPost Documentation**: https://dokumentacja-inpost.atlassian.net/
- **ShipX API Docs**: https://dokumentacja-inpost.atlassian.net/wiki/spaces/PL/overview
- **Geowidget Documentation**: Див. `backend/INPOST_GEOWIDGET.md`
- **Parcel Manager (Sandbox)**: https://sandbox-manager.paczkomaty.pl
- **Parcel Manager (Production)**: https://manager.paczkomaty.pl
- **Facebook Conversions API**: Див. `FACEBOOK_CONVERSIONS_API_SETUP.md`

