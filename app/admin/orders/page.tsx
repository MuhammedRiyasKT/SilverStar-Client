// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Check, Clock, X, Utensils, RefreshCw } from "lucide-react"
// import { ordersAPI } from "@/lib/api"
// import { toast } from "sonner"

// interface OrderItem {
//   name: string
//   quantity: number
//   price: number
//   size?: string
// }

// interface Order {
//   _id: string
//   tableId: string
//   items: OrderItem[]
//   totalAmount: number
//   status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled'
//   createdAt: string
// }

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [statusFilter, setStatusFilter] = useState<string>("all")

//   useEffect(() => {
//     fetchOrders()
//   }, [statusFilter])

//   const fetchOrders = async () => {
//     try {
//       setIsLoading(true)
//       const response = await ordersAPI.getAll({
//         status: statusFilter === "all" ? undefined : statusFilter
//       })
//       setOrders(response.data || [])
//     } catch (error) {
//       toast.error("Failed to fetch orders")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const updateOrderStatus = async (orderId: string, newStatus: string) => {
//     try {
//       await ordersAPI.updateStatus(orderId, newStatus)
//       setOrders(orders.map(order => 
//         order._id === orderId ? { ...order, status: newStatus as Order["status"] } : order
//       ))
//       toast.success("Order status updated")
//     } catch (error) {
//       toast.error("Failed to update order status")
//     }
//   }

//   const filteredOrders = statusFilter === "all" 
//     ? orders 
//     : orders.filter(order => order.status === statusFilter)

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return <Clock className="w-4 h-4 text-amber-400" />
//       case 'preparing':
//         return <Utensils className="w-4 h-4 text-blue-400" />
//       case 'ready':
//         return <Check className="w-4 h-4 text-green-400" />
//       case 'cancelled':
//         return <X className="w-4 h-4 text-red-400" />
//       default:
//         return null
//     }
//   }

//   return (
//     <div className="space-y-4 lg:space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div className="text-center sm:text-left">
//           <h1 className="text-2xl lg:text-3xl font-bold text-amber-400 mb-1 lg:mb-2">Orders</h1>
//           <p className="text-sm lg:text-base text-gray-400">Manage customer orders</p>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Button
//             onClick={fetchOrders}
//             variant="outline"
//             size="sm"
//             className="border-amber-400/50 text-amber-400"
//           >
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Refresh
//           </Button>
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-32 lg:w-40 bg-black/50 border-amber-400/50 text-white">
//               <SelectValue placeholder="Filter status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Orders</SelectItem>
//               <SelectItem value="pending">Pending</SelectItem>
//               <SelectItem value="preparing">Preparing</SelectItem>
//               <SelectItem value="ready">Ready</SelectItem>
//               <SelectItem value="served">Served</SelectItem>
//               <SelectItem value="cancelled">Cancelled</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Orders List */}
//       {isLoading ? (
//         <div className="flex items-center justify-center h-32 lg:h-64">
//           <div className="animate-spin rounded-full h-16 w-16 lg:h-32 lg:w-32 border-b-2 border-amber-400"></div>
//         </div>
//       ) : filteredOrders.length === 0 ? (
//         <div className="text-center py-8 lg:py-12">
//           <p className="text-gray-400 text-sm lg:text-base">No orders found</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 gap-4 lg:gap-6">
//           {filteredOrders.map((order) => (
//             <Card key={order._id} className="bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30">
//               <CardHeader className="flex flex-row items-center justify-between p-4 lg:p-6">
//                 <div>
//                   <CardTitle className="text-lg lg:text-xl text-amber-400">
//                     Order #{order._id.slice(-4).toUpperCase()}
//                   </CardTitle>
//                   <p className="text-sm text-gray-400">Table {order.tableId}</p>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   {getStatusIcon(order.status)}
//                   <span className={`text-sm ${
//                     order.status === 'ready' ? 'text-green-400' :
//                     order.status === 'cancelled' ? 'text-red-400' :
//                     'text-amber-400'
//                   }`}>
//                     {order.status.toUpperCase()}
//                   </span>
//                 </div>
//               </CardHeader>
//               <CardContent className="p-4 lg:p-6 pt-0">
//                 <div className="space-y-3">
//                   {order.items.map((item, index) => (
//                     <div key={index} className="flex justify-between">
//                       <div>
//                         <p className="text-gray-300">
//                           {item.quantity}x {item.name}
//                           {item.size && ` (${item.size})`}
//                         </p>
//                       </div>
//                       <p className="text-amber-400">₹{item.price * item.quantity}</p>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="mt-4 pt-4 border-t border-amber-400/20 flex justify-between">
//                   <p className="text-gray-300">Total</p>
//                   <p className="text-xl font-bold text-amber-400">₹{order.totalAmount}</p>
//                 </div>
//                 <div className="mt-4 flex flex-wrap gap-2">
//                   <Button
//                     size="sm"
//                     variant={order.status === 'pending' ? 'default' : 'outline'}
//                     onClick={() => updateOrderStatus(order._id, 'pending')}
//                     className={order.status === 'pending' ? 'bg-amber-400 text-black' : 'border-amber-400/50 text-amber-400'}
//                   >
//                     Pending
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant={order.status === 'preparing' ? 'default' : 'outline'}
//                     onClick={() => updateOrderStatus(order._id, 'preparing')}
//                     className={order.status === 'preparing' ? 'bg-blue-400 text-black' : 'border-blue-400/50 text-blue-400'}
//                   >
//                     Preparing
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant={order.status === 'ready' ? 'default' : 'outline'}
//                     onClick={() => updateOrderStatus(order._id, 'ready')}
//                     className={order.status === 'ready' ? 'bg-green-400 text-black' : 'border-green-400/50 text-green-400'}
//                   >
//                     Ready
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant={order.status === 'served' ? 'default' : 'outline'}
//                     onClick={() => updateOrderStatus(order._id, 'served')}
//                     className={order.status === 'served' ? 'bg-purple-400 text-black' : 'border-purple-400/50 text-purple-400'}
//                   >
//                     Served
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant={order.status === 'cancelled' ? 'default' : 'outline'}
//                     onClick={() => updateOrderStatus(order._id, 'cancelled')}
//                     className={order.status === 'cancelled' ? 'bg-red-400 text-black' : 'border-red-400/50 text-red-400'}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Clock, X, Utensils, RefreshCw } from "lucide-react";
import { ordersAPI } from "@/lib/api";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";
import { requestForToken, onMessageListener } from "@/lib/firebase";

