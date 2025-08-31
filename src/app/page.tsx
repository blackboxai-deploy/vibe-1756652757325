'use client'

import React, { useState, createContext, useContext, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, ShoppingCart, User, Search, Menu, X, Plus, Minus, Heart } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { toast } from 'sonner'

// Types
interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  description: string
  category: string
  rating: number
  reviews: number
  colors?: string[]
  sizes?: string[]
}

interface CartItem extends Product {
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, options?: { color?: string; size?: string }) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  getTotalItems: () => number
  getTotalPrice: () => number
  clearCart: () => void
}

// Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined)

const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Sample Products Data
const products: Product[] = [
  {
    id: 1,
    name: "PowerPack Pro Sports Bag",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop",
    description: "Built for Your Active Life. Designed to accommodate all your essentials, from workout clothes to sports equipment, with room to spare. Perfect for gym sessions, practice, or weekend tournaments.",
    category: "Bags",
    rating: 4.8,
    reviews: 124,
    colors: ["Blue", "Black", "Red"],
    sizes: ["Small", "Medium", "Large"]
  },
  {
    id: 2,
    name: "Elite Workout Companion",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=400&fit=crop",
    description: "Your Companion Workout. Engineered to be lightweight without compromising strength, making it easy to carry while withstanding heavy loads of gear.",
    category: "Bags",
    rating: 4.6,
    reviews: 89,
    colors: ["Green", "Black", "Navy"],
    sizes: ["Medium", "Large"]
  },
  {
    id: 3,
    name: "StyleFlex Performance Bag",
    price: 94.99,
    originalPrice: 129.99,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    description: "Performance and Style in One. Adjustable dividers and removable compartments let you organize your bag your way, whether you're carrying gym gear, sports equipment, or travel essentials.",
    category: "Bags",
    rating: 4.9,
    reviews: 156,
    colors: ["Pink", "Purple", "White"],
    sizes: ["Small", "Medium", "Large", "XL"]
  },
  {
    id: 4,
    name: "Pro Training Shoes",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop",
    description: "High-performance training shoes designed for maximum comfort and durability during intense workouts.",
    category: "Footwear",
    rating: 4.7,
    reviews: 203,
    colors: ["Black", "White", "Red"],
    sizes: ["7", "8", "9", "10", "11", "12"]
  },
  {
    id: 5,
    name: "Athletic Performance Shirt",
    price: 39.99,
    originalPrice: 59.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop",
    description: "Moisture-wicking performance shirt perfect for training and competition. Lightweight and breathable fabric.",
    category: "Apparel",
    rating: 4.5,
    reviews: 78,
    colors: ["Black", "Blue", "Red", "White"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  {
    id: 6,
    name: "Premium Yoga Mat",
    price: 69.99,
    originalPrice: 89.99,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
    description: "Non-slip premium yoga mat with superior cushioning and grip. Perfect for yoga, pilates, and floor exercises.",
    category: "Equipment",
    rating: 4.8,
    reviews: 167,
    colors: ["Purple", "Blue", "Green", "Pink"],
    sizes: ["Standard", "Extra Long"]
  }
]

// Cart Provider Component
const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (product: Product, options?: { color?: string; size?: string }) => {
    setItems(prev => {
      const existingItem = prev.find(item => 
        item.id === product.id && 
        item.selectedColor === options?.color && 
        item.selectedSize === options?.size
      )
      
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id && 
          item.selectedColor === options?.color && 
          item.selectedSize === options?.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      return [...prev, { 
        ...product, 
        quantity: 1, 
        selectedColor: options?.color,
        selectedSize: options?.size 
      }]
    })
    toast.success('Added to cart!')
  }

  const removeFromCart = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
    toast.success('Removed from cart')
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item))
  }

  const getTotalItems = () => items.reduce((total, item) => total + item.quantity, 0)
  const getTotalPrice = () => items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const clearCart = () => setItems([])

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalItems,
      getTotalPrice,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

// Header Component
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      {/* Top Banner */}
      <div className="bg-red-500 text-white text-center py-2 px-4 font-semibold text-sm">
        🎉 FREE SHIPPING! WELCOME! SITEWIDE SALE 🎉
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#products" className="text-gray-700 hover:text-gray-900 font-medium">Products</a>
              <a href="#categories" className="text-gray-700 hover:text-gray-900 font-medium">Categories</a>
              <a href="#about" className="text-gray-700 hover:text-gray-900 font-medium">About</a>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Empty space for layout balance */}
            <div className="flex-1 md:flex-none">
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t bg-white py-4">
              <nav className="flex flex-col space-y-4">
                <a href="#products" className="text-gray-700 hover:text-gray-900 font-medium px-4">Products</a>
                <a href="#categories" className="text-gray-700 hover:text-gray-900 font-medium px-4">Categories</a>
                <a href="#about" className="text-gray-700 hover:text-gray-900 font-medium px-4">About</a>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}



