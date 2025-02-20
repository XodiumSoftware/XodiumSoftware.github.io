/*
 * Copyright (c) 2025. Xodium.
 * All rights reserved.
 */

import { IConfig } from "axiod/interfaces";

// TYPEWRITER CONSTANTS
export const T_TARGET: string = ".typewriter";
export const T_AUTO_START: boolean = true;
export const T_STRINGS: string[] = ["MODULAR", "STRUCTURED", "EFFICIENT"];
export const T_TYPE_SPEED: number = 150;
export const T_BACK_SPEED: string | number = "natural";
export const T_LOOP: boolean = true;

// UTILS GITHUB CONSTANTS
export const FETCH_DATA_MAP: Record<string, { url: string; config?: IConfig }> =
  {
    members: {
      url: "https://api.github.com/orgs/XodiumSoftware/public_members",
      config: { headers: { Accept: "application/vnd.github+json" } },
    },
  };
