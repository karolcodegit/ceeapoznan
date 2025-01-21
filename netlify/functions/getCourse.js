exports.handler = async function(event, context) {
    const { request } = await import('graphql-request');
    
    const endpoint = 'https://graphql.datocms.com/'; // Adres API
    const API_KEY = process.env.API_DATOCMS;

    // Logowanie do sprawdzenia, czy zmienna środowiskowa jest dostępna
    console.log('API Key:', API_KEY);

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
      const data = await request(endpoint, query, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`, // Użyj swojego tokenu API
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    
      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Something went wrong', details: error.message })
      };
    }
};