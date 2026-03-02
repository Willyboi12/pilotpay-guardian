import { AnalysisInput, RuleResult } from "@/lib/types";

export function buildDisputeMessage(input: AnalysisInput, checks: RuleResult[], premiums: string[]): string {
  const issues = checks.filter((c) => c.status !== "pass");

  return `Hello Scheduling/Pay Support,\n\nI am requesting clarification on a reserve reassignment for ${input.reserveType} reserve.\n\nSummary:\n- Base timezone: ${input.timezone}\n- Original assignment: ${input.originalReport} to ${input.originalRelease}\n- Actual sequence: ${input.actualReport} to ${input.actualRelease}\n- Phone call: ${input.hadPhoneCall ? "Yes" : "No"}\n- Airport standby: ${input.onAirportStandby ? "Yes" : "No"}\n\nPotential concerns identified:\n${issues.map((i) => `- ${i.title}: ${i.detail}`).join("\n") || "- No rule exceptions auto-flagged; requesting confirmation."}\n\nPotential pay/premium considerations:\n${premiums.map((p) => `- ${p}`).join("\n") || "- None auto-flagged from provided data."}\n\nPlease confirm whether this reassignment is compliant and whether any applicable pay protection or premium adjustments should be applied.\n\nThank you.`;
}
