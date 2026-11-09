import { mkdirSync, rmSync } from 'node:fs'

/** Starts each run with empty output folders, so reports list only current pages. */
export default function setup() {
  for (const dir of ['artifacts/audit', 'artifacts/screens']) {
    rmSync(dir, { recursive: true, force: true })
    mkdirSync(dir, { recursive: true })
  }
}
