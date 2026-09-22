# AGENTS.md

## Project Context

This is a supabase app repository. Treat it as user-owned application code, keep changes focused on the user's request, and preserve existing project conventions.

Start with `README.md` for local setup, environment variables, and publish workflow.

## supabase References

- CLI overview: https://docs.supabase.com/developers/references/cli/get-started/overview.md
- Agent skills: https://docs.supabase.com/developers/backend/overview/skills.md

If your agent supports Agent Skills, install or update supabase skills before supabase-specific work:

```bash
npx skills add supabase/skills
```

## Key Files

- `src/`: frontend application source.
- `src/api/supabaseClient.js`: frontend supabase SDK client.
- `vite.config.js`: Vite config and supabase Vite plugin setup.
- `.env.local`: local-only environment values; never commit secrets.

## Working Notes

- Use `supabase dev` as the default local development command when you need the local supabase backend. It can run the backend and frontend together.
- When docs or code mention the frontend being started automatically, that usually means the supabase project config includes `site.serveCommand`, for example `"serveCommand": "npm run dev"` in `supabase/config.jsonc`.
- Use `npm run dev` only for frontend-only work against the hosted supabase backend.
- Prefer the existing supabase CLI workflow over adding new npm scripts for supabase-specific tasks.
- Reuse the existing SDK client and Vite plugin patterns before adding new supabase integration paths.
- Run the relevant checks from `package.json` before finishing code changes.
