import React, { useState } from "react";
import { X, ShoppingBag, Minus, Plus, Trash2, CreditCard, User, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cart, getCartSummary, updateQuantity, removeItem, clearCart } = useCartContext();
  const cartSummary = getCartSummary();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const { user, isAuthenticated } = useAuth();

  if (!isOpen) return null;

  // Calculate shipping
  const subtotalNum = parseFloat(cartSummary.subtotal);
  const shippingCost = subtotalNum >= 50 ? 0 : 9.99;
  const taxAmount = parseFloat(cartSummary.tax) || (subtotalNum * 0.08);
  const totalAmount = subtotalNum + taxAmount + shippingCost;

  const handleProceedToCheckout = async () => {
    // Validate cart has items
    if (cartSummary.itemCount === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    // Validate minimum order amount (optional)
    if (subtotalNum < 5) {
      toast({
        title: "Minimum order amount",
        description: "Minimum order amount is $5.00 to proceed to checkout.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingCheckout(true);

    try {
      // Simulate API call for checkout preparation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success feedback
      toast({
        title: "Redirecting to checkout",
        description: `Proceeding with ${cartSummary.itemCount} item(s) - Total: $${totalAmount.toFixed(2)}`,
      });

      // Close cart sidebar
      onClose();

      // Redirect to checkout page (you can replace this with actual checkout route)
      // For demo purposes, we'll redirect to a checkout page
      setTimeout(() => {
        setLocation("/checkout");
      }, 500);

    } catch (error) {
      toast({
        title: "Checkout failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  return (
    <>
      {/* Backdrop - positioned below navbar to not affect its color */}
      <div 
        className="fixed left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[9998]"
        style={{ top: '120px' }}
        onClick={onClose}
      />
      
      {/* Sidebar - Full height from top to bottom */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white z-[9999] shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-lg font-semibold text-gray-900">
            Shopping Cart ({cartSummary.itemCount})
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Status Indicator */}
        <div className={`px-4 py-2 text-sm ${isAuthenticated ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <UserCheck className="h-4 w-4 mr-2" />
                <span>Signed in as {user?.email || 'User'} • Cart synced</span>
              </>
            ) : (
              <>
                <User className="h-4 w-4 mr-2" />
                <span>Guest cart • Sign in to save across devices</span>
              </>
            )}
          </div>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
          {cartSummary.itemCount === 0 ? (
            // Empty Cart State
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="mb-6">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-8">
                Add some products to get started!
              </p>
              <Button 
                onClick={onClose}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            // Cart Items
            <div className="p-4">
              <div className="space-y-4 mb-6">
                {cart?.items?.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <img
                      src={item.imageUrl || "/placeholder-image.jpg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                      <p className="text-sm text-gray-500">Fashion</p>
                      {item.variant && (
                        <p className="text-sm text-gray-500">{item.variant}</p>
                      )}
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        ${item.price}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Clear Cart Button */}
              <div className="mb-6">
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Cart Summary - Fixed at bottom when cart has items */}
        {cartSummary.itemCount > 0 && (
          <div className="border-t bg-white p-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${cartSummary.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${shippingCost.toFixed(2)}</span>
              </div>
              {subtotalNum >= 50 && (
                <p className="text-xs text-green-600">Free shipping on orders over $50</p>
              )}
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={handleProceedToCheckout}
                disabled={isProcessingCheckout || cartSummary.itemCount === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 disabled:bg-gray-400"
              >
                {isProcessingCheckout ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </div>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="w-full"
                disabled={isProcessingCheckout}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar; 