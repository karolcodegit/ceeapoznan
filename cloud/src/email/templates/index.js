// cloud/src/email/templates/index.js — rejestr szablonów maili chmury
// Sygnatury identyczne ze starym emails.js – require("./emails") działa bez zmian.
const courseConfirmationTransfer = require("./course").confirmationTransfer;
const paymentSuccess = require("./payment").success;
const organizerNotification = require("./payment").organizerNotification;
const contactConfirmation = require("./contact").confirmation;
const { orderConfirmationTransfer, orderConfirmationOnline, orderOrganizer, notifyConfirmation
} = require("./book");
const contactOrganizer = require("./contact").organizer;


module.exports = {
  courseConfirmationTransfer,
  paymentSuccess,
  organizerNotification,
  contactConfirmation,
  contactOrganizer,
  bookOrderConfirmationTransfer: orderConfirmationTransfer,
  bookOrderConfirmationOnline: orderConfirmationOnline,
  bookOrderOrganizer: orderOrganizer,
  bookNotifyConfirmation: notifyConfirmation,
};
