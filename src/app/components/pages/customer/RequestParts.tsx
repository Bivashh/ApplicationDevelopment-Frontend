import { useEffect, useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import {
  Calendar,
  Package,
  Star,
  History,
  TrendingUp,
  Clock,
  User,
} from "lucide-react";
import { partRequestsApi } from "../../../api/client";

const menuItems = [
  { path: "/customer", label: "Dashboard", icon: <TrendingUp size={20} /> },
  { path: "/customer/profile", label: "Profile", icon: <User size={20} /> },
  { path: "/customer/appointment", label: "Book Appointment", icon: <Calendar size={20} /> },
  { path: "/customer/request-parts", label: "Request Parts", icon: <Package size={20} /> },
  { path: "/customer/review", label: "Submit Review", icon: <Star size={20} /> },
  { path: "/customer/history", label: "Purchase History", icon: <History size={20} /> },
];

export function RequestParts() {
  const [partName, setPartName] = useState("");
  const [description, setDescription] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadRequests = async () => {
    setError("");

    try {
      const data = await partRequestsApi.getMine();
      setRequests(data);
    } catch (err: any) {
      setError(err.message || "Failed to load part requests");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await partRequestsApi.create({
        partName,
        description,
      });

      setPartName("");
      setDescription("");
      setMessage("Part request submitted successfully.");
      await loadRequests();
    } catch (err: any) {
      setError(err.message || "Failed to submit request");
    }
  };

  return (
    <DashboardLayout role="customer" menuItems={menuItems}>
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Request Unavailable Parts
        </h2>

        {message && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={submit} className="bg-white rounded-lg shadow p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Submit New Request
            </h3>

            <div className="space-y-6">
              <input
                required
                type="text"
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Part name e.g. Headlight Assembly"
              />

              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Please provide details about the part you need..."
              />

              <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">
                Submit Request
              </button>
            </div>
          </form>

          <div className="bg-white rounded-lg shadow p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              My Part Requests
            </h3>

            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900">{request.partName}</p>
                      <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                    </div>

                    <span className="px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 bg-yellow-100 text-yellow-800">
                      <Clock size={12} />
                      {request.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">REQ-{request.id}</span>
                    <span className="text-gray-500">
                      {request.requestedAt
                        ? new Date(request.requestedAt).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                </div>
              ))}

              {requests.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No part requests yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}