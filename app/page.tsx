"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { analysisSchema, AnalysisFormValues } from "@/lib/validation";
import { runAnalysis } from "@/lib/rules/engine";
import { AnalysisInput, AnalysisResult } from "@/lib/types";
import { saveHistory } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const timezones = ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "UTC"];

export default function HomePage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<AnalysisFormValues>({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      timezone: "America/New_York",
      reserveType: "Short Call",
      hadPhoneCall: false,
      onAirportStandby: false,
      cutIntoDayOff: false,
      lessThanTenRest: "unsure",
    },
  });

  const onSubmit = (data: AnalysisFormValues) => {
    const input: AnalysisInput = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...data,
    };
    const analysis = runAnalysis(input);
    saveHistory({ input, result: analysis });
    setResult(analysis);
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold">Analyze a Reassignment</h2>
        <p className="text-sm text-slate-600">Fast legality + pay-protection triage in under a minute.</p>
      </section>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1">Base/Time zone
              <select {...register("timezone")}>{timezones.map((tz) => <option key={tz}>{tz}</option>)}</select>
            </label>

            <label className="flex flex-col gap-1">Reserve type
              <select {...register("reserveType")}><option>Short Call</option><option>Long Call</option><option>Ready Reserve</option></select>
            </label>

            <label className="flex flex-col gap-1">Original report <input type="datetime-local" {...register("originalReport")} /></label>
            <label className="flex flex-col gap-1">Original release <input type="datetime-local" {...register("originalRelease")} /></label>
            <label className="flex flex-col gap-1">Original block (optional) <input type="number" step="0.1" {...register("originalBlock")} /></label>
            <label className="flex flex-col gap-1">Original credit (optional) <input type="number" step="0.1" {...register("originalCredit")} /></label>
            <label className="flex flex-col gap-1">Actual report <input type="datetime-local" {...register("actualReport")} /></label>
            <label className="flex flex-col gap-1">Actual release <input type="datetime-local" {...register("actualRelease")} /></label>
            <label className="flex flex-col gap-1">Actual block (optional) <input type="number" step="0.1" {...register("actualBlock")} /></label>
            <label className="flex flex-col gap-1">Actual credit (optional) <input type="number" step="0.1" {...register("actualCredit")} /></label>

            <label className="flex items-center justify-between rounded-md border p-2">Was there a phone call?<input type="checkbox" {...register("hadPhoneCall")} /></label>
            <label className="flex items-center justify-between rounded-md border p-2">On airport standby?<input type="checkbox" {...register("onAirportStandby")} /></label>
            <label className="flex items-center justify-between rounded-md border p-2">Cut into scheduled day off?<input type="checkbox" {...register("cutIntoDayOff")} /></label>

            <label className="flex flex-col gap-1">Received less than 10h rest?
              <select {...register("lessThanTenRest")}><option value="yes">Yes</option><option value="no">No</option><option value="unsure">I'm not sure</option></select>
            </label>

            <div className="md:col-span-2">
              <Button type="submit">Analyze</Button>
              {Object.keys(errors).length > 0 && <p className="mt-2 text-sm text-red-600">Please fill required date fields and numeric inputs.</p>}
            </div>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Verdict</h3>
              <Badge
                label={result.verdict}
                tone={result.verdict === "Likely Legal" ? "success" : result.verdict === "Possible Violation" ? "danger" : "warning"}
              />
            </div>

            <section className="space-y-2">
              <h4 className="font-medium">Why</h4>
              {result.checks.map((c) => (
                <div key={c.key} className="rounded-md border p-3 text-sm">
                  <p className="font-medium">{c.title} — {c.status.toUpperCase()}</p>
                  <p className="text-slate-600">{c.detail}</p>
                </div>
              ))}
            </section>

            <section>
              <h4 className="font-medium">Pay / Premium</h4>
              <p className="text-sm text-slate-600">Expected credit: {result.expectedCredit ?? "n/a"} | Actual credit: {result.actualCredit ?? "n/a"}</p>
              <ul className="list-disc pl-5 text-sm">
                {result.potentialPremiums.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </section>

            <section className="space-y-2">
              <h4 className="font-medium">Message Generator</h4>
              <textarea className="min-h-56 w-full rounded-md border p-3 text-sm" value={result.message} readOnly />
              <Button type="button" onClick={() => navigator.clipboard.writeText(result.message)}>Copy message</Button>
            </section>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
