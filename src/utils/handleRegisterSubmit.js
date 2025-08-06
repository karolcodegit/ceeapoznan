import { renderEmailTemplate } from "./renderEmailTemplate"
import { generateOrderNumber } from "./generateOrderNumber";
import { saveToAirtable } from "./airtable";


export const handleRegisterSubmit = async (
  registerData,
  apiEndpoint,
  navigate
) => {
  try {
    const orderNumber = generateOrderNumber();
    const currentPath = window.location.pathname.replace(/\/$/, ""); // Usuń końcowy ukośnik, jeśli istnieje

    const fullOrderData = {
      ...registerData,
      orderNumber,
    };

    // Natychmiastowe przekierowanie użytkownika
    navigate(`${currentPath}/formularz-wyslany`);

    // Operacje w tle
    const performBackgroundTasks = async () => {
      try {
        // Zapis do Airtable
        await saveToAirtable(fullOrderData);

        // Generowanie treści e-maili za pomocą szablonów
        const emailHtmlToYou = renderEmailTemplate("CourseConfirmation", {
          courseTitle: registerData.courseTitle,
          firstName: registerData.firstName,
          surName: registerData.surName,
          street: registerData.street,
          numberHome: registerData.numberHome,
          zipCode: registerData.zipCode,
          city: registerData.city,
          email: registerData.email,
          phone: registerData.phone,
          birthday: registerData.birthday,
          invoiceName: registerData.invoiceName,
          invoiceStreet: registerData.invoiceStreet,
          invoiceNumberHome: registerData.invoiceNumberHome,
          invoiceZipCode: registerData.invoiceZipCode,
          invoiceCity: registerData.invoiceCity,
          invoiceNip: registerData.invoiceNip,
          dishes: registerData.dishes,
          total: registerData.total,
          orderNumber,
        });

        const emailHtmlToUser = renderEmailTemplate("CourseConfirmationUser", {
          name: registerData.name,
          email: registerData.email,
          courseTitle: registerData.courseTitle,
          total: registerData.total,
          orderNumber,
        });

        // Przygotowanie payload do wysyłki do Google Cloud Functions
        const payload = {
          toYou: {
            to: "sekretariat@ceea.org.pl",
            subject: `Zapisano na kurs ${registerData.courseTitle}`,
            html: emailHtmlToYou,
          },
          toUser: {
            to: registerData.email,
            subject: "Serdecznie dziękujemy za zainteresowanie naszym kursem",
            html: emailHtmlToUser,
          },
        };

        console.log("📦 Payload wysyłany do API:", payload);

        // Wysłanie danych do API
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Błąd odpowiedzi z API:", errorText);
          throw new Error(`HTTP status: ${response.status}`);
        }
      } catch (error) {
        console.error("❌ Błąd podczas operacji w tle:", error);
      }
    };

    // Uruchomienie operacji w tle
    performBackgroundTasks();
  } catch (error) {
    console.error("❌ Błąd podczas wysyłania formularza:", error);
    throw error;
  }
};