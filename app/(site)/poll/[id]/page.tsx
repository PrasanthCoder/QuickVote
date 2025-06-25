"use client";

import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import type { Poll } from "@/lib/types";
import { ShareButton } from "@/components/ShareButton";
import { useAuth } from "@/context/AuthContext";

export default function PollPage() {
  const { id } = useParams<{ id: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [pollNotFound, setPollNotFound] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, "polls", id), (doc) => {
      if (doc.exists()) {
        setPoll({ id: doc.id, ...doc.data() } as Poll);
        setPollNotFound(false);
      } else {
        setPoll(null);
        setPollNotFound(true);
      }
    });
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setSelectedOption(null); // Deselect when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const vote = async () => {
    if (!user) {
      router.push("/signin?returnTo=" + encodeURIComponent(`/poll/${id}`));
      return;
    }
    if (selectedOption === null || !poll) return;

    if (poll.voters && poll.voters[user.uid] != null) {
      const prevOption = poll.voters[user.uid];
      if (selectedOption === prevOption) return;
      await updateDoc(doc(db, "polls", id), {
        [`votes.${prevOption}`]: poll.votes[prevOption] - 1,
        [`votes.${selectedOption}`]: (poll.votes[selectedOption] || 0) + 1,
        [`voters.${user.uid}`]: selectedOption,
      });
    } else {
      await updateDoc(doc(db, "polls", id), {
        [`votes.${selectedOption}`]: (poll.votes[selectedOption] || 0) + 1,
        [`voters.${user.uid}`]: selectedOption,
      });
    }
  };

  // Show loading state while fetching
  if (!poll && !pollNotFound) {
    return <div className="max-w-md mx-auto mt-10 text-center">Loading...</div>;
  }

  // Show not found state if poll doesn't exist
  if (pollNotFound) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center text-gray-200">
        The poll you are looking for doesn&apos;t exist or deleted
      </div>
    );
  }

  // At this point, poll is guaranteed to be non-null
  const totalVotes = Math.max(
    1,
    Object.values(poll!.votes).reduce((a, b) => a + b, 0)
  );

  return (
    <div className="w-full max-w-lg mx-auto mt-10 px-4 py-8">
      {/* Poll Title and Share Button */}
      <h1 className="text-2xl font-bold text-gray-200">{poll!.title}</h1>
      <ShareButton pollId={poll!.id} />

      {/* Total Votes */}
      <h1 className="text-md text-gray-400 mb-4">
        {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
      </h1>

      {/* Combined Options and Results */}
      <div ref={ref}>
        <div className="space-y-4 bg-black rounded-lg shadow-md">
          {poll!.options.map((opt, i) => {
            const voteCount = poll!.votes[i] || 0;
            const percentage = Math.round((voteCount / totalVotes) * 100);
            const isSelected = selectedOption === i;
            const isUserVotedOption = user && poll!.voters?.[user.uid] === i;

            return (
              <div
                key={i}
                className={`relative p-4 rounded-lg border transition-all duration-200
                ${
                  isUserVotedOption
                    ? "bg-blue-950 border-blue-500"
                    : isSelected
                    ? "bg-gray-900 border-blue-500"
                    : "bg-transparent border-gray-200 hover:bg-gray-700"
                }
              `}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click from bubbling to document
                  setSelectedOption(i);
                }}
              >
                {/* Option Row: Radio Indicator, Option Text, and Percentage */}
                <div className="flex items-center space-x-3 mb-2">
                  {/* Radio Indicator */}
                  <div
                    className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center
                    ${
                      isSelected
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }
                  `}
                  >
                    {isSelected && (
                      <div className="h-3 w-3 rounded-full bg-gray-900" />
                    )}
                  </div>
                  {/* Option Text and Percentage Container */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    {/* Option Text */}
                    <span className="text-gray-200 font-medium break-words">
                      {opt}
                    </span>
                    {/* Vote Percentage */}
                    <div className="text-sm text-gray-200 sm:ml-4 sm:my-4 sm:flex-shrink-0">
                      {percentage}%
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-gray-400 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            onClick={vote}
            disabled={selectedOption === null}
            className="w-full p-3 rounded-lg text-white font-medium transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-600"
          >
            Submit Vote
          </button>
        </div>
      </div>
    </div>
  );
}
