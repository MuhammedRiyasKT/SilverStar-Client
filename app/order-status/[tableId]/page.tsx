// "use client";
// import { useEffect, useState } from "react";
// import io, { Socket } from "socket.io-client";

// interface OrderItem {
//   menuItem: string;
//   name: string;
//   quantity: number;
//   price: number;
//   size?: string;
//   specialInstructions?: string;
// }

// interface Order {
//   _id: string;
//   tableId: string;
//   status: string;
//   items: OrderItem[];
//   totalAmount: number;
//   createdAt: string;
// }

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
// let socket: Socket;

// export default function OrderStatusPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [tableId, setTableId] = useState<string | null>(null);

//   // 🟢 Load orders from backend
//   const fetchOrders = async (tid: string) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/orders/public?tableId=${tid}`);
//       const data = await res.json();
//       if (data.success) {
//         setOrders(data.data);
//       }
//     } catch (err) {
//       console.error("Fetch orders error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const storedTableId = localStorage.getItem("tableId");
//     if (!storedTableId) {
//       console.warn("❌ Table ID not found in localStorage");
//       setLoading(false);
//       return;
//     }

//     setTableId(storedTableId);
//     fetchOrders(storedTableId);

//     // 🟢 Setup socket
//     socket = io(API_BASE_URL, {
//       transports: ["websocket"],
//       withCredentials: true,
//     });

//     socket.on("connect", () => {
//       console.log("✅ Connected to socket:", socket.id);
//       socket.emit("join-table", storedTableId); // join table room
//     });

//     socket.on("order:new", (order: Order) => {
//       console.log("📥 Order:new received", order);
//       if (order.tableId === storedTableId) {
//         setOrders((prev) => [order, ...prev]);
//       }
//     });

//     socket.on("order:updated", (order: Order) => {
//       console.log("📥 Order:updated received", order);
//       if (order.tableId === storedTableId) {
//         setOrders((prev) =>
//           prev.map((o) => (o._id === order._id ? order : o))
//         );
//       }
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   if (loading) return <div className="p-4">Loading orders...</div>;
//   if (!tableId) return <div className="p-4 text-red-500">❌ Table ID missing</div>;

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">📋 Order Status (Table {tableId})</h2>
//       {orders.length === 0 ? (
//         <p>No orders yet.</p>
//       ) : (
//         <ul className="space-y-4">
//           {orders.map((order) => (
//             <li key={order._id} className="border p-4 rounded-lg shadow">
//               <div className="flex justify-between items-center">
//                 <span className="font-semibold">Order #{order._id.slice(-5)}</span>
//                 <span
//                   className={`px-2 py-1 rounded text-white ${
//                     order.status === "pending"
//                       ? "bg-yellow-500"
//                       : order.status === "preparing"
//                       ? "bg-blue-500"
//                       : order.status === "served"
//                       ? "bg-green-500"
//                       : "bg-gray-500"
//                   }`}
//                 >
//                   {order.status}
//                 </span>
//               </div>
//               <ul className="mt-2">
//                 {order.items.map((item, idx) => (
//                   <li key={idx} className="text-sm">
//                     {item.quantity}x {item.name}{" "}
//                     {item.size && <span>({item.size})</span>} – ₹{item.price}
//                   </li>
//                 ))}
//               </ul>
//               <div className="mt-2 font-semibold">Total: ₹{order.totalAmount}</div>
//               <div className="text-xs text-gray-500">
//                 {new Date(order.createdAt).toLocaleString()}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// "use client";
// import { useEffect, useRef, useState } from "react";
// import io, { Socket } from "socket.io-client";
// import { useParams } from "next/navigation";

// interface OrderItem {
//   menuItem: string;
//   name: string;
//   quantity: number;
//   price: number;
//   size?: string;
//   specialInstructions?: string;
// }
// interface Order {
//   _id: string;
//   tableId: string;
//   status: string;
//   items: OrderItem[];
//   totalAmount: number;
//   createdAt: string;
// }

