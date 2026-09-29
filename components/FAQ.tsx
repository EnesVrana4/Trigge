"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { FAQS } from "@/lib/data";

export default function FAQ() {
  // All closed until the visitor picks one.
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-slate-200 border-y border-slate-200">
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={faq.question}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-4 text-left"
            >
              <span
                className={`text-base font-semibold transition-colors ${
                  isOpen ? "text-accent-dark" : "text-navy-900"
                }`}
              >
                {faq.question}
              </span>
              <Plus
                size={18}
                className={`shrink-0 text-slate-400 transition-transform duration-300 ${
                  isOpen ? "rotate-45 text-accent-dark" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="-mt-1 pb-4 pr-10 text-sm leading-relaxed text-slate-500">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
