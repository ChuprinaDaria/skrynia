# Швидке Виправлення: Запуск Міграції Блогу

## Проблема
Міграція `add_multilingual_blog` не застосовується, бо файл ще не в контейнері.

## Рішення 1: Перебудувати Backend Контейнер (Рекомендовано)

```bash
# На сервері
cd /app/runebox
docker-compose -f docker-compose.prod.yml build backend
docker-compose -f docker-compose.prod.yml up -d backend
```

Після перебудови:
```bash
docker exec -it skrynia_backend_prod bash
alembic upgrade head
```

## Рішення 2: Скопіювати Файл Міграції Вручну

```bash
# На сервері, знайти шлях до alembic/versions
docker exec -it skrynia_backend_prod bash
ls -la /app/alembic/versions/

# Якщо файлу немає, скопіювати його з хоста в контейнер
# (з хоста, де є файл міграції)
docker cp skrynia/backend/alembic/versions/20260113_add_multilingual_fields_to_blog.py \
  skrynia_backend_prod:/app/alembic/versions/20260113_add_multilingual_fields_to_blog.py

# Потім в контейнері
alembic upgrade head
```

## Рішення 3: Запустити SQL Вручну (Якщо інші не працюють)

```bash
# Підключитися до бази даних
docker exec -it skrynia_db_prod psql -U your_db_user -d your_db_name

# Або через backend контейнер
docker exec -it skrynia_backend_prod psql $DATABASE_URL
```

Потім виконати SQL з міграції:

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

-- Мігрувати дані
UPDATE blogs 
SET title_uk = COALESCE(title_uk, title, 'Untitled'),
    excerpt_uk = COALESCE(excerpt_uk, excerpt, ''),
    content_uk = COALESCE(content_uk, content, '')
WHERE title_uk IS NULL OR content_uk IS NULL;

-- Зробити поля обов'язковими
ALTER TABLE blogs ALTER COLUMN title_uk SET NOT NULL;
ALTER TABLE blogs ALTER COLUMN content_uk SET NOT NULL;

-- Додати індекс
CREATE INDEX IF NOT EXISTS ix_blogs_title_uk ON blogs(title_uk);

-- Оновити версію міграції вручну
INSERT INTO alembic_version (version_num) 
VALUES ('add_multilingual_blog')
ON CONFLICT (version_num) DO NOTHING;
```

## Перевірка Після Міграції

```bash
# В контейнері backend
alembic current  # Має показати: add_multilingual_blog

# Перевірити структуру таблиці
docker exec -it skrynia_db_prod psql -U your_db_user -d your_db_name -c "\d blogs"
```

## Якщо Потрібно Відкотити

```sql
-- Видалити нові поля (якщо потрібно)
ALTER TABLE blogs DROP COLUMN IF EXISTS title_fr, title_dk, title_no, title_se, title_pl, title_de, title_en;
ALTER TABLE blogs DROP COLUMN IF EXISTS excerpt_fr, excerpt_dk, excerpt_no, excerpt_se, excerpt_pl, excerpt_de, excerpt_en;
ALTER TABLE blogs DROP COLUMN IF EXISTS content_fr, content_dk, content_no, content_se, content_pl, content_de, content_en;
ALTER TABLE blogs DROP COLUMN IF EXISTS title_uk, excerpt_uk, content_uk;
DROP INDEX IF EXISTS ix_blogs_title_uk;
DELETE FROM alembic_version WHERE version_num = 'add_multilingual_blog';
```

