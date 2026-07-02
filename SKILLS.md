## commit

when user says `/commit`:

1. review all staged/changed files
2. generate a commit message using this format:

```
prefix: short commit title

## Summary
- brief description of what changed and why

## Changes
- list of specific changes made

## Related (optional)
- related issues, PRs, or context
```

3. use conventional commit prefixes: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
4. auto-run: `git add -A && git commit -m "message"`
5. if scope applies, use `prefix(scope): title` format