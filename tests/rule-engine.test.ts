import { describe, expect, it } from "vitest";
import { runAnalysis } from "@/lib/rules/engine";
import { AnalysisInput } from "@/lib/types";

const base: AnalysisInput = {
  id: "1",
  createdAt: "2024-01-01T00:00:00.000Z",
  timezone: "America/New_York",
  originalReport: "2024-01-05T08:00",
  originalRelease: "2024-01-05T18:00",
  actualReport: "2024-01-06T06:00",
  actualRelease: "2024-01-06T16:00",
  reserveType: "Short Call",
  hadPhoneCall: false,
  onAirportStandby: false,
  cutIntoDayOff: false,
  lessThanTenRest: "no",
};

describe("runAnalysis", () => {
  it("returns likely legal when thresholds are met", () => {
    const result = runAnalysis(base);
    expect(result.verdict).toBe("Likely Legal");
  });

  it("flags rest violation", () => {
    const result = runAnalysis({ ...base, actualReport: "2024-01-06T01:00" });
    expect(result.verdict).toBe("Possible Violation");
    expect(result.checks.some((c) => c.key === "rest" && c.status === "flag")).toBe(true);
  });

  it("flags possible pay protection when credit drop exceeds threshold", () => {
    const result = runAnalysis({ ...base, originalCredit: 8, actualCredit: 5 });
    expect(result.potentialPremiums.some((p) => p.includes("Possible pay protection"))).toBe(true);
  });
});
