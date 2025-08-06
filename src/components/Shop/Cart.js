import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from 'react-redux';
import { Link } from 'gatsby';
import { ShoppingBagIcon } from '@heroicons/react/24/outline'; // lub solid
import { selectTotalQuantity } from '../../store/cart/cartSelectors';

const Cart = () => {
  const totalQuantity = useSelector(selectTotalQuantity);

  return (
    <AnimatePresence>
      {totalQuantity > 0 && (
        <motion.div
          key="cart"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          style={{ position: "fixed", bottom: 20, left: 20, zIndex: 1000 }}
        >
          <Link
            to="/koszyk"
            className="p-3 bg-sky-700 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center gap-2"
          >
            <ShoppingBagIcon className="h-6 w-6" />
            <span className="text-sm font-medium">{totalQuantity}</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


export default Cart;