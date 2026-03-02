export type ReserveType = "Short Call" | "Long Call" | "Ready Reserve";

export type AnalysisInput = {
  id: string;
  createdAt: string;
  timezone: string;
  originalReport: string;
  originalRelease: string;
  originalBlock?: number;
  originalCredit?: number;
  actualReport: string;
  actualRelease: string;
  actualBlock?: number;
  actualCredit?: number;
  reserveType: ReserveType;
  hadPhoneCall: boolean;
  onAirportStandby: boolean;
  cutIntoDayOff: boolean;
  lessThanTenRest: "yes" | "no" | "unsure";
};

export type RuleResult = {
  key: string;
  status: "pass" | "flag" | "review";
  title: string;
  detail: string;
};

export type AnalysisResult = {
  verdict: "Likely Legal" | "Possible Violation" | "Needs Review";
  checks: RuleResult[];
  potentialPremiums: string[];
  expectedCredit?: number;
  actualCredit?: number;
  message: string;
};
