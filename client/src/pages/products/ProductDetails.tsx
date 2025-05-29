import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCartContext } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CartSidebar from "@/components/CartSidebar";

interface ProductDetailsProps {
  id: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  specifications: { [key: string]: string };
  images: string[];
  inStock: boolean;
  stockCount: number;
  brand: string;
  sku: string;
  tags: string[];
}

// Enhanced mock data for products
const mockProducts: { [key: string]: Product } = {
  "1": {
    id: "1",
    name: "Men's Premium Casual Shirt",
    category: "Fashion",
    price: 29.99,
    originalPrice: 59.99,
    rating: 4.7,
    reviewCount: 2847,
    description:
      "Transform your everyday style with this meticulously crafted men's casual shirt. Made from a luxurious cotton-polyester blend that feels soft against the skin while maintaining its shape wash after wash. The sophisticated checkered pattern adds visual interest without being overwhelming, making it perfect for both professional meetings and weekend adventures. This versatile piece effortlessly bridges the gap between comfort and style.",
    features: [
      "Premium cotton-polyester blend for ultimate comfort",
      "Wrinkle-resistant technology for busy lifestyles",
      "Tailored fit that flatters without restricting movement",
      "Classic button-down collar with reinforced stitching",
      "Easy-care fabric - machine washable and quick-dry",
      "Fade-resistant colors that stay vibrant",
      "Double-needle hemming for enhanced durability",
      "Signature brand buttons with elegant finish"
    ],
    specifications: {
      Material: "60% Premium Cotton, 40% Polyester",
      Fit: "Modern Tailored Fit",
      Collar: "Button-down Spread Collar",
      "Sleeve Length": "Long Sleeve with Adjustable Cuffs",
      Care: "Machine wash cold, tumble dry low",
      Origin: "Designed in California, Made in Vietnam",
      "Weight": "Medium-weight fabric (180 GSM)",
      "Sizes Available": "XS, S, M, L, XL, XXL",
    },
    images: [
      "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/f/x/u/m-beige-chex-shirt-formal-vellosta-original-imahap5cz32bhsja.jpeg?q=90&crop=false",
      ],
    inStock: true,
    stockCount: 50,
    brand: "ClassicWear",
    sku: "CW-CS-002",
    tags: ["casual", "premium cotton", "comfortable", "versatile", "business casual"],
  },
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ id }) => {
  const [, setLocation] = useLocation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [primarySelectedImage, setPrimarySelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const [hoveredColor, setHoveredColor] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("description");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const cartContext = useCartContext();

  // Color options with the provided images
  const colorOptions = [
    {
      id: 0,
      name: "Beige Check",
      image:
        "https://rukminim2.flixcart.com/image/180/180/xif0q/shirt/f/x/u/m-beige-chex-shirt-formal-vellosta-original-imahap5cz32bhsja.jpeg?q=50",
      mainImage:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/f/x/u/m-beige-chex-shirt-formal-vellosta-original-imahap5cz32bhsja.jpeg?q=90&crop=false",
    },
    {
      id: 1,
      name: "Dark Blue",
      image:
        "https://rukminim2.flixcart.com/image/180/180/xif0q/shirt/9/f/6/-original-imahb3gyguhmybad.jpeg?q=50",
      mainImage:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/9/f/6/-original-imahb3gyguhmybad.jpeg?q=90&crop=false",
    },
    {
      id: 2,
      name: "Light Blue",
      image:
        "https://rukminim2.flixcart.com/image/180/180/xif0q/shirt/z/a/r/-original-imahb3gf2xy5dxr5.jpeg?q=50",
      mainImage:
        "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/z/a/r/-original-imahb3gf2xy5dxr5.jpeg?q=90&crop=false",
    },
  ];

  const product = id ? mockProducts[id] : null;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h2>
          <Button onClick={() => setLocation("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Validate both color and size selection for Fashion items
    if (product.category === "Fashion" && (!selectedSize || selectedColor === null)) {
      toast({
        title: "Selection Required",
        description: "Please select color and size to add product into cart.",
        variant: "destructive",
      });
      return;
    }

    const cartItem = {
      productId: parseInt(product.id),
      name: product.name,
      price: product.price.toString(),
      quantity: quantity,
      imageUrl: product.images[0],
      variant: selectedSize ? `Color: ${colorOptions[selectedColor]?.name}, Size: ${selectedSize}` : `Color: ${colorOptions[selectedColor]?.name}`,
      vendorId: 1, // Default vendor ID
    };

    cartContext.addToCart(cartItem);
    
    // Show success message
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    // Validate both color and size selection for Fashion items before proceeding
    if (product.category === "Fashion" && (!selectedSize || selectedColor === null)) {
      toast({
        title: "Selection Required",
        description: "Please select color and size to add product into cart.",
        variant: "destructive",
      });
      return;
    }

    // For Buy Now, we require login since it's immediate checkout
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to buy now. You can add to cart as a guest.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }
    
    // Add to cart first
    handleAddToCart();
    
    // Then redirect to checkout
    setTimeout(() => {
      setLocation("/checkout");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header - announcement bar */}
      <div className="bg-indigo-600 py-2">
        <div className="container mx-auto px-4 text-center text-white text-sm font-medium">
          Free shipping on orders over $50 • 30-day money-back guarantee
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur-md border-gray-200">
        <div className="container mx-auto px-4">
          {/* Top nav with search, account, cart */}
          <div className="flex items-center justify-between py-4">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span className="text-xl font-bold">ShopEase</span>
              </div>
            </Link>

            {/* Search */}
            <div className="hidden md:flex relative w-full max-w-md mx-4">
              <input 
                type="text" 
                placeholder="Search for products..." 
                className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Account */}
              <Link href="/login" className="flex items-center text-gray-700 hover:text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="ml-2 text-sm font-medium hidden sm:inline">Account</span>
              </Link>

              {/* Wishlist */}
              <a href="#" className="flex items-center text-gray-700 hover:text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="ml-2 text-sm font-medium hidden sm:inline">Wishlist</span>
              </a>

              {/* Cart */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="flex items-center text-gray-700 hover:text-indigo-600 relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="ml-2 text-sm font-medium hidden sm:inline">Cart</span>
                {cartContext.getCartSummary().itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartContext.getCartSummary().itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Main category navigation */}
          <div className="flex items-center py-2 overflow-x-auto scrollbar-hide">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-2 text-sm whitespace-nowrap mr-2">
              Home
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/category/new-arrivals" className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-2 text-sm whitespace-nowrap">
                New Arrivals
              </Link>
              <Link href="/category/electronics" className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-2 text-sm whitespace-nowrap">
                Electronics
              </Link>
              <Link href="/category/clothing" className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-2 text-sm whitespace-nowrap">
                Clothing
              </Link>
              <Link href="/category/home-kitchen" className="text-gray-700 hover:text-indigo-600 font-medium px-3 py-2 text-sm whitespace-nowrap">
                Home & Kitchen
              </Link>
              <Link href="/category/sale" className="text-indigo-600 font-medium px-3 py-2 text-sm whitespace-nowrap">
                Sale
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="flex items-center text-gray-600 hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-lg">
              <img
                src={
                  hoveredColor !== null
                    ? colorOptions[hoveredColor]?.mainImage
                    : selectedColor !== null
                    ? colorOptions[selectedColor]?.mainImage ||
                      product.images[selectedImage]
                    : product.images[selectedImage]
                }
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300 ease-in-out"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    setPrimarySelectedImage(index);
                  }}
                  onMouseEnter={() => setSelectedImage(index)}
                  onMouseLeave={() => setSelectedImage(primarySelectedImage)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 hover:border-indigo-400 hover:shadow-md ${
                    primarySelectedImage === index
                      ? "border-indigo-600 shadow-lg"
                      : selectedImage === index
                      ? "border-indigo-400 shadow-md"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <span>{product.brand}</span>
                <span>•</span>
                <span>SKU: {product.sku}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {product.rating}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.inStock ? (
                <>
                  <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                  <span className="text-green-700 font-medium">
                    In Stock ({product.stockCount} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="h-3 w-3 bg-red-400 rounded-full"></div>
                  <span className="text-red-700 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Color and Size Selection */}
      <div className="space-y-4">
              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex space-x-2">
                  {colorOptions.map((color) => (
            <button
              key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      onMouseEnter={() => setHoveredColor(color.id)}
              onMouseLeave={() => setHoveredColor(null)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:border-indigo-400 hover:shadow-md hover:scale-105 ${
                        selectedColor === color.id
                          ? "border-indigo-600 shadow-lg"
                          : hoveredColor === color.id
                          ? "border-indigo-400 shadow-md"
                          : "border-gray-300"
                      }`}
                      title={color.name}
                    >
                      <img
                        src={color.image}
                        alt={color.name}
                        className="w-full h-full object-cover transition-transform duration-200"
                      />
                    </button>
                  ))}
                </div>
        </div>
        
              {/* Size Selection */}
              {product.category === "Fashion" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <div className="flex space-x-2">
                    {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg font-medium ${
                  selectedSize === size 
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
              )}

              {/* Quantity */}
        <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
        </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400"
                size="lg"
              >
                Buy Now
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                variant="outline"
                className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                size="lg"
              >
            Add to Cart
          </Button>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "description", label: "Description" },
                { id: "features", label: "Features" },
                { id: "specifications", label: "Specifications" },
                { id: "reviews", label: "Reviews" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === "features" && (
              <div>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
      </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-2 border-b border-gray-200"
                  >
                    <span className="font-medium text-gray-900">{key}</span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Customer reviews and ratings will be displayed here.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  This product has {product.reviewCount} verified reviews with an average
                  rating of {product.rating}/5 stars
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
