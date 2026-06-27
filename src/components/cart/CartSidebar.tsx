// "use client";
// import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";
// import Link from "next/link";
// import { useCart } from "@/context/CartContext";

// export default function CartSidebar() {
//   const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div
//             key="cart-backdrop"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.25 }}
//             className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px]"
//             onClick={closeCart}
//             aria-hidden="true"
//           />

//           {/* Drawer */}
//           <motion.div
//             key="cart-drawer"
//             initial={{ x: "100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "100%" }}
//             transition={{ type: "spring", damping: 28, stiffness: 280 }}
//             className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-sm sm:max-w-md bg-[#faf8f4] shadow-2xl flex flex-col"
//             role="dialog"
//             aria-label="Shopping cart"
//             aria-modal="true"
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8e0d0]">
//               <div>
//                 <h2 className="text-base font-medium tracking-[0.1em] text-[#1a2744] uppercase">
//                   Shopping Bag
//                 </h2>
//                 {totalItems > 0 && (
//                   <p className="text-xs text-[#1a2744]/50 mt-0.5">
//                     {totalItems} {totalItems === 1 ? "item" : "items"}
//                   </p>
//                 )}
//               </div>
//               <button
//                 onClick={closeCart}
//                 aria-label="Close cart"
//                 className="w-8 h-8 flex items-center justify-center text-[#1a2744]/50 hover:text-[#1a2744] transition-colors"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Items */}
//             <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
//               <AnimatePresence initial={false}>
//                 {items.length === 0 ? (
//                   <motion.div
//                     key="empty"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     className="h-full flex flex-col items-center justify-center text-center py-20 gap-4"
//                   >
//                     <div className="w-14 h-14 border-2 border-[#e8e0d0] rounded-full flex items-center justify-center">
//                       <svg className="w-6 h-6 text-[#1a2744]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                       </svg>
//                     </div>
//                     <p className="text-sm text-[#1a2744]/50 font-serif">Your bag is empty</p>
//                     <Link
//                       href="/shop"
//                       onClick={closeCart}
//                       className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] font-medium hover:underline"
//                     >
//                       Browse the Collection →
//                     </Link>
//                   </motion.div>
//                 ) : (
//                   items.map((item) => (
//                     <motion.div
//                       key={`${item.id}-${item.size}`}
//                       layout
//                       initial={{ opacity: 0, x: 30 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       exit={{ opacity: 0, x: 30, height: 0 }}
//                       transition={{ duration: 0.22 }}
//                       className="flex gap-4"
//                     >
//                       {/* Image */}
//                       <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden bg-[#e8e0d0]">
//                         <Image
//                           src={item.image}
//                           alt={item.name}
//                           fill
//                           className="object-cover"
//                           sizes="80px"
//                         />
//                       </div>

//                       {/* Details */}
//                       <div className="flex-1 min-w-0 space-y-1">
//                         <div className="flex items-start justify-between gap-2">
//                           <div>
//                             {item.styleNo && (
//                               <p className="text-[10px] tracking-[0.2em] text-[#c9a96e] uppercase font-medium">
//                                 Style No. {item.styleNo}
//                               </p>
//                             )}
//                             <h3 className="text-sm font-medium text-[#1a2744] leading-snug truncate">
//                               {item.name}
//                             </h3>
//                           </div>
//                           <button
//                             onClick={() => removeItem(item.id, item.size)}
//                             aria-label={`Remove ${item.name}`}
//                             className="flex-shrink-0 text-[#1a2744]/30 hover:text-red-500 transition-colors text-xs"
//                           >
//                             Remove
//                           </button>
//                         </div>

//                         {(item.size || item.color) && (
//                           <p className="text-xs text-[#1a2744]/50">
//                             {[item.size, item.color].filter(Boolean).join(" · ")}
//                           </p>
//                         )}

//                         <div className="flex items-center justify-between pt-1">
//                           {/* Qty stepper */}
//                           <div className="flex items-center border border-[#e8e0d0]">
//                             <button
//                               onClick={() => updateQuantity(item.id, item.size, -1)}
//                               aria-label="Decrease quantity"
//                               className="w-8 h-8 flex items-center justify-center text-[#1a2744]/60 hover:text-[#1a2744] transition-colors text-base"
//                             >
//                               −
//                             </button>
//                             <span className="w-8 text-center text-sm font-medium text-[#1a2744]">
//                               {item.quantity}
//                             </span>
//                             <button
//                               onClick={() => updateQuantity(item.id, item.size, 1)}
//                               aria-label="Increase quantity"
//                               className="w-8 h-8 flex items-center justify-center text-[#1a2744]/60 hover:text-[#1a2744] transition-colors text-base"
//                             >
//                               +
//                             </button>
//                           </div>
//                           <span className="text-sm font-semibold text-[#1a2744]">
//                             ₹{(item.price * item.quantity).toLocaleString("en-IN")}
//                           </span>
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* Footer */}
//             {items.length > 0 && (
//               <div className="border-t border-[#e8e0d0] px-6 py-5 space-y-4 bg-[#faf8f4]">
//                 {/* Trust badges */}
//                 <div className="flex items-center justify-around text-[10px] text-[#1a2744]/50 tracking-wide">
//                   {["✓ Free Shipping", "✓ Handcrafted", "✓ Custom Fit"].map((b) => (
//                     <span key={b}>{b}</span>
//                   ))}
//                 </div>

