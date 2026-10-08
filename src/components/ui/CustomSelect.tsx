"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, LucideIcon, Search, X, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
  count?: number;
  icon?: LucideIcon;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  icon?: LucideIcon;
  placeholder?: string;
  className?: string;
  dropdownClassName?: string;
  prefixLabel?: string;
  align?: "left" | "right";
  searchable?: boolean;
  searchPlaceholder?: string;
  footerOption?: CustomSelectOption;
}

export function CustomSelect({
  value,
  onChange,
  options,
  icon: DefaultIcon,
  placeholder = "Sélectionner...",
  className = "",
  dropdownClassName = "",
  prefixLabel,
  align = "left",
  searchable = false,
  searchPlaceholder = "Rechercher...",
  footerOption,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle autofocus and reset query when dropdown opens
  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
    }
  }, [isOpen, searchable]);

  // Find currently active option (including footer option if matched)
  const allOptions = footerOption ? [...options, footerOption] : options;
  const activeOption = allOptions.find((opt) => opt.value === value) || options[0];
  const ActiveOptionIcon = activeOption?.icon || DefaultIcon;

  // Filter options for search
  const normalizeStr = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filteredOptions = searchQuery.trim()
    ? options.filter((opt) =>
        normalizeStr(opt.label).includes(normalizeStr(searchQuery))
      )
    : options;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* 1. BOUTON D'ANCRAGE */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#1c1917] hover:border-[#c4622d] transition-all shadow-2xs cursor-pointer text-left focus:outline-none ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        tabIndex={isOpen ? -1 : 0}
        aria-hidden={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {ActiveOptionIcon && (
            <ActiveOptionIcon className="w-4 h-4 text-[#c4622d] shrink-0" />
          )}
          <span className="whitespace-nowrap">
            {prefixLabel && <span className="font-normal text-[#78716c] mr-1">{prefixLabel}</span>}
            {activeOption ? activeOption.label : placeholder}
            {activeOption?.count !== undefined && (
              <span className="text-[#78716c] font-normal ml-1">({activeOption.count})</span>
            )}
          </span>
        </div>
        <ChevronDown
          className="w-4 h-4 text-[#78716c] shrink-0 ml-2"
        />
      </button>

      {/* 2. CARTE FLOTTANTE LORSQU'ELLE EST OUVERTE */}
      {isOpen && (
        <div
          className={`absolute top-0 z-50 rounded-2xl bg-white border border-[#c4622d] shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 ${
            align === "right" ? "right-0 min-w-full" : "left-0 right-0"
          } ${dropdownClassName}`}
        >
          {/* SEARCHABLE MODE: Search bar directly in place of the button! */}
          {searchable ? (
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#ebd8be]/60 bg-white">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <Search className="w-4 h-4 text-[#c4622d] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-xs font-semibold text-[#1c1917] placeholder:text-stone-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-0.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-0.5 text-[#c4622d] hover:text-[#ba4e1a] shrink-0 ml-2 cursor-pointer transition-colors"
                title="Fermer"
              >
                <ChevronDown className="w-4 h-4 rotate-180" />
              </button>
            </div>
          ) : (
            /* NON-SEARCHABLE MODE */
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-[#c4622d] bg-[#c4622d]/8 cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {ActiveOptionIcon && (
                  <ActiveOptionIcon className="w-4 h-4 text-[#c4622d] shrink-0" />
                )}
                <span className="whitespace-nowrap">
                  {prefixLabel && <span className="font-semibold text-[#c4622d] mr-1">{prefixLabel}</span>}
                  {activeOption ? activeOption.label : placeholder}
                  {activeOption?.count !== undefined && (
                    <span className="text-[#c4622d]/80 font-normal ml-1">({activeOption.count})</span>
                  )}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#c4622d] rotate-180 shrink-0 ml-2" />
            </button>
          )}

          {/* LISTE DES OPTIONS */}
          <div className="space-y-0.5 max-h-56 overflow-y-auto pr-0.5">
            {filteredOptions.map((opt) => {
              if (!searchable && opt.value === value) return null;

              const isSelected = opt.value === value;
              const ItemIcon = opt.icon || DefaultIcon;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? "bg-[#c4622d]/10 text-[#c4622d] font-bold"
                      : "font-medium text-[#1c1917] hover:bg-[#faf8f5] hover:text-[#c4622d]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {ItemIcon && (
                      <ItemIcon
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? "text-[#c4622d]" : "text-[#78716c]"
                        }`}
                      />
                    )}
                    <span className="whitespace-nowrap">{opt.label}</span>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#c4622d] shrink-0 ml-2" />
                  )}
                  {opt.count !== undefined && !isSelected && (
                    <span className="text-[10px] text-[#78716c] font-normal ml-2">
                      ({opt.count})
                    </span>
                  )}
                </button>
              );
            })}

            {filteredOptions.length === 0 && (
              <div className="py-4 text-center text-xs text-stone-500">
                <p>Aucune ville trouvée</p>
              </div>
            )}
          </div>

          {/* OPTION PIED DE PAGE DÉDIÉE (ex: "Autre ville") */}
          {footerOption && (
            <div className="pt-1 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  onChange(footerOption.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                  value === footerOption.value
                    ? "bg-[#c4622d]/10 text-[#c4622d] font-bold"
                    : "font-medium text-[#1c1917] hover:bg-[#faf8f5] hover:text-[#c4622d]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {footerOption.icon && (
                    <footerOption.icon
                      className={`w-4 h-4 shrink-0 ${
                        value === footerOption.value
                          ? "text-[#c4622d]"
                          : "text-[#78716c]"
                      }`}
                    />
                  )}
                  <span className="whitespace-nowrap font-bold text-[#ba4e1a]">
                    {footerOption.label}
                  </span>
                </div>
                {value === footerOption.value && (
                  <Check className="w-3.5 h-3.5 text-[#ba4e1a] shrink-0 ml-2" />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
