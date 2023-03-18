import { useEffect, useState } from "react";

export const useSweep = items => {
  const [sweepMode, setSweepMode] = useState(false);
  const [amountToSweep, setAmountToSweep] = useState(1);
  const [sweepPrice, setSweepPrice] = useState(0);

  const [sweepItems, setSweepItems] = useState([]);

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
  };
};
