import Cookies from "js-cookie";

export type Variant = "A" | "B";

export const getVariant = (): Variant => {
  const savedVariant = Cookies.get("ab-variant") as Variant;
  if (!savedVariant) {
    const newVariant: Variant = Math.random() < 0.5 ? "A" : "B";
    Cookies.set("ab-variant", newVariant, { expires: 7 });
    return newVariant;
  }
  return savedVariant;
};

export const variants = {
  A: {
    title: "Welcome to Version A",
    description: "This is the control version with a classic design.",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    layout: "centered",
  },
  B: {
    title: "Experience Version B",
    description: "This is the experimental version with a modern design.",
    buttonColor: "bg-green-500 hover:bg-green-600",
    layout: "split",
  },
};
