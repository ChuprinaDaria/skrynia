# Автоматичне оновлення InPost Secrets при деплої

Всі секрети InPost автоматично оновлюються при кожному деплої через GitHub Actions.

## Як це працює

### 1. GitHub Actions Workflow (`deploy.yml`)

При кожному push в `main` або ручному запуску workflow:

1. **Створюється `.env` файл** на сервері з усіма секретами з GitHub Secrets
2. **Оновлюються змінні оточення** в Docker контейнерах
3. **Перезапускаються контейнери** з новими значеннями

### 2. Додано до `.env` файлу

```bash
# InPost
INPOST_API_TOKEN=${{ secrets.INPOST_API_TOKEN }}
INPOST_ORGANIZATION_ID=${{ secrets.INPOST_ORGANIZATION_ID }}
INPOST_GEOWIDGET_TOKEN=${{ secrets.INPOST_GEOWIDGET_TOKEN }}
INPOST_SANDBOX=${{ secrets.INPOST_SANDBOX }}
```

### 3. Передано в Docker Compose

**Backend** (`docker-compose.prod.yml`):
```yaml
environment:
  INPOST_API_TOKEN: ${INPOST_API_TOKEN}
  INPOST_ORGANIZATION_ID: ${INPOST_ORGANIZATION_ID}
  INPOST_GEOWIDGET_TOKEN: ${INPOST_GEOWIDGET_TOKEN}
  INPOST_SANDBOX: ${INPOST_SANDBOX:-true}
```

**Frontend** (`docker-compose.prod.yml`):
```yaml
environment:
  NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN: ${INPOST_GEOWIDGET_TOKEN}
```

## Перевірка після деплою

Після кожного деплою перевірте:

1. **Backend logs**:
   ```bash
   docker compose -f docker-compose.prod.yml logs backend | grep INPOST
   ```

2. **Перевірка змінних оточення**:
   ```bash
   docker compose -f docker-compose.prod.yml exec backend env | grep INPOST
   ```

3. **Frontend змінні**:
   ```bash
   docker compose -f docker-compose.prod.yml exec frontend env | grep INPOST
   ```

## Оновлення секретів

Якщо потрібно оновити секрети:

1. Перейдіть: **GitHub** → **Settings** → **Secrets and variables** → **Actions**
2. Знайдіть потрібний секрет (наприклад, `INPOST_API_TOKEN`)
3. Натисніть **Update**
4. Введіть нове значення
5. Збережіть
6. Запустіть деплой вручну або зробіть push в `main`

**Важливо**: Після оновлення секретів в GitHub, автоматично запуститься деплой, який оновить `.env` файл на сервері.

## Структура файлів

### Backend (`backend/app/core/config.py`)
```python
# InPost
INPOST_API_TOKEN: str = ""  # ShipX API token
INPOST_ORGANIZATION_ID: str = ""  # Organization ID
INPOST_SANDBOX: bool = True  # Use sandbox environment
INPOST_GEOWIDGET_TOKEN: str = ""  # Geowidget PUBLIC token
```

### Frontend (`components/shipping/InPostGeowidget.tsx`)
```typescript
// Token передається через prop або з process.env.NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN
token={process.env.NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN || 'fallback-token'}
```

## Troubleshooting

### Секрети не оновлюються

1. Перевірте, що секрети додані в GitHub Secrets
2. Перевірте логи workflow: **Actions** → **Deploy to Production** → **View logs**
3. Перевірте `.env` файл на сервері:
   ```bash
   ssh root@your-server
   cat /app/runebox/.env | grep INPOST
   ```

### Backend не бачить змінні

1. Перезапустіть контейнер:
   ```bash
   docker compose -f docker-compose.prod.yml restart backend
   ```

2. Перевірте, що змінні передані:
   ```bash
   docker compose -f docker-compose.prod.yml exec backend printenv | grep INPOST
   ```

### Frontend не бачить Geowidget token

1. Перевірте, що змінна доступна:
   ```bash
   docker compose -f docker-compose.prod.yml exec frontend printenv | grep INPOST
   ```

2. Перезапустіть frontend:
   ```bash
   docker compose -f docker-compose.prod.yml restart frontend
   ```

3. Перевірте в браузері (DevTools → Console):
   ```javascript
   console.log(process.env.NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN)
   ```

## Автоматичне оновлення

✅ **Автоматично оновлюється при**:
- Push в `main` branch
- Ручному запуску workflow (`workflow_dispatch`)
- Оновленні секретів в GitHub (потрібен новий деплой)

❌ **НЕ оновлюється автоматично**:
- Зміна `.env` файлу вручну на сервері (буде перезаписано при наступному деплої)
- Зміна змінних оточення в Docker без оновлення GitHub Secrets

## Рекомендації

1. ✅ **Завжди оновлюйте секрети в GitHub**, а не на сервері
2. ✅ **Використовуйте різні токени** для sandbox та production
3. ✅ **Регулярно ротуйте токени** (кожні 3-6 місяців)
4. ✅ **Моніторьте логи** після кожного деплою
5. ✅ **Тестуйте в sandbox** перед переходом на production

