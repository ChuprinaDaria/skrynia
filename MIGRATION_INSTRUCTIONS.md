# Інструкція з виконання міграції бази даних

## Яка міграція потрібна

**Міграція:** `20260119_add_multilingual_fields_to_products.py`

**Що додає:**
- Мультимовні поля для товарів (SE, NO, DK, FR):
  - `title_se`, `title_no`, `title_dk`, `title_fr`
  - `description_se`, `description_no`, `description_dk`, `description_fr`
  - `legend_title_se`, `legend_title_no`, `legend_title_dk`, `legend_title_fr`
  - `legend_content_se`, `legend_content_no`, `legend_content_dk`, `legend_content_fr`
- Теги для кожної мови окремо:
  - `tags_uk`, `tags_en`, `tags_de`, `tags_pl`, `tags_se`, `tags_no`, `tags_dk`, `tags_fr`
- Автоматично переносить існуючі теги з `tags` в `tags_uk`

## Як запустити міграцію на сервері

### Варіант 1: Через Docker (рекомендовано)

```bash
# Зайти в контейнер backend
docker exec -it backend bash

# Або якщо контейнер називається інакше
docker exec -it skrynia-backend-1 bash

# Виконати міграцію
cd /app
alembic upgrade head
```

### Варіант 2: Безпосередньо через Docker (без входу в контейнер)

```bash
# Виконати команду в контейнері
docker exec -it backend alembic upgrade head

# Або якщо контейнер називається інакше
docker exec -it skrynia-backend-1 alembic upgrade head
```

### Варіант 3: Якщо backend запущений локально (не в Docker)

```bash
cd skrynia/backend
source venv/bin/activate  # або . venv/bin/activate
alembic upgrade head
```

### Варіант 4: Через docker-compose

```bash
# З кореня проекту
docker-compose exec backend alembic upgrade head

# Або якщо використовується docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

## Перевірка статусу міграцій

### Перевірити поточну версію БД:

```bash
docker exec -it backend alembic current
```

### Перевірити історію міграцій:

```bash
docker exec -it backend alembic history
```

### Перевірити, які міграції потрібно виконати:

```bash
docker exec -it backend alembic heads
```

## Відкат міграції (якщо потрібно)

```bash
# Відкатити на одну міграцію назад
docker exec -it backend alembic downgrade -1

# Відкатити до конкретної версії
docker exec -it backend alembic downgrade add_multilingual_blog
```

## Важливо!

⚠️ **Перед виконанням міграції:**
1. Зробіть backup бази даних
2. Переконайтеся, що backend контейнер запущений
3. Перевірте, що є доступ до бази даних

## Backup бази даних (PostgreSQL)

```bash
# Створити backup
docker exec -it postgres pg_dump -U your_username your_database > backup_$(date +%Y%m%d_%H%M%S).sql

# Або якщо використовується docker-compose
docker-compose exec postgres pg_dump -U your_username your_database > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Після міграції

Після успішного виконання міграції:
1. Перезапустіть backend контейнер (якщо потрібно):
   ```bash
   docker restart backend
   ```
2. Перевірте, що все працює правильно
3. Перевірте в адмін-панелі, що теги та мультимовні поля працюють

## Можливі проблеми

### Помилка: "Can't locate revision identified by..."
**Рішення:** Переконайтеся, що всі попередні міграції виконані:
```bash
docker exec -it backend alembic upgrade head
```

### Помилка: "Table 'products' already has column 'title_se'"
**Рішення:** Міграція вже виконана. Перевірте поточну версію:
```bash
docker exec -it backend alembic current
```

### Помилка підключення до БД
**Рішення:** Перевірте, що:
- PostgreSQL контейнер запущений
- Правильні налаштування в `.env` або `docker-compose.yml`
- Backend контейнер має доступ до БД

