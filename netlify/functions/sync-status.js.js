const axios = require("axios");

exports.handler = async function (event, context) {
  const statusChangeEvent = JSON.parse(event.body); // Zakładając, że dane przychodzą w body
  
  if (statusChangeEvent.status === "true") {  // Sprawdzamy, czy status się zmienił na true
    const repository_dispatch = {
      event_type: "build_and_deploy", // Typ zdarzenia dla dispatch
    };

    const github_token = process.env.TOKEN_GITHUB; // Token GitHub
    const repo = "karolcodegit/ceeapoznan"; // Twoje repozytorium GitHub

    const url = `https://api.github.com/repos/${repo}/dispatches`; // URL dla dispatch

    const headers = {
      Authorization: `token ${github_token}`,
      Accept: "application/vnd.github.v3+json",
    };

    try {
      const response = await axios.post(url, repository_dispatch, {
        headers: headers,
      });
      console.log("Workflow dispatched successfully");
      return { statusCode: 200, body: "Workflow dispatched successfully" };
    } catch (error) {
      console.error("Error dispatching workflow:", error.message);
      console.error("Error stack:", error.stack);
      return {
        statusCode: 500,
        body: `Error dispatching workflow: ${error.message}`,
      };
    }
  } else {
    // Jeśli status nie jest zmieniony na "true"
    return {
      statusCode: 200,
      body: "Status not updated, skipping dispatch",
    };
  }
};