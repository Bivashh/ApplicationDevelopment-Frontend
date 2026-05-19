import { Link } from "react-router";
import { Wrench, Package, TrendingUp, Users, Shield, LogIn, UserPlus } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wrench className="text-blue-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">Vehicle Parts System</h1>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600">About</a>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold"
            >
              <LogIn size={18} />
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-2 font-semibold"
            >
              <UserPlus size={18} />
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Streamline Your Auto Parts Business
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete inventory management, sales tracking, and customer service platform for vehicle parts retail centers
          </p>
          <p className="text-lg text-gray-500 mt-6">
            Sign in to access your portal or create a new account to get started
          </p>
        </div>

        <div id="features" className="bg-white rounded-xl shadow-lg p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Key Features</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <Package className="text-blue-600 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Inventory Management</h4>
                <p className="text-gray-600">Real-time stock tracking with automatic low-stock alerts</p>
              </div>
            </div>
            <div className="flex gap-4">
              <TrendingUp className="text-blue-600 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Financial Reports</h4>
                <p className="text-gray-600">Daily, monthly, and yearly financial analytics</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Users className="text-blue-600 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Customer Management</h4>
                <p className="text-gray-600">Complete customer and vehicle history tracking</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Shield className="text-blue-600 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">AI Predictions</h4>
                <p className="text-gray-600">Predictive maintenance alerts for customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2026 Vehicle Parts System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
