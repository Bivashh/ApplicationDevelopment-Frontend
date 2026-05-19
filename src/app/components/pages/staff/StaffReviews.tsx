import { useEffect, useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import {
  UserPlus,
  ShoppingCart,
  Search,
  FileText,
  TrendingUp,
  Calendar,
  Package,
  Star,
} from "lucide-react";
import { reviewsApi } from "../../../api/client";

const menuItems = [
  { path: "/staff", label: "Dashboard", icon: <TrendingUp size={20} /> },
  { path: "/staff/register-customer", label: "Register Customer", icon: <UserPlus size={20} /> },
  { path: "/staff/sales", label: "Parts Sales", icon: <ShoppingCart size={20} /> },
  { path: "/staff/search", label: "Customer Search", icon: <Search size={20} /> },
  { path: "/staff/reports", label: "Customer Reports", icon: <FileText size={20} /> },
  { path: "/staff/appointments", label: "Appointments", icon: <Calendar size={20} /> },
  { path: "/staff/part-requests", label: "Part Requests", icon: <Package size={20} /> },
  { path: "/staff/reviews", label: "Reviews", icon: <Star size={20} /> },
];

export function StaffReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState("");

  const loadReviews = async () => {
    setError("");

    try {
      const data = await reviewsApi.getAll();
      setReviews(data);
    } catch (err: any) {
      setError(err.message || "Failed to load reviews");
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <DashboardLayout role="staff" menuItems={menuItems}>
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Customer Reviews
        </h2>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            All Reviews
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Appointment</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left">Comment</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td className="px-4 py-3">{review.id}</td>

                    <td className="px-4 py-3">
                      {review.customerName || review.customerId || "-"}
                    </td>

                    <td className="px-4 py-3">
                      {review.appointmentId || "-"}
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-semibold text-yellow-600">
                        {review.rating || "-"} / 5
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {review.comment || review.reviewText || "-"}
                    </td>

                    <td className="px-4 py-3">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : review.reviewDate
                        ? new Date(review.reviewDate).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}

                {reviews.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No reviews found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}