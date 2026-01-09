# Інструкції для створення БД

## Проблема
PostgreSQL на порту 5433 не приймає підключення з паролем `skrynia_password` для користувача `skrynia_user`.

## Рішення

### Варіант 1: Через sudo (якщо є права)
```bash
sudo -u postgres psql -h localhost -p 5433
```

Потім виконайте:
```sql
CREATE USER skrynia_user WITH PASSWORD 'skrynia_password';
CREATE DATABASE skrynia_db OWNER skrynia_user;
GRANT ALL PRIVILEGES ON DATABASE skrynia_db TO skrynia_user;
\q
```

### Варіант 2: Через Docker (якщо PostgreSQL в Docker)
```bash
docker exec -it skrynia_postgres psql -U postgres
```

Або якщо контейнер не запущений:
```bash
docker start skrynia_postgres
docker exec -it skrynia_postgres psql -U postgres
```

### Варіант 3: Змінити пароль в .env
Якщо ви знаєте правильний пароль для PostgreSQL, оновіть `DATABASE_URL` в `.env`:
```
DATABASE_URL=postgresql://правильний_користувач:правильний_пароль@localhost:5433/правильна_бд
```

### Варіант 4: Використати SQLite для тестування
Тимчасово можна використати SQLite замість PostgreSQL для тестування.

## Після створення БД

1. Запустіть міграції:
```bash
cd /home/dchuprina/skrynia/skrynia/backend
source venv/bin/activate
alembic upgrade head
```

2. Ініціалізуйте БД:
```bash
python init_db.py
```

3. Перевірте логін:
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@skrynia.com","password":"admin123"}'
```

