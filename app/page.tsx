"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftRight, Languages, Sparkles, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const languages = [
  { code: "zh", label: "Chinese (ZH)" },
  { code: "en", label: "English (EN)" },
  { code: "ja", label: "Japanese (JA)" },
  { code: "ko", label: "Korean (KO)" },
  { code: "fr", label: "French (FR)" },
  { code: "de", label: "German (DE)" },
  { code: "ru", label: "Russian (RU)" },
  { code: "es", label: "Spanish (ES)" }
];

export default function HomePage() {
  const [sourceLanguage, setSourceLanguage] = useState("zh");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [text, setText] = useState(
    "若夫淫雨霏霏，连月不开，阴风怒号，浊浪排空"
  );
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const canTranslate = useMemo(
    () => text.trim().length > 0 && sourceLanguage !== targetLanguage,
    [text, sourceLanguage, targetLanguage]
  );

  const handleSwap = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  const handleTranslate = async () => {
    if (!canTranslate) return;
    setTranslation("");
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          source_language: sourceLanguage,
          target_language: targetLanguage
        })
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Translation failed");
      }

      const data = await res.json();
      setTranslation(data.translation ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!translation) return;
    try {
      await navigator.clipboard.writeText(translation.trimEnd());
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    const nextHeight = Math.min(Math.max(el.scrollHeight, 200), 700);
    el.style.height = `${nextHeight}px`;
  };

  useEffect(() => {
    autoResize(inputRef.current);
  }, [text]);

  useEffect(() => {
    autoResize(outputRef.current);
  }, [translation]);

  return (
    <main className="min-h-screen px-6 pb-24 pt-14">
      <div className="mx-auto max-w-9xl space-y-12">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 font-black grid place-items-center shadow-lg shadow-cyan-500/40">
              A
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Ark Translator</p>
              <p className="text-sm text-slate-400">
                Doubao Seed Translation · Powered by Ark
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-300 text-sm">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Quality tuned for product-ready translations</span>
          </div>
        </header>

        <div className="glass rounded-3xl p-8 shadow-2xl shadow-black/30">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <Languages className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-sm text-slate-200 font-semibold">
                  Language pair
                </p>
                <p className="text-xs text-slate-400">
                  Source defaults to Chinese, target to English
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Timer className="h-4 w-4" />
                <span>Fast responses with caching off for freshness</span>
              </div>
              <Button
                type="button"
                size="lg"
                onClick={handleTranslate}
                disabled={!canTranslate || loading}
              >
                {loading ? "Translating..." : "Translate"}
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] items-start">
            <div className="space-y-3">
              <Label>Source language</Label>
              <Select
                value={sourceLanguage}
                onValueChange={(value) => setSourceLanguage(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose source language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste text to translate..."
                className="min-h-[220px] w-full"
              />
            </div>

            <div className="flex flex-col items-center gap-3 pt-9">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={handleSwap}
                aria-label="Swap languages"
              >
                <ArrowLeftRight className="h-5 w-5" />
              </Button>
              <div className="h-full w-px bg-white/10" />
            </div>

            <div className="space-y-3">
              <Label>Target language</Label>
              <Select
                value={targetLanguage}
                onValueChange={(value) => setTargetLanguage(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose target language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                ref={outputRef}
                value={translation}
                readOnly
                placeholder="Translation will appear here"
                className="min-h-[220px] w-full bg-white/5"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-slate-400">
              Doubao Seed Translation model • Private API key is required
            </div>
            <div className="flex items-center gap-3">
              {error && (
                <span className="text-sm text-red-300">{error}</span>
              )}
              <Button
                type="button"
                variant="secondary"
                onClick={handleCopy}
                disabled={!translation}
              >
                Copy translation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
