import Airtable from 'airtable';


const base = new Airtable({apiKey: process.env.GATSBY_AIRTABLE_ACCESS_TOKEN}).base(process.env.GATSBY_AIRTABLE_BASE_ID);
const table = base(process.env.GATSBY_AIRTABLE_TABLE_NAME);

export function saveToAirtable(enrichedForm) {
  return new Promise((resolve, reject) => {
    console.log('Enriched form data before Airtable save:', enrichedForm);
    table.create([
      {
        "fields": {
        "Name": enrichedForm.firstName,
        'Surname': enrichedForm.surName,
        'Street': enrichedForm.street,
        'NumberHome': enrichedForm.numberHome,
        'ZipCode': enrichedForm.zipCode,
        'City': enrichedForm.city,
        'Phone': enrichedForm.phone,
        'Mail': enrichedForm.email,
        'Profession': enrichedForm.profession,
        'NPWZ': enrichedForm.profesionNumber,
        'Specialist': enrichedForm.specjalist == 'tak' ? true : false,
        'SpecialistAnestezjologii': enrichedForm.specialist2 == 'tak' ? true : false,
        'LastCourse': enrichedForm.lastcourse == 'tak' ? true : false,
        'InvoiceName': enrichedForm.invoiceName,
        'InvoiceStreet': enrichedForm.invoiceStreet,
        'InvoiceNumberHome': enrichedForm.invoiceNumberHome,
        'InvoiceZipCode': enrichedForm.invoiceZipCode,
        'InvoiceCity': enrichedForm.invoiceCity,
        'InvoiceNip': enrichedForm.invoiceNip,
        'YearSpecialist': enrichedForm.yearSpecialist,
        'Dishes': enrichedForm.dishes,
        'Birthday': enrichedForm.birthday,
        'Option1': enrichedForm.option1 === true ? true : false,
        'Option2': enrichedForm.option2 === true ? true : false,
        'Option3': enrichedForm.option3 === true ? true : false,
        'Agree':enrichedForm.wyrazamZgode === 'on',
        'CourseTitle': enrichedForm.courseTitle,
        'Total': enrichedForm.total
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