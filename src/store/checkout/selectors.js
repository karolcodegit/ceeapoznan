// store/checkout/selectors.js — WSZYSTKIE kwoty liczone na żywo (nie w stanie!)
import { getParcelSize } from "../../constants/shippingCosts"
import { getPaymentFee } from "../../utils/payment"


export const selectItems = s => s.checkout.items
export const selectItemCount = s =>
  s.checkout.items.reduce((n, i) => n + i.quantity, 0)
export const selectSubtotal = s =>
  Math.round(s.checkout.items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100

export const selectParcelSize = s => getParcelSize(selectItemCount(s))

export const selectDeliveryCost = s => {
  const { deliveryMethod, prices } = s.checkout
  const size = selectParcelSize(s)
  const table = deliveryMethod === "Paczkomat" ? prices.locker : prices.home
  return table?.[size] ?? 0
}

export const selectTotal = s =>
  Math.round((selectSubtotal(s) + selectDeliveryCost(s)) * 100) / 100

export const selectCustomer = s => ({
  firstName: s.checkout.firstName,
  lastName: s.checkout.lastName,
  email: s.checkout.email,
  phone: s.checkout.phone,
})

export const selectDelivery = s => ({
  method: s.checkout.deliveryMethod === "Paczkomat" ? "paczkomat" : "courier",
  address: s.checkout.address,
  locker: s.checkout.locker,
})


export const selectPaymentMethod = s => s.checkout.paymentMethod

export const selectPaymentFee = s =>
  getPaymentFee(selectTotal(s), s.checkout.paymentMethod)   // 0 dla transferu
export const selectGrandTotal = s =>
  Math.round((selectTotal(s) + selectPaymentFee(s)) * 100) / 100
