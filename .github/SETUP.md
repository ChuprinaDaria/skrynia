# GitHub Actions Setup Guide

## Krok 1: Konfiguracja Secrets

Przejdź do: **Settings → Secrets and variables → Actions → New repository secret**

### Wymagane Secrets:

1. **NEXT_PUBLIC_API_URL**
   - Wartość: `https://api.runebox.eu` (lub Twój URL API)
   - Opis: URL backend API dla frontendu

2. **NEXT_PUBLIC_SITE_URL**
   - Wartość: `https://runebox.eu` (lub Twój URL frontendu)
   - Opis: URL frontendu dla SEO i meta tagów

### Opcjonalne Secrets (dla deployment):

3. **SSH_HOST**
   - Wartość: IP lub domena serwera produkcyjnego
   - Opis: Host serwera do deploymentu

4. **SSH_USER**
   - Wartość: `root` lub Twój użytkownik
   - Opis: Użytkownik SSH

5. **SSH_PRIVATE_KEY**
   - Wartość: Twój prywatny klucz SSH
   - Opis: Klucz do połączenia SSH z serwerem

6. **FRONTEND_URL**
   - Wartość: `https://runebox.eu`
   - Opis: URL frontendu (dla notyfikacji)

## Krok 2: Włączanie GitHub Actions

1. Przejdź do **Settings → Actions → General**
2. Upewnij się że "Allow all actions and reusable workflows" jest włączone
3. W sekcji "Workflow permissions" wybierz:
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests

## Krok 3: Konfiguracja GitHub Container Registry

Obrazy Docker będą automatycznie publikowane do GitHub Container Registry.

Aby je zobaczyć:
1. Przejdź do **Packages** w repozytorium
2. Zobaczysz obrazy: `backend` i `frontend`

Aby użyć obrazów lokalnie:
```bash
# Login do GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull obrazów
docker pull ghcr.io/OWNER/REPO/backend:latest
docker pull ghcr.io/OWNER/REPO/frontend:latest
```

## Krok 4: Pierwszy Push

Po skonfigurowaniu secrets, wykonaj push do main:

```bash
git add .
git commit -m "Setup GitHub Actions CI/CD"
git push origin main
```

Workflow automatycznie:
1. ✅ Zbuduje obrazy Docker
2. ✅ Przetestuje kod
3. ✅ Przeskanuje bezpieczeństwo
4. ✅ Opublikuje obrazy do GHCR
5. ✅ Wykona deployment (jeśli skonfigurowany)

## Krok 5: Monitoring

### Sprawdzanie statusu:
- Przejdź do zakładki **Actions**
- Zobaczysz wszystkie uruchomione workflow
- Kliknij na workflow aby zobaczyć szczegóły i logi

### Security Alerts:
- Przejdź do **Security → Code scanning alerts**
- Zobaczysz wszystkie znalezione problemy bezpieczeństwa

### Packages:
- Przejdź do **Packages**
- Zobaczysz wszystkie opublikowane obrazy Docker

## Troubleshooting

### Workflow nie uruchamia się
- Sprawdź czy pliki `.github/workflows/*.yml` są w repozytorium
- Upewnij się że branch `main` istnieje
- Sprawdź czy Actions są włączone w Settings

### Build fails
- Sprawdź logi w Actions → wybierz failed workflow
- Upewnij się że wszystkie secrets są ustawione
- Sprawdź czy Dockerfile jest poprawny

### Secrets nie działają
- Upewnij się że nazwy secrets są dokładnie takie same jak w workflow
- Sprawdź czy secrets są ustawione w Settings → Secrets
- Pamiętaj że secrets są case-sensitive

### Docker build fails
- Sprawdź czy Dockerfile istnieje w odpowiednim miejscu
- Zweryfikuj czy context path jest poprawny
- Sprawdź logi builda w Actions

## Workflow Details

### ci-cd.yml
Główny pipeline uruchamiany przy każdym push do main:
- Testy backendu i frontendu
- Build obrazów Docker
- Security scanning
- Deployment

### docker-image.yml
Szybki build obrazów Docker:
- Uruchamiany przy zmianach w kodzie
- Build i push do GHCR
- Cache dla szybkości

### security.yml
Security scanning:
- Dependency review
- Secret scanning
- Vulnerability scanning
- Weekly automated scans

### lint.yml
Code quality:
- ESLint dla frontendu
- Flake8 dla backendu
- TypeScript checking

### deploy.yml
Production deployment:
- Tylko na branch main
- Build i push obrazów
- Security scan przed deployem
- Deployment notification

## Best Practices

1. **Nie commituj secrets** - zawsze używaj GitHub Secrets
2. **Review PR przed merge** - sprawdzaj workflow przed merge do main
3. **Monitor security alerts** - regularnie sprawdzaj Security tab
4. **Test lokalnie** - testuj zmiany przed push
5. **Używaj branch protection** - wymagaj PR reviews przed merge do main

## Next Steps

Po pierwszym udanym deploy:
1. ✅ Skonfiguruj monitoring (np. Sentry, LogRocket)
2. ✅ Ustaw alerty dla failed deployments
3. ✅ Skonfiguruj backup bazy danych
4. ✅ Ustaw SSL certificates
5. ✅ Skonfiguruj CDN (opcjonalnie)

