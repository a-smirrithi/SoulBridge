import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import { useRatings } from '../../context/RatingContext';
import { useAuth } from '../../context/AuthContext';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  counsellorId: string;
  counsellorName: string;
  sessionDate: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  counsellorId,
  counsellorName,
  sessionDate
}) => {
  const { user } = useAuth();
  const { addRating } = useRatings();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    setError('');
    
    try {
      addRating({
        studentId: user.id,
        counsellorId,
        bookingId,
        rating,
        feedback,
        sessionDate
      });

      // Reset form
      setRating(0);
      setFeedback('');
      setError('');
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to submit feedback. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue: number) => {
    setHoveredRating(starValue);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Rate Your Session</h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-base-content/70 text-sm">
            Session with <span className="font-semibold">{counsellorName}</span>
          </p>
          <p className="text-base-content/60 text-xs">
            {new Date(sessionDate).toLocaleDateString()}
          </p>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div className="mb-6">
            <label className="label">
              <span className="label-text font-medium">How was your session?</span>
            </label>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="btn btn-ghost btn-sm p-1"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= displayRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-sm text-base-content/60">
              {rating === 0 && 'Please select a rating'}
              {rating === 1 && 'Poor - Not helpful'}
              {rating === 2 && 'Fair - Somewhat helpful'}
              {rating === 3 && 'Good - Helpful'}
              {rating === 4 && 'Very Good - Very helpful'}
              {rating === 5 && 'Excellent - Extremely helpful'}
            </div>
          </div>

          {/* Feedback Text */}
          <div className="mb-6">
            <label className="label">
              <span className="label-text font-medium">Additional Feedback (Optional)</span>
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts about the session..."
              className="textarea textarea-bordered w-full h-24 resize-none"
              maxLength={500}
            />
            <div className="text-xs text-base-content/50 text-right">
              {feedback.length}/500
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default FeedbackModal;
