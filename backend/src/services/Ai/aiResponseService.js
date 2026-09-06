const parseProjectAnalysis = ({ response }) => {
  let parsedResponse;

  try {
    parsedResponse = JSON.parse(response);
  } catch (error) {
    throw new Error("AI returned invalid JSON");
  }

  const validHealthStatuses = ["HEALTHY", "AT_RISK", "CRITICAL"];

  if (!validHealthStatuses.includes(parsedResponse.health)) {
    throw new Error("AI returned an invalid health status");
  }

  if (typeof parsedResponse.summary !== "string") {
    throw new Error("AI returned an invalid summary");
  }

  if (!Array.isArray(parsedResponse.risks)) {
    throw new Error("AI returned invalid risks");
  }

  if (!Array.isArray(parsedResponse.bottlenecks)) {
    throw new Error("AI returned invalid bottlenecks");
  }

  if (!Array.isArray(parsedResponse.overdueItems)) {
    throw new Error("AI returned invalid overdue items");
  }

  if (!Array.isArray(parsedResponse.recommendations)) {
    throw new Error("AI returned invalid recommendations");
  }

  for (const item of parsedResponse.overdueItems) {
    if (
      typeof item !== "object" ||
      item === null ||
      typeof item.id !== "number" ||
      typeof item.title !== "string" ||
      typeof item.status !== "string" ||
      typeof item.priority !== "string" ||
      typeof item.dueDate !== "string"
    ) {
      throw new Error("AI returned invalid overdue item");
    }

    for (const risk of parsedResponse.risks) {
      if (typeof risk !== "string") {
        throw new Error("AI returned an invalid risk");
      }
    }

    for (const bottleneck of parsedResponse.bottlenecks) {
      if (typeof bottleneck !== "string") {
        throw new Error("AI returned an invalid bottleneck");
      }
    }

    for (const recommendation of parsedResponse.recommendations) {
      if (typeof recommendation !== "string") {
        throw new Error("AI returned an invalid recommendation");
      }
    }

    if (item.assignee !== null && typeof item.assignee !== "string") {
      throw new Error("AI returned invalid overdue item assignee");
    }
  }

  return parsedResponse;
};

module.exports = {
  parseProjectAnalysis,
};
