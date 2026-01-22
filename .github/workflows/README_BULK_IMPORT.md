# GitHub Actions: Bulk Import Products

## Огляд

Workflow для автоматичного завантаження товарів з папки `товари/` на сервер через CI/CD.

## Workflows

### 1. `bulk-import-products.yml` - Окремий Workflow

**Тригери:**
- **Manual** - запуск вручну через GitHub Actions UI
- **Push** - автоматично при зміні файлів в `товари/` або `scripts/bulk_import_products.py`
- **Schedule** - автоматично щодня о 3:00 UTC (опціонально)

**Параметри (при manual запуску):**
- `products_path` - шлях до папки з товарами (за замовчуванням: `товари`)
- `api_url` - URL API сервера (за замовчуванням: `https://api.runebox.eu`)
- `skip_errors` - пропустити помилки і продовжити (true/false)

### 2. Інтеграція в `deploy.yml`

Bulk import автоматично запускається після успішного deployment на production:
- Запускається тільки на `main` branch
- Чекає готовності API (до 60 секунд)
- Автоматично отримує admin token
- Завантажує всі товари з папки `товари/`
- Не блокує deployment при помилках

## Як використовувати

### Manual запуск:

1. Перейдіть до **Actions** → **Bulk Import Products**
2. Клікніть **Run workflow**
3. Виберіть branch (зазвичай `main`)
4. Налаштуйте параметри (опціонально)
5. Клікніть **Run workflow**

### Автоматичний запуск:

**При push в `товари/`:**
```bash
git add товари/
git commit -m "Додано нові товари"
git push origin main
```

Workflow автоматично запуститься і завантажить товари.

### Автоматичний запуск після deployment:

При push в `main`:
1. Запускається `deploy.yml`
2. Після успішного deployment автоматично запускається bulk import
3. Товари завантажуються на production сервер

## Secrets Required

Встановіть в **Settings → Secrets and variables → Actions**:

### Обов'язкові:
- `ADMIN_EMAIL` - email адміністратора
- `ADMIN_PASSWORD` - пароль адміністратора
- `BACKEND_URL` або `NEXT_PUBLIC_API_URL` - URL API сервера

### Приклади:
```
ADMIN_EMAIL = admin@example.com
ADMIN_PASSWORD = your_secure_password
BACKEND_URL = https://api.runebox.eu
```

## Структура папки товарів

```
товари/
└── product-slug/
    ├── product.json          ← Обов'язково
    ├── description-uk.md     ← Опціонально
    ├── image-1.jpg           ← Зображення
    └── video.mp4             ← Відео (опціонально)
```

## Логи та результати

Після виконання workflow:
- Перейдіть до **Actions** → виберіть workflow run
- Перегляньте логи кожного кроку
- Подивіться summary в кінці workflow

## Troubleshooting

### Помилка: "Не вдалося отримати token"
- Перевірте `ADMIN_EMAIL` та `ADMIN_PASSWORD` в Secrets
- Перевірте, що API доступний за URL в `BACKEND_URL`

### Помилка: "Папка не існує"
- Переконайтеся, що папка `товари/` існує в репозиторії
- Перевірте шлях в параметрі `products_path`

### Помилка завантаження зображень
- Перевірте формат файлів (JPG, PNG, WebP)
- Перевірте розмір файлів (максимум 10MB)
- Перевірте права доступу до папки uploads на сервері

### API не готовий
- Workflow чекає до 60 секунд на готовність API
- Якщо API не готовий - перевірте логи deployment
- Можна запустити bulk import вручну пізніше

## Приклади використання

### Завантажити товари на staging:
```yaml
# Manual запуск з параметрами:
products_path: товари
api_url: https://staging-api.runebox.eu
skip_errors: false
```

### Завантажити товари на production:
```yaml
# Просто push в main - все автоматично
git push origin main
```

## Примітки

- ✅ Bulk import не блокує deployment при помилках
- ✅ Автоматично визначає, чи товар вже існує (за slug)
- ✅ Оновлює існуючі товари або створює нові
- ✅ Завантажує всі зображення та відео
- ✅ Підтримує `.md` файли для описів

