#!/bin/bash
# Скрипт для створення БД та користувача PostgreSQL
# Використання: ./create_db.sh

echo "🔧 Створення БД для Skrynia..."

# Спробувати через sudo
if sudo -n true 2>/dev/null; then
    echo "Створення через sudo..."
    sudo -u postgres psql -h localhost -p 5433 <<EOF
CREATE USER skrynia_user WITH PASSWORD 'skrynia_password';
CREATE DATABASE skrynia_db OWNER skrynia_user;
GRANT ALL PRIVILEGES ON DATABASE skrynia_db TO skrynia_user;
\q
EOF
    if [ $? -eq 0 ]; then
        echo "✅ БД створено успішно!"
        exit 0
    fi
fi

# Спробувати через Docker
if docker ps -a | grep -q skrynia_postgres; then
    echo "Створення через Docker..."
    docker start skrynia_postgres 2>/dev/null
    sleep 2
    docker exec -i skrynia_postgres psql -U postgres <<EOF
CREATE USER skrynia_user WITH PASSWORD 'skrynia_password';
CREATE DATABASE skrynia_db OWNER skrynia_user;
GRANT ALL PRIVILEGES ON DATABASE skrynia_db TO skrynia_user;
\q
EOF
    if [ $? -eq 0 ]; then
        echo "✅ БД створено успішно через Docker!"
        exit 0
    fi
fi

echo "❌ Не вдалося створити БД автоматично."
echo ""
echo "Виконайте вручну одну з команд:"
echo ""
echo "1. Через sudo:"
echo "   sudo -u postgres psql -h localhost -p 5433"
echo ""
echo "2. Через Docker:"
echo "   docker start skrynia_postgres"
echo "   docker exec -it skrynia_postgres psql -U postgres"
echo ""
echo "Потім виконайте SQL:"
echo "   CREATE USER skrynia_user WITH PASSWORD 'skrynia_password';"
echo "   CREATE DATABASE skrynia_db OWNER skrynia_user;"
echo "   GRANT ALL PRIVILEGES ON DATABASE skrynia_db TO skrynia_user;"
echo "   \q"

