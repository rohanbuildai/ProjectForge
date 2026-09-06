require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env")
});

const { analyzeProject } = require("./services/Ai/aiService");

const run = async () => {
  try {
    const response = await analyzeProject({
      workspaceId: "12",
      projectId: "21",
      userId: "9"
    });

    console.log("ANALYSIS RESPONSE:");
    console.dir(response, { depth: null });

  } catch (error) {
    console.error(error);
  }
};

run();