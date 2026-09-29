"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import MailboxScene, { type SendStage } from "./MailboxScene";
import { CONTACT } from "@/lib/data";

const BUDGETS = [
  "Not sure yet",
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $40,000",
  "$40,000+",
];

const SERVICES = [
  "Website",
  "Web application",
  "E-Commerce",
  "UI/UX design",
  "Integration / API",
  "Maintenance & support",
];

type Status = "idle" | "sent" | "error";

// How long each part of the send animation gets, matched to MailboxScene.
const TIMING = {
  seal: 1500, // letter slides in, flap closes, seal stamps
  flight: 1350, // door opens and the envelope flies in
  celebrate: 2600, // flag up and the check, before the form comes back
  failed: 3800, // the mailbox catches fire and the letter burns up
  fade: 500, // cross-fade between the scene and the form
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [stage, setStage] = useState<SendStage>("idle");
  const [showScene, setShowScene] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const still = useRef(false);

  useEffect(() => {
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Keep keyboard and screen-reader focus out of the form while it's hidden.
  useEffect(() => {
    if (formRef.current) formRef.current.inert = showScene;
  }, [showScene]);

  // The "sent" note steps aside after a while.
  useEffect(() => {
    if (status !== "sent") return;
    const id = window.setTimeout(() => setStatus("idle"), 8000);
    return () => window.clearTimeout(id);
  }, [status]);

  // With reduced motion the scene just shows each state briefly.
  const pause = (ms: number) => wait(still.current ? Math.min(ms, 900) : ms);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    // The service checkboxes share one name; fromEntries alone would keep only
    // the last one ticked.
    const data: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {
      ...Object.fromEntries(formData.entries()),
      services: formData.getAll("services"),
    };

    const nextErrors: Record<string, string> = {};
    if (!String(data.name || "").trim()) nextErrors.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email || "")))
      nextErrors.email = "Please enter a valid email address.";
    if (String(data.message || "").trim().length < 10)
      nextErrors.message = "Please tell us a bit more (at least 10 characters).";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("idle");
    setStage("sealing");
    setShowScene(true);

    // On a tall form (phones) the scene sits mid-card, possibly off screen
    // from the Send button; bring it into view if so.
    const card = form.parentElement?.getBoundingClientRect();
    if (card && Math.abs(card.top + card.height / 2 - window.innerHeight / 2) > window.innerHeight * 0.35) {
      form.parentElement?.scrollIntoView({
        block: "center",
        behavior: still.current ? "auto" : "smooth",
      });
    }
    // Let the sealing play out even when the server answers quickly.
    const sealed = pause(TIMING.seal);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Request failed");

      await sealed;
      setStage("flying");
      await pause(TIMING.flight);
      setStage("delivered");
      form.reset();
      await pause(TIMING.celebrate);
      setMessage(result.message);
      setStatus("sent");
    } catch {
      // Whatever went wrong (mail server, network, a crashed route), the
      // visitor gets the same way out: our address, shown in the form.
      await sealed;
      setStage("failed");
      await pause(TIMING.failed);
      setStatus("error");
    }

    // Bring the form back, fresh after a send, as it was after a failure.
    setShowScene(false);
    await wait(TIMING.fade);
    setStage("idle");
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/20";

  return (
    <div className="relative">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        aria-hidden={showScene}
        className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-[opacity,transform,filter] duration-500 sm:p-8 ${
          showScene ? "scale-[0.97] opacity-0 blur-sm" : "scale-100 opacity-100 blur-0"
        }`}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-navy-900">
              Name *
            </label>
            <input id="name" name="name" className={inputClass} placeholder="Your full name" />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy-900">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={inputClass}
              placeholder="you@company.com"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-navy-900">
              Company
            </label>
            <input
              id="company"
              name="company"
              className={inputClass}
              placeholder="Company name (optional)"
            />
          </div>

          <div>
            <label htmlFor="budget" className="mb-1.5 block text-sm font-medium text-navy-900">
              Budget
            </label>
            <select id="budget" name="budget" className={inputClass} defaultValue={BUDGETS[0]}>
              {BUDGETS.map((budget) => (
                <option key={budget}>{budget}</option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className="mt-6">
          <legend className="mb-2.5 text-sm font-medium text-navy-900">
            What do you need?
          </legend>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((service) => (
              <label
                key={service}
                className="cursor-pointer rounded-full border border-slate-200 px-3.5 py-1.5 text-sm text-slate-600 transition has-[:checked]:border-navy-950 has-[:checked]:bg-navy-950 has-[:checked]:text-white"
              >
                <input
                  type="checkbox"
                  name="services"
                  value={service}
                  className="sr-only"
                />
                {service}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Honeypot — hidden from people, filled in by spam bots. */}
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="website">Leave this field empty</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="mt-6">
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-navy-900">
            Project details *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className={`${inputClass} resize-y`}
            placeholder="Tell us about your project, your goals and your timeline."
          />
          {errors.message && (
            <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>
          )}
        </div>

        {status === "error" && (
          <p
            role="alert"
            className="mt-5 flex animate-appear gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>
              Your message was not sent. Please email us directly at{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="font-semibold underline underline-offset-2 hover:text-red-700"
              >
                {CONTACT.email}
              </a>
              . Your text is still in the form, so you can copy it from here.
            </span>
          </p>
        )}

        {status === "sent" && (
          <p
            role="status"
            className="mt-5 flex animate-appear items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700"
          >
            <CheckCircle2 size={16} className="shrink-0" />
            {message || "Your message was sent."} Want to send another?
          </p>
        )}

        <button
          type="submit"
          disabled={stage !== "idle"}
          className="btn-dark group mt-7 w-full disabled:opacity-60 sm:w-auto"
        >
          Send message
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>

        <p className="mt-4 text-xs text-slate-400">
          We usually reply within one business day. Your details are never shared
          with third parties.
        </p>
      </form>

      <div
        aria-hidden={!showScene}
        className={`absolute inset-0 overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-b from-[#f5f8fd] to-white shadow-sm transition-opacity duration-500 ${
          showScene ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <MailboxScene stage={stage} />
      </div>
    </div>
  );
}
