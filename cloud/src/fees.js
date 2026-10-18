// cloud/src/fees.js – DOKŁADNIE TA SAMA formuła co w gatsby/src/utils/payment.js
// (tpay nie udostępnia API z taryfą; formuła 2% + 1 zł zawsze pokrywa Starter)
const FEE_PERCENT = 0.02;
const FEE_FLAT = 1.0;

const getPaymentFee = (amount, paymentMethod) => {
  if (paymentMethod !== "tpay") return 0;
  const fee = Number(amount || 0) * FEE_PERCENT + FEE_FLAT;
  return Math.ceil(fee * 10) / 10;
};

const formatMoney = (amount) => {
  const num = Number(amount) || 0;
  return num.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

module.exports = { FEE_PERCENT, FEE_FLAT, getPaymentFee, formatMoney };
