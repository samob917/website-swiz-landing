// Warns when app/privacy/page.tsx has been edited more recently than the
// LAST_UPDATED date it displays.
//
// The date is the only signal a visitor (or a client's compliance reviewer)
// has that the policy is current, so a stale one is worse than none: it
// asserts currency that isn't there. It went stale once already, silently.
//
// Runs on every build via "prebuild". Deliberately never fails the build - a
// wrong date should not stop a deploy - so it shouts instead.

import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"

const PAGE = "app/privacy/page.tsx"
const YELLOW = "\x1b[33m"
const RESET = "\x1b[0m"

function warn(lines) {
  const width = Math.max(...lines.map((l) => l.length)) + 4
  console.warn(`\n${YELLOW}${"=".repeat(width)}`)
  for (const l of lines) console.warn(`  ${l}`)
  console.warn(`${"=".repeat(width)}${RESET}\n`)
}

let displayed
try {
  const m = readFileSync(PAGE, "utf8").match(/const LAST_UPDATED = "([^"]+)"/)
  if (!m) {
    warn([`Could not find LAST_UPDATED in ${PAGE}.`, "The privacy date check did not run."])
    process.exit(0)
  }
  displayed = new Date(m[1])
  if (Number.isNaN(displayed.valueOf())) {
    warn([`LAST_UPDATED in ${PAGE} is not a readable date: "${m[1]}"`])
    process.exit(0)
  }
} catch {
  process.exit(0) // page missing: nothing to check
}

let committed
try {
  // %cs is the committer date as a plain YYYY-MM-DD in the committer's own
  // timezone. %cI would be UTC, which reads a late-evening commit as the next
  // day and so flags the very commit that sets LAST_UPDATED.
  const stamp = execFileSync("git", ["log", "-1", "--format=%cs", "--", PAGE], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim()
  if (!stamp) process.exit(0) // never committed, or a shallow clone with no history
  const [y, m, d] = stamp.split("-").map(Number)
  committed = new Date(Date.UTC(y, m - 1, d))
} catch {
  process.exit(0) // no git available (some CI images): skip rather than cry wolf
}

// Both are now plain calendar days, so compare them directly.
const day = (d) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())

if (day(committed) > day(displayed)) {
  const fmt = (d) => d.toISOString().slice(0, 10)
  warn([
    "PRIVACY POLICY DATE IS STALE",
    "",
    `${PAGE} was last changed on ${fmt(committed)},`,
    `but the page tells visitors it was last updated ${fmt(displayed)}.`,
    "",
    "If that change altered what the policy says, update LAST_UPDATED.",
    "If it was cosmetic, leave it and this warning is safe to ignore.",
  ])
}
