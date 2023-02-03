import { useAddItemToCart } from "./useAddItemToCart";
import { useBuyNow } from "./useBuyNow";

export const useGetItemFunctions = address => {
  const { addItemToCart } = useAddItemToCart(address);
  const { buyNow } = useBuyNow();

  return {
    addItemToCart,
    buyNow,
  };
};
