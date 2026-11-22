const { getPaymentFee } = require("./fees");

const CLIENT_PRICE_FIELDS = new Set([
  "baseAmount", "total", "amount", "price", "fee", "paymentFee",
  "cost", "costs", "unitPrice", "subtotal", "deliveryCost",
  "baseCourseCost", "courseCost", "grandTotal", "shippingCost",
]);

function containsClientPrice(value) {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(containsClientPrice);
  return Object.entries(value).some(([key, child]) =>
    CLIENT_PRICE_FIELDS.has(key) || containsClientPrice(child)
  );
}

function money(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) throw new Error("Invalid price");
  return Math.round(amount * 100) / 100;
}

function calculateCoursePricing(course, selections, method) {
  let baseAmount = money(course.price);
  if (baseAmount <= 0) throw new Error("Invalid course price");
  const selectedOptions = [];
  const options = Array.isArray(course.meal_options) ? course.meal_options : [];

  options.forEach((option, index) => {
    if (selections[`option${index + 1}`] !== true) return;
    if (option.available !== true) throw new Error("Unavailable course option");
    const price = money(option.price);
    baseAmount += price;
    selectedOptions.push({ index, price });
  });

  baseAmount = money(baseAmount);
  const paymentFee = money(getPaymentFee(baseAmount, method));
  return {
    baseAmount,
    paymentFee,
    amount: money(baseAmount + paymentFee),
    selectedOptions,
  };
}

function expectedCourseAmount(payment) {
  let notes = {};
  try { notes = typeof payment.notes === "string" ? JSON.parse(payment.notes) : payment.notes || {}; }
  catch { return null; }

  // New rows carry a server-written order-time snapshot. Never query the live
  // course catalog here: changing today's price must not affect old orders.
  if (notes.pricingVersion === 1 && Array.isArray(notes.selectedOptions) &&
      notes.currency === "PLN" && notes.paymentMethod === payment.method) {
    const baseAmount = money(notes.coursePrice) + notes.selectedOptions.reduce(
      (sum, option) => sum + money(option.price), 0
    );
    const paymentFee = money(getPaymentFee(baseAmount, payment.method));
    const amount = money(baseAmount + paymentFee);
    if (Math.round(Number(notes.baseAmount) * 100) !== Math.round(baseAmount * 100) ||
        Math.round(Number(notes.paymentFee) * 100) !== Math.round(paymentFee * 100) ||
        Math.round(Number(notes.amount) * 100) !== Math.round(amount * 100)) return null;
    return amount;
  }
  return null;
}

// Current public book shipping rates, now applied server-side.
const SHIPPING = {
  paczkomat: { A: 20.99, B: 23.99, C: 25.99 },
  courier: { A: 19.99, B: 20.99, C: 25.99 },
};

function bookShippingCost(deliveryMethod, itemCount) {
  const method = deliveryMethod === "courier" ? "courier" : "paczkomat";
  const size = itemCount <= 3 ? "A" : itemCount <= 6 ? "B" : "C";
  return SHIPPING[method][size];
}

function expectedBookAmount(order) {
  const pricing = order.payload?.serverPricing;
  if (!pricing || pricing.version !== 1 || pricing.currency !== "PLN") return null;
  const base = money(pricing.subtotal) + money(pricing.delivery);
  const fee = money(getPaymentFee(base, pricing.paymentMethod));
  const amount = money(base + fee);
  if (Math.round(Number(pricing.amount) * 100) !== Math.round(amount * 100) ||
      Math.round(Number(pricing.fee) * 100) !== Math.round(fee * 100)) return null;
  return amount;
}

function providerPaymentMatches(orderNumber, storedAmount, providerPayload, externalId) {
  const data = providerPayload?.data || providerPayload || {};
  const reference = data.orderId ?? data.tr_crc ?? data.transactionHiddenDescription ?? data.crc;
  if (String(reference || "") !== String(orderNumber)) return false;
  if (data.transactionId && externalId && String(data.transactionId) !== String(externalId)) return false;

  const targetAmount = data.transactionAmount ?? data.tr_amount ?? data.amount;
  const paidAmount = data.transactionPaidAmount ?? data.tr_paid ?? data.paidAmount;
  const currency = data.transactionCurrency ?? data.tr_currency ?? data.currency;
  const amountInCents = value => {
    const n = Number(value);
    return Number.isFinite(n) ? Math.round(n * 100) : NaN;
  };
  const expected = amountInCents(storedAmount);
  return currency === "PLN" && Number.isFinite(expected) &&
    amountInCents(targetAmount) === expected && amountInCents(paidAmount) === expected;
}

module.exports = {
  containsClientPrice,
  calculateCoursePricing,
  expectedCourseAmount,
  bookShippingCost,
  expectedBookAmount,
  providerPaymentMatches,
  money,
};
