"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  memo: string | undefined;
  onSave: (memo: string) => void;
}

export function TodoMemo({ memo, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(memo ?? "");
  const [editing, setEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  const handleSave = () => {
    onSave(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(memo ?? "");
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleCancel();
    // Ctrl/Cmd+Enter で保存
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSave();
  };

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className={`transition-transform duration-150 ${open ? "rotate-90" : ""}`}>▶</span>
        {memo ? (
          <span className="underline underline-offset-2">メモあり</span>
        ) : (
          <span>メモを追加</span>
        )}
      </button>

      {open && (
        <div className="mt-2 rounded-md border border-border bg-muted/40 p-3 space-y-2">
          {editing ? (
            <>
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="進行状況や注意事項を入力... (Ctrl+Enter で保存)"
                rows={4}
                className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>保存</Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>キャンセル</Button>
              </div>
            </>
          ) : (
            <div
              className="group cursor-pointer"
              onClick={() => setEditing(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setEditing(true)}
            >
              {memo ? (
                <p className="whitespace-pre-wrap text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                  {memo}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">クリックして編集...</p>
              )}
              <span className="mt-1 block text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                クリックで編集
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
