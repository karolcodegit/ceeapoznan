import { shippingCosts } from '../constants/shippingCosts';

export function calculateShippingCost(totalItems) {
  for (const bracket of shippingCosts) {
    if (totalItems >= bracket.min && totalItems <= bracket.max) {
      return bracket.price;
    }
  }
  return 0; // np. jeśli koszyk pusty
}