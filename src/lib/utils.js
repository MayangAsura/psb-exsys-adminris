import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function splitStringByUnderscore(str) {
  return str.split("_").join(" ");
}