// /** IMPORTANT:
//  *  REST should include /api in the path, not in the base URL.
//  *  Socket must point to the server root (no /api).
//  */
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
// const SOCKET_URL   = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

// export default function OrderStatusPage() {
//   const { tableId: routeTid } = useParams<{ tableId: string }>();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [tableId, setTableId] = useState<string | null>(null);
//   const socketRef = useRef<Socket | null>(null);

//   const fetchOrders = async (tid: string) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/orders/public?tableId=${tid}`);
//       const data = await res.json();
//       if (data?.success) setOrders(data.data);
//     } catch (err) {
//       console.error("Fetch orders error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // prefer route param; fallback to localStorage to not break your flow
//     const stored = typeof window !== "undefined" ? localStorage.getItem("tableId") : null;
//     const tid = routeTid || stored || null;

//     if (!tid) {
//       console.warn("❌ Table ID missing");
//       setLoading(false);
//       return;
//     }

//     setTableId(tid);
//     fetchOrders(tid);

//     // ----- Socket -----
//     const s = io(SOCKET_URL, {
//       transports: ["websocket"],
//       withCredentials: true,
//     });
//     socketRef.current = s;

//     s.on("connect", () => {
//       console.log("✅ socket connected", s.id);
//       s.emit("join-table", tid); // join room for this table
//     });

//     s.on("connect_error", (e) => {
//       console.error("socket connect_error:", e?.message || e);
//     });

//     s.on("order:new", (order: Order) => {
//       if (order.tableId === tid) setOrders((prev) => [order, ...prev]);
//     });

//     s.on("order:updated", (order: Order) => {
//       if (order.tableId === tid)
//         setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
//     });

//     return () => {
//       s.disconnect();
//     };
//   }, [routeTid]);

//   if (loading) return <div className="p-4">Loading orders...</div>;
//   if (!tableId) return <div className="p-4 text-red-500">❌ Table ID missing</div>;

//   // --- your existing UI unchanged below ---
//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">📋 Order Status (Table {tableId})</h2>
//       {orders.length === 0 ? (
//         <p>No orders yet.</p>
//       ) : (
//         <ul className="space-y-4">
//           {orders.map((order) => (
//             <li key={order._id} className="border p-4 rounded-lg shadow">
//               <div className="flex justify-between items-center">
//                 <span className="font-semibold">Order #{order._id.slice(-5)}</span>
//                 <span
//                   className={`px-2 py-1 rounded text-white ${
//                     order.status === "pending"
//                       ? "bg-yellow-500"
//                       : order.status === "preparing"
//                       ? "bg-blue-500"
//                       : order.status === "served"
//                       ? "bg-green-500"
//                       : "bg-gray-500"
//                   }`}
//                 >
//                   {order.status}
//                 </span>
//               </div>
//               <ul className="mt-2">
//                 {order.items.map((item, idx) => (
//                   <li key={idx} className="text-sm">
//                     {item.quantity}x {item.name} {item.size && <span>({item.size})</span>} – ₹{item.price}
//                   </li>
//                 ))}
//               </ul>
//               <div className="mt-2 font-semibold">Total: ₹{order.totalAmount}</div>
//               <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

"use client"; 

import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useParams } from "next/navigation";
import { requestForToken, onMessageListener } from "@/lib/firebase";

