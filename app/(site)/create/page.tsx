"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { useAIOptions } from "@/hooks/useAIOptions";
import { useRefinedQuestion } from "@/hooks/useRefinedQuestion";
import { useAICategory } from "@/hooks/useAICategory";
import { motion, AnimatePresence } from "framer-motion";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensor,
  useSensors,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableOption from "@/components/SortableOption";

interface FormState {
  title: string;
  category: string;
  options: { id: string; value: string }[];
}

export default function CreatePoll() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [nextOptionId, setNextOptionId] = useState<number>(2);
  const [form, setForm] = useState<FormState>({
    title: "",
    category: "",
    options: [
      { id: `option-0`, value: "" },
      { id: `option-1`, value: "" },
    ],
  });
  const [showRefined, setShowRefined] = useState<boolean>(false);
  const [activeSuggestions, setActiveSuggestions] = useState<string[]>([]);
  const [usedOptions, setUsedOptions] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);

  // Setup sensors for mouse and touch support
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  // AI Hooks
  const { suggestions, isLoading, error, generateOptions } = useAIOptions();
  const {
    refined,
    isLoading: refining,
    error: refineError,
    refineQuestion,
  } = useRefinedQuestion();
  const {
    category: aiCategory,
    isLoading: categoryLoading,
    error: categoryError,
    generateCategory,
  } = useAICategory();

  // Sync suggestions to activeSuggestions
  useEffect(() => {
    if (suggestions.length > 0) {
      setActiveSuggestions(suggestions);
      setHasGenerated(true);
    }
  }, [suggestions]);

  // Update form.category when AI category is generated
  useEffect(() => {
    if (aiCategory) {
      setForm((prev) => ({ ...prev, category: aiCategory }));
    }
  }, [aiCategory]);

  // Show refined question only when it's available, not loading, and matches the current title
  useEffect(() => {
    if (!refining && refined && refined !== form.title) {
      setShowRefined(true);
    } else {
      setShowRefined(false); // Hide if refining or if refined matches the current title
    }
  }, [refining, refined, form.title]); // Add form.title as a dependency

  // Hide refined suggestion when the user modifies the title
  useEffect(() => {
    setShowRefined(false); // Hide refined suggestion whenever title changes
  }, [form.title]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!user)
    return (
      <div className="max-w-md mx-auto mt-10 text-center">
        <p className="mb-4">You need to sign in to create polls</p>
        <Link href="/signin" className="text-blue-500 hover:underline">
          Sign In
        </Link>
      </div>
    );

  const handleGenerateCategory = () => {
    const validOptions = form.options
      .filter((opt) => opt.value.trim() !== "")
      .map((opt) => opt.value);
    generateCategory(form.title, validOptions);
  };

  const createPoll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate at least 2 options with content
    const validOptions = form.options
      .filter((opt) => opt.value.trim() !== "")
      .map((opt) => opt.value);
    if (validOptions.length < 2) {
      alert("Please provide at least 2 options");
      return;
    }

    setSubmitting(true);
    try {
      const category = form.category.trim() || "Uncategorized";

      const pollRef = await addDoc(collection(db, "polls"), {
        title: form.title,
        options: validOptions,
        votes: Object.fromEntries(validOptions.map((_, i) => [i, 0])),
        voters: {},
        createdAt: serverTimestamp(),
        userId: user.uid,
        category,
      });

      await setDoc(doc(db, `users/${user.uid}/polls`, pollRef.id), {
        createdAt: serverTimestamp(),
        pollId: pollRef.id,
        category,
      });

      router.push(`/poll/${pollRef.id}`);
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Failed to create poll. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const addSuggestion = (suggestion: string) => {
    const emptyIndex = form.options.findIndex((opt) => !opt.value.trim());
    if (emptyIndex >= 0) {
      const newOptions = [...form.options];
      newOptions[emptyIndex] = { ...newOptions[emptyIndex], value: suggestion };
      setForm((prev) => ({ ...prev, options: newOptions }));
    } else if (form.options.length < 6) {
      setForm((prev) => ({
        ...prev,
        options: [
          ...prev.options,
          { id: `option-${nextOptionId}`, value: suggestion },
        ],
      }));
      setNextOptionId((prev) => prev + 1);
    }
    setUsedOptions((prev) => [...prev, suggestion]);
    setActiveSuggestions((prev) => prev.filter((s) => s !== suggestion));
  };

  const dismissSuggestion = (suggestion: string) => {
    setActiveSuggestions((prev) => prev.filter((s) => s !== suggestion));
  };

  const dismissAllSuggestions = () => {
    setActiveSuggestions([]);
  };

  const handleGenerateOptions = () => {
    if (form.title.trim().length > 10) {
      const currentOptions = form.options
        .map((opt) => opt.value.trim())
        .filter((value) => value !== "");
      const allUsedOptions = [...new Set([...usedOptions, ...currentOptions])];
      generateOptions(form.title, allUsedOptions);
    } else {
      alert("Please enter a longer poll question for better suggestions");
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setForm((prev) => {
        const newOptions = [...prev.options];
        const oldIndex = newOptions.findIndex((opt) => opt.id === active.id);
        const newIndex = newOptions.findIndex((opt) => opt.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const [movedOption] = newOptions.splice(oldIndex, 1);
          newOptions.splice(newIndex, 0, movedOption);
        }

        return { ...prev, options: newOptions };
      });
    }
  };

  return (
    <form
      onSubmit={createPoll}
      className="max-w-md mx-auto mt-10 space-y-4 px-4 py-8"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="question" className="block text-sm font-medium">
            Poll Question
          </label>
          <button
            type="button"
            onClick={() => {
              if (form.title.trim().length > 10) {
                setShowRefined(false); // Hide immediately to prevent flicker
                refineQuestion(form.title);
              } else {
                alert("Please enter a longer question to refine");
              }
            }}
            disabled={refining}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 text-xs"
          >
            <Sparkles className="h-4 w-4" />
            {refining ? "Refining..." : "Refine Question"}
          </button>
        </div>

        <textarea
          id="question"
          placeholder="What's your favorite..."
          value={form.title}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full p-3 border rounded-lg min-h-[100px]"
          required
        />
        <AnimatePresence>
          {showRefined && refined && refined !== form.title && (
            <motion.div
              className="mt-2 text-sm text-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              key={refined}
            >
              <p>Suggested:</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="mt-1 px-3 py-1 bg-gray-100 border rounded hover:bg-gray-200 text-sm flex-grow text-left"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, title: refined }))
                  }
                >
                  {refined}
                </button>
                <button
                  type="button"
                  className="mt-1 p-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowRefined(false)}
                  aria-label="Dismiss refined question"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {refineError && (
          <p className="mt-2 text-sm text-red-500">{refineError}</p>
        )}
      </div>

      {/* AI Suggestions Button and Display */}
      <div>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="button"
          onClick={handleGenerateOptions}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm mb-4"
          disabled={isLoading}
        >
          <Sparkles className="h-4 w-4" />
          {isLoading
            ? "Generating..."
            : hasGenerated
            ? "Generate More AI Suggestions"
            : "Generate AI Suggestions"}
        </button>

        <AnimatePresence>
          {activeSuggestions.length > 0 && (
            <motion.div
              className="p-4 bg-gray-200 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-gray-400 gap-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  AI Suggestions
                </div>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
                  onClick={dismissAllSuggestions}
                >
                  <X className="h-4 w-4" />
                  Dismiss All
                </button>
              </div>
              <div className="flex flex-wrap text-gray-400 gap-2">
                {activeSuggestions.map((suggestion) => (
                  <motion.div
                    key={suggestion}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => addSuggestion(suggestion)}
                        className="px-3 py-1.5 bg-white border rounded-full text-sm hover:bg-gray-100 transition"
                        disabled={form.options.length >= 6}
                      >
                        {suggestion}
                      </button>
                      <button
                        type="button"
                        className="p-1 text-gray-500 hover:text-gray-700"
                        onClick={() => dismissSuggestion(suggestion)}
                        aria-label="Dismiss suggestion"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Options List */}
      <div>
        <label className="block text-sm font-medium mb-2">Poll Options</label>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={form.options.map((opt) => opt.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {form.options.map((opt, i) => (
                <SortableOption
                  key={opt.id}
                  id={opt.id}
                  index={i}
                  opt={opt}
                  form={form}
                  setForm={setForm}
                  setUsedOptions={setUsedOptions}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {form.options.length < 6 && (
        <button
          type="button"
          onClick={() => {
            setForm((prev) => ({
              ...prev,
              options: [
                ...prev.options,
                { id: `option-${nextOptionId}`, value: "" },
              ],
            }));
            setNextOptionId((prev) => prev + 1);
          }}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
        >
          + Add Option
        </button>
      )}

      {/* Category Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <button
            type="button"
            onClick={handleGenerateCategory}
            disabled={categoryLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 text-xs"
          >
            <Sparkles className="h-4 w-4" />
            {categoryLoading ? "Generating..." : "Generate Category"}
          </button>
        </div>
        <input
          id="category"
          type="text"
          placeholder="e.g., Entertainment, Food (leave blank for Uncategorized)"
          value={form.category}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((prev) => ({ ...prev, category: e.target.value }))
          }
          className="w-full p-3 border rounded-lg"
        />
        {categoryError && (
          <p className="text-red-500 text-sm mt-1">{categoryError}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full p-3 rounded text-white ${
          submitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {submitting ? "Creating..." : "Create Poll"}
      </button>
    </form>
  );
}
