export function CriticalCSS() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          /* Critical CSS for above-the-fold content */
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
          
          /* Critical navbar styles */
          .navbar {
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 50;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }
          
          /* Critical hero styles */
          .hero-section {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0066cc 0%, #00a8e8 50%, #ff6b35 100%);
            position: relative;
            overflow: hidden;
          }
          
          /* Critical button styles */
          .btn-primary {
            background: #0066cc;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
          }
          
          .btn-primary:hover {
            background: #0052a3;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 102, 204, 0.3);
          }
          
          /* Critical card styles */
          .professional-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }
          
          .professional-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }
          
          /* Critical typography */
          h1, h2, h3, h4, h5, h6 {
            font-weight: 600;
            line-height: 1.2;
            color: #1e293b;
          }
          
          h1 { font-size: clamp(2rem, 5vw, 4rem); }
          h2 { font-size: clamp(1.5rem, 4vw, 3rem); }
          h3 { font-size: clamp(1.25rem, 3vw, 2rem); }
          
          /* Critical layout */
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 16px;
          }
          
          /* Critical responsive */
          @media (max-width: 768px) {
            .container {
              padding: 0 12px;
            }
            
            .hero-section {
              min-height: 80vh;
            }
          }
        `,
      }}
    />
  )
} 