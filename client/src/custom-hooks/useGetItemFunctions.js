import { useAddItemToCart } from "./useAddItemToCart";
import { useBuyNow } from "./useBuyNow";

export const useGetItemFunctions = (address, quantity) => {
  const { addItemToCart } = useAddItemToCart(address);
  const { buyNow } = useBuyNow(undefined, quantity);

  return {
    addItemToCart,
    buyNow,
  };
};
