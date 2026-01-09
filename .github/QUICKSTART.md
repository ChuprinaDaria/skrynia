# 🚀 Quick Start - GitHub Actions

## Szybka konfiguracja (5 minut)

### 1. Dodaj Secrets (wymagane)

**Settings → Secrets and variables → Actions → New repository secret**

```
NEXT_PUBLIC_API_URL = https://api.runebox.eu
NEXT_PUBLIC_SITE_URL = https://runebox.eu
```

### 2. Push do main

```bash
git add .
git commit -m "Setup CI/CD"
git push origin main
```

### 3. Sprawdź status

Przejdź do **Actions** → zobaczysz workflow w akcji! 🎉

## Co się dzieje automatycznie?

✅ **Przy każdym push do main:**
- Testy backendu i frontendu
- Build obrazów Docker
- Security scanning
- Publikacja do GitHub Container Registry
- Deployment (jeśli skonfigurowany)

✅ **Przy każdym PR:**
- Linting
- Testy
- Security scan
- Dependency review

## Obrazy Docker

Po pierwszym udanym buildzie znajdziesz je tutaj:
- **Packages** → `backend:latest`
- **Packages** → `frontend:latest`

Pull lokalnie:
```bash
docker pull ghcr.io/OWNER/REPO/backend:latest
docker pull ghcr.io/OWNER/REPO/frontend:latest
```

## Troubleshooting

**Workflow nie uruchamia się?**
- Sprawdź czy Actions są włączone: Settings → Actions → General
- Upewnij się że branch `main` istnieje

**Build fails?**
- Sprawdź logi w Actions → wybierz failed workflow
- Upewnij się że secrets są ustawione

**Więcej informacji:**
- Zobacz [SETUP.md](./SETUP.md) dla szczegółowej konfiguracji
- Zobacz [README.md](./workflows/README.md) dla opisu workflow

