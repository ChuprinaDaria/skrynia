# 🚀 GitHub Actions - Auto Deploy Setup

## ✅ Gotowe do użycia!

Wszystkie workflow GitHub Actions są skonfigurowane i gotowe do użycia.

## 📋 Szybki Start

### 1. Dodaj Secrets (2 minuty)

Przejdź do: **Settings → Secrets and variables → Actions → New repository secret**

Dodaj:
- `NEXT_PUBLIC_API_URL` = `https://api.runebox.eu`
- `NEXT_PUBLIC_SITE_URL` = `https://runebox.eu`

### 2. Push do main

```bash
git add .
git commit -m "Setup GitHub Actions CI/CD"
git push origin main
```

### 3. Sprawdź status

Przejdź do zakładki **Actions** → zobaczysz workflow w akcji! 🎉

## 📦 Co się dzieje automatycznie?

### Przy każdym push do main:
✅ Testy backendu (Python/pytest)  
✅ Testy frontendu (Next.js build)  
✅ Linting (ESLint, Flake8)  
✅ Build obrazów Docker  
✅ Security scanning (Trivy, CodeQL)  
✅ Publikacja do GitHub Container Registry  
✅ Deployment notification  

### Przy każdym Pull Request:
✅ Linting  
✅ Testy  
✅ Security scan  
✅ Dependency review  

## 🔐 Security Features

- ✅ Dependency review przy każdym PR
- ✅ Secret scanning (Gitleaks)
- ✅ Vulnerability scanning (Trivy)
- ✅ CodeQL analysis
- ✅ Security headers w aplikacji
- ✅ Rate limiting
- ✅ 2FA dla admina

## 📚 Dokumentacja

- **[QUICKSTART.md](.github/QUICKSTART.md)** - Szybki start (5 minut)
- **[SETUP.md](.github/SETUP.md)** - Szczegółowa konfiguracja
- **[workflows/README.md](.github/workflows/README.md)** - Opis wszystkich workflow
- **[GITHUB_ACTIONS_SUMMARY.md](GITHUB_ACTIONS_SUMMARY.md)** - Pełne podsumowanie

## 🐳 Obrazy Docker

Po pierwszym buildzie znajdziesz je w:
- **Packages** → `backend:latest`
- **Packages** → `frontend:latest`

Pull lokalnie:
```bash
docker pull ghcr.io/OWNER/REPO/backend:latest
docker pull ghcr.io/OWNER/REPO/frontend:latest
```

## 🔍 Monitoring

- **Actions** - status wszystkich workflow
- **Security** - alerts bezpieczeństwa  
- **Packages** - opublikowane obrazy Docker
- **Insights** - statystyki i metryki

## ⚙️ Workflows

1. **ci-cd.yml** - Główny pipeline (testy, build, deploy)
2. **docker-image.yml** - Build obrazów Docker
3. **security.yml** - Security scanning
4. **lint.yml** - Code quality checks
5. **deploy.yml** - Production deployment

## 🎯 Status

✅ Dockerfiles gotowe  
✅ Workflows skonfigurowane  
✅ Security scanning włączony  
✅ Dependabot skonfigurowany  
✅ PR template dodany  
✅ Dokumentacja kompletna  

**Gotowe do push!** 🚀

