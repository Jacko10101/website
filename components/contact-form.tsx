"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      <input type="hidden" name="access_key" value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY} />
      <input type="hidden" name="subject" value="New contact from DevlinOps" />
      <input type="hidden" name="from_name" value="DevlinOps Contact Form" />

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
            placeholder="John Doe"
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
            placeholder="john@company.com"
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
          placeholder="Platform Engineering Consultation"
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
          placeholder="Tell me about your infrastructure challenges, current tech stack, team size, and timeline..."
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
              Send Message
              <Send className="h-4 w-4 transition-all" />
            </>
          )}
        </button>

        {status === "success" && (
          <div className="flex items-center gap-2 text-sm text-green-400">
            <CheckCircle className="h-4 w-4" />
            Message sent! I'll get back to you soon.
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <AlertCircle className="h-4 w-4" />
            {errorMessage}
          </div>
        )}
      </div>
    </form>
  );
}
