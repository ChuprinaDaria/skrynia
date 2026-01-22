# Візуальна Схема Структури Папок

## Повна Структура для Bulk Import

```
товари/                                    ← Головна папка з усіма товарами
│
├── lunnytsya-z-perlamy/                  ← Підпапка = slug товару
│   ├── product.json                      ← JSON з усією інформацією
│   ├── description-uk.md                  ← Опціонально: опис українською (Markdown)
│   ├── description-en.md                  ← Опціонально: опис англійською (Markdown)
│   ├── legend-content-uk.md              ← Опціонально: легенда українською (Markdown)
│   ├── 01-main.jpg                       ← Головне зображення (перше)
│   ├── 02-detail.jpg                     ← Додаткове зображення
│   ├── 03-back.jpg                       ← Додаткове зображення
│   ├── 04-packaging.jpg                  ← Додаткове зображення
│   └── video.mp4                         ← Опціонально: відео
│
├── oberig-zahystu/                       ← Інший товар
│   ├── product.json
│   ├── front.jpg
│   ├── side.jpg
│   └── detail.jpg
│
├── slovyanska-broshka/                    ← Ще один товар
│   ├── product.json
│   ├── image-1.jpg
│   └── image-2.jpg
│
└── koliyka-z-symvolamy/                  ← Ще один товар
    ├── product.json
    ├── main.jpg
    └── detail.jpg
```

## Детальний Приклад Одного Товару

```
lunnytsya-z-perlamy/
│
├── product.json                          ← ОБОВ'ЯЗКОВО: дані товару
│   {
│     "title_uk": "Лунниця з перлами",
│     "slug": "lunnytsya-z-perlamy",
│     "price": 450.00,
│     "description_uk_file": "description-uk.md",  ← Опціонально: посилання на .md файл
│     "images": [
│       {
│         "filename": "01-main.jpg",      ← Вказує на файл в цій папці
│         "is_primary": true
│       }
│     ]
│   }
│
├── description-uk.md                     ← Опціонально: опис в Markdown
├── description-en.md                     ← Опціонально: опис в Markdown
├── 01-main.jpg                           ← Зображення товару
├── 02-detail.jpg                         ← Зображення товару
├── 03-back.jpg                           ← Зображення товару
└── video.mp4                             ← Опціонально: відео
```

## Правила Іменування

### Папки (slug):
- ✅ `lunnytsya-z-perlamy` - правильно
- ✅ `oberig-zahystu` - правильно
- ❌ `Лунниця з перлами` - неправильно (кирилиця)
- ❌ `lunnytsya z perlamy` - неправильно (пробіли)
- ✅ Використовуйте латиницю, дефіси замість пробілів

### Зображення:
- ✅ `01-main.jpg` - правильно (порядок)
- ✅ `main.jpg` - правильно
- ✅ `image-1.jpg` - правильно
- ✅ `detail.jpg` - правильно
- ❌ `Зображення 1.jpg` - неправильно (кирилиця)
- ✅ Формати: `.jpg`, `.jpeg`, `.png`, `.webp`

### JSON файл:
- ✅ `product.json` - обов'язкова назва
- ❌ `товар.json` - неправильно
- ❌ `product_data.json` - неправильно

## Порядок Зображень

### Варіант 1: Автоматичний (за алфавітом)
```
01-main.jpg    ← Стане головним (перше в алфавіті)
02-detail.jpg
03-back.jpg
```

### Варіант 2: Вказати в JSON
```json
{
  "images": [
    {
      "filename": "detail.jpg",
      "is_primary": true    ← Явно вказати головне
    },
    {
      "filename": "main.jpg",
      "is_primary": false
    }
  ]
}
```

## Мінімальна Структура

Найпростіший варіант для швидкого старту:

```
товари/
└── my-product/
    ├── product.json       ← Мінімум: title_uk, slug, price
    └── image.jpg          ← Опціонально
```

## Повна Структура з Усіма Можливостями

```
товари/
└── lunnytsya-z-perlamy/
    ├── product.json       ← Всі поля (багатомовність, SEO, тощо)
    ├── 01-main.jpg
    ├── 02-detail.jpg
    ├── 03-back.jpg
    ├── 04-packaging.jpg
    └── video.mp4
```

## Приклад для Кількох Товарів

```
товари/
├── product-1/
│   ├── product.json
│   └── images...
├── product-2/
│   ├── product.json
│   └── images...
└── product-3/
    ├── product.json
    └── images...
```

**Важливо:** Кожен товар в окремій папці!

