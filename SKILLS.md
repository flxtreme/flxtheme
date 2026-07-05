## commit

when user says `/commit`:

1. review all staged/changed files
2. generate a commit message using this format:

```
prefix: short commit title

## Summary
- super short description of what changed and why

## Changes
- list of super short specific changes made

## Related (optional)
- related issues, PRs, or context, describe short
```

3. use conventional commit prefixes: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
4. auto-run: `git add -A && git commit -m "message"`
5. if scope applies, use `prefix(scope): title` format
6. reply done only once finished, no need to explain.

## generate-commit-message

when user says `/generate-commit-message`:

1. review all staged/changed files
2. generate a commit message using this format

```
prefix: short commit title

## Summary
- super short description of what changed and why

## Changes
- list of super short specific changes made

## Related (optional)
- related issues, PRs, or context, describe short
```

3. use conventional commit prefixes: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
4. reply done only once finished, no need to explain.
