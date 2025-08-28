"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Minus, UtensilsCrossed, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { ordersAPI, settingsAPI } from "@/lib/api"
import { toast } from "sonner"
import Link from "next/link"

interface CartItem {
  id: string
  _id: string
  name: string
  price: number
  size?: string
  quantity: number
  image?: string
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [tableId, setTableId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // inside SettingsPage component
  const [hotelLocation, setHotelLocation] = useState({ hotelLat: 10.841156, hotelLon: 76.109505 });
  
  useEffect(() => {
    // Load current hotel settings
    const fetchSettings = async () => {
    try {
      const res = await settingsAPI.get();
      if (res.success) setHotelLocation({ 
        hotelLat: parseFloat(res.data.hotelLat),  // string → number
        hotelLon: parseFloat(res.data.hotelLon)   // string → number
      });
    } catch (err) {
      console.error(err);
    }
  };
    fetchSettings();
  }, []);

  // Load cart from localStorage and set up event listeners
  useEffect(() => {
    const loadCart = () => {
      try {
        const cartData = localStorage.getItem("cart")
        if (cartData) {
          const parsedCart = JSON.parse(cartData)
          setCart(parsedCart)
        } else {
          setCart([])
        }
      } catch (error) {
        console.error("Error loading cart:", error)
        setCart([])
        localStorage.setItem("cart", JSON.stringify([]))
      }
    }

    // Initial load
    loadCart()

    // Set up event listeners for cart updates
    window.addEventListener('storage', loadCart)
    window.addEventListener('cartUpdated', loadCart)

    return () => {
      window.removeEventListener('storage', loadCart)
      window.removeEventListener('cartUpdated', loadCart)
    }
  }, [])

  // Update item quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    try {
      if (newQuantity < 1) {
        removeItem(id)
        return
      }

      const updatedCart = cart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )

      setCart(updatedCart)
      localStorage.setItem("cart", JSON.stringify(updatedCart))
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast.error("Failed to update quantity")
    }
  }

  // Remove item from cart
  const removeItem = (id: string) => {
    try {
      const updatedCart = cart.filter(item => item.id !== id)
      setCart(updatedCart)
      localStorage.setItem("cart", JSON.stringify(updatedCart))
      window.dispatchEvent(new Event('cartUpdated'))
      toast.success("Item removed from cart")
    } catch (error) {
      console.error("Error removing item:", error)
      toast.error("Failed to remove item")
    }
  }

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // Haversine Formula (distance calculation)
  function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const handleSubmitOrder = async () => {
    if (!tableId) {
      toast.error("Please enter your table number");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // ✅ Check geolocation
    if (!navigator.geolocation) {
      alert("Geolocation not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        const distance = getDistanceFromLatLonInMeters(
          userLat,
          userLon,
          hotelLocation.hotelLat,  
          hotelLocation.hotelLon    
        );

        console.log("User distance from hotel:", distance, "meters");

        if (distance > 150) {
          alert("❌ You are outside the hotel. Orders are only allowed inside (within 150m).");
          return;
        }

        // ✅ Proceed with order if within 50m
        setIsSubmitting(true);
        try {
          const orderPayload = {
            tableId,
            userId: "guest",
            items: cart.map((item) => ({
              menuItemId: item._id,
              name: item.name,
              price: item.price,
              size: item.size,
              quantity: item.quantity,
            })),
            totalAmount: calculateTotal(),
            latitude: userLat,   
            longitude: userLon   
          };


          localStorage.setItem("lastTableId", tableId);

          const res = await ordersAPI.create(orderPayload);
          if (!res?.success) throw new Error(res?.message || "Failed to place order");

          localStorage.removeItem("cart");
          setCart([]);
          window.dispatchEvent(new Event("cartUpdated"));

          toast.success("✅ Order placed successfully!");
          router.push(`/order-status/${tableId}`);
        } catch (err: any) {
          console.error("Order submission error:", err);
          toast.error(err.message || "Failed to place order. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      },
      (error) => {
        alert("⚠️ Please enable location to place order.\nError: " + error.message);
      }
    );
  };




  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_50%)]" />
      </div>

      <header className="relative z-10 text-center py-8 px-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
          YOUR ORDER
        </h1>
      </header>

      <main className="relative z-10 px-4 pb-16 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="text-amber-400 hover:bg-amber-400/10"
          >
            <ChevronLeft className="mr-2" /> Back to Menu
          </Button>
          <div className="text-amber-400 font-bold">
            {cart.reduce((total, item) => total + item.quantity, 0)} Items
          </div>
        </div>

        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30 mb-6">
          <CardContent className="p-4">
            <div className="space-y-2">
              <Label className="text-amber-300">Table Number</Label>
              <Input
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                className="bg-black/50 border-amber-400/50 text-white"
                placeholder="Enter your table number"
              />
            </div>
          </CardContent>
        </Card>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <UtensilsCrossed className="w-16 h-16 mx-auto text-amber-400 mb-4" />
            <p className="text-xl text-amber-300">Your cart is empty</p>
            <Button
              onClick={() => router.push("/")}
              className="mt-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black"
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="bg-gradient-to-br from-gray-900/80 to-black/80 border-amber-400/30">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {item.image && (
                        <div className="w-16 h-16 rounded-md overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-amber-300">{item.name}</h3>
                            {item.size && (
                              <p className="text-sm text-gray-300 capitalize">Size: {item.size}</p>
                            )}
                            <p className="text-sm text-gray-300">
                              ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="border-amber-400/50 text-amber-400 p-1"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="border-amber-400/50 text-amber-400 p-1"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeItem(item.id)}
                            className="border-red-400/50 text-red-400"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-amber-900/30 to-amber-950/30 border border-amber-400/30 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg text-amber-300">Subtotal:</span>
                <span className="text-xl font-bold text-amber-400">₹{calculateTotal()}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-300">Taxes (included)</span>
                <span className="text-sm text-gray-300">₹0</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold mt-4 pt-4 border-t border-amber-400/30">
                <span className="text-amber-300">Total:</span>
                <span className="text-2xl text-amber-400">₹{calculateTotal()}</span>
              </div>
              <Button
                onClick={handleSubmitOrder}
                className="w-full mt-6 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold hover:from-amber-500 hover:to-yellow-600 h-12 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
