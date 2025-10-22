# BWAlytics - Deployment Guide

**Version:** 1.0.0  
**Letzte Aktualisierung:** 22. Oktober 2025

---

## 🌍 Deployment-Umgebungen

BWAlytics nutzt **3 Umgebungen** mit GitFlow-Branching:

| Umgebung | Branch | URL | Zweck |
|----------|--------|-----|-------|
| **Development** | `dev` | Lokal (localhost:8080) | Feature-Entwicklung |
| **Staging** | `staging` | TBD | Testing vor Production |
| **Production** | `main` | https://gordians1993.github.io/bwalytics/ | Live für Nutzer |

---

## 🚀 Deployment-Workflow

### 1. **Development → Staging**

```bash
# Feature auf dev Branch entwickeln
git checkout dev
git add .
git commit -m "feat: neue Funktion XY"
git push origin dev

# Merge zu staging für Testing
git checkout staging
git merge dev
git push origin staging

# Testing auf Staging-Umgebung
# → Test mit echten BWAs
# → Browser-Kompatibilität prüfen
# → Performance-Tests
```

### 2. **Staging → Production**

```bash
# Wenn Staging-Tests erfolgreich
git checkout main
git merge staging
git push origin main

# GitHub Pages deployed automatisch nach Push zu main
# → Live in ~1-2 Minuten
```

---

## 📦 GitHub Pages Setup

### Einmalige Konfiguration (bereits erledigt)

1. **GitHub Repository Settings:**
   - Gehe zu: Settings → Pages
   - Source: `Deploy from a branch`
   - Branch: `main` / Root
   - Save

2. **Custom Domain (optional):**
   - CNAME-Datei im Repo: `bwalytics.com`
   - DNS: A-Record auf GitHub Pages IPs
   - HTTPS: Automatisch via Let's Encrypt

### Deployment-Trigger

**Automatisch:**
- Jeder Push zu `main` Branch → Automatisches Deployment

**Manuell:**
- GitHub Actions Workflow manuell triggern (zukünftig)

---

## 🔄 CI/CD Pipeline (GitHub Actions)

### Basis-Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main, staging, dev]
  pull_request:
    branches: [main, staging]

jobs:
  # Job 1: Testing
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Code coverage
        uses: codecov/codecov-action@v3
  
  # Job 2: Lint & Format
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Check formatting
        run: npm run format:check
  
  # Job 3: Deploy (nur bei main branch)
  deploy:
    needs: [test, lint]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
          publish_branch: gh-pages
```

### Erweiterte Workflows (zukünftig)

#### Build-Optimierung
```yaml
- name: Minify HTML/CSS/JS
  run: npm run build:production

- name: Optimize images
  run: npm run optimize:images
```

#### Security-Scanning
```yaml
- name: Security audit
  run: npm audit --production

- name: OWASP Dependency Check
  uses: dependency-check/Dependency-Check_Action@main
```

---

## 🔐 Environment Variables (zukünftig)

Aktuell: **Keine Environment Variables** (reine Client-Side App)

Zukünftig (falls Backend-Features):
```bash
# .env.development
API_URL=http://localhost:3000
DEBUG_MODE=true

# .env.staging
API_URL=https://staging-api.bwalytics.com
DEBUG_MODE=true

# .env.production
API_URL=https://api.bwalytics.com
DEBUG_MODE=false
```

---

## 📊 Deployment-Monitoring

### GitHub Pages Status
- **Status-Page:** https://www.githubstatus.com/
- **Build-Logs:** GitHub Actions Tab im Repo

### Post-Deployment-Checks
```bash
# 1. Check HTTP Status
curl -I https://gordians1993.github.io/bwalytics/

# 2. Validate HTML
curl https://gordians1993.github.io/bwalytics/ | grep "BWAlytics"

# 3. Check JavaScript lädt
curl https://gordians1993.github.io/bwalytics/bwa-upload-working.html | grep "extractBWADataFromText"
```

### Lighthouse CI (zukünftig)
```yaml
- name: Run Lighthouse
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      https://gordians1993.github.io/bwalytics/
    uploadArtifacts: true
```

---

## 🐛 Rollback-Strategie

### Schneller Rollback bei kritischem Bug

```bash
# Option 1: Revert letzten Commit
git checkout main
git revert HEAD
git push origin main
# → GitHub Pages deployed alte Version automatisch

# Option 2: Zurück zu stabilem Commit
git checkout main
git reset --hard <stable-commit-hash>
git push --force origin main
# ⚠️ Achtung: Force-Push nur in Notfällen!

