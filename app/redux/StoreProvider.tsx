"use client";

import { Provider } from "react-redux";
import { makeStore } from "@/lib/store";
import { useRef } from "react";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<any>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // Use the angle brackets < >.
  // This is where the value of 'Provider' is "read" by React.
  return <Provider store={storeRef.current}>{children}</Provider>;
}
