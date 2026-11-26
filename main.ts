// A sport the Olympics said no to, squeezed into one funny line.
//
// This script does four small jobs in order: hold the line, check it
// against the brief, save it where the harness expects it, and then
// read it back to prove the save actually happened. If any step
// smells wrong it throws right here, while there is still time to
// fix it, instead of letting a broken file reach the judges.

import * as fs from "node:fs";
import { dirname } from "node:path";

// The joke itself: leaving a party, treated as an endurance event, with
// the twist saved for the very last clause — the record holder never
// actually got out the door, he only kept saying "anyway". Picked in
// the v2 pass over the v1 hide-and-seek line (which finished 860th of
// 1898 in its round): the goodbye lands in a single read, it is easy
// to quote out loud, and it is a different idea from v1 rather than
// the same idea in a new coat.
const SUBMISSION =
  "The Longest Goodbye: athletes compete to leave a party; the world record is four hours, set by a man who kept saying 'anyway'.";

// Where the harness looks, and the shape the brief demands.
const DESTINATION = "/output/entry.txt";
const SHORTEST = 1;
const LONGEST = 200;

// Each check below looks at one rule and either stays quiet or hands
// back the reason the line fails. Keeping them separate means a new
// rule is one more small function, not surgery on a big one.
function checkLength(text: string): string | null {
  if (text.length < SHORTEST || text.length > LONGEST) {
    return `line must run ${SHORTEST}-${LONGEST} characters, got ${text.length}`;
  }
  return null;
}

function checkSubstance(text: string): string | null {
  if (text.trim().length === 0) {
    return "line must hold more than blank space";
  }
  return null;
}

function checkSingleLine(text: string): string | null {
  if (text.includes("\n") || text.includes("\r")) {
    return "line must not break across lines";
  }
  return null;
}

const BRIEF_CHECKS = [checkLength, checkSubstance, checkSingleLine];

function proveAgainstBrief(text: string): void {
  for (const check of BRIEF_CHECKS) {
    const fault = check(text);
    if (fault !== null) {
      throw new Error(fault);
    }
  }
}

function save(text: string): void {
  fs.mkdirSync(dirname(DESTINATION), { recursive: true });
  fs.writeFileSync(DESTINATION, text, "utf8");
}

function proveSaved(text: string): void {
  const back = fs.readFileSync(DESTINATION, "utf8");
  if (back !== text) {
    throw new Error("entry.txt came back different from the line checked");
  }
}

function main(): void {
  proveAgainstBrief(SUBMISSION);
  save(SUBMISSION);
  proveSaved(SUBMISSION);
  console.log(`saved ${SUBMISSION.length} characters to ${DESTINATION}`);
}

main();
