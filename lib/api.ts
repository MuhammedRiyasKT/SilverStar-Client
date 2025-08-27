// "use client";

// // API configuration and helper functions
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || " http://localhost:5000/api";

// // Get token from localStorage
// const getToken = () => {
//   if (typeof window !== "undefined") {
//     return localStorage.getItem("admin_token");
//   }
//   return null;
// };

// // API helper function
// const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
//   const token = getToken();

//   const config: RequestInit = {
//     headers: {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     },
//     ...options,
//   };

//   const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ message: "Network error" }));
//     throw new Error(error.message || "Something went wrong");
//   }

//   return response.json();
// };

// // Auth API
// export const authAPI = {
//   login: async (email: string, password: string) => {
//     const response = await apiRequest("/auth/login", {
//       method: "POST",
//       body: JSON.stringify({ email, password }),
//     });

//     if (response.token) {
//       localStorage.setItem("admin_token", response.token);
//     }

//     return response;
//   },

//   getMe: async () => {
//     return apiRequest("/auth/me");
//   },

//   changePassword: async (currentPassword: string, newPassword: string) => {
//     return apiRequest("/auth/change-password", {
//       method: "PUT",
//       body: JSON.stringify({ currentPassword, newPassword }),
//     });
//   },

//   logout: () => {
//     localStorage.removeItem("admin_token");
//   },
// };

// // Categories API
// export const categoriesAPI = {
//   getAll: async () => {
//     return apiRequest("/categories");
//   },

//   getById: async (id: string) => {
//     return apiRequest(`/categories/${id}`);
//   },

//   create: async (categoryData: any) => {
//     return apiRequest("/categories", {
//       method: "POST",
//       body: JSON.stringify(categoryData),
//     });
//   },

//   update: async (id: string, categoryData: any) => {
//     return apiRequest(`/categories/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(categoryData),
//     });
//   },

//   delete: async (id: string) => {
//     return apiRequest(`/categories/${id}`, {
//       method: "DELETE",
//     });
//   },
// };

// // Menu Items API
// export const menuAPI = {
//   getAll: async (params?: { category?: string; search?: string; isAvailable?: boolean }) => {
//     const searchParams = new URLSearchParams();
//     if (params?.category) searchParams.append("category", params.category);
//     if (params?.search) searchParams.append("search", params.search);
//     if (params?.isAvailable !== undefined) searchParams.append("isAvailable", params.isAvailable.toString());

//     const query = searchParams.toString();
//     return apiRequest(`/menu${query ? `?${query}` : ""}`);
//   },

//   getByCategory: async (categoryId: string) => {
//     return apiRequest(`/menu/category/${categoryId}`);
//   },

//   getById: async (id: string) => {
//     return apiRequest(`/menu/${id}`);
//   },

//   create: async (menuItemData: FormData) => {
//     const token = getToken();
//     const response = await fetch(`${API_BASE_URL}/menu`, {
//       method: "POST",
//       headers: {
//         ...(token && { Authorization: `Bearer ${token}` }),
//       },
//       body: menuItemData,
//     });

//     if (!response.ok) {
//       const error = await response.json().catch(() => ({ message: "Network error" }));
//       throw new Error(error.message || "Something went wrong");
//     }

//     return response.json();
//   },

//   update: async (id: string, menuItemData: FormData) => {
//     const token = getToken();
//     const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
//       method: "PUT",
//       headers: {
//         ...(token && { Authorization: `Bearer ${token}` }),
//       },
//       body: menuItemData,
//     });

//     if (!response.ok) {
//       const error = await response.json().catch(() => ({ message: "Network error" }));
//       throw new Error(error.message || "Something went wrong");
//     }

//     return response.json();
//   },

//   delete: async (id: string) => {
//     return apiRequest(`/menu/${id}`, {
//       method: "DELETE",
//     });
//   },
// };

// // Orders API
// export const ordersAPI = {
//   create: async (orderData: any) => {
//     return apiRequest("/orders", {
//       method: "POST",
//       body: JSON.stringify(orderData),
//     });
//   },

