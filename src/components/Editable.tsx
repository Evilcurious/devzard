import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Pencil, Undo2, Sparkles, Eye, History } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { cn } from "../utils/cn";

/** Flatten React children (text, numbers, nested elements) into a plain string. */
function plainText(children: ReactNode): string {
  const walk = (node: ReactNode): string => {
    if (node == null || typeof node === "boolean") return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(walk).join("");
    if (typeof node === "object" && "props" in (node as any)) {
      return walk((node as any).props?.children);
    }
    return "";
  };
  return walk(children).replace(/\s+/g, " ").trim();
}

/**
 * EditableText — when site "edit mode" is on and the viewer is the admin,
 * any text wrapped with this component becomes click-to-edit inline.
 * Edits are stored by key (id + original content) so they survive reloads,
 * and every commit is recorded so the admin can undo in one click.
 */
export function EditableText({
  id,
  children,
  className,
  multiline = false,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  multiline?: boolean;
}) {
  const { editMode, textOverrides, setTextOverride } = useStore();
  const { isAdmin } = useAuth();

  const original = useMemo(() => plainText(children), [children]);
  const key = `${id}::${original}`;
  const shown = textOverrides[key] ?? original;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(shown);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // keep draft in sync if shown value changes externally
  useEffect(() => {
    if (!editing) setDraft(shown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const active = editMode && isAdmin;
  const edited = textOverrides[key] !== undefined;

  const commit = () => {
    const value = draft.trim();
    if (value && value !== shown) setTextOverride(key, value);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(shown);
    setEditing(false);
  };

  if (!active) {
    if (className) return <span className={className}>{children}</span>;
    return <>{children}</>;
  }

  if (editing) {
    return (
      <span
        className="dz-edit dz-edit-on"
        onClick={(e) => e.stopPropagation()}
      >
        <textarea
          ref={inputRef}
          value={draft}
          rows={multiline ? Math.max(2, draft.split("\n").length) : 1}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (!multiline && e.key === "Enter") {
              e.preventDefault();
              commit();
            }
            if (e.key === "Escape") cancel();
          }}
          onBlur={commit}
          className="dz-edit-area w-full resize-none rounded-lg bg-white text-slate-900 outline-none ring-2 ring-brand-500"
        />
        <span className="dz-edit-actions">
          <button onClick={commit} title="Save">
            <Check className="h-3.5 w-3.5" />
          </button>
          <button onClick={cancel} title="Cancel">
            <X className="h-3.5 w-3.5" />
          </button>
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn("dz-edit group/txt relative", className)}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {shown}
      <span className="dz-edit-badge">
        {edited ? <History className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
      </span>
    </span>
  );
}

/** Floating toolbar shown when edit mode is ON (admin only). */
export function EditModeBar() {
  const { editMode, setEditMode, undoTextEdit, canUndo, undoCount } = useStore();
  const { isAdmin } = useAuth();

  if (!editMode || !isAdmin) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="fixed inset-x-0 bottom-4 z-[120] flex justify-center px-4"
      >
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-navy-900/95 px-3 py-2.5 shadow-2xl shadow-brand-900/40 backdrop-blur-xl sm:gap-3">
          <span className="inline-flex items-center gap-2 rounded-lg bg-brand-500/15 px-3 py-1.5 text-xs font-bold text-brand-300">
            <Sparkles className="h-3.5 w-3.5" /> Edit mode ON
          </span>
          <span className="hidden text-xs text-slate-400 md:inline">
            Click any highlighted text to edit it
          </span>
          <button
            onClick={() => undoTextEdit()}
            disabled={!canUndo}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:border-brand-400/60 disabled:opacity-40"
          >
            <Undo2 className="h-3.5 w-3.5" />
            Undo {canUndo ? `(${undoCount})` : ""}
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-brand-500/30 transition-transform hover:scale-105"
          >
            <Eye className="h-3.5 w-3.5" /> Finish editing
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* tiny note: edit-targets become clickable + outlined only while edit mode is on */
