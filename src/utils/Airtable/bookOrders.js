import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.GATSBY_AIRTABLE_ACCESS_TOKEN }).base(process.env.GATSBY_AIRTABLE_BASE_ID);
const table = base(process.env.GATSBY_AIRTABLE_BOOK_ORDER);


async function getAirtableProductIds(items) {
  const resultIds = [];
  for (const item of items) {
    const filterFormula = `{DatoCMS ID} = "${item.id}"`;
    try {
      const records = await base('Products')
        .select({ filterByFormula: filterFormula })
        .firstPage();

      if (records.length > 0) {
        resultIds.push(records[0].id);
      } else {
        console.warn("⚠️ Nie znaleziono produktu w Airtable:", item.id);
      }
    } catch (error) {
      console.error("❌ Błąd podczas pobierania produktów z Airtable:", error);
      throw error;
    }
  }

  return resultIds;
}

// 💾 Zapisz zamówienie do Airtable
 async function saveAirableBookOrders (formData) {
  if (!formData) {
    throw new Error("Brak danych do zapisania!");
  }
  const productIds = await getAirtableProductIds(formData.items);
  const fields = {
    "Order Number": formData.orderNumber,
    // "Order Date": formData.submittedAt, // jeśli chcesz zapisać datę
    "Customer Name": `${formData.customer.firstName} ${formData.customer.lastName}`,
    "Email": formData.customer.email,
    "Phone": formData.customer.phone,
    "Delivery Method": formData.delivery.method,
    "Street": formData.delivery.address?.street || "",
    "City": formData.delivery.address?.city || "",
    "Postcode": formData.delivery.address?.postcode || "",
    "Parcel Locker Code": formData.delivery.parcelLocker?.name || "",
    "Total Price": formData.summary.total,
    "Order Status": "Pending",
    "Products": productIds
  };
  return new Promise((resolve, reject) => {
    table.create([{ fields }], function (err, records) {
      if (err) {
        reject(err);
        return;
      }
      resolve(records);
    });
  });
}

export { saveAirableBookOrders, getAirtableProductIds };