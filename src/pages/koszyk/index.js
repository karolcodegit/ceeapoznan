import React, { useEffect } from "react"
import { navigate } from "gatsby"
import { useDispatch, useSelector } from "react-redux"
import {
  incrementQuantity, decrementQuantity, removeFromCart, clearCart, setPrices,
} from "../../store/checkout/checkoutSlice"
import { selectItems, selectSubtotal, selectItemCount } from "../../store/checkout/selectors"
import CheckoutProgress from "../../components/CheckoutProgress/CheckoutProgress"
import Title from "../../components/Title/Title"
import Button from "../../components/Button/Button"
import usePaczkomatPrices from "../../hooks/usePaczkomatPrices"
import BookCover from "../../components/Book/BookCover"

const KoszykPage = () => {
  const dispatch = useDispatch()
  const items = useSelector(selectItems)
  const subtotal = useSelector(selectSubtotal)
  const itemCount = useSelector(selectItemCount)
  const paczkomatPrices = usePaczkomatPrices() // [{type:'A',price},...] + fallbacki

  // Ceny paczkomatów (z API InPost) -> slice; selektory same policzą dostawę
  useEffect(() => {
    if (!paczkomatPrices?.length) return
    const locker = paczkomatPrices.reduce((acc, p) => ({ ...acc, [p.type]: p.price }), {})
    dispatch(setPrices({ locker }))
  }, [paczkomatPrices, dispatch])

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <CheckoutProgress currentStep="koszyk" />
        <Title tag="h2" className="text-xl mt-10 text-gray-800 dark:text-gray-200">
          Twój koszyk jest pusty
        </Title>
        <Button variant="next" className="mt-6" onClick={() => navigate("/ksiazki")}>
          Przeglądaj książki
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <CheckoutProgress currentStep="koszyk" />
      <div className="mt-4 bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 transition-colors">
        <Title tag="h4" className="pb-5 text-gray-900 dark:text-gray-100">Twój koszyk</Title>

        <ul className="divide-y divide-gray-200 dark:divide-slate-700">
          {items.map(item => (
            <li key={item.productId} className="py-4 flex gap-4 items-center">
              {item.image ? (
                <BookCover src={item.image} alt={item.title} className="w-16 h-24" />
              ) : (
                <div className="w-16 h-24 rounded-lg bg-gray-100 dark:bg-slate-700 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 leading-snug">{item.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.price} zł / szt.</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => dispatch(decrementQuantity(item.productId))}
                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">−</button>
                  <span className="w-8 text-center text-gray-900 dark:text-gray-100">{item.quantity}</span>
                  <button onClick={() => dispatch(incrementQuantity(item.productId))}
                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">+</button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{(item.price * item.quantity).toFixed(2)} zł</p>
                <button onClick={() => dispatch(removeFromCart(item.productId))}
                  className="text-red-500 dark:text-red-400 text-xs mt-1 hover:underline">Usuń</button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">{itemCount} szt. • dostawa obliczana w kolejnym kroku</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">Suma: {subtotal.toFixed(2)} zł</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button onClick={() => dispatch(clearCart())} variant="cancel" className="flex-1">Wyczyść koszyk</Button>
          <Button onClick={() => navigate("/koszyk/dane")} variant="next" className="flex-1">Przejdź dalej</Button>
        </div>
      </div>
    </div>
  )
}

export default KoszykPage
