import { useEffect, useState } from "react";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Calendar, Package, Star, History, TrendingUp, User, Trash2 } from "lucide-react";
import { customersApi } from "../../../api/client";

const menuItems = [
  { path: "/customer", label: "Dashboard", icon: <TrendingUp size={20} /> },
  { path: "/customer/profile", label: "Profile", icon: <User size={20} /> },
  { path: "/customer/appointment", label: "Book Appointment", icon: <Calendar size={20} /> },
  { path: "/customer/request-parts", label: "Request Parts", icon: <Package size={20} /> },
  { path: "/customer/review", label: "Submit Review", icon: <Star size={20} /> },
  { path: "/customer/history", label: "Purchase History", icon: <History size={20} /> },
];

const emptyVehicle = { plateNumber: "", make: "", model: "", year: "", notes: "" };

export function ProfileManagement() {
  const [profile, setProfile] = useState<any>(null);
  const [profileForm, setProfileForm] = useState({ fullName: "", phone: "", address: "" });
  const [vehicleForm, setVehicleForm] = useState(emptyVehicle);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      const [profileData, vehicleData] = await Promise.all([customersApi.me(), customersApi.vehicles()]);
      setProfile(profileData);
      setVehicles(vehicleData);
      setProfileForm({ fullName: profileData.fullName || "", phone: profileData.phone || "", address: profileData.address || "" });
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    }
  };

  useEffect(() => { loadProfile(); }, []);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await customersApi.updateMe(profileForm);
      setMessage("Profile updated successfully.");
      await loadProfile();
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    }
  };

  const addVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await customersApi.addVehicle({ ...vehicleForm, year: Number(vehicleForm.year) });
      setVehicleForm(emptyVehicle);
      setMessage("Vehicle added successfully.");
      await loadProfile();
    } catch (err: any) {
      setError(err.message || "Failed to add vehicle");
    }
  };

  const deleteVehicle = async (id: number) => {
    if (!confirm("Delete this vehicle?")) return;
    try {
      await customersApi.deleteVehicle(id);
      setMessage("Vehicle deleted successfully.");
      await loadProfile();
    } catch (err: any) {
      setError(err.message || "Failed to delete vehicle");
    }
  };

  return (
    <DashboardLayout role="customer" menuItems={menuItems}>
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Profile Management</h2>
        {message && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{message}</div>}
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

        <div className="grid lg:grid-cols-2 gap-6">
          <form onSubmit={updateProfile} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">My Details</h3>
            <div className="space-y-4">
              <input disabled value={profile?.email || ""} className="w-full px-4 py-3 border rounded-lg bg-gray-50" placeholder="Email" />
              <input value={profileForm.fullName} onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })} className="w-full px-4 py-3 border rounded-lg" placeholder="Full name" />
              <input value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} className="w-full px-4 py-3 border rounded-lg" placeholder="Phone" />
              <textarea value={profileForm.address} onChange={e => setProfileForm({ ...profileForm, address: e.target.value })} className="w-full px-4 py-3 border rounded-lg" placeholder="Address" />
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg">Update Profile</button>
            </div>
          </form>

          <form onSubmit={addVehicle} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Add Vehicle</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input required value={vehicleForm.plateNumber} onChange={e => setVehicleForm({ ...vehicleForm, plateNumber: e.target.value })} className="px-4 py-3 border rounded-lg" placeholder="Plate number" />
              <input required value={vehicleForm.make} onChange={e => setVehicleForm({ ...vehicleForm, make: e.target.value })} className="px-4 py-3 border rounded-lg" placeholder="Make" />
              <input required value={vehicleForm.model} onChange={e => setVehicleForm({ ...vehicleForm, model: e.target.value })} className="px-4 py-3 border rounded-lg" placeholder="Model" />
              <input required type="number" value={vehicleForm.year} onChange={e => setVehicleForm({ ...vehicleForm, year: e.target.value })} className="px-4 py-3 border rounded-lg" placeholder="Year" />
              <textarea value={vehicleForm.notes} onChange={e => setVehicleForm({ ...vehicleForm, notes: e.target.value })} className="md:col-span-2 px-4 py-3 border rounded-lg" placeholder="Notes" />
            </div>
            <button className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg">Add Vehicle</button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h3 className="text-xl font-bold mb-4">My Vehicles</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="border rounded-lg p-4 flex justify-between items-start">
                <div>
                  <p className="font-bold">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                  <p className="text-sm text-gray-600">Plate: {vehicle.plateNumber}</p>
                  <p className="text-sm text-gray-500">{vehicle.notes}</p>
                </div>
                <button onClick={() => deleteVehicle(vehicle.id)} className="text-red-600"><Trash2 size={18} /></button>
              </div>
            ))}
            {vehicles.length === 0 && <p className="text-gray-500">No vehicles found.</p>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
