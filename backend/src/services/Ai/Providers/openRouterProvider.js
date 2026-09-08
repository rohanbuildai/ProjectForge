const axios = require("axios");

const generate = async ({ prompt }) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-v4-flash-0731",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
    );

    const content = response?.data?.choices?.[0]?.message?.content;

    if (typeof content !== "string" || content.trim() === "") {
      throw new Error("AI provider returned an invalid response");
    }

    return content;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        throw new Error("AI provider authentication failed");
      }

      if (status === 402) {
        throw new Error("AI provider credits are unavailable");
      }

      if (status === 429) {
        throw new Error("AI provider rate limit exceeded");
      }

      if (status >= 500) {
        throw new Error("AI provider is currently unavailable");
      }
    }

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      throw new Error("AI provider request timed out");
    }

    if (!error.response) {
      throw new Error("Unable to connect to AI provider");
    }

    throw error;
  }
};

module.exports = {
  generate,
};
