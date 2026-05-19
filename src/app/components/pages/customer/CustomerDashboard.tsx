import { useEffect, useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Calendar, Package, Star, History, TrendingUp, User } from "lucide-react";
import { appointmentsApi, customersApi, reviewsApi } from "../../../api/client";

const menuItems = [
  { path: "/customer", label: "Dashboard", icon: <TrendingUp size={20} /> },
  { path: "/customer/profile", label: "Profile", icon: <User size={20} /> },
  { path: "/customer/appointment", label: "Book Appointment", icon: <Calendar size={20} /> },
  { path: "/customer/request-parts", label: "Request Parts", icon: <Package size={20} /> },
  { path: "/customer/review", label: "Submit Review", icon: <Star size={20} /> },
  { path: "/customer/history", label: "Purchase History", icon: <History size={20} /> },
];

export function CustomerDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [profileData, appointmentsData, reviewsData] = await Promise.all([
          customersApi.me(),
          appointmentsApi.getMine().catch(() => []),
          reviewsApi.getMine().catch(() => []),
        ]);
        setProfile(profileData);
        setAppointments(appointmentsData);
        setReviews(reviewsData);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      }
    }
    load();
  }, []);

  return (
    <DashboardLayout role="customer" menuItems={menuItems}>
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Customer Dashboard</h2>
        <p className="text-gray-600 mb-8">Welcome, {profile?.fullName || "Customer"}</p>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6"><User className="text-green-600 mb-3" size={28} /><p className="text-sm text-gray-600">Vehicles</p><p className="text-3xl font-bold">{profile?.vehicles?.length || 0}</p></div>
          <div className="bg-white rounded-lg shadow p-6"><Calendar className="text-blue-600 mb-3" size={28} /><p className="text-sm text-gray-600">Appointments</p><p className="text-3xl font-bold">{appointments.length}</p></div>
          <div className="bg-white rounded-lg shadow p-6"><Star className="text-yellow-500 mb-3" size={28} /><p className="text-sm text-gray-600">Reviews</p><p className="text-3xl font-bold">{reviews.length}</p></div>
          <div className="bg-white rounded-lg shadow p-6"><History className="text-purple-600 mb-3" size={28} /><p className="text-sm text-gray-600">Total Spent</p><p className="text-3xl font-bold">£{Number(profile?.totalSpent || 0).toFixed(2)}</p></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Upcoming Appointments</h3>
            {appointments.length === 0 && <p className="text-gray-500">No appointments found.</p>}
            {appointments.slice(0, 5).map(appointment => (
              <div key={appointment.id} className="border-b py-3">
                <p className="font-semibold">{appointment.serviceType}</p>
                <p className="text-sm text-gray-600">{appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleString() : "-"} · {appointment.status}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">My Vehicles</h3>
            {(!profile?.vehicles || profile.vehicles.length === 0) && <p className="text-gray-500">No vehicles found.</p>}
            {profile?.vehicles?.map((vehicle: any) => (
              <div key={vehicle.id} className="border-b py-3">
                <p className="font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                <p className="text-sm text-gray-600">Plate: {vehicle.plateNumber}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