//                 {/* Subtotal */}
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium text-[#1a2744] tracking-wide uppercase text-xs">
//                     Subtotal
//                   </span>
//                   <span className="text-lg font-semibold text-[#1a2744]">
//                     ₹{subtotal.toLocaleString("en-IN")}
//                   </span>
//                 </div>

//                 {/* CTA */}
//                 <Link
//                   href="/custom-order"
//                   onClick={closeCart}
//                   className="block w-full bg-[#1a2744] text-white text-xs tracking-[0.25em] uppercase font-bold py-4 text-center hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
//                 >
//                   Proceed to Order
//                 </Link>
//                 <button
//                   onClick={closeCart}
//                   className="block w-full text-xs tracking-[0.2em] uppercase text-[#1a2744]/50 hover:text-[#1a2744] transition-colors py-1"
//                 >
//                   Continue Shopping
//                 </button>
//               </div>
//             )}
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }

"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartSidebar() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeItem, 
    updateQuantity, 
    subtotal, 
    totalItems 
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px]"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-sm sm:max-w-md bg-[#faf8f4] shadow-2xl flex flex-col"
            role="dialog"
            aria-label="Shopping cart"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8e0d0]">
              <div>
                <h2 className="text-base font-medium tracking-[0.1em] text-[#1a2744] uppercase">
                  Shopping Bag
                </h2>
                {totalItems > 0 && (
                  <p className="text-xs text-[#1a2744]/50 mt-0.5">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </p>
                )}
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="w-8 h-8 flex items-center justify-center text-[#1a2744]/50 hover:text-[#1a2744] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-20 gap-4"
                  >
                    <div className="w-14 h-14 border-2 border-[#e8e0d0] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#1a2744]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <p className="text-sm text-[#1a2744]/50 font-serif">Your bag is empty</p>
                    <Link
                      href="/shop"
                      onClick={closeCart}
                      className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] font-medium hover:underline"
                    >
                      Browse the Collection →
                    </Link>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0 }}
                      transition={{ duration: 0.22 }}
                      className="flex gap-4"
                    >
                      <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden bg-[#e8e0d0]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-medium text-[#1a2744] leading-snug truncate">
                              {item.name}
                            </h3>
                          </div>
                          <button
                            onClick={() => removeItem(item.id, item.size)}
                            className="flex-shrink-0 text-[#1a2744]/30 hover:text-red-500 transition-colors text-xs"
                          >
                            Remove
                          </button>
                        </div>

                        {(item.size || item.color) && (
                          <p className="text-xs text-[#1a2744]/50">
                            {[item.size, item.color].filter(Boolean).join(" · ")}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center border border-[#e8e0d0]">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, -1)}
                              className="w-8 h-8 flex items-center justify-center text-[#1a2744]/60 hover:text-[#1a2744] transition-colors text-base"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-[#1a2744]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, 1)}
                              className="w-8 h-8 flex items-center justify-center text-[#1a2744]/60 hover:text-[#1a2744] transition-colors text-base"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-[#1a2744]">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#e8e0d0] px-6 py-5 space-y-4 bg-[#faf8f4]">
                <div className="flex items-center justify-around text-[10px] text-[#1a2744]/50 tracking-wide">
                  {["✓ Free Shipping", "✓ Handcrafted", "✓ Custom Fit"].map((b) => (
                    <span key={b}>{b}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#1a2744] tracking-wide uppercase text-xs">
                    Subtotal
                  </span>
                  <span className="text-lg font-semibold text-[#1a2744]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-[#1a2744] text-white text-xs tracking-[0.25em] uppercase font-bold py-4 text-center hover:bg-[#c9a96e] hover:text-[#1a2744] transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="block w-full text-xs tracking-[0.2em] uppercase text-[#1a2744]/50 hover:text-[#1a2744] transition-colors py-1"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
