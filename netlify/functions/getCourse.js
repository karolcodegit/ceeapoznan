const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const endpoint = "https://graphql.datocms.com";
  const query = `
    query {
       allCourses(filter: { available: { eq: true } }) {
        available
        nameCourse
        courseDuration
        courseCost
        date
        description
        detailedInformationAboutTheHotel{
          conditionsOfParticipation
          extras
        }
      }
    }
  `;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GATSBY_DATOCMS_API_READONLY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const text = new TextDecoder("utf-8").decode(buffer); // Dekodowanie UTF-8
    const data = JSON.parse(text);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(data, null, 2),
    };
  } catch (error) {
    console.error("Request failed. Error details:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong",
        details: error.message,
      }),
    };
  }
};