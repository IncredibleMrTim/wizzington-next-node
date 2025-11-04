"use client";

import { useEffect } from "react";
import { subscribeZustandStoresToReduxDevtool } from "./zustandDevTools";

export default function DevToolsProvider() {
  useEffect(() => {
    subscribeZustandStoresToReduxDevtool();
  }, []);

  return null;
}
