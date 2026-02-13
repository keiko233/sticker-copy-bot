export function formatError(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export const array2text = (
  array: (string | undefined | null)[],
  type: "newline" | "space" = "newline",
): string => {
  let result = "";

  const getSplit = () => {
    if (type == "newline") {
      return "\n";
    } else if (type == "space") {
      return " ";
    }
  };

  array.forEach((value, index) => {
    if (value === undefined || value === null) {
      return;
    }

    if (index === array.length - 1) {
      result += value;
    } else {
      result += value + getSplit();
    }
  });

  return result;
};
