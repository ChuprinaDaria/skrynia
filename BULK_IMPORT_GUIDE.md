# Інструкція з Bulk Завантаження Товарів

## Структура Папок

Рекомендована структура для bulk завантаження товарів:

```
товари/
├── лунниця-з-перлами/
│   ├── product.json          # JSON файл з усією інформацією про товар
│   ├── image-1.jpg           # Зображення товару (перше = головне)
│   ├── image-2.jpg
│   ├── image-3.jpg
│   └── video.mp4             # Опціонально: відео товару
│
├── оберіг-захисту/
│   ├── product.json
│   ├── main.jpg
│   ├── detail-1.jpg
│   └── detail-2.jpg
│
└── слов-янська-брошка/
    ├── product.json
    ├── front.jpg
    ├── back.jpg
    └── packaging.jpg
```

**Важливо:**
- Назва папки = slug товару (латиниця, без пробілів, з дефісами)
- Перше зображення в алфавітному порядку стає головним
- Всі зображення мають бути в форматі: JPG, PNG, WebP
- Відео опціонально (MP4, MOV, AVI)

---

## Формат 1: JSON (Рекомендований)

JSON формат підтримує всі можливості системи, включаючи багатомовність.

### Структура `product.json`:

```json
{
  "title_uk": "Лунниця з натуральними перлами",
  "title_en": "Lunnytsya with Natural Pearls",
  "title_de": "Lunnytsya mit natürlichen Perlen",
  "title_pl": "Lunnytsya z naturalnymi perłami",
  "title_se": "Lunnytsya med naturliga pärlor",
  "title_no": "Lunnytsya med naturlige perler",
  "title_dk": "Lunnytsya med naturlige perler",
  "title_fr": "Lunnytsya avec perles naturelles",
  
  "slug": "lunnytsya-z-perlamy",
  
  "description_uk": "Унікальна лунниця з натуральними річковими перлами...",
  "description_en": "Unique lunnytsya with natural river pearls...",
  "description_de": "Einzigartige Lunnytsya mit natürlichen Flussperlen...",
  "description_pl": "Unikalna lunnytsya z naturalnymi perłami rzecznymi...",
  
  // АБО використовуйте окремі .md файли:
  "description_uk_file": "description-uk.md",
  "description_en_file": "description-en.md",
  
  "legend_title_uk": "Легенда про Лунницю",
  "legend_title_en": "Legend of Lunnytsya",
  "legend_content_uk": "Лунниця - це древній слов'янський символ...",
  "legend_content_en": "Lunnytsya is an ancient Slavic symbol...",
  
  "price": 450.00,
  "currency": "zł",
  "compare_at_price": 550.00,
  
  "stock_quantity": 5,
  "sku": "LUN-PEARL-001",
  
  "materials_uk": [
    "натуральні річкові перли",
    "металевий сплав (лунниця)",
    "посріблена фурнітура"
  ],
  "materials_en": [
    "natural river pearls",
    "metal alloy (lunnytsya)",
    "silvered fittings"
  ],
  "materials_de": [
    "natürliche Flussperlen",
    "Metalllegierung (Lunnytsya)",
    "versilberte Beschläge"
  ],
  
  "specifications": {
    "Довжина": "45 см",
    "Ширина": "8 см",
    "Вага": "25 г"
  },
  
  "is_handmade": true,
  "category_id": 1,
  
  "tags_uk": [
    "слов'янський оберіг",
    "лунниця",
    "перли",
    "ручна робота"
  ],
  "tags_en": [
    "slavic amulet",
    "lunnytsya",
    "pearls",
    "handmade"
  ],
  
  "symbols": ["love", "protection", "wealth"],
  
  "is_active": true,
  "is_featured": true,
  
  "is_made_to_order": false,
  "made_to_order_duration": null,
  
  "meta_description_uk": "Унікальна лунниця з натуральними перлами. Слов'янський оберіг ручної роботи. Доставка по всьому світу.",
  "meta_description_en": "Unique lunnytsya with natural pearls. Handmade Slavic amulet. Worldwide shipping.",
  "meta_keywords_uk": [
    "слов'янські прикраси",
    "лунниця",
    "оберіг",
    "етно",
    "бохо"
  ],
  "meta_keywords_en": [
    "slavic jewelry",
    "lunnytsya",
    "amulet",
    "ethnic",
    "boho"
  ],
  
  "images": [
    {
      "filename": "image-1.jpg",
      "alt_text": "Лунниця з перлами - головне зображення",
      "position": 0,
      "is_primary": true
    },
    {
      "filename": "image-2.jpg",
      "alt_text": "Деталь лунниці",
      "position": 1,
      "is_primary": false
    }
  ],
  
  "videos": [
    {
      "filename": "video.mp4",
      "alt_text": "Відео презентація лунниці"
    }
  ]
}
```

