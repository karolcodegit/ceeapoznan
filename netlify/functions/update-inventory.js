const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let items;
  try {
    const payload = JSON.parse(event.body);
    items = payload.items;
  } catch (err) {
    console.error('Błąd parsowania body:', err);
    return { statusCode: 400, body: JSON.stringify({ error: 'Nieprawidłowy JSON' }) };
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Brak produktów' }) };
  }

  const token = process.env.GATSBY_DATOCMS_API; // Użyj tej zmiennej w Netlify!

  if (!token) {
    console.error('Brak DATOCMS_TOKEN');
    return { statusCode: 500, body: JSON.stringify({ error: 'Brak tokena' }) };
  }

  const datoClient = axios.create({
    baseURL: 'https://site-api.datocms.com',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Api-Version': '3',
    },
  });

  try {
    for (const item of items) {
      const { id: bookId, quantity } = item;

      if (!bookId || !quantity || quantity <= 0) continue;

      console.log(`Aktualizacja książki ${bookId}, -${quantity}`);

      // Pobierz bieżący rekord (aby dostać item_type)
      const getRes = await datoClient.get(`/items/${bookId}`);
      const itemTypeId = getRes.data.data.relationships.item_type.data.id;
      const currentStock = getRes.data.data.attributes.stock_quantity || 0;

      if (currentStock < quantity) {
        console.error(`Niewystarczający stock: ${currentStock} < ${quantity}`);
        continue;
      }

      const newStock = currentStock - quantity;

      // PATCH z pełnym payloadem
      await datoClient.patch(`/items/${bookId}`, {
        data: {
          id: bookId,
          type: "item",
          attributes: {
            stock_quantity: newStock
          },
          relationships: {
            item_type: {
              data: {
                type: "item_type",
                id: itemTypeId
              }
            }
          }
        }
      });

      console.log(`Stock zaktualizowany: ${currentStock} → ${newStock}`);
    }

    // <<< DODANY KOD – TRIGGER REBUILD NETLIFY >>>
    const buildHookUrl = 'https://api.netlify.com/build_hooks/694be3eff2ba81cd03e821f1'; // ← Twój aktualny hook z screena

    try {
      const rebuildResponse = await fetch(buildHookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (rebuildResponse.ok) {
        console.log('✅ Rebuild strony w Netlify uruchomiony pomyślnie');
      } else {
        console.error('❌ Błąd przy triggerowaniu rebuilda:', await rebuildResponse.text());
      }
    } catch (triggerErr) {
      console.error('❌ Błąd sieci przy triggerowaniu rebuilda:', triggerErr);
    }
    // <<< KONIEC DODANEGO KODU >>>

    return { statusCode: 200, body: JSON.stringify({ message: 'Stock zaktualizowany!' }) };
  } catch (error) {
    console.error('Błąd DatoCMS:', error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Błąd aktualizacji', details: error.response?.data || error.message })
    };
  }
};