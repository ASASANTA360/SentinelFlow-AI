import { documentAgent } from "./documentAgent";
import { riskAgent } from "./riskAgent";
import { exceptionAgent } from "./exceptionAgent";
import { resolutionAgent } from "./resolutionAgent";

export async function caseBrainAgent(data:any){

  const document = await documentAgent(data);

  const riskText = await riskAgent(document);

  // riskAgent may return undefined; default to an empty object string for JSON.parse
  let risk;

try {
  risk = JSON.parse(riskText ?? "{}");
} catch {
  risk = {
    riskLevel: "medium",
    score: 50,
    recommendation: "manual_review",
    explanation: "Unable to parse AI response",
  };
}

  const exception = await exceptionAgent(
    risk.score
  );

  const resolution = await resolutionAgent(
    exception.exception
  );

  return {
    document,
    risk,
    exception,
    resolution
  }

}