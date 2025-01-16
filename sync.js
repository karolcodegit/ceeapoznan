const axios = require('axios');
require('dotenv').config();

// Fetch books data from DatoCMS
async function getDatoCmsData() {
  const response = await axios.post(
    'https://graphql.datocms.com/',
    {
      query: `
        query {
          allBooks {
            id
            title
            available
          }
        }
      `
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GATSBY_DATOCMS_API}`
      }
    }
  );
  return response.data.data.allBooks;
}

// Update Airtable records
async function updateAirtableRecords(book) {
  const response = await axios.get(`https://api.airtable.com/v0/${process.env.GATSBY_AIRTABLE_BASE_ID}/${process.env.GATSBY_AIRTABLE_TABLE_NAME_NOTIFICATIONBOOK}`, {
    headers: {
      Authorization: `Bearer ${process.env.GATSBY_AIRTABLE_ACCESS_TOKEN}`
    }
  });

  const records = response.data.records;

  records.forEach(async (record) => {
    if (record.fields.title === book.title) {
      await axios.patch(
        `https://api.airtable.com/v0/${process.env.GATSBY_AIRTABLE_BASE_ID}/${process.env.GATSBY_AIRTABLE_TABLE_NAME_NOTIFICATIONBOOK}/${record.id}`,
        {
          fields: {
            Available: 'Dostępny'
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GATSBY_AIRTABLE_ACCESS_TOKEN}`
          }
        }
      );
    }
  });
}

async function main() {
  const books = await getDatoCmsData();

  books.forEach(book => {
    if (book.reprint === true) {
      updateAirtableRecords(book);
    }
  });
}

main().catch(error => console.error(error));