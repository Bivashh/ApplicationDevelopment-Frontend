import { useEffect, useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Calendar, Package, Star, History, TrendingUp, User } from "lucide-react";
import { appointmentsApi, customersApi } from "../../../api/client";

const menuItems = [
  { path: "/customer", label: "Dashboard", icon: <TrendingUp size={20} /> },
  { path: "/customer/profile", label: "Profile", icon: <User size={20} /> },
  { path: "/customer/appointment", label: "Book Appointment", icon: <Calendar size={20} /> },
  { path: "/customer/request-parts", label: "Request Parts", icon: <Package size={20} /> },
  { path: "/customer/review", label: "Submit Review", icon: <Star size={20} /> },
  { path: "/customer/history", label: "Purchase History", icon: <History size={20} /> },
];

const emptyForm = { vehicleId: "", serviceType: "", appointmentDate: "", notes: "" };

export function BookAppointment() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [vehicleData, appointmentData] = await Promise.all([customersApi.vehicles(), appointmentsApi.getMine()]);
      setVehicles(vehicleData);
      setAppointments(appointmentData);
    } catch (err: any) {
      setError(err.message || "Failed to load appointments");
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await appointmentsApi.create({
        vehicleId: Number(form.vehicleId),
        serviceType: form.serviceType,
        appointmentDate: new Date(form.appointmentDate).toISOString(),
        notes: form.notes,
      });
      setMessage("Appointment booked successfully.");
      setForm(emptyForm);
      await load();
    } catch (err: any) {
      setError(err.message || "Failed to book appointment");
    }
  };

  const cancel = async (id: number) => {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await appointmentsApi.cancel(id);
      setMessage("Appointment cancelled.");
      await load();
    } catch (err: any) {
      setError(err.message || "Failed to cancel appointment");
    }
  };

  return (
    <DashboardLayout role="customer" menuItems={menuItems}>
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Book Appointment</h2>
        {message && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{message}</div>}
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

        <div className="grid lg:grid-cols-2 gap-6">
          <form onSubmit={submit} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">New Appointment</h3>
            <div className="space-y-4">
              <select required value={form.vehicleId} onChange={e => setForm({ ...form, vehicleId: e.target.value })} className="w-full px-4 py-3 border rounded-lg">
                <option value="">Select vehicle</option>
                {vehicles.map(vehicle => <option key={vehicle.id} value={vehicle.id}>{vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.plateNumber}</option>)}
              </select>
              <input required value={form.serviceType} onChange={e => setForm({ ...form, serviceType: e.target.value })} className="w-full px-4 py-3 border rounded-lg" placeholder="Service type e.g. Oil Change" />
              <input required type="datetime-local" value={form.appointmentDate} onChange={e => setForm({ ...form, appointmentDate: e.target.value })} className="w-full px-4 py-3 border rounded-lg" />
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full px-4 py-3 border rounded-lg" placeholder="Notes" />
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg">Book Appointment</button>
            </div>
          </form>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">My Appointments</h3>
            <div className="space-y-3">
              {appointments.map(appointment => (
                <div key={appointment.id} className="border rounded-lg p-4 flex justify-between gap-4">
                  <div>
                    <p className="font-bold">{appointment.serviceType}</p>
                    <p className="text-sm text-gray-600">{appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleString() : "-"}</p>
                    <p className="text-sm text-gray-500">{appointment.vehicleName} {appointment.vehiclePlate}</p>
                    <p className="text-sm font-semibold">Status: {appointment.status}</p>
                  </div>
                  {appointment.status !== "Cancelled" && <button onClick={() => cancel(appointment.id)} className="text-red-600 text-sm">Cancel</button>}
                </div>
              ))}
              {appointments.length === 0 && <p className="text-gray-500">No appointments found.</p>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
