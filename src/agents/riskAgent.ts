import { ai } from "../lib/gemini";

export async function riskAgent(data: any) {

  const prompt = `
You are an enterprise risk analyst.

Analyze:

${JSON.stringify(data)}

Return JSON only:

{
"riskLevel":"",
"score":0,
"recommendation":"",
"explanation":""
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
}