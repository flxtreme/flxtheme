# Setup Guide

This guide walks you through getting the required tokens and configuring GitHub for the CI/CD workflows.

---

## 1. NPM Token (for `publish.yml`)

The npm token allows GitHub Actions to publish the package to npm on your behalf.

### Steps:

1. Go to [npmjs.com](https://www.npmjs.com) and sign in
2. Click your **profile avatar** (top right) → **Access Tokens**
3. Click **Generate New Token** → select **Granular Access Token**
4. Configure:
   - **Token name**: `github-actions-flxtheme`
   - **Expiration**: pick a duration (or no expiration)
   - **Packages and scopes**: select **Read and write**
   - **Select packages**: choose **All packages** or specific packages
5. Click **Generate Token**
6. **Copy the token** — you won't see it again

### Add to GitHub:

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `NPM_TOKEN`
4. Value: paste your npm token
5. Click **Add secret**

---

## 2. GitHub Pages (for `deploy-preview.yml`)

### Enable GitHub Pages:

1. Go to your GitHub repo → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Click **Save**

That's it — no token needed. The workflow uses the built-in `GITHUB_TOKEN` with `pages: write` permission.

---

## 3. Changelog (for `changelog.yml`)

No extra tokens needed. The workflow uses the built-in `GITHUB_TOKEN` with `contents: write` permission to commit the changelog.

### Conventional Commits:

For the changelog to generate properly, use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat: add new Button component
fix: resolve theme toggle issue
docs: update README
feat(icons): add new icon set
fix!: breaking change to API
```

| Prefix     | Category         |
|------------|------------------|
| `feat:`    | 🚀 Features     |
| `fix:`     | 🐛 Bug Fixes    |
| `docs:`    | 📚 Documentation |
| `perf:`    | ⚡ Performance   |
| `refactor:`| 🔨 Refactoring  |
| `style:`   | 🎨 Styling      |
| `test:`    | 🧪 Testing      |
| `chore:`   | ⚙️ Miscellaneous |

---

## 4. Publishing a Release (Workflow)

1. Update the `version` in `package.json`
2. Commit: `git commit -m "chore(release): v1.1.0"`
3. Tag: `git tag v1.1.0`
4. Push: `git push && git push --tags`
5. Go to GitHub → **Releases** → **Draft a new release**
6. Select your tag, add release notes, and click **Publish release**
7. The `publish.yml` workflow will automatically publish to npm

---

## Summary

| Secret       | Where to get it               | GitHub Secret Name |
|-------------|-------------------------------|--------------------|
| NPM Token  | npmjs.com → Access Tokens     | `NPM_TOKEN`       |
| GitHub Pages | Repo Settings → Pages → Source: GitHub Actions | *(no secret needed)* |
| Changelog    | *(no secret needed)*          | *(no secret needed)* |
