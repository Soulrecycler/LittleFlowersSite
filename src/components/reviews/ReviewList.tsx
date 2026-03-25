"use client";

import React, { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { subscribeToReviews, type Review } from "@/lib/firebase/reviews";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";

export default function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Auth State
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Listen to Reviews real-time
    const unsubscribeReviews = subscribeToReviews((fetchedReviews) => {
      setReviews(fetchedReviews);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeReviews();
    };
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="w-full pt-4 pb-16 sm:pt-6 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fffaf5] to-white rounded-[3rem]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-orange-400 tracking-[0.2em] uppercase mb-4">
            Community Voices
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6 tracking-tight">
            What Parents Say
          </h3>
          <p className="text-neutral-500 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Hear from our community of parents about their child&apos;s journey at Little Flowers
            Playschool.
          </p>
        </div>

        <div className="mb-24">
          <ReviewForm user={user} onLoginClick={handleLogin} />
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl font-bold text-neutral-800 flex items-center gap-3">
              Recent Reviews
              <span className="text-sm font-normal text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">
                {reviews.length}
              </span>
            </h3>
            <div className="hidden sm:block h-[1px] flex-1 bg-neutral-100 mx-8"></div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex space-x-2">
                <div className="w-2.5 h-2.5 bg-orange-200 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2.5 h-2.5 bg-orange-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm">
              <p className="text-neutral-400 text-lg font-medium">
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
