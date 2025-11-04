import React from 'react';
import { Trash2 } from 'lucide-react';
import { useReview } from '../contexts/ReviewContext';
import RatingDisplay from './RatingDisplay';

const ReviewSection = ({ productId }) => {
  const { getProductReviews, deleteReview } = useReview();
  const reviews = getProductReviews(productId);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-slate-600">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Customer Reviews</h3>

      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold text-slate-900">{review.author}</p>
              <RatingDisplay rate={review.rating} count={0} size="sm" showCount={false} />
            </div>
            <button
              onClick={() => deleteReview(productId, review.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete review"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Comment */}
          <p className="text-slate-700 text-sm mb-2">{review.comment}</p>

          {/* Date */}
          <p className="text-xs text-slate-500">
            {new Date(review.date).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewSection;
