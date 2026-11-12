import type { Component } from "svelte";
import type { RouteId } from "$app/types";
import Play from "#lib/icons/Play.svelte";
import TrendingUp from "#lib/icons/TrendingUp.svelte";

export interface AppInfo {
  id: string;
  name: string;
  description: string;
  href: RouteId;
  icon: Component;
}

// Apps listed on the home page. Add an entry here when adding a new app
// under src/routes/<id>/.
export const apps: AppInfo[] = [
  {
    id: "timeit",
    name: "Time-It",
    description: "Track time by task and project",
    href: "/timeit",
    icon: Play,
  },
  {
    id: "alpha",
    name: "Alpha",
    description: "Investment tools",
    href: "/alpha",
    icon: TrendingUp,
  },
];
