import React, { useState } from 'react';
import { Calendar, Clock, User, Plus, Filter, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import { useRatings } from '../../context/RatingContext';
import { mockUsers } from '../../data/mockData';
import { Booking } from '../../types';
import { format, addDays } from 'date-fns';
import FeedbackModal from '../Feedback/FeedbackModal';

const BookingSystem: React.FC = () => {
  const { user } = useAuth();
  const { bookings, addBooking, getBookingsByStudent, getBookingsByCounsellor } = useBookings();
  const { getRatingsByStudent } = useRatings();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCounsellor, setSelectedCounsellor] = useState('');
  const [notes, setNotes] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
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
    sessionDate: '',
  });

  const counsellors = mockUsers.filter(u => u.role === 'counsellor');
  
  const userBookings = user?.role === 'student' 
    ? getBookingsByStudent(user.id)
    : user?.role === 'counsellor'
    ? getBookingsByCounsellor(user.id)
    : bookings;

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBooking: Booking = {
      id: Date.now().toString(),
      studentId: user!.id,
      counsellorId: selectedCounsellor,
      date: selectedDate,
      time: selectedTime,
      status: 'pending',
      notes,
      createdAt: new Date().toISOString(),
    };

    addBooking(newBooking);
    setShowBookingForm(false);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedCounsellor('');
    setNotes('');
  };

  const updateBookingStatus = (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = newStatus;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'completed': return 'badge-info';
      case 'cancelled': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  // Check if a booking has been rated
  const hasBeenRated = (bookingId: string): boolean => {
    if (!user || user.role !== 'student') return false;
    const userRatings = getRatingsByStudent(user.id);
    return userRatings.some(rating => rating.bookingId === bookingId);
  };

  // Handle opening feedback modal
  const openFeedbackModal = (booking: Booking) => {
    const counsellor = mockUsers.find(u => u.id === booking.counsellorId);
    setFeedbackModal({
      isOpen: true,
      bookingId: booking.id,
      counsellorId: booking.counsellorId,
      counsellorName: counsellor?.name || 'Unknown Counsellor',
      sessionDate: booking.date,
    });
  };

  // Handle closing feedback modal
  const closeFeedbackModal = () => {
    setFeedbackModal({
      isOpen: false,
      bookingId: '',
      counsellorId: '',
      counsellorName: '',
      sessionDate: '',
    });
  };

  const getNextWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(new Date(), i);
      dates.push({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'EEE, MMM d'),
      });
    }
    return dates;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {user?.role === 'student' ? 'Book a Session' : 'Manage Bookings'}
          </h1>
          <p className="text-base-content/70">
            {user?.role === 'student' 
              ? 'Schedule a counselling session with our professionals'
              : 'View and manage your counselling sessions'
            }
          </p>
        </div>
        
        {user?.role === 'student' && (
          <button 
            onClick={() => setShowBookingForm(true)}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5" />
            Book Session
          </button>
        )}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && user?.role === 'student' && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Book a Counselling Session</h3>
            
            <form onSubmit={handleBookSession} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Select Counsellor</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={selectedCounsellor}
                  onChange={(e) => setSelectedCounsellor(e.target.value)}
                  required
                >
                  <option value="">Choose a counsellor</option>
                  {counsellors.map(counsellor => (
                    <option key={counsellor.id} value={counsellor.id}>
                      {counsellor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Select Date</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                >
                  <option value="">Choose a date</option>
                  {getNextWeekDates().map(date => (
                    <option key={date.value} value={date.value}>
                      {date.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Select Time</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                >
                  <option value="">Choose a time</option>
                  {availableTimes.map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Additional Notes (Optional)</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered"
                  placeholder="Any specific topics you'd like to discuss..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="modal-action">
                <button 
                  type="button" 
                  className="btn" 
                  onClick={() => setShowBookingForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Book Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bookings List */}
      <div className="grid gap-4">
        {userBookings.length > 0 ? (
          userBookings.map(booking => {
            const counsellor = mockUsers.find(u => u.id === booking.counsellorId);
            const student = mockUsers.find(u => u.id === booking.studentId);
            const displayName = user?.role === 'student' ? counsellor?.name : student?.name;
            
            return (
              <div key={booking.id} className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                          <User className="w-6 h-6" />
                        </div>
                      </div>
                      <div>
                        <h3 className="card-title">{displayName}</h3>
                        <div className="flex items-center gap-4 text-sm text-base-content/70">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(booking.date), 'MMM d, yyyy')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {booking.time}
                          </div>
                        </div>
                        {booking.notes && (
                          <p className="text-sm text-base-content/70 mt-2">{booking.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`badge ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </div>
                      {user?.role === 'counsellor' && booking.status === 'pending' && (
                        <div className="flex gap-1">
                          <button 
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            className="btn btn-success btn-xs"
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            className="btn btn-error btn-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      {user?.role === 'student' && booking.status === 'completed' && (
                        <div className="flex gap-1">
                          {hasBeenRated(booking.id) ? (
                            <div className="badge badge-success badge-sm">
                              <Star className="w-3 h-3 mr-1" />
                              Rated
                            </div>
                          ) : (
                            <button 
                              onClick={() => openFeedbackModal(booking)}
                              className="btn btn-primary btn-xs"
                            >
                              <Star className="w-3 h-3" />
                              Rate Session
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No sessions booked</h3>
            <p className="text-base-content/70 mb-4">
              {user?.role === 'student' 
                ? "You haven't booked any counselling sessions yet."
                : "No students have booked sessions with you yet."
              }
            </p>
            {user?.role === 'student' && (
              <button 
                onClick={() => setShowBookingForm(true)}
                className="btn btn-primary"
              >
                <Plus className="w-5 h-5" />
                Book Your First Session
              </button>
            )}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={closeFeedbackModal}
        bookingId={feedbackModal.bookingId}
        counsellorId={feedbackModal.counsellorId}
        counsellorName={feedbackModal.counsellorName}
        sessionDate={feedbackModal.sessionDate}
      />
    </div>
  );
};

export default BookingSystem;