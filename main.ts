// Rejected Olympic Sports — one funny single-line sport the Olympics turned down.
//
// The program writes exactly one line of text to /output/entry.txt.
// The line must be UTF-8, 1 to 200 characters, a single line, not only
// white space. It is checked here before it is written, so a bad line
// fails loudly in development instead of silently failing the gate.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The entry: a made-up event a broadcaster could announce with a straight
// face, whose joke lands in one read and whose twist arrives at the end.
const LINE =
  "Competitive Hide-and-Seek: the defending champion hasn't been found since 2008 and is still, technically, winning.";

const MAX_CHARS = 200;

function validate(line: string): void {
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(
      `entry must be 1-${MAX_CHARS} characters, got ${line.length}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

validate(LINE);
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");

// Read the file back and confirm it holds exactly the line we validated,
// so a silent write failure can never pass as a good entry.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== LINE) {
  throw new Error("entry.txt does not hold the validated line");
}
console.log(`wrote ${LINE.length} characters to /output/entry.txt`);
