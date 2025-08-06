export const loadState = () => {
    if (typeof window === "undefined") return undefined;
  
    try {
      const cart = localStorage.getItem("cartState");
      const userCart = localStorage.getItem("userCartState");
      const delivery = localStorage.getItem("delivery");
  
      return {
        cart: cart ? JSON.parse(cart) : undefined,
        userCart: userCart ? JSON.parse(userCart) : undefined,
        delivery: delivery ? JSON.parse(delivery) : undefined,
      };
    } catch (e) {
      console.error("Błąd przy ładowaniu stanu z localStorage:", e);
      return undefined;
    }
  };
  
  export const saveState = (state) => {
    if (typeof window === "undefined") return;
  
    try {
      localStorage.setItem("cartState", JSON.stringify(state.cart));
      localStorage.setItem("userCartState", JSON.stringify(state.userCart));
      localStorage.setItem("delivery", JSON.stringify(state.delivery));
    } catch (e) {
      console.error("Błąd przy zapisie do localStorage:", e);
    }
  };