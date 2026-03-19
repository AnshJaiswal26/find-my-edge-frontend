import { useEffect, useState } from "react";
import { confirmManager } from "@shared/components/ui/managers";

export function useConfirmation() {
  const [state, setState] = useState(null);

  useEffect(() => {
    return confirmManager.subscribe(setState);
  }, []);

  return state;
}
