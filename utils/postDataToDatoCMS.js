import axios from "axios";

const postDataToDatoCMS = async (form) => {
    try {
        

      const response = await axios.post(
        'https://graphql.datocms.com/',
        {
          query: `
            mutation CreateRegisterForm($data: RegisterformModelInput!) {
                createformegister(data: $data) {
                id
                firstname
                surname
                }
            }
          `,
          variables: {
            data: form,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.GATSBY_DATOCMS_API}`, // Zastąp tokenem API DatoCMS
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Api-Version': '3',
          },
        }
      );
      
  
      // Sprawdź, czy odpowiedź zawiera oczekiwane pole
      const createdRecord = response.data.data && response.data.data.createRegisterForm;

      if (!createdRecord || !createdRecord.id) {
        console.error('Błąd: Brak oczekiwanego pola "id" w odpowiedzi z DatoCMS.');
        // Wypisz pełną odpowiedź błędu dla dodatkowych informacji
        console.log('Pełna odpowiedź błędu:', response.data);
        throw new Error('Błąd: Brak oczekiwanego pola "id" w odpowiedzi z DatoCMS.');
      }
    } catch (error) {
        console.error('Błąd podczas zapisywania danych do DatoCMS:', error.response || error.message || error);
      
        // Dodaj ten console.log, aby zobaczyć pełną odpowiedź błędu
        console.log('Pełna odpowiedź błędu:', error.response);
      
        // Rzuć błąd
        throw error;
      }
  };

  export default postDataToDatoCMS