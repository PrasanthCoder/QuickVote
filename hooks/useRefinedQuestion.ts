import { useState } from "react";

export function useRefinedQuestion() {
  const [refined, setRefined] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setRefined("");
    setError(null);
  };

  const refineQuestion = async (question: string) => {
    if (!question.trim()) {
      setError("Question cannot be empty");
      setRefined("");
      return;
    }

    // Reset state before making a new API call
    reset();
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/refine-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("Failed to refine question");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setRefined(data.refined || "");
    } catch (err) {
      console.error("Error refining question:", err);
      setError("Failed to refine question. Please try again.");
      setRefined("");
    } finally {
      setIsLoading(false);
    }
  };

  return { refined, isLoading, error, refineQuestion, reset };
}
