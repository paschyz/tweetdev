import type { Dispatch, SetStateAction } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** A list held in state; null while it is loading. */
export type Items = any[] | null;

/** `onDeleted` handler for such a list: drops the item with that id. */
export const without =
  (setItems: Dispatch<SetStateAction<Items>>) => (id: string) =>
    setItems((items) => items?.filter((item) => item._id !== id) ?? null);
