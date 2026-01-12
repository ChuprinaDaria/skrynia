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
   curl -X GET https://api-shipx-pl.easypack24.net/v1/organizations \
     -H "Authorization: Bearer YOUR_TOKEN"
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

## Додаткова інформація

- **InPost Documentation**: https://dokumentacja-inpost.atlassian.net/
- **ShipX API Docs**: https://dokumentacja-inpost.atlassian.net/wiki/spaces/PL/overview
- **Geowidget Documentation**: Див. `backend/INPOST_GEOWIDGET.md`
- **Parcel Manager (Sandbox)**: https://sandbox-manager.paczkomaty.pl
- **Parcel Manager (Production)**: https://manager.paczkomaty.pl

