"use client";

export const useWindow = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window;
}