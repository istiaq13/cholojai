"use client"

export function HeroSection() {
  return (
    <section className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/image-bg.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 sm:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 text-balance leading-tight">
            Explore
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            your amazing city
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Find great places to stay, eat, shop, or visit from local experts
          </p>

          <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 sm:px-12 sm:py-6 text-base sm:text-lg font-semibold rounded-full transform transition-all hover:scale-105">
            Start Exploring
          </button>
        </div>
      </div>
    </section>
  )
}
