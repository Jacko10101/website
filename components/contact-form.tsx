"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!WEB3FORMS_KEY) {
      setStatus("error");
      setErrorMessage("The form isn't configured right now — please email jack@devlinops.com directly.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        form.reset();
        // Re-enable the form after a moment so a second message can be sent.
        setTimeout(() => setStatus("idle"), 6000);
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Failed to send message. Please email jack@devlinops.com directly.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
      <input type="hidden" name="from_name" value="DevlinOps Contact Form" />

      {/* Honeypot — hidden from real users, bots tend to fill it. Web3forms drops any submission where this is set. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={status === "submitting"}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled={status === "submitting"}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          disabled={status === "submitting"}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          placeholder="Quick question / role / general"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          disabled={status === "submitting"}
          rows={8}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y disabled:opacity-50"
          placeholder="What you're working on, what's broken, or just hello."
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:gap-3 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
        >
          {status === "submitting" ? (
            <>
              Sending...
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Send message
              <Send className="h-4 w-4 transition-all" />
            </>
          )}
        </button>

        <div aria-live="polite" role="status">
          {status === "success" && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <CheckCircle className="h-4 w-4" />
              Message sent. I usually reply within a day.
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 text-sm text-error">
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
