import React, { useEffect } from "react"
import { navigate } from "gatsby"
import { useDispatch, useSelector } from "react-redux"
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
  setPrices,
} from "../../store/checkout/checkoutSlice"
import {
  selectItems,
  selectSubtotal,
  selectItemCount,
} from "../../store/checkout/selectors"
import CheckoutShellV2 from "../../components/CheckoutShellV2/CheckoutShellV2"
import Button from "../../components/Button/Button"
import usePaczkomatPrices from "../../hooks/usePaczkomatPrices"
import BookCover from "../../components/Book/BookCover"
import Seo from "../../components/seo"

const Koszyk2Page = () => {
  const dispatch = useDispatch()
  const items = useSelector(selectItems)
  const subtotal = useSelector(selectSubtotal)
  const itemCount = useSelector(selectItemCount)
  const paczkomatPrices = usePaczkomatPrices()

  useEffect(() => {
    if (!paczkomatPrices?.length) return
    const locker = paczkomatPrices.reduce(
      (acc, p) => ({ ...acc, [p.type]: p.price }),
      {}
    )
    dispatch(setPrices({ locker }))
  }, [paczkomatPrices, dispatch])

  if (items.length === 0) {
    return (
      <CheckoutShellV2
        title="Koszyk"
        subtitle="Zamówienie książek"
        description="Twój koszyk jest pusty — dodaj publikacje z katalogu."
        currentStep="koszyk"
      >
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-[#002C7C] dark:text-sky-300">
            Twój koszyk jest pusty
          </h2>
          <Button
            variant="next"
            className="mt-6"
            onClick={() => navigate("/ksiazki")}
          >
            Przeglądaj książki
          </Button>
        </div>
      </CheckoutShellV2>
    )
  }

  return (
    <CheckoutShellV2
      title="Koszyk"
      subtitle="Zamówienie książek"
      description="Sprawdź pozycje i przejdź do danych wysyłki."
      currentStep="koszyk"
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <h2 className="pb-5 text-xl font-bold text-[#002C7C] dark:text-sky-300">
          Twój koszyk
        </h2>

        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
          {items.map(item => (
            <li
              key={item.productId}
              className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-4"
            >
              {item.image ? (
                <BookCover
                  src={item.image}
                  alt={item.title}
                  className="h-24 w-16"
                />
              ) : (
                <div className="h-24 w-16 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-700" />
              )}
              <div className="min-w-0 flex-1">
                <p className="leading-snug font-medium text-slate-900 dark:text-slate-100">
                  {item.title}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.price} zł / szt.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(decrementQuantity(item.productId))
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 transition-colors hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C6478] sm:h-9 sm:w-9 dark:bg-slate-700 dark:hover:bg-slate-600"
                    aria-label="Zmniejsz ilość"
                  >
                    −
                  </button>
                  <span className="min-w-8 text-center text-slate-900 dark:text-slate-100">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(incrementQuantity(item.productId))
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 transition-colors hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C6478] sm:h-9 sm:w-9 dark:bg-slate-700 dark:hover:bg-slate-600"
                    aria-label="Zwiększ ilość"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {(item.price * item.quantity).toFixed(2)} zł
                </p>
                <button
                  type="button"
                  onClick={() => dispatch(removeFromCart(item.productId))}
                  className="min-h-11 rounded-lg px-2 text-sm text-rose-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A317] sm:mt-1 sm:min-h-0 sm:px-0 sm:text-xs dark:text-rose-400"
                >
                  Usuń
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {itemCount} szt. • dostawa w kolejnym kroku
          </p>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Suma: {subtotal.toFixed(2)} zł
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => dispatch(clearCart())}
            variant="cancel"
            className="flex-1"
          >
            Wyczyść koszyk
          </Button>
          <Button
            onClick={() => navigate("/koszyk/dane")}
            variant="next"
            className="flex-1"
          >
            Przejdź dalej
          </Button>
        </div>
      </div>
    </CheckoutShellV2>
  )
}

export const Head = ({ location }) => (
  <Seo
    title="Koszyk"
    description="Koszyk zamówienia książek CEEA Poznań."
    pathname={location?.pathname || "/koszyk/"}
    robots="noindex,nofollow"
  />
)
export default Koszyk2Page
