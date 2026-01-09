#!/bin/bash
# Скрипт для ручного створення БД та користувача
# Використання: ./init_db_manual.sh

echo "Створення користувача та БД для Skrynia..."

# Створення користувача (якщо не існує)
psql -U postgres -c "CREATE USER skrynia_user WITH PASSWORD 'skrynia_password';" 2>/dev/null || echo "Користувач вже існує"

# Створення БД (якщо не існує)
psql -U postgres -c "CREATE DATABASE skrynia_db OWNER skrynia_user;" 2>/dev/null || echo "БД вже існує"

# Надання прав
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE skrynia_db TO skrynia_user;"

# Перевірка підключення
echo "Перевірка підключення..."
PGPASSWORD=skrynia_password psql -h localhost -p 5433 -U skrynia_user -d skrynia_db -c "SELECT 1;" && echo "✅ Підключення успішне!" || echo "❌ Помилка підключення"

echo "Готово! Тепер можна запустити: python init_db.py"

