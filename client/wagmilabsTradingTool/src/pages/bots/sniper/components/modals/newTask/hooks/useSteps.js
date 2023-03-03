import React, { useCallback, useState } from "react";

export const useSteps = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const resetStep = useCallback(() => {
    setStep(1);
  }, []);

  return { step, nextStep, prevStep, resetStep };
};
