import {
  collection,
  addDoc,
  query,
  orderBy,
  Timestamp,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./config";

export type Review = {
  id?: string;
  userId: string;
  userName: string;
  userPhoto: string;
  rating: number;
  reviewText: string;
  createdAt: Timestamp | Date;
  isVerified: boolean;
};

export const addReview = async (review: Omit<Review, "id" | "createdAt" | "isVerified">) => {
  try {
    const docRef = await addDoc(collection(db, "reviews"), {
      ...review,
      createdAt: Timestamp.now(),
      isVerified: true,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding review: ", error);
    throw error;
  }
};

export const subscribeToReviews = (callback: (reviews: Review[]) => void, limitCount = 20) => {
  const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(limitCount));

  return onSnapshot(
    q,
    (querySnapshot) => {
      const reviews: Review[] = [];
      querySnapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() } as Review);
      });
      callback(reviews);
    },
    (error) => {
      console.error("Error getting reviews real-time DB: ", error);
    }
  );
};
