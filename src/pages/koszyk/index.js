import React, { useEffect } from "react"
import { navigate } from "gatsby"
import { useSelector, useDispatch } from "react-redux"
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
  setLockerPrices,
  updateSubtotal,
  calculateDeliveryCosts,
  updateDeliveryCost,
} from "../../store/cart/cartSlice"
import Button from "../../components/Button/Button"
import CheckoutProgress from "../../components/CheckoutProgress/CheckoutProgress"
import Title from "../../components/Title/Title"
import usePaczkomatPrices from "../../hooks/usePaczkomatPrices"

const KoszykPage = () => {
  const dispatch = useDispatch()
  const items = useSelector(state => state.cart.items)
  const summary = useSelector(state => state.cart.summary)
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const paczkomatPrices = usePaczkomatPrices();

  const formattedLockerPrices = paczkomatPrices.reduce((acc, item) => {
    acc[item.type] = item.price;
    return acc;
  }, {});


  // Wywołaj updateSubtotal tylko wtedy, gdy zmieniają się dane w koszyku
  useEffect(() => {
    dispatch(updateSubtotal(subtotal));
    dispatch(calculateDeliveryCosts());

    // Aktualizuj koszt dostawy na podstawie metody dostawy
  const deliveryMethod = summary.deliveryMethod || "Kurier InPost";
  const lockerDeliveryCost = summary.lockerDeliveryCost || 0;
  const homeDeliveryCost = summary.homeDeliveryCost || 0;

  dispatch(updateDeliveryCost({ deliveryMethod, lockerDeliveryCost, homeDeliveryCost }));
}, [subtotal, dispatch, summary.deliveryMethod, summary.homeDeliveryCost, summary.lockerDeliveryCost]);

  // Zapisz ceny paczkomatów w Redux
  useEffect(() => {
    if (Array.isArray(paczkomatPrices) && paczkomatPrices.length > 0) {
      console.log("Setting locker prices:", formattedLockerPrices);
      dispatch(setLockerPrices(formattedLockerPrices));
    } else {
      console.error("Paczkomat prices are undefined or empty:", paczkomatPrices);
    }
  }, [paczkomatPrices, dispatch]);


  if (items.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl text-gray-800 dark:text-gray-200">
          Twój koszyk jest pusty 🛒
        </h2>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md transition-colors duration-300">
      <CheckoutProgress currentStep="koszyk" />
      <Title tag="h4" className="pt-3 pb-5 text-gray-900 dark:text-gray-100">
        Twój koszyk
      </Title>
      
      <ul className="divide-y divide-gray-200 dark:divide-gray-700 pt-6">
        {items.map(item => (
          <li
            key={item.id}
            className="py-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{item.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.price} zł / szt.</p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() => dispatch(decrementQuantity(item.id))}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  −
                </button>
                <span className="px-4 text-gray-900 dark:text-gray-100">{item.quantity}</span>
                <button
                  onClick={() => dispatch(incrementQuantity(item.id))}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="text-red-500 dark:text-red-400 text-sm mt-1 hover:underline"
              >
                Usuń
              </button>
            </div>
            <div className="text-right font-semibold text-gray-900 dark:text-gray-100">
              {(item.price * item.quantity).toFixed(2)} zł
            </div>
          </li>
        ))}
      </ul>
  
      <div className="mt-6 text-right text-xl font-bold text-gray-900 dark:text-gray-100">
        Suma: {subtotal.toFixed(2)} zł
      </div>
  
      <div className="flex justify-between mt-6 space-x-4">
        <Button
          onClick={() => dispatch(clearCart())}
          variant='cancel'
          className="w-full"
        >
          Wyczyść koszyk
        </Button>
        <Button
          type="button"
          onClick={() => navigate("/koszyk/dane")}
          variant='next'
          className="w-full"
        >
          Przejdź dalej
        </Button>
      </div>
    </div>
  )
}

export default KoszykPage
