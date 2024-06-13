import Airtable from 'airtable';


const base = new Airtable({apiKey: process.env.GATSBY_AIRTABLE_ACCESS_TOKEN}).base(process.env.GATSBY_AIRTABLE_BASE_ID);
const table = base(process.env.GATSBY_AIRTABLE_TABLE_NAME);

export function saveToAirtable(initialFormState) {
  return new Promise((resolve, reject) => {

    table.create([
      {
        "fields": {
        "Name": initialFormState.firstName,
        'Surname': initialFormState.surName,
        'Street': initialFormState.street,
        'NumberHome': initialFormState.numberHome,
        'ZipCode': initialFormState.zipCode,
        'City': initialFormState.city,
        'Phone': initialFormState.phone,
        'Mail': initialFormState.email,
        'Profession': initialFormState.profession,
        'NPWZ': initialFormState.profesionNumber,
        'Specialist': initialFormState.specjalist == 'tak' ? true : false,
        'SpecialistAnestezjologii': initialFormState.specialist2 == 'tak' ? true : false,
        'LastCourse': initialFormState.lastcourse == 'tak' ? true : false,
        'InvoiceName': initialFormState.invoiceName,
        'InvoiceStreet': initialFormState.invoiceStreet,
        'InvoiceNumberHome': initialFormState.invoiceNumberHome,
        'InvoiceZipCode': initialFormState.invoiceZipCode,
        'InvoiceCity': initialFormState.invoiceCity,
        'InvoiceNip': initialFormState.invoiceNip,
        'YearSpecialist': initialFormState.yearSpecialist,
        'Dishes': initialFormState.dishes,
        'Breakfast': initialFormState.breakfast === true ? true : false,
        'Dinner': initialFormState.dinner === true ? true : false,
        'Super': initialFormState.super === true ? true : false,
        'Agree':initialFormState.wyrazamZgode === 'on'
        
        }
      },
    ], function(err, records) {
      if (err) {
        reject(err);
        return;
      }
      resolve(records);
    });
  });
}