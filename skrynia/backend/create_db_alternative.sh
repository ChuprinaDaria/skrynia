#!/bin/bash
# Альтернативний спосіб створення БД через локальний socket
# Використання: ./create_db_alternative.sh

echo "🔧 Створення БД через локальний socket PostgreSQL..."

# Спробувати через локальний socket (peer authentication)
if [ -S /var/run/postgresql/.s.PGSQL.5432 ]; then
    echo "Спробувати через стандартний порт 5432..."
    sudo -u postgres psql -c "CREATE USER skrynia_user WITH PASSWORD 'skrynia_password';" 2>/dev/null
    sudo -u postgres psql -c "CREATE DATABASE skrynia_db OWNER skrynia_user;" 2>/dev/null
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE skrynia_db TO skrynia_user;" 2>/dev/null
fi

# Спробувати через порт 5433 з локальним socket
if [ -S /var/run/postgresql/.s.PGSQL.5433 ]; then
    echo "Спробувати через порт 5433..."
    sudo -u postgres psql -p 5433 -c "CREATE USER skrynia_user WITH PASSWORD 'skrynia_password';" 2>/dev/null
    sudo -u postgres psql -p 5433 -c "CREATE DATABASE skrynia_db OWNER skrynia_user;" 2>/dev/null
    sudo -u postgres psql -p 5433 -c "GRANT ALL PRIVILEGES ON DATABASE skrynia_db TO skrynia_user;" 2>/dev/null
fi

# Перевірка
PGPASSWORD=skrynia_password psql -h localhost -p 5433 -U skrynia_user -d skrynia_db -c "SELECT 1;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ БД створено успішно!"
    exit 0
fi

echo ""
echo "❌ Автоматичне створення не вдалося."
echo ""
echo "Виконайте вручну в терміналі (потрібен пароль sudo):"
echo ""
echo "sudo -u postgres psql -p 5433"
echo ""
echo "Або якщо працює peer authentication:"
echo "sudo -u postgres psql -p 5433 -h localhost"
echo ""
echo "Потім виконайте SQL:"
echo "CREATE USER skrynia_user WITH PASSWORD 'skrynia_password';"
echo "CREATE DATABASE skrynia_db OWNER skrynia_user;"
echo "GRANT ALL PRIVILEGES ON DATABASE skrynia_db TO skrynia_user;"
echo "\\q"






