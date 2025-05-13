import { useState } from "react";

export function useAIOptions() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateOptions = async (
    question: string,
    usedOptions: string[] = []
  ) => {
    if (!question.trim()) {
      setSuggestions([]);
      setError("Question cannot be empty");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate-options", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, usedOptions }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setSuggestions(data.options || []);
    } catch (err) {
      console.error("Error generating options:", err);
      setError("Failed to get suggestions. Please try again.");
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { suggestions, isLoading, error, generateOptions };
}