type OrderStatus = "pending" | "preparing" | "ready" | "served" | "cancelled";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  size?: string;
}
interface Order {
  _id: string;
  tableId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>(""); // ✅ new state
  const socketRef = useRef<Socket | null>(null);

   // ✅ Define tableId (if admin, you might not need this)
  // For example, take from localStorage or context
  const tableId = typeof window !== "undefined" ? localStorage.getItem("tableId") : null;

  useEffect(() => {
    // ✅ Get FCM Token when page loads
    requestForToken().then((token) => {
      if (token && tableId) {
        // Save token to backend with tableId
        fetch(`${API_BASE_URL}/save-fcm-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tableId, token, role: "admin" }), // or role: "user"
        });
      }
    });

    // ✅ Listen for foreground messages
    onMessageListener().then((payload: any) => {
      console.log("📩 Foreground notification:", payload);
      alert(payload.notification?.title + " - " + payload.notification?.body);
    });
  }, [tableId]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await ordersAPI.getAll({
        status: statusFilter === "all" ? undefined : statusFilter,
        date: dateFilter || undefined, // ✅ send date to backend
      });
      setOrders(response.data || []);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, dateFilter]);

  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = s;

    s.on("connect", () => {
      s.emit("join-admin");
    });

    s.on("order:new", (order: Order) => {
      setOrders((prev) => {
        const exists = prev.some((o) => o._id === order._id);
        return exists ? prev : [order, ...prev];
      });
    });

    s.on("order:updated", (order: Order) => {
      setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const filteredOrders =
    statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter as OrderStatus);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-amber-400" />;
      case "preparing":
        return <Utensils className="w-4 h-4 text-blue-400" />;
      case "ready":
        return <Check className="w-4 h-4 text-green-400" />;
      case "cancelled":
        return <X className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold text-amber-400 mb-1 lg:mb-2">Orders</h1>
          <p className="text-sm lg:text-base text-gray-400">Manage customer orders</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchOrders} variant="outline" size="sm" className="border-amber-400/50 text-amber-400">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          {/* ✅ status filter (existing) */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 lg:w-40 bg-black/50 border-amber-400/50 text-white">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="served">Served</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          {/* ✅ new date filter */}
          <div className="relative">
            <div className="relative w-full">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-black/50 border border-amber-400/50 text-white text-sm rounded-md px-2 py-1 pr-10 w-full appearance-none"
              />
              {/* Custom white calendar icon */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 2v2M18 2v2M3 8h18M5 8v12a2 2 0 002 2h10a2 2 0 002-2V8H5z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32 lg:h-64">
          <div className="animate-spin rounded-full h-16 w-16 lg:h-32 lg:w-32 border-b-2 border-amber-400"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-8 lg:py-12">
          <p className="text-gray-400 text-sm lg:text-base">No orders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:gap-6">
          {filteredOrders.map((order) => (
            <Card key={order._id} className="bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30">
              <CardHeader className="flex flex-row items-center justify-between p-4 lg:p-6">
                <div>
                  <CardTitle className="text-lg lg:text-xl text-amber-400">
                    Order #{order._id.slice(-4).toUpperCase()}
                  </CardTitle>
                  <p className="text-sm text-gray-400">Table {order.tableId}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <span
                    className={`text-sm ${order.status === "ready"
                        ? "text-green-400"
                        : order.status === "cancelled"
                          ? "text-red-400"
                          : "text-amber-400"
                      }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-0">
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <p className="text-gray-300">
                          {item.quantity}x {item.name}
                          {item.size ? ` (${item.size})` : ""}
                        </p>
                      </div>
                      <p className="text-amber-400">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-amber-400/20 flex justify-between">
                  <p className="text-gray-300">Total</p>
                  <p className="text-xl font-bold text-amber-400">₹{order.totalAmount}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(["pending", "preparing", "ready", "served", "cancelled"] as OrderStatus[]).map((st) => (
                    <Button
                      key={st}
                      size="sm"
                      variant={order.status === st ? "default" : "outline"}
                      onClick={() => updateOrderStatus(order._id, st)}
                      className={
                        order.status === st
                          ? st === "pending"
                            ? "bg-amber-400 text-black"
                            : st === "preparing"
                              ? "bg-blue-400 text-black"
                              : st === "ready"
                                ? "bg-green-400 text-black"
                                : st === "served"
                                  ? "bg-purple-400 text-black"
                                  : "bg-red-400 text-black"
                          : st === "pending"
                            ? "border-amber-400/50 text-amber-400"
                            : st === "preparing"
                              ? "border-blue-400/50 text-blue-400"
                              : st === "ready"
                                ? "border-green-400/50 text-green-400"
                                : st === "served"
                                  ? "border-purple-400/50 text-purple-400"
                                  : "border-red-400/50 text-red-400"
                      }
                    >
                      {st[0].toUpperCase() + st.slice(1)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