//   getAll: async (params?: { status?: string, tableId?: string }) => {
//     const query = new URLSearchParams();
//     if (params?.status) query.append("status", params.status);
//     if (params?.tableId) query.append("tableId", params.tableId);
    
//     return apiRequest(`/orders${query.toString() ? `?${query.toString()}` : ""}`);
//   },

//   getById: async (id: string) => {
//     return apiRequest(`/orders/${id}`);
//   },

//   updateStatus: async (id: string, status: string) => {
//     return apiRequest(`/orders/${id}/status`, {
//       method: "PUT",
//       body: JSON.stringify({ status }),
//     });
//   },
// };

// // Tables API
// export const tablesAPI = {
//   getAll: async () => {
//     return apiRequest("/tables");
//   },

//   occupyTable: async (tableId: string) => {
//     return apiRequest(`/tables/${tableId}/occupy`, {
//       method: "PUT",
//     });
//   },

//   vacateTable: async (tableId: string) => {
//     return apiRequest(`/tables/${tableId}/vacate`, {
//       method: "PUT",
//     });
//   },
// };

"use client";

const safeLocalStorage = {
  get(key: string) {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  },
  set(key: string, value: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  },
  remove(key: string) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getToken = () => safeLocalStorage.get("admin_token");

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Network error" }));
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (response.token) safeLocalStorage.set("admin_token", response.token);
    return response;
  },
  getMe: async () => apiRequest("/auth/me"),
  changePassword: async (currentPassword: string, newPassword: string) =>
    apiRequest("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  logout: () => safeLocalStorage.remove("admin_token"),
};

export const categoriesAPI = {
  getAll: async () => apiRequest("/categories"),
  getById: async (id: string) => apiRequest(`/categories/${id}`),
  create: async (data: any) =>
    apiRequest("/categories", { method: "POST", body: JSON.stringify(data) }),
  update: async (id: string, data: any) =>
    apiRequest(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: async (id: string) =>
    apiRequest(`/categories/${id}`, { method: "DELETE" }),
};

export const menuAPI = {
  getAll: async (params?: { category?: string; search?: string; isAvailable?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.search) query.append("search", params.search);
    if (params?.isAvailable !== undefined) query.append("isAvailable", String(params.isAvailable));
    const qs = query.toString();
    return apiRequest(`/menu${qs ? `?${qs}` : ""}`);
  },
  getByCategory: async (id: string) => apiRequest(`/menu/category/${id}`),
  getById: async (id: string) => apiRequest(`/menu/${id}`),

  create: async (formData: FormData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: "POST",
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Network error" }));
      throw new Error(error.message || "Something went wrong");
    }
    return response.json();
  },

  update: async (id: string, formData: FormData) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: "PUT",
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Network error" }));
      throw new Error(error.message || "Something went wrong");
    }
    return response.json();
  },

  delete: async (id: string) => apiRequest(`/menu/${id}`, { method: "DELETE" }),
};

export const ordersAPI = {
  create: async (orderData: any) =>
    apiRequest("/orders", { method: "POST", body: JSON.stringify(orderData) }),
getAll: async (params?: { status?: string; tableId?: string, date?: string }) => {
  const query = new URLSearchParams();
  if (params?.status) query.append("status", params.status);
  if (params?.tableId) query.append("tableId", params.tableId);
  if (params?.date) query.append("date", params.date); // ✅ add this
  const qs = query.toString();
  return apiRequest(`/orders/public${qs ? `?${qs}` : ""}`);
},
  getById: async (id: string) => apiRequest(`/orders/${id}`),
  updateStatus: async (id: string, status: string) =>
    apiRequest(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

export const settingsAPI = {
  get: async () => apiRequest("/settings"),
  update: async (data: { hotelLat: number; hotelLon: number }) =>
    apiRequest("/settings", { method: "PUT", body: JSON.stringify(data) }),
};

