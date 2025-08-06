import { useSelector } from 'react-redux';
import {
  selectCartTotal,
  selectShippingCost,
  selectTotalWithShipping,
  selectTotalQuantity
} from '../../store/cart/cartSelectors';

const OrderSummary = () => {
  const subtotal = useSelector(selectCartTotal);
  const shipping = useSelector(selectShippingCost);
  const total = useSelector(selectTotalWithShipping);
  // const totalQuantity = useSelector(selectTotalQuantity);

  return (
    <div>
      {/* <p>Liczba książek: {totalQuantity}</p> */}
      <p>Suma produktów: {subtotal.toFixed(2)} zł</p>
      <p>Koszt dostawy: {shipping.toFixed(2)} zł</p>
      <hr />
      <p><strong>Do zapłaty: {total.toFixed(2)} zł</strong></p>
    </div>
  );
}

export default OrderSummary