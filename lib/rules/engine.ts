import { differenceInMinutes, formatISO } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { RULES_CONFIG } from "@/lib/configurable-rules";
import { AnalysisInput, AnalysisResult, RuleResult } from "@/lib/types";
import { buildDisputeMessage } from "@/lib/message";

function toUtc(dateTimeLocal: string, timezone: string): Date {
  return fromZonedTime(dateTimeLocal, timezone);
}

function hoursBetween(start: Date, end: Date): number {
  return differenceInMinutes(end, start) / 60;
}

export function runAnalysis(input: AnalysisInput): AnalysisResult {
  const checks: RuleResult[] = [];

  const originalReport = toUtc(input.originalReport, input.timezone);
  const originalRelease = toUtc(input.originalRelease, input.timezone);
  const actualReport = toUtc(input.actualReport, input.timezone);
  const actualRelease = toUtc(input.actualRelease, input.timezone);

  const restHours = hoursBetween(originalRelease, actualReport);
  const actualDutyHours = hoursBetween(actualReport, actualRelease);
  const reportShiftHours = hoursBetween(actualReport, originalReport);
  const releaseShiftHours = hoursBetween(originalRelease, actualRelease);

  checks.push({
    key: "rest",
    status: restHours >= RULES_CONFIG.MIN_REST_HOURS ? "pass" : "flag",
    title: `Rest check ≥ ${RULES_CONFIG.MIN_REST_HOURS}h`,
    detail: `Computed rest: ${restHours.toFixed(2)}h between original release (${formatISO(originalRelease)}) and actual report (${formatISO(actualReport)}).`,
  });

  checks.push({
    key: "duty",
    status: actualDutyHours <= RULES_CONFIG.MAX_DUTY_HOURS ? "pass" : "flag",
    title: `Duty period ≤ ${RULES_CONFIG.MAX_DUTY_HOURS}h`,
    detail: `Computed duty: ${actualDutyHours.toFixed(2)}h from report to release.`,
  });

  if (input.cutIntoDayOff) {
    checks.push({
      key: "day-off",
      status: "review",
      title: RULES_CONFIG.DAY_OFF_ENCROACHMENT_FLAG,
      detail: "User indicated reassignment touched a scheduled day off.",
    });
  }

  if (Math.abs(reportShiftHours) > RULES_CONFIG.MAX_EARLY_SHIFT_HOURS && reportShiftHours < 0) {
    checks.push({
      key: "early-shift",
      status: "review",
      title: "Report moved earlier",
      detail: `Actual report is ${Math.abs(reportShiftHours).toFixed(2)}h earlier than original.`,
    });
  }

  if (releaseShiftHours > RULES_CONFIG.MAX_LATE_SHIFT_HOURS) {
    checks.push({
      key: "late-shift",
      status: "review",
      title: "Release moved later",
      detail: `Actual release is ${releaseShiftHours.toFixed(2)}h later than original.`,
    });
  }

  const potentialPremiums: string[] = [];
  if (
    typeof input.originalCredit === "number" &&
    typeof input.actualCredit === "number" &&
    input.originalCredit - input.actualCredit > RULES_CONFIG.CREDIT_DROP_THRESHOLD
  ) {
    potentialPremiums.push(
      `${RULES_CONFIG.PAY_PROTECTION_LABEL}: credit dropped from ${input.originalCredit.toFixed(2)} to ${input.actualCredit.toFixed(2)}.`,
    );
    checks.push({
      key: "credit-drop",
      status: "review",
      title: RULES_CONFIG.PAY_PROTECTION_LABEL,
      detail: `Credit drop ${(input.originalCredit - input.actualCredit).toFixed(2)} exceeds threshold ${RULES_CONFIG.CREDIT_DROP_THRESHOLD.toFixed(2)}.`,
    });
  }

  if (input.hadPhoneCall) potentialPremiums.push("CONFIGURABLE RULE: Call-out/contact premium may apply.");
  if (input.onAirportStandby) potentialPremiums.push("CONFIGURABLE RULE: Airport standby reassignment premium may apply.");
  if (input.lessThanTenRest === "yes") potentialPremiums.push("Potential FAR 117 rest exception concern noted by pilot.");
  if (input.lessThanTenRest === "unsure") potentialPremiums.push("Pilot marked rest status as unsure; requires manual review.");

  const hasFlag = checks.some((c) => c.status === "flag");
  const hasReview = checks.some((c) => c.status === "review");
  const verdict = hasFlag ? "Possible Violation" : hasReview ? "Needs Review" : "Likely Legal";

  const message = buildDisputeMessage(input, checks, potentialPremiums);

  return {
    verdict,
    checks,
    potentialPremiums,
    expectedCredit: input.originalCredit,
    actualCredit: input.actualCredit,
    message,
  };
}
