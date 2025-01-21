require('dotenv').config();
exports.handler = async function (event, context) {
  const { request } = await import('graphql-request');
  const endpoint = "https://graphql.datocms.com";
  const query = `
    query {
        allCourses {
            nameCourse
            courseDuration
            courseCost
            date
            description
        }
    }
  `;

  try {
    console.log('Sending request to DatoCMS...');
    const data = await request(endpoint, query, {
      headers: {
        Authorization: `Bearer ${process.env.GATSBY_DATOCMS_API_READONLY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    console.log('Response from DatoCMS:', data);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Request failed. Error details:", error.response || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong",
        details: error.response || error.message,
      }),
    };
  }
};