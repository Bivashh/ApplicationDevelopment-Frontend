import { useEffect, useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { UserPlus, ShoppingCart, Search, FileText, TrendingUp, Package, Calendar, Star } from "lucide-react";
import { partRequestsApi } from "../../../api/client";

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

export function PartRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadRequests = async () => {
    setError("");

    try {
      const data = await partRequestsApi.getAll();
      setRequests(data);
    } catch (err: any) {
      setError(err.message || "Failed to load part requests");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    setMessage("");
    setError("");

    try {
      await partRequestsApi.updateStatus(id, { status });
      setMessage("Part request updated successfully.");
      await loadRequests();
    } catch (err: any) {
      setError(err.message || "Failed to update part request");
    }
  };

  return (
    <DashboardLayout role="staff" menuItems={menuItems}>
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Customer Part Requests
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

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">All Part Requests</h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Part</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Requested</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-4 py-3">REQ-{request.id}</td>
                    <td className="px-4 py-3">{request.customerName || "-"}</td>
                    <td className="px-4 py-3">{request.customerEmail || "-"}</td>
                    <td className="px-4 py-3">{request.partName}</td>
                    <td className="px-4 py-3">{request.description}</td>
                    <td className="px-4 py-3">
                      {request.requestedAt
                        ? new Date(request.requestedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={request.status || "Pending"}
                        onChange={(e) => updateStatus(request.id, e.target.value)}
                        className="px-3 py-2 border rounded-lg"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Ordered">Ordered</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}

                {requests.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                      No part requests found.
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