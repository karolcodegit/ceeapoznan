import Airtable from 'airtable';

const base = new Airtable({apiKey: process.env.GATSBY_AIRTABLE_ACCESS_TOKEN}).base(process.env.GATSBY_AIRTABLE_BASE_ID);
const table = base(process.env.GATSBY_AIRTABLE_TABLE_NAME_ORDER);

export function saveAirableOrderBook(enrichedForm) {
    // console.log("Zawartość enrichedForm przekazywanego do Airtable:", enrichedForm);
    return new Promise((resolve, reject) => {
      if (!enrichedForm) {
        reject("Brak danych do zapisania!");
        return;
      }
  
      // Przygotowanie danych do zapisu
      const fields = {
        'Name': enrichedForm.name,
        'Surname': enrichedForm.surname,
        'Email': enrichedForm.email,
        'Phone': enrichedForm.phone,
        'Title': enrichedForm.title,
        'Delivery': enrichedForm.delivery,
        'Street': enrichedForm.streetDelivery || "", // Obsługa pustych wartości
        'City': enrichedForm.cityDelivery || "",
        'Postcode': enrichedForm.postcodeDelivery || "",
        // Pola paczkomatu tylko, jeśli enrichedForm.parcelLocker istnieje
        'Name_Paczkomat': enrichedForm.parcelLocker?.name || "",
        'Address_Street_ParcelLocer': enrichedForm.parcelLocker?.address?.street || "",
        'Address_Building_Number_ParcelLocer': enrichedForm.parcelLocker?.address?.building_number || "",
        'Address_City_ParcelLocer': enrichedForm.parcelLocker?.address?.city || "",
        'Address_PostCode_ParcelLocer': enrichedForm.parcelLocker?.address?.post_code || "",
        'OrderNumber': enrichedForm.orderNumber,
        'Quantity': enrichedForm.quantity,
        'Total': enrichedForm.price
      };
  
      table.create([{ fields }], function (err, records) {
        if (err) {
          reject(err);
          return;
        }
        resolve(records);
      });
    });
  }