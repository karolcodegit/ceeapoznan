export const getParcelSize = (totalItems) => {
  if (totalItems <= 3) return "A";
  if (totalItems <= 6) return "B";
  return "C";
};

export const getDeliveryCost = (deliveryMethod, parcelSize, lockerPrices, deliveryPrices) => {
  if (deliveryMethod === "Paczkomat") {
    const paczkomatCost = lockerPrices?.find(cost => cost.type === parcelSize);
    return paczkomatCost ? paczkomatCost.price : 0;
  }

  if (deliveryMethod === "Kurier InPost") {
    return deliveryPrices[parcelSize] || 0;
  }

  console.warn(`Unknown delivery method: "${deliveryMethod}".`);
  return 0;
};