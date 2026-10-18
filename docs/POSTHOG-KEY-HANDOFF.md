# PostHog key swap: runbook for Sam (and Sam's Claude)

**Goal:** point the live website (schedulingwiz.com) at Zac's PostHog project instead of the old one, then redeploy so the change takes effect.

**No code changes are needed.** The site reads the key from a Vercel environment variable at build time. See `instrumentation-client.ts`. This is purely a Vercel settings change plus a redeploy. Only a Vercel team Owner/Admin can do it, which is why it's Sam's task.

## The new key

```
phc_qz5AWQQwuCynemYds7G7S8crzdwAHRBRzkmyxQTDqNHw
```

This is a PostHog **project API key**. It is public by design (it ships in the site's JavaScript), so it's fine to have it in this file.

The old key being replaced starts with `phc_n5m3qT`. It belongs to a PostHog workspace set up by a former contributor (commits by "Boblynlim", May 2026).

## Option A: Vercel CLI (preferred if `vercel` is installed and logged in as Sam)

Run from the repo root. The CLI will ask to link the project on first use: pick team `samob917's projects`, project `website-swiz-landing`.

```bash
vercel link --yes --project website-swiz-landing --scope samob917s-projects

vercel env rm NEXT_PUBLIC_POSTHOG_KEY production --yes
vercel env rm NEXT_PUBLIC_POSTHOG_KEY preview --yes

echo phc_qz5AWQQwuCynemYds7G7S8crzdwAHRBRzkmyxQTDqNHw | vercel env add NEXT_PUBLIC_POSTHOG_KEY production
echo phc_qz5AWQQwuCynemYds7G7S8crzdwAHRBRzkmyxQTDqNHw | vercel env add NEXT_PUBLIC_POSTHOG_KEY preview
```

If the preview `env add` asks `Git branch?`, press Enter to apply to all preview branches.

Then redeploy production without build cache:

```bash
vercel redeploy --no-cache $(vercel ls --prod --yes 2>/dev/null | grep -oE 'https://[^ ]+' | head -1)
```

If that one-liner is awkward, `vercel --prod` from the repo root on `main` also works.

Windows PowerShell note: if `vercel` fails with an execution-policy error, use `vercel.cmd` instead.

## Option B: Vercel dashboard (no terminal)

1. vercel.com, open team **samob917's projects**, project **website-swiz-landing**.
2. **Settings, Environment Variables.**
3. Find `NEXT_PUBLIC_POSTHOG_KEY`, click the `...` menu, **Edit**.
4. Paste the new key above. Keep **Production** and **Preview** both ticked. Save.
5. **Deployments** tab, `...` on the latest Production deployment, **Redeploy**. Leave "Use existing Build Cache" **unticked**. Confirm.

## Verify (either option)

Wait for the deployment to finish (about 2 minutes), then from any shell:

```bash
curl -sL https://schedulingwiz.com -o /tmp/swiz.html
for c in $(grep -oE "/_next/static/chunks/[^\"' ]+\.js" /tmp/swiz.html | sort -u); do
  curl -sL "https://schedulingwiz.com$c"
done | grep -ohE "phc_[A-Za-z0-9]{40,}" | sort -u
```

Expected output: exactly one line, `phc_qz5AWQQwuCynemYds7G7S8crzdwAHRBRzkmyxQTDqNHw`. If `phc_n5m3qT...` still appears, the redeploy hasn't finished or used a cached build.

Then open schedulingwiz.com once. Zac should see the pageview in his PostHog project within a minute.

## Also worth doing while in Vercel

Settings, Members on the team: remove anyone from the previous contractor (bluejay.finance) if they're still listed.

## When done

Tell Zac. This branch (`posthog-key-handoff`) gets merged into `main` afterwards; the runbook stays in `docs/` as a record.
