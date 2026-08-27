import { useState } from "react";
import { store } from "./store";

export function useDb() {
  const [, setN] = useState(0);
  return {
    db: store.read(),
    refresh: () => setN((n) => n + 1),
  };
}
