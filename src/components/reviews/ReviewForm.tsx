"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { User } from "firebase/auth";
import { addReview } from "@/lib/firebase/reviews";
import StarRating from "./StarRating";

interface ReviewFormProps {
  user: User | null;
  onLoginClick: () => void;
}

export default function ReviewForm({ user, onLoginClick }: ReviewFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (reviewText.trim().length < 10) {
      setError("Review must be at least 10 characters long.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await addReview({
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userPhoto: user.photoURL || "",
        rating,
        reviewText: reviewText.trim(),
      });
      setSuccess(true);
      setRating(0);
      setReviewText("");
      setIsExpanded(false);
    } catch (_err) {
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-[2.5rem] p-10 text-center border border-neutral-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/50 to-rose-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-neutral-800 mb-3">Share Your Journey</h3>
          <p className="text-neutral-500 mb-8 max-w-md mx-auto font-medium">
            We&apos;d love to hear about your child&apos;s experience. Sign in to join the
            conversation.
          </p>
          <button
            onClick={onLoginClick}
            className="bg-neutral-900 text-white px-10 py-4 rounded-full font-bold hover:bg-neutral-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:scale-95"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-[#fcfaf8] text-neutral-800 rounded-[2.5rem] p-10 text-center border border-[#ece0d5] shadow-sm">
        <div className="w-16 h-16 bg-[#e5d5c5]/40 text-[#c28e5c] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-3">
          Heartfelt Thanks, {user.displayName?.split(" ")[0]}!
        </h3>
        <p className="text-neutral-500 font-medium">
          Your review has been shared and will inspire other parents in our community.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-8 px-6 py-2 text-sm font-bold text-neutral-400 hover:text-neutral-800 transition-colors border-2 border-neutral-100 hover:border-neutral-200 rounded-full"
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-neutral-100 overflow-hidden transition-all duration-500 ease-in-out`}
    >
      {/* Toggle Header */}
      <button
        onClick={toggleExpand}
        className="w-full flex items-center justify-between p-8 text-left hover:bg-neutral-50/50 transition-colors group"
        aria-expanded={isExpanded}
        aria-controls="review-form-content"
      >
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-neutral-800">Write a Review</h3>
            <p className="text-neutral-400 text-sm font-medium mt-1">
              {isExpanded
                ? "Tell us what you love about Little Flowers"
                : "Click to share your experience with us"}
            </p>
          </div>
        </div>
        <div
          className={`w-10 h-10 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Expandable Content */}
      <div
        id="review-form-content"
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-4 pt-0 sm:p-8 sm:pt-0">
            <div className="h-[1px] w-full bg-neutral-100 mb-8" />

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-8 flex items-start gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}

            <div className="mb-8 bg-neutral-50/50 p-4 sm:p-8 rounded-3xl text-center border border-neutral-50">
              <label className="block text-sm font-bold text-neutral-500 tracking-widest uppercase mb-4">
                How would you rate us?
              </label>
              <div className="flex justify-center scale-110">
                <StarRating rating={rating} setRating={setRating} />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-neutral-700 mb-3" htmlFor="reviewText">
                Your Experience
              </label>
              <textarea
                ref={textareaRef}
                id="reviewText"
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="What made your child's time here special? Mention our teachers, environment, or specific memories..."
                className="w-full min-h-[140px] max-h-[50vh] px-4 py-4 sm:px-6 sm:py-5 rounded-3xl border border-neutral-100 focus:outline-none focus:ring-4 focus:ring-orange-50 focus:border-orange-200 transition-all resize-y shadow-sm placeholder:text-neutral-300 font-medium"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 sm:pt-6 mb-2">
              <div className="flex items-center gap-4">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full ring-4 ring-neutral-50 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center font-bold text-sm ring-4 ring-orange-50">
                    {user.displayName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Posting as
                  </p>
                  <p className="text-neutral-800 font-bold">{user.displayName}</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-neutral-900 text-white px-10 py-4 rounded-full font-bold hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl active:scale-95"
              >
                {isSubmitting ? "Sharing..." : "Post Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