// ----- Interfaces (Your original code, unchanged) -----
interface OrderItem {
  menuItem: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  specialInstructions?: string;
}
interface Order {
  _id: string;
  tableId: string;
  status: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

// ----- Constants (Your original code, unchanged) -----
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://silverstar-serverside.onrender.com";
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "https://silverstar-serverside.onrender.com";

// --- Functional Component Starts Here ---
export default function OrderStatusPage() {
  // ----- State and Hooks (Your original code, unchanged) -----
  const { tableId: routeTid } = useParams<{ tableId: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableId, setTableId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
  // ✅ Get FCM Token when page loads
  requestForToken().then((token) => {
    if (token && tableId) {
      // Save token to backend with tableId
      fetch(`${API_BASE_URL}/save-fcm-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId, token, role: "user" }), 
      });
    }
  });

  // ✅ Listen for foreground messages
  onMessageListener().then((payload) => {
    console.log("📩 Foreground notification:", payload);
    const notif = payload as { notification?: { title?: string; body?: string } };
    alert(notif.notification?.title + " - " + notif.notification?.body);
  });
}, [tableId]);

  // ----- Data Fetching and Socket Logic (Your original code, unchanged)-----
  const fetchOrders = async (tid: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/public?tableId=${tid}`);
      const data = await res.json();
      if (data?.success) setOrders(data.data);
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("tableId") : null;
    const tid = routeTid || stored || null;

    if (!tid) {
      console.warn("❌ Table ID missing");
      setLoading(false);
      return;
    }

    setTableId(tid);
    fetchOrders(tid);

    const s = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    socketRef.current = s;

    s.on("connect", () => {
      console.log("✅ socket connected", s.id);
      s.emit("join-table", tid);
    });

    s.on("connect_error", (e) => {
      console.error("socket connect_error:", e?.message || e);
    });

    s.on("order:new", (order: Order) => {
      if (order.tableId === tid) setOrders((prev) => [order, ...prev]);
    });

    s.on("order:updated", (order: Order) => {
      if (order.tableId === tid)
        setOrders((prev) =>
          prev.map((o) => (o._id === order._id ? order : o))
        );
    });

    return () => {
      s.disconnect();
    };
  }, [routeTid]);

  // ----- Loading and Error States (Styled to match the new theme) -----
  if (loading) {
    return (
      <div className="bg-gray-900 text-yellow-400 min-h-screen flex items-center justify-center">
        Loading orders...
      </div>
    );
  }

  if (!tableId) {
    return (
      <div className="bg-gray-900 text-red-500 min-h-screen flex items-center justify-center">
        ❌ Table ID missing
      </div>
    );
  }

  // ----- NEW USER INTERFACE STARTS HERE -----
  // Helper for styling order status
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Pending", icon: "🕒" };
      case "preparing":
        return { label: "Preparing", icon: "🍳" };
      case "served":
        return { label: "Served", icon: "✅" };
      default:
        return { label: status, icon: "📋" };
    }
  };

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans">
      <div className="container mx-auto max-w-4xl p-4 md:p-8">
        {/* --- Header --- */}
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-yellow-400 tracking-wider uppercase">
            Your Orders
          </h1>
          <p className="text-gray-500 mt-2">
            Real-time status for Table{" "}
            <span className="font-bold text-yellow-300">{tableId}</span>
          </p>
        </header>

        {/* --- Orders List --- */}
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="mx-auto h-20 w-20 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>

            <h2 className="mt-6 text-2xl font-bold text-gray-300">
              No orders yet.
            </h2>
            <p className="mt-2 text-gray-500">
              Your active orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div
                  key={order._id}
                  className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="p-5">
                    {/* Top Section: ID and Status */}
                    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                      <div>
                        <span className="text-sm text-gray-500">ORDER</span>
                        <p className="font-mono font-bold text-lg text-gray-300">
                          #{order._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-yellow-400">
                          {statusInfo.icon} {statusInfo.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Middle Section: Items List */}
                    <ul className="py-4 space-y-3">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-sm">
                          <div className="flex items-baseline">
                            <span className="w-6 text-gray-500">
                              {item.quantity}x
                            </span>
                            <span className="text-gray-300">{item.name}</span>
                            {item.size && (
                              <span className="ml-2 text-xs text-yellow-400 bg-gray-700 px-2 py-0.5 rounded-full">
                                {item.size}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-gray-400">
                            ₹{item.price.toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Bottom Section: Total */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                      <span className="font-semibold text-base text-gray-300">
                        Total Amount
                      </span>
                      <span className="font-bold text-2xl text-yellow-400">
                        ₹{order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
