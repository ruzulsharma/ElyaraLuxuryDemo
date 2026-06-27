"use client";
import { useState, useEffect } from "react";
import Script from "next/script";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    state: "",
    city: "",
    pincode: "",
    addressLine1: "",
    addressLine2: "",
  });

  // Fetch location based on Pincode
  const fetchLocationByPincode = async (pincode: string) => {
    if (pincode.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        
        if (data[0].Status === "Success") {
          const { Circle, District } = data[0].PostOffice[0];
          setFormData((prev) => ({ 
            ...prev, 
            state: Circle, 
            city: District 
          }));
        }
      } catch (error) {
        console.error("Error fetching pincode:", error);
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) value = value.slice(0, 10);
    setFormData({ ...formData, phone: value });
  };

  const handlePayment = async () => {
    if (formData.phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    
    if (!formData.name || !formData.addressLine1 || !formData.pincode) {
      alert("Please fill in all required fields.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: subtotal * 100,
      currency: "INR",
      name: "Elyara by Sweety",
      description: "Bespoke Luxury Fashion",
      handler: (response: any) => {
        alert("Payment Successful! Ref: " + response.razorpay_payment_id);
      },
      prefill: {
        name: formData.name,
        contact: "+91" + formData.phone,
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 grid md:grid-cols-2 gap-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      {/* LEFT: FORM */}
      <div className="space-y-6">
        <h2 className="text-xl font-serif text-[#1a2744] uppercase tracking-widest border-b pb-4">Shipping Details</h2>
        
        <input type="text" placeholder="Full Name" className="w-full p-4 border border-[#e8e0d0]" 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
        
        <div className="flex border border-[#e8e0d0]">
          <span className="p-4 bg-[#e8e0d0]/30 text-[#1a2744]/60">+91</span>
          <input type="tel" placeholder="Phone Number" value={formData.phone} className="w-full p-4 focus:outline-none"
            onChange={handlePhoneChange} />
        </div>

        <input type="text" placeholder="Pincode" className="w-full p-4 border border-[#e8e0d0]" 
            maxLength={6}
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} 
            onBlur={(e) => fetchLocationByPincode(e.target.value)} 
        />

        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="State" value={formData.state} className="p-4 border border-[#e8e0d0]" readOnly />
          <input type="text" placeholder="City" value={formData.city} className="p-4 border border-[#e8e0d0]" readOnly />
        </div>
        
        <input type="text" placeholder="Address Line 1" className="w-full p-4 border border-[#e8e0d0]" 
          onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })} value={formData.addressLine1} />
        
        <input type="text" placeholder="Address Line 2 (Optional)" className="w-full p-4 border border-[#e8e0d0]" 
          onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} value={formData.addressLine2} />
      </div>

      {/* RIGHT: SUMMARY */}
      <div className="bg-[#f5f0e8] p-8 h-fit">
        <h2 className="text-xl font-serif text-[#1a2744] mb-6">Order Summary</h2>
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#e8e0d0] pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <button onClick={handlePayment} className="w-full bg-[#1a2744] text-white py-4 mt-8 uppercase tracking-widest font-bold hover:bg-[#c9a96e]">
          Pay ₹{subtotal.toLocaleString("en-IN")}
        </button>
      </div>
    </div>
  );
}