import { useEffect, useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { UserPlus, ShoppingCart, Search, FileText, TrendingUp, Package, Calendar, Star } from "lucide-react";
import { appointmentsApi } from "../../../api/client";

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

export function StaffAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadAppointments = async () => {
    setError("");

    try {
      const data = await appointmentsApi.getAll();
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || "Failed to load appointments");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    setError("");
    setMessage("");

    try {
      await appointmentsApi.updateStatus(id, { status });
      setMessage("Appointment status updated successfully.");
      await loadAppointments();
    } catch (err: any) {
      setError(err.message || "Failed to update appointment status");
    }
  };

  return (
    <DashboardLayout role="staff" menuItems={menuItems}>
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Staff Appointments
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
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            All Appointments
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Vehicle</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-4 py-3">{appointment.id}</td>

                    <td className="px-4 py-3">
                      {appointment.customerName || "-"}
                    </td>

                    <td className="px-4 py-3">
                      <div>{appointment.vehicleName || "-"}</div>
                      <div className="text-sm text-gray-500">
                        {appointment.vehiclePlate || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {appointment.serviceType || "-"}
                    </td>

                    <td className="px-4 py-3">
                      {appointment.appointmentDate
                        ? new Date(appointment.appointmentDate).toLocaleString()
                        : "-"}
                    </td>

                    <td className="px-4 py-3">
                      {appointment.status || "-"}
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={appointment.status || "Pending"}
                        onChange={(e) =>
                          updateStatus(appointment.id, e.target.value)
                        }
                        className="px-3 py-2 border rounded-lg"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}

                {appointments.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No appointments found.
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