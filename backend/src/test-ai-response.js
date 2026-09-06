const {
  parseProjectAnalysis
} = require("./services/Ai/aiResponseService");

const test = (name, response) => {
  try {
    parseProjectAnalysis({ response });

    console.log(`✅ ${name} - PASSED`);
  } catch (error) {
    console.log(`❌ ${name} - ${error.message}`);
  }
};

console.log("Running AI response validation tests...\n");

// Test 1 — Invalid JSON
test(
  "Invalid JSON",
  "this is not valid json"
);

// Test 2 — Invalid health
test(
  "Invalid health",
  JSON.stringify({
    health: "BANANA",
    summary: "test",
    risks: [],
    bottlenecks: [],
    overdueItems: [],
    recommendations: []
  })
);

// Test 3 — Invalid overdue item
test(
  "Invalid overdue item",
  JSON.stringify({
    health: "CRITICAL",
    summary: "test",
    risks: [],
    bottlenecks: [],
    overdueItems: [
      {
        id: "wrong"
      }
    ],
    recommendations: []
  })
);

// Test 4 — Valid response
test(
  "Valid response",
  JSON.stringify({
    health: "CRITICAL",
    summary: "The project has an overdue task.",
    risks: [
      "The only task is overdue."
    ],
    bottlenecks: [
      "No work is currently in progress."
    ],
    overdueItems: [
      {
        id: 70,
        title: "b nxg",
        status: "todo",
        priority: "medium",
        dueDate: "2026-08-31T18:30:00.000Z",
        assignee: "chauhan"
      }
    ],
    recommendations: [
      "Start the overdue task immediately."
    ]
  })
);