# Option 3: Hotfix-Branch
git checkout -b hotfix/critical-bug main
# Fix Bug
git commit -m "hotfix: kritischer Bug behoben"
git checkout main
git merge hotfix/critical-bug
git push origin main
```

### Rollback-Testing
```bash
# Teste alte Version lokal vor Rollback
git checkout <old-commit-hash>
python3 -m http.server 8080
# → Test auf http://localhost:8080
```

---

## 🏷️ Versioning & Release-Tags

### Semantic Versioning (SemVer)
```
v1.0.0 - Initial Release
v1.1.0 - Dashboard & Visualisierung
v1.2.0 - Cashflow & Liquidität
v2.0.0 - Breaking Changes (Plugin-System)
```

### Tag erstellen
```bash
# Tag für neue Version
git checkout main
git tag -a v1.1.0 -m "Release v1.1.0: Dashboard & Visualisierung"
git push origin v1.1.0

# Release auf GitHub erstellen
# → GitHub Web UI: Releases → Create new release
# → Tag: v1.1.0
# → Title: "v1.1.0 - Dashboard & Visualisierung"
# → Description: Copy from CHANGELOG.md
```

### Automatische Release Notes (GitHub Actions)
```yaml
- name: Generate Release Notes
  uses: release-drafter/release-drafter@v5
  with:
    config-name: release-drafter.yml
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 🚨 Deployment-Checkliste

### Pre-Deployment
- [ ] Alle Tests grün (Unit + E2E)
- [ ] Code-Review abgeschlossen (PR approved)
- [ ] CHANGELOG.md aktualisiert
- [ ] Breaking Changes dokumentiert
- [ ] Staging-Tests erfolgreich

### Deployment
- [ ] Branch `staging` → `main` mergen
- [ ] Git-Tag erstellen (z.B. v1.1.0)
- [ ] Push zu GitHub (`main` Branch)
- [ ] GitHub Pages Build abwarten (~2 Minuten)

### Post-Deployment
- [ ] Live-URL testen: https://gordians1993.github.io/bwalytics/
- [ ] Smoke-Tests: BWA hochladen & analysieren
- [ ] Browser-Kompatibilität (Chrome, Firefox, Safari)
- [ ] Performance-Check (Lighthouse)
- [ ] Monitoring aktivieren (Error-Tracking)

### Rollback (bei Fehlern)
- [ ] Kritische Bugs identifizieren
- [ ] Entscheidung: Hotfix oder Rollback?
- [ ] Rollback durchführen (siehe oben)
- [ ] Post-Mortem dokumentieren

---

## 📈 Performance-Optimierung (Pre-Deployment)

### Checklist
- [ ] **Minification:** HTML/CSS/JS minifizieren
- [ ] **Compression:** Gzip/Brotli aktiviert
- [ ] **Caching:** Cache-Headers für statische Assets
- [ ] **Images:** Optimiert (WebP, komprimiert)
- [ ] **Lazy-Loading:** Nicht-kritische Ressourcen lazy loaden
- [ ] **Service Worker:** Offline-Support (zukünftig)

### Lighthouse-Ziele
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

---

## 🌐 Multi-Environment-Setup (Erweitert)

### Staging-Environment (separate GitHub Pages)

**Option 1: Subdomain**
```
staging.bwalytics.com → GitHub Pages von staging Branch
```

**Option 2: Vercel/Netlify**
```
# Vercel-Config (vercel.json)
{
  "git": {
    "deploymentEnabled": {
      "staging": true,
      "dev": false
    }
  }
}
```

**Option 3: GitHub Pages mit Branch-Switching**
```bash
# Deploy staging Branch zu GitHub Pages
git checkout staging
git push origin staging

# GitHub Settings → Pages → Branch: staging
```

---

## 🔧 Troubleshooting

### Problem: GitHub Pages zeigt alte Version
**Lösung:**
1. Force-Refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
2. Clear Browser-Cache
3. Warte 5 Minuten (GitHub Pages Cache)

### Problem: Build schlägt fehl
**Lösung:**
1. Check GitHub Actions Logs
2. Reproduziere lokal: `npm run build`
3. Fix Error, commit, re-deploy

### Problem: 404 nach Deployment
**Lösung:**
1. Check GitHub Pages Settings: Branch = `main`, Folder = `/` (root)
2. Verify index.html existiert
3. Check .gitignore (nicht versehentlich HTML ignoriert)

### Problem: Langsame Ladezeiten
**Lösung:**
1. Run Lighthouse-Audit
2. Optimize Images (WebP, compression)
3. Enable Gzip/Brotli
4. Add Service Worker für Caching

---

## 📚 Weiterführende Ressourcen

- **GitHub Pages Docs:** https://docs.github.com/en/pages
- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Semantic Versioning:** https://semver.org/
- **Lighthouse CI:** https://github.com/GoogleChrome/lighthouse-ci

---

**Nächste Schritte:** Siehe [ROADMAP.md](./ROADMAP.md) für geplante Deployment-Verbesserungen (CI/CD, Monitoring, etc.)
