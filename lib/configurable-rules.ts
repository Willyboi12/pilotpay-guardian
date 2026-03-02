/**
 * CONFIGURABLE RULES
 * Update these thresholds and placeholder labels as contract language evolves.
 */
export const RULES_CONFIG = {
  MIN_REST_HOURS: 10,
  MAX_DUTY_HOURS: 14,
  MAX_EARLY_SHIFT_HOURS: 2,
  MAX_LATE_SHIFT_HOURS: 2,
  CREDIT_DROP_THRESHOLD: 1.0,
  DAY_OFF_ENCROACHMENT_FLAG: "Possible day-off encroachment",
  PAY_PROTECTION_LABEL: "Possible pay protection",
} as const;
