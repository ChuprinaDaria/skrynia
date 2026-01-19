# Виправлення помилки Docker тегу в GitHub Actions

## Проблема
```
ERROR: failed to build: invalid tag "ghcr.io/chuprinadaria/skrynia/frontend:-9af9296": invalid reference format
```

Docker теги не можуть починатися з дефісу (`-`). Тег `-9af9296` невалідний.

## Рішення

У вашому GitHub Actions workflow файлі (зазвичай `.github/workflows/*.yml`) знайдіть місце, де генерується тег, і виправте його:

### ❌ Неправильно:
```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    tags: ghcr.io/chuprinadaria/skrynia/frontend:${{ github.ref_name }}
```

Якщо `github.ref_name` починається з дефісу (наприклад, `-9af9296`), тег буде невалідним.

### ✅ Правильно - Варіант 1: Використовувати SHA замість ref_name
```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    tags: |
      ghcr.io/chuprinadaria/skrynia/frontend:${{ github.sha }}
      ghcr.io/chuprinadaria/skrynia/frontend:latest
```

### ✅ Правильно - Варіант 2: Очистити ref_name від дефісів
```yaml
- name: Set image tag
  id: image-tag
  run: |
    REF_NAME="${{ github.ref_name }}"
    # Видалити дефіси на початку
    CLEAN_TAG=$(echo "$REF_NAME" | sed 's/^-\+//')
    # Якщо після очищення порожньо, використати SHA
    if [ -z "$CLEAN_TAG" ]; then
      CLEAN_TAG="${{ github.sha }}"
    fi
    echo "tag=$CLEAN_TAG" >> $GITHUB_OUTPUT

- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    tags: ghcr.io/chuprinadaria/skrynia/frontend:${{ steps.image-tag.outputs.tag }}
```

### ✅ Правильно - Варіант 3: Використовувати короткий SHA
```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    tags: |
      ghcr.io/chuprinadaria/skrynia/frontend:${{ github.sha }}
      ghcr.io/chuprinadaria/skrynia/frontend:${{ github.run_number }}
      ghcr.io/chuprinadaria/skrynia/frontend:latest
```

### ✅ Правильно - Варіант 4: Перевірка та fallback
```yaml
- name: Set image tag
  id: image-tag
  run: |
    REF_NAME="${{ github.ref_name }}"
    # Перевірити, чи починається з дефісу
    if [[ "$REF_NAME" =~ ^- ]]; then
      # Якщо так, використати SHA
      TAG="${{ github.sha }}"
    else
      TAG="$REF_NAME"
    fi
    echo "tag=$TAG" >> $GITHUB_OUTPUT

- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    tags: ghcr.io/chuprinadaria/skrynia/frontend:${{ steps.image-tag.outputs.tag }}
```

## Рекомендація

Найпростіше рішення - використовувати `github.sha` замість `github.ref_name`:

```yaml
tags: ghcr.io/chuprinadaria/skrynia/frontend:${{ github.sha }}
```

Або якщо потрібен короткий тег:
```yaml
tags: ghcr.io/chuprinadaria/skrynia/frontend:${{ github.sha }}
```

SHA завжди валідний і не містить дефісів на початку.

## Де знайти workflow файл

Workflow файли зазвичай знаходяться в:
- `.github/workflows/*.yml`
- `.github/workflows/*.yaml`

Якщо файлів немає в репозиторії, вони можуть бути налаштовані безпосередньо в GitHub Actions через веб-інтерфейс.

