/**
 * Robust JSON extractor for LLM responses.
 * LLMs (especially local ones) often return JSON with unescaped characters
 * inside string values. This module handles extraction and repair.
 */

/**
 * Attempts to parse a JSON array from raw LLM output.
 * Strategy:
 * 1. Try direct parse of extracted array
 * 2. Try stripping markdown code fences
 * 3. Try a line-by-line object extractor as last resort
 */
export function extractJsonArray<T>(raw: string, agentName: string): T[] {
  // Strip markdown code fences if present
  const stripped = raw
    .replace(/^```(?:json)?\s*/m, '')
    .replace(/\s*```\s*$/m, '')
    .trim();

  // Try to find the outermost JSON array
  const arrayMatch = stripped.match(/\[[\s\S]*\]/);
  if (!arrayMatch) {
    throw new Error(`${agentName}: no JSON array found in LLM response`);
  }

  const candidate = arrayMatch[0];

  // Attempt 1: direct parse
  try {
    return JSON.parse(candidate) as T[];
  } catch {
    // fall through
  }

  // Attempt 2: repair common issues — unescaped newlines inside strings
  try {
    const repaired = repairJson(candidate);
    return JSON.parse(repaired) as T[];
  } catch {
    // fall through
  }

  // Attempt 3: extract individual objects using a brace-matching approach
  try {
    return extractObjects<T>(candidate);
  } catch {
    throw new Error(`${agentName}: failed to parse LLM response as JSON after all repair attempts`);
  }
}

/**
 * Repairs common JSON issues from LLM output:
 * - Unescaped newlines inside string values
 * - Unescaped tabs inside string values
 * - Trailing commas before ] or }
 */
function repairJson(input: string): string {
  let result = '';
  let inString = false;
  let escaped = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (escaped) {
      result += ch;
      escaped = false;
      continue;
    }

    if (ch === '\\') {
      escaped = true;
      result += ch;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      result += ch;
      continue;
    }

    if (inString) {
      // Escape raw control characters inside strings
      if (ch === '\n') { result += '\\n'; continue; }
      if (ch === '\r') { result += '\\r'; continue; }
      if (ch === '\t') { result += '\\t'; continue; }
    }

    result += ch;
  }

  // Remove trailing commas before ] or }
  result = result.replace(/,\s*([}\]])/g, '$1');

  return result;
}

/**
 * Last-resort: extract objects by matching balanced braces.
 */
function extractObjects<T>(input: string): T[] {
  const objects: T[] = [];
  let depth = 0;
  let start = -1;

  for (let i = 0; i < input.length; i++) {
    if (input[i] === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (input[i] === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        const objStr = input.slice(start, i + 1);
        try {
          objects.push(JSON.parse(repairJson(objStr)) as T);
        } catch {
          // skip unparseable object
        }
        start = -1;
      }
    }
  }

  if (objects.length === 0) {
    throw new Error('No valid objects could be extracted');
  }

  return objects;
}
