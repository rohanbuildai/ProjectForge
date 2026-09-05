const buildProjectAnalysisPrompt = ( { context } ) => {
  return `
You are an AI project management analyst.

Analyze the provided project context and identify the project's current health, risks, bottlenecks, overdue work, and actionable recommendations.

Use only the information provided in the project context.
Do not invent facts or assume information that is not present.

PROJECT CONTEXT:
${JSON.stringify(context, null, 2)}

Return the analysis as JSON with exactly this structure:

{
  "health": "HEALTHY | AT_RISK | CRITICAL",
  "summary": "string",
  "risks": [],
  "bottlenecks": [],
  "overdueItems": [],
  "recommendations": []
}
`;
};

module.exports = {
  buildProjectAnalysisPrompt
};