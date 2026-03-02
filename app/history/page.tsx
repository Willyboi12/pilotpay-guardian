"use client";

import { useEffect, useState } from "react";
import { getHistory, HistoryEntry } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Last 10 analyses</h2>
      {items.length === 0 && <p className="text-sm text-slate-600">No saved analyses yet.</p>}
      {items.map((entry) => (
        <Card key={entry.input.id}>
          <CardContent className="space-y-2 text-sm">
            <p><strong>{entry.result.verdict}</strong> — {new Date(entry.input.createdAt).toLocaleString()}</p>
            <p>{entry.input.originalReport} → {entry.input.actualReport} ({entry.input.timezone})</p>
            <Button onClick={() => downloadJson(`pilotpay-analysis-${entry.input.id}.json`, entry)}>Export JSON</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
