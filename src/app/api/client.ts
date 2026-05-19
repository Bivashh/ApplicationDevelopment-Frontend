export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "https://localhost:7113";

export type LoginResponse = {
  token: string;
  role: string;
  fullName: string;
  userId: string;
};

type RequestOptions = RequestInit & {
  auth?: boolean;
};

function getToken() {
  return localStorage.getItem("vpp_token") || "";
}

async function readError(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      const data = await response.json();
      if (typeof data === "string") return data;
      if (data?.message) return data.message;
      if (data?.title) return data.title;
      if (data?.errors) return Object.values(data.errors).flat().join(" ");
      return JSON.stringify(data);
    }
    return await response.text();
  } catch {
    return response.statusText || "Request failed";
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Accept", "application/json");

  if (options.auth !== false) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await readError(response);
    throw new Error(`${response.status}: ${message || response.statusText}`);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      auth: false,
    }),
    registerCustomer: (data: {
      fullName: string;
      email: string;
      password: string;
      phone?: string;
      address?: string;

      // vehicle fields
      plateNumber?: string;
      make?: string;
      model?: string;
      year?: number;
      vehicleNotes?: string;
    }) =>
    apiRequest<LoginResponse>("/api/auth/register-customer", {
      method: "POST",
      body: JSON.stringify(data),
      auth: false,
    }),
  registerStaff: (data: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    employeeCode: string;
  }) =>
    apiRequest<any>("/api/auth/register-staff", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const partsApi = {
  getAll: () => apiRequest<any[]>("/api/parts"),
  getLowStock: () => apiRequest<any[]>("/api/parts/low-stock"),
  create: (data: any) => apiRequest<any>("/api/parts", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiRequest<any>(`/api/parts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => apiRequest<any>(`/api/parts/${id}`, { method: "DELETE" }),
};

export const vendorsApi = {
  getAll: () => apiRequest<any[]>("/api/vendors"),
  create: (data: any) => apiRequest<any>("/api/vendors", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiRequest<any>(`/api/vendors/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => apiRequest<any>(`/api/vendors/${id}`, { method: "DELETE" }),
};

export const purchaseApi = {
  getAll: () => apiRequest<any[]>("/api/purchase-invoices"),
  create: (data: any) => apiRequest<any>("/api/purchase-invoices", { method: "POST", body: JSON.stringify(data) }),
};

export const lowStockApi = {
  getActive: () => apiRequest<any[]>("/api/low-stock-alerts/active"),
  generate: () => apiRequest<any[]>("/api/low-stock-alerts/generate", { method: "POST" }),
  resolve: (id: number) => apiRequest<any>(`/api/low-stock-alerts/${id}/resolve`, { method: "PUT" }),
};

export const staffApi = {
  getAll: () => apiRequest<any[]>("/api/staff"),
  delete: (id: number) => apiRequest<any>(`/api/staff/${id}`, { method: "DELETE" }),
  registerCustomerWithVehicle: (data: any) =>
    apiRequest<any>("/api/staff/customers/register-with-vehicle", { method: "POST", body: JSON.stringify(data) }),
};

export const salesApi = {
  getAll: () => apiRequest<any[]>("/api/sales-invoices"),
  create: (data: any) => apiRequest<any>("/api/sales-invoices", { method: "POST", body: JSON.stringify(data) }),
};

export const customersApi = {
  me: () => apiRequest<any>("/api/customers/me"),
  updateMe: (data: any) => apiRequest<any>("/api/customers/me", { method: "PUT", body: JSON.stringify(data) }),
  vehicles: () => apiRequest<any[]>("/api/customers/vehicles"),
  addVehicle: (data: any) => apiRequest<any>("/api/customers/vehicles", { method: "POST", body: JSON.stringify(data) }),
  updateVehicle: (id: number, data: any) => apiRequest<any>(`/api/customers/vehicles/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteVehicle: (id: number) => apiRequest<any>(`/api/customers/vehicles/${id}`, { method: "DELETE" }),
  reports: () => apiRequest<any[]>("/api/customers/reports"),
  search: (data: any) => apiRequest<any[]>("/api/customers/search", { method: "POST", body: JSON.stringify(data) }),
  history: (customerId: number) => apiRequest<any[]>(`/api/customers/${customerId}/history`),
};

export const reportsApi = {
  financialSummary: () => apiRequest<any>("/api/reports/financial-summary"),
  monthlySales: () => apiRequest<any[]>("/api/reports/monthly-sales"),
  topSellingParts: () => apiRequest<any[]>("/api/reports/top-selling-parts"),
};

export const appointmentsApi = {
  getMine: () => apiRequest<any[]>("/api/appointments/me"),
  getAll: () => apiRequest<any[]>("/api/appointments"),
  create: (data: any) => apiRequest<any>("/api/appointments", { method: "POST", body: JSON.stringify(data) }),
  cancel: (id: number) => apiRequest<any>(`/api/appointments/${id}/cancel`, { method: "PUT" }),
  updateStatus: (id: number, data: any) => apiRequest<any>(`/api/appointments/${id}/status`, { method: "PUT", body: JSON.stringify(data) }),
};

export const partRequestsApi = {
  create: (data: any) =>
    apiRequest<any>("/api/part-requests", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMine: () =>
    apiRequest<any[]>("/api/part-requests/me"),

  getAll: () =>
    apiRequest<any[]>("/api/part-requests"),

  updateStatus: (id: number, data: any) =>
    apiRequest<any>(`/api/part-requests/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export const reviewsApi = {
  getMine: () => apiRequest<any[]>("/api/reviews/me"),
  getAll: () => apiRequest<any[]>("/api/reviews"),
  create: (data: any) => apiRequest<any>("/api/reviews", { method: "POST", body: JSON.stringify(data) }),
};
