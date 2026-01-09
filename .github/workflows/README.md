# GitHub Actions Workflows

Ten repozytorium zawiera kilka workflow GitHub Actions do automatyzacji CI/CD.

## Workflows

### 1. `ci-cd.yml` - Główny pipeline CI/CD
**Trigger**: Push do `main` lub `develop`, Pull Request do `main`

**Zadania**:
- ✅ Testy backendu (Python/pytest)
- ✅ Testy frontendu (Next.js build)
- ✅ Linting (flake8, ESLint)
- ✅ Build obrazów Docker
- ✅ Security scanning (Trivy)
- ✅ CodeQL analysis
- ✅ Deployment (tylko na main)

### 2. `docker-image.yml` - Build obrazów Docker
**Trigger**: Zmiany w kodzie backendu/frontendu, manualny

**Zadania**:
- Build i push obrazów Docker do GitHub Container Registry
- Cache dla szybszych buildów
- Multi-platform support (amd64, arm64)

### 3. `security.yml` - Security Scanning
**Trigger**: Push do main, PR, weekly schedule, manualny

**Zadania**:
- Dependency review
- Secret scanning (Gitleaks)
- Docker vulnerability scanning (Trivy)
- Upload wyników do GitHub Security

### 4. `lint.yml` - Code Linting
**Trigger**: Push/PR do main lub develop

**Zadania**:
- Backend: flake8, black, pylint
- Frontend: ESLint, TypeScript check

### 5. `deploy.yml` - Production Deployment
**Trigger**: Push do main, manualny z opcjami

**Zadania**:
- Build i push obrazów Docker
- Security scanning przed deployem
- Deployment notification

## Secrets Required

Ustaw w Settings → Secrets and variables → Actions:

### Wymagane:
- `NEXT_PUBLIC_API_URL` - URL API backendu
- `NEXT_PUBLIC_SITE_URL` - URL frontendu

### Opcjonalne (dla deployment):
- `SSH_HOST` - Host serwera produkcyjnego
- `SSH_USER` - Użytkownik SSH
- `SSH_PRIVATE_KEY` - Klucz SSH
- `FRONTEND_URL` - URL frontendu (dla notyfikacji)

## Użycie

### Automatyczny deploy przy push do main:
```bash
git push origin main
```

### Manualny deploy:
1. Przejdź do Actions → Deploy to Production
2. Kliknij "Run workflow"
3. Wybierz branch i opcje deployu
4. Kliknij "Run workflow"

### Sprawdzenie statusu:
- Przejdź do zakładki "Actions" w GitHub
- Zobacz status wszystkich workflow
- Kliknij na workflow aby zobaczyć szczegóły

## Obrazy Docker

Obrazy są publikowane do GitHub Container Registry:
- Backend: `ghcr.io/OWNER/REPO/backend:latest`
- Frontend: `ghcr.io/OWNER/REPO/frontend:latest`

Aby użyć obrazów lokalnie:
```bash
docker pull ghcr.io/OWNER/REPO/backend:latest
docker pull ghcr.io/OWNER/REPO/frontend:latest
```

## Troubleshooting

### Build fails
- Sprawdź logi w Actions
- Upewnij się że wszystkie secrets są ustawione
- Sprawdź czy Dockerfile jest poprawny

### Security scan finds issues
- Przejdź do Security → Code scanning alerts
- Przejrzyj znalezione problemy
- Napraw i push ponownie

### Deployment fails
- Sprawdź czy serwer jest dostępny
- Zweryfikuj SSH keys
- Sprawdź logi deploymentu

