export const useWindow = () => {
  if (typeof window !== "undefined") {
    return window;
  }
};
