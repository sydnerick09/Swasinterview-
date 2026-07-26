"use client";

import { useCallback, useEffect, useState } from "react";
import {
  APPLICATIONS_CHANGE_EVENT,
  listApplications,
} from "@/lib/storage/applications";
import type { Application } from "@/lib/types";

/** Live list of all applications stored in this browser. */
export function useApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => setApps(listApplications()), []);

  useEffect(() => {
    refresh();
    setReady(true);
    window.addEventListener(APPLICATIONS_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(APPLICATIONS_CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return { apps, ready, refresh };
}
