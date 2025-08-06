import { renderEmailTemplate } from "./renderEmailTemplate";

const sendOrderDataToCloudFunction = async (orderData) => {

  const emailHtmlToYou = renderEmailTemplate("orderConfirmation", {
    firstName: orderData.customer.firstName,
    lastName: orderData.customer.lastName,
    orderNumber: orderData.customer.orderNumber,
    totalPrice: orderData.summary.total,
  });

  const emailHtmlToUser = renderEmailTemplate("orderConfirmation", {
    firstName: orderData.customer.firstName,
    lastName: orderData.customer.lastName,
    orderNumber: orderData.customer.orderNumber,
    totalPrice: orderData.summary.total,
  });

  try {
    const payload = {
      toYou: {
        to: "sekretariat@ceea.org.pl",
        subject: `Nowa wiadomość od ${orderData.customer.firstName} ${orderData.customer.lastName}`,
        html: emailHtmlToYou,
      },
      toUser: {
        to: orderData.customer.email,
        subject: "Dziękujemy za przesłanie formularza",
        html: emailHtmlToUser,
      },
    };

    const response = await fetch("https://us-central1-ceea-poznan-426120.cloudfunctions.net/sendgrid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP status: ${response.status}`);
    }

  } catch (error) {
    console.error("Błąd podczas wysyłania e-maila:", error.message);
  }
};