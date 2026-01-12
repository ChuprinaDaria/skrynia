# Інструкції для створення БД

## Проблема
PostgreSQL на порту 5433 вимагає пароль для користувача `postgres`, який невідомий.

## Рішення

### Варіант 1: Через локальний socket (peer authentication)
Якщо PostgreSQL налаштований на peer authentication для локальних підключень:

```bash
sudo -u postgres psql -p 5433
```

Потім виконайте SQL:
```sql
CREATE USER skrynia_user WITH PASSWORD 'skrynia_password';
CREATE DATABASE skrynia_db OWNER skrynia_user;
GRANT ALL PRIVILEGES ON DATABASE skrynia_db TO skrynia_user;
\q
```

### Варіант 2: Встановити пароль для postgres
Якщо ви маєте доступ до системи, встановіть пароль для користувача postgres:

```bash
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'ваш_пароль';"
```

Потім використовуйте цей пароль для підключення.

### Варіант 3: Використати .pgpass файл
Створіть файл `~/.pgpass` з паролем:

```bash
echo "localhost:5433:*:postgres:ваш_пароль" > ~/.pgpass
chmod 600 ~/.pgpass
```

Потім підключіться:
```bash
psql -h localhost -p 5433 -U postgres
```

### Варіант 4: Через Docker
Якщо є Docker контейнер:

```bash
docker start skrynia_postgres
docker exec -it skrynia_postgres psql -U postgres
```

### Варіант 5: Звернутися до адміністратора
Якщо ви не маєте прав для створення БД, зверніться до адміністратора PostgreSQL з проханням:
- Створити користувача `skrynia_user` з паролем `skrynia_password`
- Створити БД `skrynia_db` з власником `skrynia_user`
- Надати всі права на БД

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

## Перевірка підключення

```bash
PGPASSWORD=skrynia_password psql -h localhost -p 5433 -U skrynia_user -d skrynia_db -c "SELECT 1;"
```

Якщо команда виконується без помилок, БД створена правильно.






