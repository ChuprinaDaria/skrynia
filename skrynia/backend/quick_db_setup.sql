-- Швидке створення БД для Skrynia
-- Використання: sudo -u postgres psql -p 5433 -f quick_db_setup.sql
-- АБО: sudo -u postgres psql -p 5433, потім скопіюйте команди нижче

-- Створення користувача (якщо не існує)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'skrynia_user') THEN
        CREATE USER skrynia_user WITH PASSWORD 'skrynia_password';
        RAISE NOTICE 'Користувач skrynia_user створено';
    ELSE
        RAISE NOTICE 'Користувач skrynia_user вже існує';
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

-- Перевірка
\du skrynia_user
\l skrynia_db

\q





