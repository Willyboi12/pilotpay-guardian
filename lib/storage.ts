import { AnalysisInput, AnalysisResult } from "@/lib/types";

const STORAGE_KEY = "pilotpay-guardian-history-v1";

export type HistoryEntry = {
  input: AnalysisInput;
  result: AnalysisResult;
};

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveHistory(entry: HistoryEntry) {
  const existing = getHistory();
  const next = [entry, ...existing].slice(0, 10);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
