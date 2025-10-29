"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeSnippetProps {
  code: string;
  language: string;
  title?: string;
}

export function CodeSnippet({ code, language, title }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {title && (
        <div className="flex items-center justify-between border-b border-border bg-secondary px-4 py-2">
          <span className="text-sm font-medium">{title}</span>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 rounded-md px-2 py-1 text-xs hover:bg-accent transition-colors"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
}
