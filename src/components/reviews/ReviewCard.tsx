"use client";

import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import StarRating from "./StarRating";
import { Timestamp } from "firebase/firestore";
import type { Review } from "@/lib/firebase/reviews";

export default function ReviewCard({ review }: { review: Review }) {
  const date = review.createdAt instanceof Timestamp ? review.createdAt.toDate() : review.createdAt;

  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-8 flex flex-col gap-5 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-neutral-50 group">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {review.userPhoto ? (
            <Image
              src={review.userPhoto}
              alt={review.userName}
              width={44}
              height={44}
              className="rounded-full bg-neutral-100 object-cover ring-4 ring-neutral-50"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center font-bold text-lg ring-4 ring-orange-50/50">
              {review.userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h4 className="font-bold text-neutral-800 text-base">{review.userName}</h4>
            <p className="text-xs font-medium text-neutral-400">{format(date, "MMM d, yyyy")}</p>
          </div>
        </div>
        <div className="opacity-80 scale-90 origin-right">
          <StarRating rating={review.rating} readonly />
        </div>
      </div>

      <div className="relative">
        <svg
          className="absolute -top-2 -left-2 w-8 h-8 text-orange-50 opacity-50 -z-10"
          fill="currentColor"
          viewBox="0 0 32 32"
        >
          <path d="M10 8c-3.3 0-6 2.7-6 6 0 2.2 1.2 4.1 3 5.1V22h4v-2.9c1.8-1 3-2.9 3-5.1 0-3.3-2.7-6-6-6zm12 0c-3.3 0-6 2.7-6 6 0 2.2 1.2 4.1 3 5.1V22h4v-2.9c1.8-1 3-2.9 3-5.1 0-3.3-2.7-6-6-6z" />
        </svg>
        <p className="text-neutral-600 leading-relaxed text-[15px] font-medium italic">
          &quot;{review.reviewText}&quot;
        </p>
      </div>
    </div>
  );
}
