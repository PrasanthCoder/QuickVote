"use client";

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import type { Poll } from "@/lib/types";
import { deletePoll } from "@/lib/polls";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ConfirmationDialog } from "@/components/DeleteConfirmation";
import { ShareButton } from "@/components/ShareButton";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export default function MyPolls() {
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "polls"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pollsData: Poll[] = [];
      querySnapshot.forEach((doc) => {
        pollsData.push({ id: doc.id, ...doc.data() } as Poll);
      });
      setPolls(pollsData);
    });

    return () => unsubscribe();
  }, [user]);

  // Group polls by category
  const groupedPolls = polls.reduce((acc, poll) => {
    const category = poll.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(poll);
    return acc;
  }, {} as Record<string, Poll[]>);

  const handleDelete = async (pollId: string | undefined) => {
    if (!user || !pollId) return;
    try {
      setDeletingId(pollId);
      await deletePoll(pollId, user.uid);
    } catch (error) {
      console.error("Error deleting poll:", error);
      alert("Failed to delete poll");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  if (!user)
    return (
      <div className="max-w-md mx-auto mt-10 text-center">
        <p className="mb-4">You need to sign in to view your polls</p>
        <Link href="/signin" className="text-blue-500 hover:underline">
          Sign In
        </Link>
      </div>
    );

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-200">
        My Polls
      </h1>
      {polls.length === 0 ? (
        <p className="text-gray-200">You haven&apos;t created any polls yet.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedPolls)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([category, categoryPolls]) => {
              const isExpanded = expandedCategories.includes(category);
              return (
                <div key={category} className="bg-black rounded-lg shadow-sm">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-gray-800 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-200">
                      {category}
                      <span className="ml-2 text-sm text-gray-400">
                        ({categoryPolls.length})
                      </span>
                    </h2>
                    {isExpanded ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-200" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-200" />
                    )}
                  </button>

                  {/* Polls List with Animation */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.ul
                        layout // Use layout for smoother height transitions
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="space-y-4 p-4 sm:p-5"
                      >
                        {categoryPolls.map((poll) => (
                          <motion.li
                            key={poll.id}
                            layout // Ensure child elements animate smoothly
                            className="border border-gray-600 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-900 hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex-1">
                              <Link
                                href={`/poll/${poll.id}`}
                                className="hover:underline"
                              >
                                <h3 className="text-base sm:text-lg font-medium text-gray-200">
                                  {poll.title}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {poll.options.length} options
                                </p>
                              </Link>
                            </div>
                            <div className="flex items-center gap-3 mt-3 sm:mt-0">
                              <ShareButton pollId={poll.id} />
                              <ConfirmationDialog
                                trigger={
                                  <button className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200">
                                    {deletingId === poll.id ? (
                                      <span className="loading-spinner">
                                        ...
                                      </span>
                                    ) : (
                                      <TrashIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                                    )}
                                  </button>
                                }
                                title="Delete Poll"
                                message="Are you sure you want to delete this poll? This action cannot be undone."
                                onConfirm={() => handleDelete(poll.id)}
                              />
                            </div>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
