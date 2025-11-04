import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { useReview } from '../contexts/ReviewContext';

const ReviewForm = ({ productId, onReviewSubmit }) => {
  const { addReview } = useReview();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authorName.trim() || !comment.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      addReview(productId, {
        rating,
        comment: comment.trim(),
        author: authorName.trim(),
      });

      setRating(5);
      setComment('');
      setAuthorName('');
      onReviewSubmit?.();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Write a Review</h3>

      {/* Name Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          disabled={isSubmitting}
        />
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
        <label className="block text-sm font-medium text-slate-700 mb-2">Your Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          rows="4"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
          disabled={isSubmitting}
        />
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
};

export default ReviewForm;
