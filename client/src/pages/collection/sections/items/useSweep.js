import { useBuyNow } from "@Hooks";
import { useEffect, useState } from "react";

export const useSweep = items => {
  const { batchBuyNow } = useBuyNow();
  const [sweepMode, setSweepMode] = useState(false);
  const [amountToSweep, setAmountToSweep] = useState(1);
  const [sweepPrice, setSweepPrice] = useState(0);
  const [sweepLoading, setSweepLoading] = useState(false);
  const [sweepItems, setSweepItems] = useState([]);

  async function processSweep(expectedPrice) {
    try {
      setSweepLoading(true);
      const orderIds = sweepItems.map(item => {
        return item?.market?.floorAsk?.id;
      });

      const result = await batchBuyNow(orderIds, expectedPrice);
      if (!result) throw new Error("Something went wrong");
      setAmountToSweep(1);
    } catch (e) {
      // console.log(e);
    } finally {
      setSweepLoading(false);
    }
  }

  useEffect(() => {
    const itemsToSweep = items.slice(0, amountToSweep);
    setSweepItems(itemsToSweep);
  }, [items, amountToSweep]);

  useEffect(() => {
    const sweepPrice = sweepItems.reduce((acc, item) => {
      return acc + item?.market?.floorAsk?.price?.amount?.decimal;
    }, 0);
    setSweepPrice(sweepPrice);
  }, [sweepItems]);

  const toggleSweepMode = () => {
    setSweepMode(!sweepMode);
  };

  return {
    sweepMode,
    toggleSweepMode,
    amountToSweep,
    setAmountToSweep,
    sweepItems,
    sweepPrice,
    processSweep,
    sweepLoading,
  };
};
