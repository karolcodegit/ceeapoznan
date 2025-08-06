export const prepareFormData = (formData) => {
  const user = formData.user || {}
  const delivery = formData.delivery || {}
  const items = formData.items || []
  return {
    orderNumber: formData.orderNumber,
    // submittedAt: formData.submittedAt,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    deliveryMethod: delivery.deliveryMethod || "",
    streetDelivery: delivery.streetDelivery || "",
    cityDelivery: delivery.cityDelivery || "",
    parcelLocker: {
      name: delivery.parcelLocker?.name || "",
      address: {
        street: delivery.parcelLocker?.address?.street || "",
        building_number: delivery.parcelLocker?.address?.building_number || "",
        city: delivery.parcelLocker?.address?.city || "",
        post_code: delivery.parcelLocker?.address?.post_code || "",
      }
    },
    items: items.map(item => ({
      title: item.title,
      quantity: item.quantity,
      price: item.price, // cena jednostkowa
      totalItemPrice: item.price * item.quantity,
    })),
    summary: formData.summary || {},
    deliveryCost: formData.summary?.deliveryCost,
    totalPrice: formData.summary?.totalPrice || "",
  }
}