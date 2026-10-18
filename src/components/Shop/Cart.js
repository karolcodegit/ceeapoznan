import React from "react"
import { navigate } from "gatsby"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector } from "react-redux"
import { ShoppingBagIcon } from "@heroicons/react/24/outline"
import { selectItemCount, selectSubtotal } from "../../store/checkout/selectors"

const Cart = () => {
  const count = useSelector(selectItemCount)
  const subtotal = useSelector(selectSubtotal)

  const handleClick = () => {
    navigate("/koszyk")
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50)
  }

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          key="cart"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          style={{ position: "fixed", bottom: 20, left: 20, zIndex: 1000 }}
        >
          <button
            onClick={handleClick}
            className="p-3 bg-sky-700 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center gap-2"
          >
            <ShoppingBagIcon className="h-6 w-6" />
            <span className="text-sm font-medium">{count}</span>
            <span className="text-xs opacity-80">{subtotal.toFixed(2)} zł</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Cart