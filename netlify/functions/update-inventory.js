const axios = require('axios'); // Netlify Functions obsługują Node.js, więc możesz użyć axios do API calls

exports.handler = async (event) => {
  try {
    const { items } = JSON.parse(event.body); // Odbieramy items z POST body
    const DATOCMS_TOKEN = process.env.GATSBY_DATOCMS_API; // Zmienna środowiskowa
    const DATOCMS_API_URL = 'https://site-api.datocms.com/items/'; // Base URL dla REST API DatoCMS (dla GraphQL użyj /graphql)

    if (!items || !Array.isArray(items)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Brak items w payloadzie' }) };
    }

    // Sekwencyjnie update'uj każdy item (możesz użyć Promise.all dla prędkości, ale ryzykujesz konflikty)
    for (const item of items) {
      const { id: bookId, quantity } = item; // Zakładam, że id to ID rekordu w DatoCMS

      // Pobierz bieżący rekord książki (aby dostać aktualny stockQuantity)
      const getResponse = await axios.get(`${DATOCMS_API_URL}${bookId}`, {
        headers: { Authorization: `Bearer ${DATOCMS_TOKEN}` },
      });
      const currentStock = getResponse.data.data.attributes.stockQuantity || 0;

      if (currentStock < quantity) {
        // Opcjonalnie: rzuć błąd lub loguj, jeśli brak stocku
        console.error(`Niewystarczający stock dla książki ${bookId}`);
        continue; // Kontynuuj dla innych items
      }

      // Update stock
      const newStock = currentStock - quantity;
      await axios.put(`${DATOCMS_API_URL}${bookId}`, {
        data: {
          type: 'item',
          attributes: { stockQuantity: newStock },
        },
      }, {
        headers: { Authorization: `Bearer ${DATOCMS_TOKEN}` },
      });
    }

    return { statusCode: 200, body: JSON.stringify({ message: 'Stock zaktualizowany' }) };
  } catch (error) {
    console.error('Błąd update stock:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Błąd serwera' }) };
  }
};