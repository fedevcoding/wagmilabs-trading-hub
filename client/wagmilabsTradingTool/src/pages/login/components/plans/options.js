export const planOptions = [
  {
    planId: 0,
    name: "Free Trial 📒",
    prices: {
      1: 0,
      3: 0,
      6: 0,
    },
    description: `Try the starter plan subscription for FREE for 7 days. No hassle, no commitments. Includes all features apart from bots.`,
    buttonName: "Start Trial",
  },
  // {
  //   planId: 1,
  //   name: "Starter Plan 💼",
  //   prices: {
  //     1: 0.06,
  //     3: 0.05,
  //     6: 0.045,
  //   },
  //   description:
  //     "Starter plan includes all features apart from bots and wallet generator & manager. Get started today!",
  //   buttonName: "Get Starter",
  // },
  {
    planId: 2,
    name: "Pro Plan 👑",
    prices: {
      1: 0.03,
      // 3: 0.075,
      // 6: 0.06,
    },
    description:
      "Pro Plan gives FULL ACCESS. Includes all our charts, bots, live views, tax tools, wallet manager and much more...",
    buttonName: "Get Pro",
  },
];

export const durationSelectOptions = [
  {
    value: 1,
    label: "Monthly",
  },
  {
    value: 3,
    label: "Quarter",
  },
  {
    value: 6,
    label: "Semester",
  },
];

export const getDurationSelectors = () => {
  return durationSelectOptions;
};
