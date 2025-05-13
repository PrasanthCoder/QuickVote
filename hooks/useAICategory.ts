import { useState } from "react";

export function useAICategory() {
  const [category, setCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateCategory = async (title: string, options: string[]) => {
    if (!title.trim() || options.length < 2) {
      setError("Please provide a title and at least 2 options");
      setCategory("");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/categorize-poll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, options }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate category");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setCategory(data.category || "Uncategorized");
    } catch (err) {
      console.error("Error generating category:", err);
      setError("Failed to generate category. Please try again.");
      setCategory("");
    } finally {
      setIsLoading(false);
    }
  };

  return { category, isLoading, error, generateCategory };
}
