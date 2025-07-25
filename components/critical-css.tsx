export function CriticalCSS() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          /* Critical CSS for above-the-fold content - Mobile Optimized */
          .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s ease, opacity 0.3s ease;
            opacity: 0;
          }
          
          .skip-link:focus {
            top: 6px;
            opacity: 1;
          }
          
          /* Critical navbar styles - Mobile optimized */
          .navbar {
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 50;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            /* Mobile optimization */
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
          
          /* Critical hero styles - Mobile optimized */
          .hero-section {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0066cc 0%, #00a8e8 50%, #ff6b35 100%);
            position: relative;
            overflow: hidden;
            /* Mobile optimization */
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
          
          /* Critical button styles - Mobile optimized */
          .btn-primary {
            background: #0066cc;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
            /* Mobile optimization */
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
          
          .btn-primary:hover {
            background: #0052a3;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 102, 204, 0.3);
          }
          
          /* Critical typography - Mobile optimized */
          h1, h2, h3, h4, h5, h6 {
            font-weight: 600;
            line-height: 1.2;
            color: #1e293b;
            /* Mobile optimization */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          h1 { font-size: clamp(2rem, 5vw, 4rem); }
          h2 { font-size: clamp(1.5rem, 4vw, 3rem); }
          h3 { font-size: clamp(1.25rem, 3vw, 2rem); }
          
          /* Critical layout - Mobile optimized */
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 16px;
            /* Mobile optimization */
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
          
          /* Mobile-first responsive */
          @media (max-width: 768px) {
            .container {
              padding: 0 12px;
            }
            
            .hero-section {
              min-height: 80vh;
            }
            
            /* Mobile-specific optimizations */
            .navbar {
              backdrop-filter: blur(4px);
            }
            
            /* Reduce animations on mobile for better performance */
            .btn-primary:hover {
              transform: none;
              box-shadow: none;
            }
          }
          
          /* Essential Tailwind utilities - Mobile optimized */
          .flex { display: flex; }
          .hidden { display: none; }
          .block { display: block; }
          .grid { display: grid; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .justify-between { justify-content: space-between; }
          .text-center { text-align: center; }
          .text-white { color: white; }
          .text-gray-900 { color: #111827; }
          .bg-white { background-color: white; }
          .bg-blue-600 { background-color: #2563eb; }
          .rounded-lg { border-radius: 0.5rem; }
          .px-4 { padding-left: 1rem; padding-right: 1rem; }
          .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
          .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
          .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
          .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
          .px-8 { padding-left: 2rem; padding-right: 2rem; }
          .mb-4 { margin-bottom: 1rem; }
          .mb-8 { margin-bottom: 2rem; }
          .mt-4 { margin-top: 1rem; }
          .mt-8 { margin-top: 2rem; }
          .w-full { width: 100%; }
          .h-full { height: 100%; }
          .min-h-screen { min-height: 100vh; }
          .max-w-7xl { max-width: 80rem; }
          .mx-auto { margin-left: auto; margin-right: auto; }
          .relative { position: relative; }
          .absolute { position: absolute; }
          .fixed { position: fixed; }
          .top-0 { top: 0; }
          .left-0 { left: 0; }
          .right-0 { right: 0; }
          .z-50 { z-index: 50; }
          .z-10 { z-index: 10; }
          .overflow-hidden { overflow: hidden; }
          .transition-all { transition-property: all; }
          .duration-300 { transition-duration: 300ms; }
          .ease-in-out { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
          .font-bold { font-weight: 700; }
          .font-semibold { font-weight: 600; }
          .text-2xl { font-size: 1.5rem; line-height: 2rem; }
          .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
          .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
          .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
          .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
          .text-xs { font-size: 0.75rem; line-height: 1rem; }
          .leading-tight { line-height: 1.25; }
          .leading-relaxed { line-height: 1.625; }
          .antialiased { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
          .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
          
          /* Mobile-optimized responsive utilities */
          @media (min-width: 640px) {
            .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
            .sm\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
            .sm\\:text-5xl { font-size: 3rem; line-height: 1; }
            .sm\\:py-20 { padding-top: 5rem; padding-bottom: 5rem; }
          }
          
          @media (min-width: 768px) {
            .md\\:grid { display: grid; }
            .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .md\\:flex { display: flex; }
            .md\\:hidden { display: none; }
            .md\\:text-5xl { font-size: 3rem; line-height: 1; }
            .md\\:text-6xl { font-size: 3.75rem; line-height: 1; }
            .md\\:py-20 { padding-top: 5rem; padding-bottom: 5rem; }
            .md\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
          }
          
          @media (min-width: 1024px) {
            .lg\\:flex { display: flex; }
            .lg\\:hidden { display: none; }
            .lg\\:text-6xl { font-size: 3.75rem; line-height: 1; }
            .lg\\:text-7xl { font-size: 4.5rem; line-height: 1; }
            .lg\\:py-24 { padding-top: 6rem; padding-bottom: 6rem; }
            .lg\\:px-12 { padding-left: 3rem; padding-right: 3rem; }
          }
          
          /* Mobile performance optimizations */
          @media (max-width: 768px) {
            /* Reduce transitions on mobile */
            .transition-all {
              transition-property: none;
            }
            
            /* Optimize for mobile touch */
            .btn-primary {
              min-height: 44px;
              min-width: 44px;
            }
            
            /* Reduce shadows on mobile for better performance */
            .shadow-lg {
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
          }
        `
      }}
    />
  )
} 