import { useEffect, useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Calendar, Package, Star, History, TrendingUp, User } from "lucide-react";
import { appointmentsApi, reviewsApi } from "../../../api/client";

const menuItems = [
  { path: "/customer", label: "Dashboard", icon: <TrendingUp size={20} /> },
  { path: "/customer/profile", label: "Profile", icon: <User size={20} /> },
  { path: "/customer/appointment", label: "Book Appointment", icon: <Calendar size={20} /> },
  { path: "/customer/request-parts", label: "Request Parts", icon: <Package size={20} /> },
  { path: "/customer/review", label: "Submit Review", icon: <Star size={20} /> },
  { path: "/customer/history", label: "Purchase History", icon: <History size={20} /> },
];

export function SubmitReview() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentId, setAppointmentId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [reviewData, appointmentData] = await Promise.all([reviewsApi.getMine(), appointmentsApi.getMine()]);
      setReviews(reviewData);
      setAppointments(appointmentData);
    } catch (err: any) {
      setError(err.message || "Failed to load reviews");
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await reviewsApi.create({ appointmentId: Number(appointmentId), rating, comment });
      setMessage("Review submitted successfully.");
      setAppointmentId("");
      setRating(5);
      setComment("");
      await load();
    } catch (err: any) {
      setError(err.message || "Failed to submit review");
    }
  };

  return (
    <DashboardLayout role="customer" menuItems={menuItems}>
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Submit Review</h2>
        {message && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{message}</div>}
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={submit} className="bg-white rounded-lg shadow p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Share Your Experience</h3>
            <div className="space-y-6">
              <select required value={appointmentId} onChange={e => setAppointmentId(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
                <option value="">Select appointment</option>
                {appointments.map(a => <option key={a.id} value={a.id}>#{a.id} - {a.serviceType} - {a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString() : ""}</option>)}
              </select>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(value => (
                    <button type="button" key={value} onClick={() => setRating(value)} className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${value <= rating ? "border-yellow-500 bg-yellow-50" : "border-gray-300"}`}>
                      <Star className="text-yellow-500" fill={value <= rating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea required rows={6} value={comment} onChange={e => setComment(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Tell us about your experience..." />
              <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">Submit Review</button>
            </div>
          </form>

          <div className="bg-white rounded-lg shadow p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">My Previous Reviews</h3>
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < review.rating ? "text-yellow-500" : "text-gray-300"} fill={i < review.rating ? "currentColor" : "none"} />)}
                    <span className="text-sm text-gray-500 ml-2">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{review.serviceType}</p>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
              {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
