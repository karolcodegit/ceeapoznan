export const generateOrderNumber = () => {
    const now = new Date();
    const date = now.getFullYear() + ("0" + (now.getMonth() + 1)).slice(-2) + ("0" + now.getDate()).slice(-2);
    const time = ("0" + now.getHours()).slice(-2) + ("0" + now.getMinutes()).slice(-2) + ("0" + now.getSeconds()).slice(-2);
    const orderNumber = `CEEA-${date}-${time}-${Math.floor(Math.random() * 10000)}`;

    return orderNumber
}