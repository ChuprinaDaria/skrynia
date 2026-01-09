-- SQL скрипт для створення БД та користувача
-- Використання: psql -h localhost -p 5433 -U postgres -f setup_db.sql

-- Створення користувача (якщо не існує)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'skrynia_user') THEN
        CREATE USER skrynia_user WITH PASSWORD 'skrynia_password';
    END IF;
END
$$;

-- Створення БД (якщо не існує)
SELECT 'CREATE DATABASE skrynia_db OWNER skrynia_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'skrynia_db')\gexec

-- Надання прав
GRANT ALL PRIVILEGES ON DATABASE skrynia_db TO skrynia_user;

-- Підключення до нової БД та надання прав на схему
\c skrynia_db
GRANT ALL ON SCHEMA public TO skrynia_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO skrynia_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO skrynia_user;

