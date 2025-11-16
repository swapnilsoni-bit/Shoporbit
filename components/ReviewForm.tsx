'use client';

import { useState } from 'react';
import { Star, Send, AlertCircle } from 'lucide-react';
import { useReview } from '@/lib/hooks/reduxHooks';

interface ReviewFormProps {
  productId: number;
  onReviewSubmit?: () => void;
}

export default function ReviewForm({ productId, onReviewSubmit }: ReviewFormProps) {
  const { addReview } = useReview();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    authorName?: string;
    comment?: string;
    general?: string;
  }>({});

  const validateForm = (): { isValid: boolean; newErrors: typeof errors } => {
    const newErrors: typeof errors = {};

    if (!authorName.trim()) {
      newErrors.authorName = 'Please enter your name';
    }

    if (!comment.trim()) {
      newErrors.comment = 'Please write your review';
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters long';
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, newErrors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent native validation
    
    // Validate form first
    const { isValid, newErrors } = validateForm();
    if (!isValid) {
      // Focus first error field after state update
      setTimeout(() => {
        if (newErrors.authorName) {
          const nameInput = document.querySelector<HTMLInputElement>('[data-field="authorName"]');
          nameInput?.focus();
          nameInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (newErrors.comment) {
          const commentTextarea = document.querySelector<HTMLTextAreaElement>('[data-field="comment"]');
          commentTextarea?.focus();
          commentTextarea?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    setIsSubmitting(true);

    try {
      addReview(productId, {
        rating,
        comment: comment.trim(),
        userName: authorName.trim(),
        userId: 'user_' + Date.now(),
      });

      setRating(5);
      setComment('');
      setAuthorName('');
      setErrors({});
      onReviewSubmit?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrors({ general: 'Failed to submit review. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-xl border border-slate-200" noValidate>
      <h3 className="text-lg font-bold text-slate-900 mb-4">Write a Review</h3>

      {/* General Error Message */}
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-red-700 text-sm font-medium">{errors.general}</span>
        </div>
      )}

      {/* Name Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="authorName"
          data-field="authorName"
          value={authorName}
          onChange={(e) => {
            setAuthorName(e.target.value);
            if (errors.authorName) {
              setErrors((prev) => ({ ...prev, authorName: undefined }));
            }
          }}
          placeholder="Enter your name"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            errors.authorName
              ? 'border-red-300 focus:ring-red-500 bg-red-50'
              : 'border-slate-300 focus:ring-blue-600'
          }`}
          disabled={isSubmitting}
        />
        {errors.authorName && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.authorName}
          </p>
        )}
      </div>

      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
              disabled={isSubmitting}
            >
              <Star
                className={`w-6 h-6 ${
                  star <= rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm font-semibold text-slate-700">{rating}/5</span>
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          name="comment"
          data-field="comment"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (errors.comment) {
              setErrors((prev) => ({ ...prev, comment: undefined }));
            }
          }}
          placeholder="Share your experience with this product..."
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none transition-colors ${
            errors.comment
              ? 'border-red-300 focus:ring-red-500 bg-red-50'
              : 'border-slate-300 focus:ring-blue-600'
          }`}
          disabled={isSubmitting}
        />
        {errors.comment && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.comment}
          </p>
        )}
        {!errors.comment && comment.length > 0 && (
          <p className="mt-1 text-xs text-slate-500">
            {comment.length} characters {comment.length < 10 ? `(minimum 10 required)` : ''}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

