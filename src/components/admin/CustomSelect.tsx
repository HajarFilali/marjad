"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronRight, Check, LucideIcon, Plus, X } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
  icon?: LucideIcon;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  icon?: LucideIcon;
  placeholder?: string;
  triggerClassName?: string;
  forceDropDirection?: "up" | "down";
  filterSelected?: boolean;
  allowCustomAdd?: boolean;
  onAddNewOption?: (newVal: string) => void;
  actionOptionLabel?: string;
  onActionOptionClick?: () => void;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  icon: Icon,
  placeholder,
  triggerClassName,
  forceDropDirection,
  filterSelected = true,
  allowCustomAdd = false,
  onAddNewOption,
  actionOptionLabel,
  onActionOptionClick,
}) => {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [maxPanelHeight, setMaxPanelHeight] = useState(240);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customInputText, setCustomInputText] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === value);
  const SelectedIcon = selected?.icon || Icon || ChevronRight;

  const checkPosition = useCallback(() => {
    if (forceDropDirection) {
      setDropUp(forceDropDirection === "up");
      return;
    }
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const windowH = window.innerHeight;

    let effectiveSpaceBelow = windowH - rect.bottom;
    let effectiveSpaceAbove = rect.top;

    let parent = ref.current.parentElement;
    let scrollParent: HTMLElement | null = null;
    while (parent && parent !== document.body) {
      const style = window.getComputedStyle(parent);
      if (["auto", "scroll"].includes(style.overflowY)) {
        scrollParent = parent;
        break;
      }
      parent = parent.parentElement;
    }

    if (scrollParent) {
      const parentRect = scrollParent.getBoundingClientRect();
      const parentSpaceBelow = parentRect.bottom - rect.bottom;
      const parentSpaceAbove = rect.top - parentRect.top;
      if (parentSpaceBelow < effectiveSpaceBelow) effectiveSpaceBelow = parentSpaceBelow;
      if (parentSpaceAbove < effectiveSpaceAbove) effectiveSpaceAbove = parentSpaceAbove;
    }

    const neededHeight = 230;
    const shouldDropUp = effectiveSpaceBelow < neededHeight && effectiveSpaceAbove > effectiveSpaceBelow;

    setDropUp(shouldDropUp);

    if (shouldDropUp) {
      const available = Math.max(120, effectiveSpaceAbove - 16);
      setMaxPanelHeight(Math.min(240, available));
    } else {
      const available = Math.max(120, effectiveSpaceBelow - 16);
      setMaxPanelHeight(Math.min(240, available));
    }
  }, [forceDropDirection]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setIsAddingCustom(false);
        setCustomInputText("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      checkPosition();
      const handleUpdate = () => checkPosition();
      window.addEventListener("scroll", handleUpdate, true);
      window.addEventListener("resize", handleUpdate);
      return () => {
        window.removeEventListener("scroll", handleUpdate, true);
        window.removeEventListener("resize", handleUpdate);
      };
    } else {
      setIsAddingCustom(false);
      setCustomInputText("");
    }
  }, [open, checkPosition]);

  const handleConfirmCustom = () => {
    const trimmed = customInputText.trim();
    if (!trimmed) return;
    if (onAddNewOption) {
      onAddNewOption(trimmed);
    } else {
      onChange(trimmed);
    }
    setIsAddingCustom(false);
    setCustomInputText("");
    setOpen(false);
  };

  const displayedOptions = filterSelected
    ? options.filter((opt) => opt.value !== value)
    : options;

  return (
    <div ref={ref} className={`relative ${open ? "z-50" : "z-10"}`}>
      <button
        type="button"
        onClick={() => {
          if (!open) checkPosition();
          setOpen((p) => !p);
        }}
        className={`w-full flex items-center gap-2 bg-white hover:bg-[#FAF7F2] border text-xs text-[#1F2937] font-semibold cursor-pointer transition-all px-3.5 py-2.5 ${
          open
            ? dropUp
              ? "border-[#6d381e] bg-white rounded-b-xl rounded-t-none border-t-0 shadow-none"
              : "border-[#6d381e] bg-white rounded-t-xl rounded-b-none border-b-0 shadow-none"
            : triggerClassName || "border-[#E9DCD5] rounded-xl shadow-2xs"
        }`}
      >
        <SelectedIcon className="w-3.5 h-3.5 text-[#6d381e] shrink-0" />
        <span className={`flex-1 text-start truncate ${!selected ? "text-neutral-400 font-normal" : ""}`}>
          {selected?.label ?? placeholder ?? value ?? ""}
        </span>
        <ChevronRight
          className={`w-3.5 h-3.5 text-[#6d381e] shrink-0 transition-transform duration-200 ${
            open ? "rotate-[270deg]" : "rotate-90"
          }`}
        />
      </button>

      {open && (
        <div
          style={{ maxHeight: `${maxPanelHeight}px` }}
          className={`absolute z-50 w-full bg-white border border-[#6d381e] overflow-hidden ${
            dropUp
              ? "bottom-full left-0 -mb-[1px] border-b-0 rounded-t-xl shadow-none"
              : "top-full left-0 -mt-[1px] border-t-0 rounded-b-xl shadow-xl shadow-[#6d381e]/10"
          }`}
        >
          <div
            style={{ maxHeight: `${maxPanelHeight}px` }}
            className="overflow-y-auto scrollbar-none"
          >
            {displayedOptions.map((opt) => {
              const isSelected = opt.value === value;
              const OptIcon = opt.icon || Icon || ChevronRight;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-start transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#6d381e]/10 text-[#6d381e] font-bold"
                      : "text-[#374151] hover:bg-[#FAF7F2] hover:text-[#6d381e]"
                  }`}
                >
                  <OptIcon className="w-3.5 h-3.5 shrink-0 text-[#6d381e]" />
                  <span className="flex-1 text-start truncate">{opt.label}</span>
                </button>
              );
            })}

            {displayedOptions.length === 0 && !allowCustomAdd && !actionOptionLabel && (
              <div className="px-3.5 py-2.5 text-xs text-neutral-400 italic text-start">
                Aucune autre option disponible
              </div>
            )}

            {actionOptionLabel && onActionOptionClick && (
              <div className="border-t border-[#E9DCD5] bg-white sticky bottom-0">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onActionOptionClick();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-start text-[#ba4e1a] hover:bg-[#FAF7F2] hover:text-[#6d381e] transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0 text-[#ba4e1a]" />
                  <span className="flex-1 text-start">{actionOptionLabel}</span>
                </button>
              </div>
            )}

            {allowCustomAdd && (
              <div className="border-t border-[#E9DCD5] bg-[#FAF7F2]/60">
                {isAddingCustom ? (
                  <div
                    className="p-2.5 flex items-center gap-2 bg-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      autoFocus
                      placeholder="Saisir la nouvelle valeur..."
                      value={customInputText}
                      onChange={(e) => setCustomInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleConfirmCustom();
                        } else if (e.key === "Escape") {
                          setIsAddingCustom(false);
                          setCustomInputText("");
                        }
                      }}
                      className="flex-1 bg-transparent border-b-2 border-[#6d381e] text-xs text-[#1F2937] font-semibold py-1 px-1.5 focus:outline-none placeholder:font-normal placeholder:text-neutral-400"
                    />
                    <button
                      type="button"
                      onClick={handleConfirmCustom}
                      className="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition shadow-2xs cursor-pointer shrink-0"
                      title="Valider"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCustom(false);
                        setCustomInputText("");
                      }}
                      className="w-7 h-7 rounded-lg bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition shadow-2xs cursor-pointer shrink-0"
                      title="Annuler"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCustom(true);
                      setCustomInputText("");
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-start text-[#6d381e] hover:bg-[#6d381e]/15 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span>Autre...</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
