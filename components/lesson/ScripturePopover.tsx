"use client";

import React, { useState, useRef, useEffect, type ReactNode } from "react";

// --- Bible reference detection ---

// Pattern 1: Parenthetical — (Romans 6:23), (1 Corinthians 6:9-10)
const PAREN_REF_RE =
  /\((\d?\s*[A-Z][a-zA-Z]+(?:\s+[a-zA-Z]+)*\s+\d+:\d+(?:[-–,]\d+)*)\)/g;

// Pattern 2: Em-dash — Romans 10:1-3 (used in headings)
const EMDASH_REF_RE =
  /—\s+(\d?\s*[A-Z][a-zA-Z]+(?:\s+[a-zA-Z]+)*\s+\d+:\d+(?:[-–,]\d+)*)/g;

// --- Verse cache (module-level, survives re-renders) ---

const verseCache = new Map<string, { text: string; reference: string }>();

async function fetchVerse(
  ref: string
): Promise<{ text: string; reference: string }> {
  const key = ref.toLowerCase();
  if (verseCache.has(key)) return verseCache.get(key)!;

  const res = await fetch(
    `https://bible-api.com/${encodeURIComponent(ref)}?translation=web`
  );
  if (!res.ok) throw new Error("Verse not found");

  const data = await res.json();
  const result = {
    text: (data.text as string).trim(),
    reference: data.reference as string,
  };
  verseCache.set(key, result);
  return result;
}

// --- Popover component ---

function ScripturePopover({
  reference,
  displayPrefix,
}: {
  reference: string;
  displayPrefix?: string;
}) {
  const [open, setOpen] = useState(false);
  const [verse, setVerse] = useState<{
    text: string;
    reference: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const popRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        popRef.current &&
        !popRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  // Reposition card to stay within viewport
  useEffect(() => {
    if (!open || !popRef.current || !btnRef.current) return;
    const btn = btnRef.current.getBoundingClientRect();
    const card = popRef.current.getBoundingClientRect();
    const pad = 8;

    let top = btn.bottom + 6;
    let left = btn.left;

    // Clamp right edge
    if (left + card.width > window.innerWidth - pad) {
      left = window.innerWidth - card.width - pad;
    }
    // Clamp left edge
    if (left < pad) left = pad;

    // If card would go below viewport, show above the button
    if (top + card.height > window.innerHeight - pad) {
      top = btn.top - card.height - 6;
    }

    setPos({ top, left });
  }, [open, verse, loading]);

  async function handleClick() {
    if (open) {
      setOpen(false);
      return;
    }

    setOpen(true);
    if (verse) return;

    setLoading(true);
    setError(false);
    try {
      const data = await fetchVerse(reference);
      setVerse(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  // Show parens for parenthetical refs, em-dash for heading refs
  const display = displayPrefix
    ? `${displayPrefix}${reference}`
    : `(${reference})`;

  return (
    <span className="inline">
      <button
        ref={btnRef}
        onClick={handleClick}
        className="font-semibold underline decoration-emerald-400/60 decoration-2 underline-offset-2 text-emerald-700 dark:text-emerald-400 hover:decoration-emerald-500 cursor-pointer transition-colors"
        title={`Look up ${reference}`}
      >
        {display}
      </button>

      {open && (
        <div
          ref={popRef}
          className="fixed z-50 w-[calc(100vw-1rem)] max-w-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-lg p-4 text-left animate-fade-in"
          style={{ top: pos.top, left: pos.left }}
        >
          {loading && (
            <p className="text-sm text-stone-400 dark:text-stone-500 italic">
              Loading verse…
            </p>
          )}
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">
              Could not load verse. Try again later.
            </p>
          )}
          {verse && (
            <>
              <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-200 italic">
                &ldquo;{verse.text}&rdquo;
              </p>
              <p className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                — {verse.reference} (WEB)
              </p>
            </>
          )}
        </div>
      )}
    </span>
  );
}

// --- Text processor: find Bible references in strings ---

interface RefMatch {
  index: number;
  length: number;
  reference: string;
  prefix: string | undefined; // undefined = parens, "— " = emdash
}

function findAllRefs(text: string): RefMatch[] {
  const matches: RefMatch[] = [];

  PAREN_REF_RE.lastIndex = 0;
  let m;
  while ((m = PAREN_REF_RE.exec(text)) !== null) {
    matches.push({
      index: m.index,
      length: m[0].length,
      reference: m[1],
      prefix: undefined,
    });
  }

  EMDASH_REF_RE.lastIndex = 0;
  while ((m = EMDASH_REF_RE.exec(text)) !== null) {
    matches.push({
      index: m.index,
      length: m[0].length,
      reference: m[1],
      prefix: "— ",
    });
  }

  // Sort by position so we process left-to-right
  matches.sort((a, b) => a.index - b.index);
  return matches;
}

function processTextNode(text: string): ReactNode {
  const matches = findAllRefs(text);
  if (matches.length === 0) return text;

  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of matches) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <ScripturePopover
        key={match.index}
        reference={match.reference}
        displayPrefix={match.prefix}
      />
    );
    lastIndex = match.index + match.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}

/** Recursively walk React children and make Bible references interactive */
function processChildren(children: ReactNode): ReactNode {
  if (typeof children === "string") {
    return processTextNode(children);
  }
  if (Array.isArray(children)) {
    return children.map((child, i) => (
      <React.Fragment key={i}>{processChildren(child)}</React.Fragment>
    ));
  }
  if (React.isValidElement(children) && children.props.children) {
    return children;
  }
  return children;
}

// --- MDX component overrides ---

export function ScriptureParagraph({ children }: { children?: ReactNode }) {
  return <p>{processChildren(children)}</p>;
}

export function ScriptureListItem({ children }: { children?: ReactNode }) {
  return <li>{processChildren(children)}</li>;
}

export function ScriptureH2({ children }: { children?: ReactNode }) {
  return <h2>{processChildren(children)}</h2>;
}

export function ScriptureH3({ children }: { children?: ReactNode }) {
  return <h3>{processChildren(children)}</h3>;
}

export function ScriptureH4({ children }: { children?: ReactNode }) {
  return <h4>{processChildren(children)}</h4>;
}
