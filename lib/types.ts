// types.ts

import { Timestamp } from "firebase/firestore";
export interface Poll {
  id?: string; // Added for convenience (Firestore auto-generates IDs)
  title: string;
  options: string[];
  votes: Record<number, number>; // Maps option index → vote count
  voters: Record<string, number>;
  createdAt?: Timestamp;
  userId: string; // Add user reference
  category?: string; // Optional, defaults to "Uncategorized" if not set
}

export interface PollPageProps {
  poll: Poll | null;
}
