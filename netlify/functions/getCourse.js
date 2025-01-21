exports.handler = async function (event, context) {
    const { request } = await import("graphql-request");
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
      console.log("Sending request to DatoCMS...");
      console.log("Token:", process.env.DATOCMS_API_READONLY);
      const data = await request(endpoint, query, {
        headers: {
          'Authorization': `Bearer ${process.env.DATOCMS_API_READONLY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Api-Version': '3'
        },
      });
      console.log("Response from DatoCMS:", data);
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    } catch (error) {
      console.error(
        "Request failed. Error details:",
        error.response || error.message
      );
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Something went wrong",
          details: error.response || error.message,
        }),
      };
    }
  };
  