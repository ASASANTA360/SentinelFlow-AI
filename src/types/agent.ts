export type RiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface RiskResult {
  riskLevel: RiskLevel;
  score: number;
  recommendation: string;
  explanation: string;
}