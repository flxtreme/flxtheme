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

## 3. Automated Versioning & Releases (`release-please.yml`)

We use **Release Please** to fully automate versioning, changelog generation, and GitHub releases.
No extra tokens are needed; it uses `GITHUB_TOKEN` with `contents: write` and `pull-requests: write`.

### How it works:
1. When you push a commit with `feat:` or `fix:`, Release Please automatically opens a **Release Pull Request**.
2. As you add more commits, it updates the PR.
3. When you are ready to publish a new version, you **merge the Release PR**.
4. A Git Tag and GitHub Release are automatically created.
5. The `publish.yml` workflow gets triggered by the GitHub Release and automatically publishes to npm!

### Conventional Commits
To trigger automated version bumps, you MUST use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix               | Effect                   | Example                                |
|----------------------|--------------------------|----------------------------------------|
| `fix:`               | Bumps **PATCH** version | `fix: resolve theme toggle issue`      |
| `feat:`              | Bumps **MINOR** version | `feat: add new Button component`       |
| `feat!:` or `fix!:`  | Bumps **MAJOR** version | `feat!: breaking change to API`        |
| `docs:`, `chore:`, etc. | No version bump      | `docs: update README`                  |

---

## Summary

| Secret       | Where to get it               | GitHub Secret Name |
|-------------|-------------------------------|--------------------|
| NPM Token  | npmjs.com → Access Tokens     | `NPM_TOKEN`       |
| GitHub Pages | Repo Settings → Pages → Source: GitHub Actions | *(no secret needed)* |
| Release Please | *(no secret needed)*          | *(no secret needed)* |
