const axios = require("axios");

exports.handler = async function (event, context) {
  const repository_dispatch = {
    event_type: "build_and_deploy", // The type of repository_dispatch event
  };

  const github_token = process.env.TOKEN_GITHUB; // Your GitHub token
  const repo = "karolcodegit/ceeapoznan"; // Your GitHub username and repository

  const url = `https://api.github.com/repos/${repo}/dispatches`; // Updated URL for repository_dispatch

  const headers = {
    Authorization: `token ${github_token}`,
    Accept: "application/vnd.github.v3+json",
  };

  try {
    const response = await axios.post(url, repository_dispatch, {
      headers: headers,
    });
    return { statusCode: 200, body: "Workflow dispatched successfully" };
  } catch (error) {
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return {
      statusCode: 500,
      body: `Error dispatching workflow: ${error.message}`,
    };
  }
};
