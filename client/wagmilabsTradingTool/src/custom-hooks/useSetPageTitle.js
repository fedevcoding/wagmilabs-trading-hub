import { useEffect } from "react";
import { setPageTitle } from "@Utils";

export const useSetPageTitle = title => {
  useEffect(() => {
    setPageTitle(title);
  }, [title]);
};
