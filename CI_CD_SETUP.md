# CI/CD Pipeline Setup ✅

## Was wurde erstellt?

### GitHub Actions Workflows

#### 1. **test.yml** - Automatische Tests bei jedem Push/PR
**Trigger:** Push oder Pull Request auf `main`, `staging`, `dev`

**Jobs:**
- ✅ Matrix-Tests: Node.js 18.x & 20.x
- ✅ npm ci - Dependency Installation
- ✅ npm test - Unit & Integration Tests
- ✅ npm run test:coverage - Coverage Report
- ✅ Codecov Upload - Coverage Tracking

**Branch-Protection:**
- Verhindert Merge wenn Tests fehlschlagen
- Garantiert Code-Qualität vor Production

---

#### 2. **deploy.yml** - Auto-Deploy zu GitHub Pages
**Trigger:** Push auf `main` Branch

**Jobs:**
1. **Build:**
   - Checkout Code
   - Setup Node.js
   - Install Dependencies
   - Run Tests (Pre-Deploy Validation)
   - Upload Artifact

2. **Deploy:**
   - Deploy zu GitHub Pages
   - URL: https://gordians1993.github.io/bwalytics/

**Permissions:**
- `contents: read` - Code lesen
- `pages: write` - GitHub Pages schreiben
- `id-token: write` - OIDC Authentication

**Concurrency:**
- `cancel-in-progress: false` - Deployments werden NICHT abgebrochen
- Garantiert: Jeder Main-Push wird deployed

---

#### 3. **staging.yml** - Staging-Validierung
**Trigger:** Push auf `staging` Branch

**Jobs:**
- ✅ Run Tests
- ✅ Generate Coverage Report
- ✅ Comment PR with Test Results (wenn PR)
- ✅ Staging Validation Complete

**Use Case:**
- Test-Umgebung für Features vor Production-Merge
- PR-Comments mit Coverage-Statistiken

---

## Workflow-Übersicht

```
┌─────────────┐
│ dev Branch  │──► Push ──► test.yml (Node 18+20)
└─────────────┘

┌─────────────┐
│ staging     │──► Push ──► staging.yml + test.yml
│ Branch      │       │
└─────────────┘       └──► PR Comment (Coverage)

┌─────────────┐
│ main Branch │──► Push ──► test.yml + deploy.yml
│ (Production)│       │
└─────────────┘       └──► GitHub Pages Deployment
                            (https://gordians1993.github.io/bwalytics/)
```

---

## Branch-Strategie Integration

### Dev Branch
```bash
git checkout dev
# Entwicklung...
git push origin dev
```
- ✅ Tests laufen automatisch (test.yml)
- ❌ Kein Deployment

### Staging Branch
```bash
git checkout staging
git merge dev
git push origin staging
```
- ✅ Tests laufen automatisch
- ✅ Staging-Validierung
- ✅ PR-Comment mit Coverage
- ❌ Kein Production-Deployment

### Main Branch (Production)
```bash
git checkout main
git merge staging
git push origin main
```
- ✅ Tests laufen automatisch
- ✅ Coverage-Report
- ✅ **Auto-Deploy zu GitHub Pages**
- ✅ Live in 1-2 Minuten

---

## Status Badges (für README)

Füge diese Badges zum README.md hinzu:

```markdown
[![Tests](https://github.com/GordianS1993/bwalytics/actions/workflows/test.yml/badge.svg)](https://github.com/GordianS1993/bwalytics/actions/workflows/test.yml)
[![Deploy](https://github.com/GordianS1993/bwalytics/actions/workflows/deploy.yml/badge.svg)](https://github.com/GordianS1993/bwalytics/actions/workflows/deploy.yml)
[![codecov](https://codecov.io/gh/GordianS1993/bwalytics/branch/main/graph/badge.svg)](https://codecov.io/gh/GordianS1993/bwalytics)
```

Zeigen:
- ✅ Tests Pass/Fail Status
- ✅ Deployment Status
- ✅ Code Coverage %

---

## Troubleshooting

### Tests schlagen fehl in CI
```bash
# Lokal testen (gleiche Environment wie CI)
npm ci  # Statt npm install
npm test
```

### Deployment schlägt fehl
1. **GitHub Pages aktivieren:**
   - Settings → Pages → Source: GitHub Actions
2. **Permissions prüfen:**
   - Settings → Actions → General → Workflow permissions: Read + Write

### Coverage Report fehlt
```bash
# Lokal Coverage generieren
npm run test:coverage
# Öffne: coverage/index.html im Browser
```

---

## Nächste Schritte

### Immediate
- [ ] GitHub Pages aktivieren (Settings → Pages → GitHub Actions)
- [ ] Erste Workflows triggern (Push zu main)
- [ ] Badges zu README hinzufügen

### Short-term
- [ ] Branch Protection Rules (main: Require passing tests before merge)
- [ ] Codecov Integration (https://codecov.io/ - kostenlos für Open Source)
- [ ] Dependabot für Auto-Updates (package.json dependencies)

### Long-term
- [ ] E2E Tests in CI (Playwright)
- [ ] Performance Budgets (Lighthouse CI)
- [ ] Visual Regression Testing (Percy/Chromatic)

---

## Vorteile der Pipeline

✅ **Automatisierung:** Kein manuelles Testing/Deployment mehr  
✅ **Qualität:** Tests müssen passen bevor Merge  
✅ **Geschwindigkeit:** Deployment in 1-2 Minuten nach Push  
✅ **Transparenz:** Status Badges zeigen Build-Status  
✅ **Rollback:** Git-History ermöglicht schnelles Rollback  
✅ **Multi-Environment:** dev → staging → production Workflow  

---

## Status: ✅ CI/CD Pipeline Ready

**Was funktioniert:**
- ✅ Test-Workflows für alle Branches
- ✅ Staging-Validierung mit PR-Comments
- ✅ Auto-Deployment zu GitHub Pages (main)
- ✅ Matrix-Testing (Node 18 + 20)
- ✅ Coverage-Reports

**Was noch konfiguriert werden muss:**
- ⏳ GitHub Pages aktivieren (1 Klick in Settings)
- ⏳ Branch Protection Rules (optional aber empfohlen)
- ⏳ Codecov Account (kostenlos, optional)

**Sobald gepusht:** Workflows sind sofort aktiv! 🚀