// Product Card Component
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart()
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0])
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = () => {
    addToCart(product, { color: selectedColor, size: selectedSize })
  }

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500">
            -{discount}%
          </Badge>
        )}
        <button 
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
        >
          <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">{product.category}</Badge>
          <div className="flex items-center space-x-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        {/* Color Selection */}
        {product.colors && (
          <div className="mb-3">
            <p className="text-sm font-medium mb-2">Color:</p>
            <div className="flex space-x-2">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 text-xs border rounded ${
                    selectedColor === color ? 'border-gray-900 bg-gray-100' : 'border-gray-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection */}
        {product.sizes && (
          <div className="mb-3">
            <p className="text-sm font-medium mb-2">Size:</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 text-xs border rounded ${
                    selectedSize === size ? 'border-gray-900 bg-gray-100' : 'border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">${product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-500 line-through text-sm">${product.originalPrice}</span>
            )}
          </div>
          <Button onClick={handleAddToCart} size="sm" className="bg-red-500 hover:bg-red-600">
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Hero Section Component
const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Gear Up for Victory
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300">
          Shop Top Sports Equipment & Unleash Your Potential
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-red-500 hover:bg-red-600 text-lg px-8 py-3">
            Shop Now
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-gray-900">
            View Categories
          </Button>
        </div>
      </div>
    </section>
  )
}

// Features Section Component
const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: "⭐",
      title: "Premium Quality Gear",
      description: "From activewear to sports equipment, you can trust that our gear is made to last and designed to enhance your athletic performance."
    },
    {
      icon: "💧",
      title: "Expert Recommendations", 
      description: "Whether you're beginner or seasoned pro, we provide personalized recommendations to match your needs."
    },
    {
      icon: "🚚",
      title: "Fast & Free Shipping",
      description: "We offer fast and free shipping on orders over $50, so you can get back to training, playing, and performing without the wait."
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
          <p className="text-lg text-gray-600">Committed to empowering your fitness journey</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials Component
const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah L.",
      title: "Game-Changer for My Training",
      content: "I've been using the gear from this store for a few months now, and it's truly a game-changer for my training. The quality is outstanding and the customer service is exceptional.",
      rating: 5
    },
    {
      name: "Daniel M.",
      title: "Perfect Fit for My Fitness Journey", 
      content: "The quality of the activewear and supplements here is fantastic. I started using their protein powder and have seen amazing results in my workouts.",
      rating: 5
    },
    {
      name: "Emily R.",
      title: "Top-Notch Sports Equipment!",
      content: "I'm extremely impressed with the tennis rackets and balls I purchased from this store. The racket is lightweight yet powerful, and the balls have great bounce and durability.",
      rating: 5
    }
  ]

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gray-50">
              <CardContent className="p-6">
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <h3 className="font-semibold mb-3">{testimonial.title}</h3>
                <p className="text-gray-600 mb-4">{testimonial.content}</p>
                <p className="font-medium text-sm">{testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Newsletter Component
const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      toast.success('Successfully subscribed to newsletter!')
      setEmail('')
    }
  }

  return (
    <section className="bg-slate-600 text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm mb-4 opacity-90">🔥 SEASONAL SALE • SEASONAL SALE • SEASONAL SALE 🔥</p>
        <h2 className="text-3xl font-bold mb-4">Don't Miss Our Hot Deals!</h2>
        <p className="text-lg mb-8 opacity-90">Be the first to know about new collections and exclusive offers.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white text-gray-900"
            required
          />
          <Button type="submit" className="bg-white text-slate-600 hover:bg-gray-100">
            Subscribe →
          </Button>
        </form>
      </div>
    </section>
  )
}

// Contact Form Component
const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Message sent successfully!')
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <Input
                name="phone"
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
              />
              <Textarea
                name="message"
                placeholder="Your message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
              />
              <Button type="submit" className="w-full bg-slate-600 hover:bg-slate-700">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <div className="space-y-2 text-gray-600">
              <p>🎉 Committed to empowering your fitness journey with top-quality gear and accessories.</p>
              <p>⚡ Combining performance, durability, and style to help you reach your goals.</p>
              <p>🏅 Whether you're training, competing, or staying active, we've got what you need to push your limits.</p>
            </div>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-2xl hover:text-gray-600">📷</a>
              <a href="#" className="text-2xl hover:text-gray-600">▶️</a>
              <a href="#" className="text-2xl hover:text-gray-600">🎵</a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-600 hover:text-gray-900">Search</a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">Terms of Service</a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">Contact</a>
            </div>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-2xl hover:text-gray-600">📷</a>
              <a href="#" className="text-2xl hover:text-gray-600">▶️</a>
              <a href="#" className="text-2xl hover:text-gray-600">🎵</a>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-gray-600">
          <p>&copy; 2024 Sports Gear Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// Main Page Component
export default function HomePage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <HeroSection />
          
          {/* Products Section */}
          <section id="products" className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
                <p className="text-lg text-gray-600">Discover our premium sports equipment and gear</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>

          <FeaturesSection />
          <TestimonialsSection />
          <NewsletterSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}