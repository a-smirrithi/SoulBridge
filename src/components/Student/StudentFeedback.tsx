import React, { useState } from 'react';
import { Star, Calendar, User, MessageSquare, Plus, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRatings } from '../../context/RatingContext';
import { useBookings } from '../../context/BookingContext';
import { mockUsers } from '../../data/mockData';
import FeedbackModal from '../Feedback/FeedbackModal';

const StudentFeedback: React.FC = () => {
  const { user } = useAuth();
  const { getRatingsByStudent, hasRatingForBooking, getRatingForBooking } = useRatings();
  const { bookings } = useBookings();
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    bookingId: string;
    counsellorId: string;
    counsellorName: string;
    sessionDate: string;
  }>({
    isOpen: false,
    bookingId: '',
    counsellorId: '',
    counsellorName: '',
    sessionDate: ''
  });

  if (!user) return null;

  const studentRatings = getRatingsByStudent(user.id);
  const completedBookings = bookings.filter(
    booking => booking.studentId === user.id && booking.status === 'completed'
  );

  // Get bookings that haven't been rated yet
  const unratedBookings = completedBookings.filter(
    booking => !hasRatingForBooking(user.id, booking.id)
  );

  // Calculate average rating given by student
  const averageRating = studentRatings.length > 0 
    ? studentRatings.reduce((sum, rating) => sum + rating.rating, 0) / studentRatings.length 
    : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getCounsellorName = (counsellorId: string) => {
    const counsellor = mockUsers.find(u => u.id === counsellorId);
    return counsellor?.name || 'Unknown Counsellor';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Feedback & Ratings</h1>
        <p className="text-base-content/70">View your session feedback and ratings</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-primary">
            <Star className="w-8 h-8" />
          </div>
          <div className="stat-title">Average Rating Given</div>
          <div className="stat-value text-primary">
            {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
          </div>
          <div className="stat-desc">Out of 5 stars</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-success">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div className="stat-title">Feedback Given</div>
          <div className="stat-value text-success">{studentRatings.length}</div>
          <div className="stat-desc">Total reviews</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-figure text-info">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="stat-title">Sessions Completed</div>
          <div className="stat-value text-info">{completedBookings.length}</div>
          <div className="stat-desc">Total sessions</div>
        </div>
      </div>

      {/* Feedback History */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title mb-4">Your Feedback History</h3>
          
          {studentRatings.length === 0 ? (
            <div className="text-center py-8">
              <Star className="w-16 h-16 mx-auto text-base-300 mb-4" />
              <p className="text-base-content/70">No feedback given yet</p>
              <p className="text-sm text-base-content/50">Complete a session to leave feedback</p>
            </div>
          ) : (
            <div className="space-y-4">
              {studentRatings.map((rating) => {
                const booking = completedBookings.find(b => b.id === rating.bookingId);
                return (
                  <div key={rating.id} className="border border-base-300 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-10">
                            <User className="w-5 h-5" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">
                            Session with {getCounsellorName(rating.counsellorId)}
                          </p>
                          <p className="text-sm text-base-content/60">
                            {booking ? new Date(booking.date).toLocaleDateString() : 'Date unavailable'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(rating.rating)}
                      </div>
                    </div>
                    
                    {rating.feedback && (
                      <div className="bg-base-200 rounded-lg p-3">
                        <p className="text-sm italic">"{rating.feedback}"</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-3 text-xs text-base-content/50">
                      <span>Feedback given on {new Date(rating.timestamp).toLocaleDateString()}</span>
                      <span>Rating: {rating.rating}/5</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sessions Awaiting Feedback */}
      {unratedBookings.length > 0 && (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title mb-4">
              <Clock className="w-5 h-5 text-warning" />
              Sessions Awaiting Your Feedback
            </h3>
            <div className="space-y-3">
              {unratedBookings.map((booking) => (
                <div key={booking.id} className="border border-base-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-secondary text-secondary-content rounded-full w-10">
                          <User className="w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">
                          Session with {getCounsellorName(booking.counsellorId)}
                        </p>
                        <p className="text-sm text-base-content/60">
                          {new Date(booking.date).toLocaleDateString()} at {booking.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="badge badge-warning">Feedback Pending</div>
                      <button
                        onClick={() => setFeedbackModal({
                          isOpen: true,
                          bookingId: booking.id,
                          counsellorId: booking.counsellorId,
                          counsellorName: getCounsellorName(booking.counsellorId),
                          sessionDate: booking.date
                        })}
                        className="btn btn-primary btn-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Rate Session
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-info/10 rounded-lg">
              <p className="text-sm text-info">
                <strong>Note:</strong> You can rate each session only once. Once submitted, ratings cannot be changed or updated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal(prev => ({ ...prev, isOpen: false }))}
        bookingId={feedbackModal.bookingId}
        counsellorId={feedbackModal.counsellorId}
        counsellorName={feedbackModal.counsellorName}
        sessionDate={feedbackModal.sessionDate}
      />
    </div>
  );
};

export default StudentFeedback;