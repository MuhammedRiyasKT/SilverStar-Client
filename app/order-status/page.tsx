// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Check, Clock, X, Utensils } from "lucide-react"
// import { useRouter } from "next/navigation"
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

// export default function OrderStatusPage() {
//   const [orders, setOrders] = useState<Order[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [tableId, setTableId] = useState("")
//   const router = useRouter()

//   useEffect(() => {
//     // This will only run on client side
//     const storedTableId = localStorage.getItem("lastTableId") || ""
//     setTableId(storedTableId)

//     const fetchOrders = async () => {
//       try {
//         if (!storedTableId) return
        
//         setIsLoading(true)
//         const response = await fetch(/api/orders?tableId=${storedTableId})
        
//         if (!response.ok) {
//           throw new Error("Failed to fetch orders")
//         }
        
//         const data = await response.json()
//         setOrders(data.data || [])
//       } catch (error) {
//         toast.error("Failed to fetch orders")
//         console.error(error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     if (storedTableId) {
//       fetchOrders()
      
//       // Set up polling for real-time updates
//       const interval = setInterval(fetchOrders, 5000)
//       return () => clearInterval(interval)
//     }
//   }, [])

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return <Clock className="w-5 h-5 text-amber-400" />
//       case 'preparing':
//         return <Utensils className="w-5 h-5 text-blue-400" />
//       case 'ready':
//         return <Check className="w-5 h-5 text-green-400" />
//       case 'cancelled':
//         return <X className="w-5 h-5 text-red-400" />
//       default:
//         return null
//     }
//   }

//   const getStatusText = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return "Pending"
//       case 'preparing':
//         return "Preparing"
//       case 'ready':
//         return "Ready to Serve"
//       case 'served':
//         return "Served"
//       case 'cancelled':
//         return "Cancelled"
//       default:
//         return ""
//     }
//   }

//   return (
//     <div className="min-h-screen bg-black text-white relative overflow-hidden">
//       {/* Background effects */}
//       <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_50%)]" />
//       </div>

//       {/* Header */}
//       <header className="relative z-10 text-center py-8 px-4">
//         <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
//           ORDER STATUS
//         </h1>
//         {tableId && <p className="text-xl text-amber-300 mt-2">Table {tableId}</p>}
//       </header>

//       {/* Main content */}
//       <main className="relative z-10 px-4 pb-16 max-w-4xl mx-auto">
//         {isLoading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
//           </div>
//         ) : orders.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-xl text-amber-300">
//               {tableId ? "No active orders for this table" : "No table number found"}
//             </p>
//             <Button 
//               onClick={() => router.push("/")}
//               className="mt-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black"
//             >
//               Back to Menu
//             </Button>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {orders.map((order) => (
//               <Card key={order._id} className="bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30">
//                 <CardHeader className="flex flex-row items-center justify-between p-4">
//                   <CardTitle className="text-lg text-amber-300">
//                     Order #{order._id.slice(-4).toUpperCase()}
//                   </CardTitle>
//                   <div className="flex items-center space-x-2">
//                     {getStatusIcon(order.status)}
//                     <span className={`text-sm ${
//                       order.status === 'ready' ? 'text-green-400' :
//                       order.status === 'cancelled' ? 'text-red-400' :
//                       'text-amber-400'
//                     }`}>
//                       {getStatusText(order.status)}
//                     </span>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="p-4 pt-0">
//                   <div className="space-y-3">
//                     {order.items.map((item, index) => (
//                       <div key={index} className="flex justify-between">
//                         <div>
//                           <p className="text-gray-300">
//                             {item.quantity}x {item.name}
//                             {item.size && ` (${item.size})`}
//                           </p>
//                         </div>
//                         <p className="text-amber-400">₹{item.price * item.quantity}</p>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="mt-4 pt-4 border-t border-amber-400/20 flex justify-between">
//                     <p className="text-gray-300">Total</p>
//                     <p className="text-xl font-bold text-amber-400">₹{order.totalAmount}</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   )
// }

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
//       const res = await fetch(`${API_BASE_URL}/api/orders/public?tableId=${tid}`);
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