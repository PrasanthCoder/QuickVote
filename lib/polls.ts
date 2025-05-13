import { doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function deletePoll(pollId: string, userId: string) {
  // Delete from main polls collection
  await deleteDoc(doc(db, "polls", pollId));

  // Delete from user's polls subcollection
  const userPollRef = doc(db, `users/${userId}/polls`, pollId);
  await deleteDoc(userPollRef);
}
