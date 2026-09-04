"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function MultiSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  allowCustom = true,
  className,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  options: string[];
  placeholder?: string;
  allowCustom?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase()),
  );
  const customEntry = allowCustom && search.trim() && !options.includes(search.trim());

  function toggle(item: string) {
    if (value.includes(item)) {
      onChange(value.filter((v) => v !== item));
    } else {
      onChange([...value, item]);
    }
    setSearch("");
  }

  function addCustom() {
    const trimmed = search.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setSearch("");
    inputRef.current?.focus();
  }

  function remove(tag: string) {
    onChange(value.filter((v) => v !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && customEntry) {
      e.preventDefault();
      addCustom();
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "flex w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring",
          value.length === 0 && "text-muted-foreground",
          className,
        )}
      >
        <div className="flex flex-wrap gap-1 items-center">
          {value.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            value.slice(0, 3).map((v) => (
              <span
                key={v}
                className="shrink-0 inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground"
              >
                {v}
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(v);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      remove(v);
                    }
                  }}
                  className="cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </span>
              </span>
            ))
          )}
          {value.length > 3 && (
            <span className="text-xs text-muted-foreground">+{value.length - 3} more</span>
          )}
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-(--anchor-width) min-w-[260px] p-0" align="start">
        <div className="p-2">
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search or add..."
            className="w-full rounded-md border border-border px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="max-h-48 overflow-y-auto p-1">
          {filtered.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggle(item)}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted",
                value.includes(item) && "bg-muted/50",
              )}
            >
              <div
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                  value.includes(item)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input",
                )}
              >
                {value.includes(item) && <Check className="h-3 w-3" />}
              </div>
              <span>{item}</span>
            </button>
          ))}
          {customEntry && (
            <button
              type="button"
              onClick={addCustom}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-primary hover:bg-primary/10"
            >
              Add &quot;{search.trim()}&quot;
            </button>
          )}
          {filtered.length === 0 && !customEntry && (
            <p className="px-2 py-3 text-center text-sm text-muted-foreground">
              No options found
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
