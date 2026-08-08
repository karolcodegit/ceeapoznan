import Airtable from 'airtable';

const base = new Airtable({apiKey: process.env.GATSBY_AIRTABLE_ACCESS_TOKEN}).base(process.env.GATSBY_AIRTABLE_BASE_ID);
const table = base(process.env.GATSBY_AIRTABLE_TABLE_NAME_NOTIFICATIONBOOK);

export function saveAirableNotificationBook(enrichedForm) {
    // console.log("Zawartość enrichedForm przekazywanego do Airtable:", enrichedForm);
    return new Promise((resolve, reject) => {
      if (!enrichedForm) {
        reject("Brak danych do zapisania!");
        return;
      }

      // Ustawienie statusu domyślnie na 'Oczekujący'
      const status = 'Oczekujący';
      const available = 'Niedostępny'
  
      // Przygotowanie danych do zapisu
      const fields = {
        'Title': enrichedForm.bookTitle,
        'Mail': enrichedForm.email,
        'Status': status,
        'Available': available
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