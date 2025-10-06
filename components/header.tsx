import Link from "next/link"
import { Menu, X } from "lucide-react"

export function Header() {

  return (
    <>
      {/* Hidden checkbox for mobile menu toggle */}
      <input type="checkbox" id="mobile-menu-toggle" className="peer sr-only" />
      
      <header className="absolute top-3 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-gray-500/20 backdrop-blur-md rounded-full px-4 sm:px-8 shadow-lg">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="text-white font-bold text-lg sm:text-xl">
              choloJai.
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <Link href="/" className="text-white relative group transition-all duration-300 hover:scale-110">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/about" className="text-white relative group transition-all duration-300 hover:scale-110">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/tour" className="text-white relative group transition-all duration-300 hover:scale-110">
                Tour
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/hotels" className="text-white relative group transition-all duration-300 hover:scale-110">
                Hotels
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/blog" className="text-white relative group transition-all duration-300 hover:scale-110">
                Blog
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/contact" className="text-white relative group transition-all duration-300 hover:scale-110">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Desktop Sign in/up Buttons */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <button className="text-white hover:bg-white/10 px-4 py-2 text-sm rounded-md transition-all duration-300 hover:scale-105 hover:shadow-lg transform">
                Sign in
              </button>
              <button className="bg-teal-500 text-white hover:bg-teal-600 px-4 py-2 text-sm rounded-md transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-0.5">
                Sign up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <label
              htmlFor="mobile-menu-toggle"
              className="lg:hidden text-white p-2 cursor-pointer"
            >
              <Menu className="h-5 w-5 peer-checked:hidden" />
              <X className="h-5 w-5 hidden peer-checked:block" />
            </label>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className="fixed inset-0 z-40 lg:hidden hidden peer-checked:block">
        <label htmlFor="mobile-menu-toggle" className="fixed inset-0 bg-black/50 cursor-pointer" />
        <div className="fixed top-20 right-4 left-4 bg-gray-800/95 backdrop-blur-md rounded-2xl p-6 shadow-xl">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className="text-white text-lg py-2 border-b border-white/10"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-white text-lg py-2 border-b border-white/10"
            >
              About
            </Link>
            <Link 
              href="/tour" 
              className="text-white text-lg py-2 border-b border-white/10"
            >
              Tour
            </Link>
            <Link 
              href="/hotels" 
              className="text-white text-lg py-2 border-b border-white/10"
            >
              Hotels
            </Link>
            <Link 
              href="/blog" 
              className="text-white text-lg py-2 border-b border-white/10"
            >
              Blog
            </Link>
            <Link 
              href="/contact" 
              className="text-white text-lg py-2"
            >
              Contact
            </Link>
            <div className="flex flex-col gap-3 pt-4">
              <button className="text-white hover:bg-white/10 w-full px-5 py-2.5 text-base rounded-md transition-all duration-300 hover:scale-105 hover:shadow-lg transform">
                Sign in
              </button>
              <button className="bg-teal-500 text-white hover:bg-teal-600 w-full px-5 py-2.5 text-base rounded-md transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:-translate-y-0.5">
                Sign up
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