### Обов'язкові поля:
- `title_uk` - назва українською (обов'язково)
- `slug` - унікальний slug (обов'язково)
- `price` - ціна (обов'язково)

### Опціональні поля:
- Всі інші поля опціональні
- Якщо поле не вказано, використовується значення за замовчуванням

---

## Markdown Тексти в Описах

Система підтримує **Markdown** для описів товарів (`description_*` та `legend_content_*`).

### Варіант 1: Markdown прямо в JSON

Пишіть Markdown текст прямо в JSON полях:

```json
{
  "description_uk": "Унікальна лунниця з натуральними річковими перлами.\n\n**Особливості:**\n- Натуральні річкові перли\n- Металевий сплав з посрібленням\n- Ручна робота майстра\n\n## Дизайн\n\nУнікальний дизайн, натхненний слов'янською культурою."
}
```

**Підтримувані Markdown елементи:**
- `**жирний текст**` або `__жирний текст__`
- `*курсив*` або `_курсив_`
- `# Заголовок 1`, `## Заголовок 2`, `### Заголовок 3`
- `- Список` або `* Список`
- `1. Нумерований список`
- `> Цитата`
- `[Текст посилання](https://url.com)`
- `` `код` ``
- `---` (горизонтальна лінія)

**Важливо для JSON:**
- Використовуйте `\n` для переносу рядка
- Екранюйте лапки: `\"` якщо потрібно
- Багаторядкові тексти в JSON потребують уваги до форматування

### Варіант 2: Окремі .md файли (Рекомендовано для довгих текстів)

Для довгих описів зручніше використовувати окремі `.md` файли:

**Структура:**
```
lunnytsya-z-perlamy/
├── product.json
├── description-uk.md        ← Опис українською
├── description-en.md       ← Опис англійською
├── legend-content-uk.md     ← Контент легенди українською
└── images...
```

**В `product.json` вкажіть посилання на файли:**
```json
{
  "description_uk_file": "description-uk.md",
  "description_en_file": "description-en.md",
  "legend_content_uk_file": "legend-content-uk.md",
  "legend_content_en_file": "legend-content-en.md"
}
```

**Приклад `description-uk.md`:**
```markdown
Унікальна лунниця з натуральними річковими перлами - це не просто прикраса, а справжній слов'янський оберіг.

## Особливості

- Натуральні річкові перли вручну підібрані
- Металевий сплав з посрібленням
- Ручна робота майстра
- Унікальний дизайн

## Символіка

Лунниця несе в собі енергію місяця та захисту. Це древній символ, який:

1. Захищає від злого ока
2. Приносить удачу та достаток
3. Зберігає любов у родині

> "Лунниця - це не просто прикраса, це частина нашої історії"
```

**Переваги окремих .md файлів:**
- ✅ Легше редагувати довгі тексти
- ✅ Підтримка Markdown редакторів з підсвіткою синтаксису
- ✅ Можна використовувати версіонування (Git)
- ✅ Чистіший JSON файл

**Як працює bulk import:**
- Якщо вказано `description_uk_file`, система читає вміст файлу
- Якщо вказано і `description_uk` і `description_uk_file`, пріоритет у файлу
- Файли шукаються в тій же папці, що і `product.json`

### Приклади Markdown

**Простий текст:**
```markdown
Унікальна лунниця з натуральними перлами.
```

**З форматуванням:**
```markdown
Унікальна **лунниця** з *натуральними* перлами.

## Особливості

- Перли
- Металевий сплав
- Ручна робота
```

**З посиланнями:**
```markdown
Детальніше про [слов'янські оберіги](https://example.com/amulets).
```

**З цитатами:**
```markdown
> Лунниця - це символ місяця та захисту
```

---

## Формат 2: CSV (Спрощений)

CSV формат для швидкого масового імпорту. Підтримує тільки основні поля.

### Структура `products.csv`:

```csv
title_uk,title_en,slug,price,currency,stock_quantity,sku,description_uk,description_en,materials_uk,materials_en,tags_uk,tags_en,is_active,is_featured,category_id
"Лунниця з перлами","Lunnytsya with Pearls",lunnytsya-z-perlamy,450.00,zł,5,LUN-001,"Унікальна лунниця...","Unique lunnytsya...","натуральні перли, металевий сплав","natural pearls, metal alloy","оберіг, лунниця","amulet, lunnytsya",true,true,1
"Оберіг захисту","Protection Amulet",oberig-zahystu,320.00,zł,3,OBR-001,"Слов'янський оберіг...","Slavic amulet...","срібло, камінь","silver, stone","захист, оберіг","protection, amulet",true,false,1
```

### Правила для CSV:
- Масиви (materials, tags) розділяються комою: `"матеріал1, матеріал2"`
- Булеві значення: `true` або `false`
- Десяткові числа: `450.00`
- Всі текстові поля в лапках для підтримки ком та переносів рядків

### Обмеження CSV:
- Не підтримує багатомовність для всіх мов (тільки uk, en)
- Не підтримує legend (title/content)
- Не підтримує specifications (JSON об'єкт)
- Не підтримує відео
- Не підтримує meta_description/meta_keywords для всіх мов

**Рекомендація:** Використовуйте JSON для повної підтримки всіх функцій.

---

## Зображення

### Правила іменування:
- Назви файлів: `image-1.jpg`, `main.jpg`, `detail.jpg` тощо
- Формати: JPG, JPEG, PNG, WebP
- Розмір: рекомендовано до 2MB на зображення
- Роздільність: мінімум 500x500px, рекомендовано 1920x1920px

### Порядок зображень:
1. Перше зображення в алфавітному порядку стає головним
2. Або вкажіть в `product.json` поле `is_primary: true`

### Alt текст:
- Вказується в `product.json` в масиві `images`
- Якщо не вказано, використовується `title_uk`

---

## Відео

### Правила:
- Формати: MP4, MOV, AVI
- Розмір: до 500MB
- Назва файлу: `video.mp4` або вкажіть в `product.json`

---

## Приклад Повної Структури

```
товари/
├── lunnytsya-z-perlamy/
│   ├── product.json
│   ├── 01-main.jpg          # Головне зображення
│   ├── 02-detail.jpg
│   ├── 03-back.jpg
│   └── video.mp4
│
├── oberig-zahystu/
│   ├── product.json
│   ├── front.jpg
│   └── side.jpg
│
└── slovyanska-broshka/
    ├── product.json
    ├── image-1.jpg
    └── image-2.jpg
```

---

## Валідація Даних

### Перевірка перед імпортом:
1. ✅ `slug` унікальний
2. ✅ `title_uk` заповнено
3. ✅ `price` > 0
4. ✅ Зображення існують та доступні
5. ✅ Формати файлів коректні
6. ✅ `category_id` існує в системі

### Помилки при імпорті:
- Якщо `slug` вже існує → товар буде оновлено
- Якщо зображення не знайдено → товар створиться без зображень
- Якщо `category_id` не існує → товар створиться без категорії

---

## API Endpoint для Bulk Import

**POST** `/api/v1/products/bulk-import`

### Запит:
```json
{
  "products_path": "/path/to/товари",
  "upload_images": true,
  "skip_errors": false
}
```

### Відповідь:
```json
{
  "success": 10,
  "failed": 2,
  "errors": [
    {
      "slug": "invalid-product",
      "error": "Missing required field: price"
    }
  ]
}
```

---

## Швидкий Старт

1. Створіть папку `товари/`
2. Створіть підпапку для кожного товару (назва = slug)
3. Додайте `product.json` з даними
4. Додайте зображення в ту ж папку
5. Запустіть bulk import через API або адмін-панель

---

## Приклади

Дивіться папку `examples/` для готових прикладів структури та файлів.

