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

All output must be in English.

Follow the requested JSON structure exactly.
Do not add, remove, rename, or change the type of fields.

For overdueItems:
- id must be the task ID from the provided context.
- title must be the task title.
- status must come from the provided task.
- priority must come from the provided task.
- dueDate must come from the provided task.
- assignee must be the assignee's name as a string, or null if unassigned.

Do not invent task IDs, names, dates, or other project data.
`;
};

module.exports = {
  buildProjectAnalysisPrompt
};