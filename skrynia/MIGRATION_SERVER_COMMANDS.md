# Команди для Запуску Міграції на Сервері

## ⚠️ Важливо: Використовуйте `docker compose` (без дефісу)

На новіших версіях Docker використовується `docker compose` замість `docker-compose`.

## 🔍 Крок 1: Перевірка Поточного Стану

```bash
# Перевірити поточну версію міграції
docker exec skrynia_backend_prod alembic current

# Перевірити чи є файл міграції в контейнері
docker exec skrynia_backend_prod ls -la /app/alembic/versions/ | grep multilingual

# Перевірити історію міграцій
docker exec skrynia_backend_prod alembic history | head -10
```

## 🚀 Крок 2: Перебудувати Backend (якщо файлу немає)

```bash
cd /app/runebox

# Перебудувати backend контейнер
docker compose -f docker-compose.prod.yml build backend

# Перезапустити backend
docker compose -f docker-compose.prod.yml up -d backend

# Зачекати кілька секунд поки контейнер запуститься
sleep 5

# Запустити міграцію
docker exec skrynia_backend_prod alembic upgrade head
```

## 📋 Крок 3: Якщо Файл Міграції Відсутній - Скопіювати Вручну

```bash
# З хоста (де є файл міграції) скопіювати в контейнер
# Спочатку перевірити чи файл існує локально
ls -la skrynia/backend/alembic/versions/20260113_add_multilingual_fields_to_blog.py

# Скопіювати файл в контейнер
docker cp skrynia/backend/alembic/versions/20260113_add_multilingual_fields_to_blog.py \
  skrynia_backend_prod:/app/alembic/versions/20260113_add_multilingual_fields_to_blog.py

# Перевірити що файл скопійовано
docker exec skrynia_backend_prod ls -la /app/alembic/versions/ | grep multilingual

# Запустити міграцію
docker exec skrynia_backend_prod alembic upgrade head
```

## 🔧 Крок 4: Альтернатива - Виконати SQL Вручну

Якщо міграція все ще не працює, можна виконати SQL вручну:

```bash
# Підключитися до бази даних
docker exec -it skrynia_db_prod psql -U postgres -d skrynia

# Або якщо інші credentials
docker exec -it skrynia_db_prod psql $DATABASE_URL
```

Потім виконати SQL:

```sql
-- Додати поля для title
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS title_uk VARCHAR(255);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS title_en VARCHAR(255);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS title_de VARCHAR(255);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS title_pl VARCHAR(255);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS title_se VARCHAR(255);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS title_no VARCHAR(255);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS title_dk VARCHAR(255);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS title_fr VARCHAR(255);

-- Додати поля для excerpt
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS excerpt_uk TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS excerpt_en TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS excerpt_de TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS excerpt_pl TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS excerpt_se TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS excerpt_no TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS excerpt_dk TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS excerpt_fr TEXT;

-- Додати поля для content
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS content_uk TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS content_en TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS content_de TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS content_pl TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS content_se TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS content_no TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS content_dk TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS content_fr TEXT;

-- Мігрувати дані зі старих полів
UPDATE blogs 
SET title_uk = COALESCE(title_uk, title, 'Untitled'),
    excerpt_uk = COALESCE(excerpt_uk, excerpt, ''),
    content_uk = COALESCE(content_uk, content, '')
WHERE title_uk IS NULL OR content_uk IS NULL;

-- Зробити поля обов'язковими (якщо всі записи мають значення)
UPDATE blogs SET title_uk = 'Untitled' WHERE title_uk IS NULL;
UPDATE blogs SET content_uk = '' WHERE content_uk IS NULL;

ALTER TABLE blogs ALTER COLUMN title_uk SET NOT NULL;
ALTER TABLE blogs ALTER COLUMN content_uk SET NOT NULL;

-- Додати індекс
CREATE INDEX IF NOT EXISTS ix_blogs_title_uk ON blogs(title_uk);

-- Оновити версію міграції вручну
UPDATE alembic_version SET version_num = 'add_multilingual_blog' WHERE version_num = '4a58bdf4ed05';
-- Або якщо запису немає
INSERT INTO alembic_version (version_num) VALUES ('add_multilingual_blog') ON CONFLICT DO NOTHING;
```

## ✅ Перевірка Після Міграції

```bash
# Перевірити версію міграції
docker exec skrynia_backend_prod alembic current

# Перевірити структуру таблиці
docker exec skrynia_db_prod psql -U postgres -d skrynia -c "\d blogs" | grep -E "title_|excerpt_|content_"

# Перевірити дані
docker exec skrynia_db_prod psql -U postgres -d skrynia -c "SELECT id, title, title_uk FROM blogs LIMIT 3;"
```

## 🐛 Troubleshooting

### Помилка: "No such file or directory"
- Файл міграції не скопійований в контейнер
- Використайте варіант 3 (SQL вручну)

### Помилка: "relation already exists"
- Поля вже існують
- Перевірте: `docker exec skrynia_db_prod psql -U postgres -d skrynia -c "\d blogs"`

### Помилка: "could not connect to server"
- Перевірте що база даних запущена: `docker ps | grep db`
- Перевірте змінні оточення

