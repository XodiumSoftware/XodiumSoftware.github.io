/**
 * Copyright (c) 2025. Xodium.
 * All rights reserved.
 */

import { config } from "../utils/constants.ts";

/**
 * Version component
 */
export default function Version() {
  return (
    <div class="fixed bottom-0 m-2 text-gray-600 dark:text-slate-400 text-sm">
      v{config.version}
    </div>
  );
}
