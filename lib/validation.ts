import { z } from "zod";

const optionalNum = z
  .string()
  .optional()
  .transform((value) => (value && value.length > 0 ? Number(value) : undefined))
  .refine((value) => value === undefined || !Number.isNaN(value), "Must be a number");

export const analysisSchema = z.object({
  timezone: z.string().default("America/New_York"),
  originalReport: z.string().min(1),
  originalRelease: z.string().min(1),
  originalBlock: optionalNum,
  originalCredit: optionalNum,
  actualReport: z.string().min(1),
  actualRelease: z.string().min(1),
  actualBlock: optionalNum,
  actualCredit: optionalNum,
  reserveType: z.enum(["Short Call", "Long Call", "Ready Reserve"]),
  hadPhoneCall: z.boolean(),
  onAirportStandby: z.boolean(),
  cutIntoDayOff: z.boolean(),
  lessThanTenRest: z.enum(["yes", "no", "unsure"]),
});

export type AnalysisFormValues = z.infer<typeof analysisSchema>;
