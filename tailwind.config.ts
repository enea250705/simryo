import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
  		colors: {
  			// Professional Brand Colors
  			brand: {
  				50: '#eff8ff',
  				100: '#dbeafe',
  				200: '#bfdbfe',
  				300: '#93c5fd',
  				400: '#60a5fa',
  				500: '#3b82f6',
  				600: '#0066cc', // Primary brand color
  				700: '#1d4ed8',
  				800: '#1e40af',
  				900: '#1e3a8a',
  				950: '#172554',
  			},
  			// Accent Colors
  			accent: {
  				50: '#f0fdfa',
  				100: '#ccfbf1',
  				200: '#99f6e4',
  				300: '#5eead4',
  				400: '#2dd4bf',
  				500: '#00a8e8', // Secondary brand color
  				600: '#0d9488',
  				700: '#0f766e',
  				800: '#115e59',
  				900: '#134e4a',
  				950: '#042f2e',
  			},
  			// Orange accent for CTAs and highlights
  			orange: {
  				50: '#fff7ed',
  				100: '#ffedd5',
  				200: '#fed7aa',
  				300: '#fdba74',
  				400: '#fb923c',
  				500: '#ff6b35', // Orange accent
  				600: '#ea580c',
  				700: '#c2410c',
  				800: '#9a3412',
  				900: '#7c2d12',
  				950: '#431407',
  			},
  			// Professional grays
  			gray: {
  				50: '#f8fafc',
  				100: '#f1f5f9',
  				200: '#e2e8f0',
  				300: '#cbd5e1',
  				400: '#94a3b8',
  				500: '#64748b',
  				600: '#475569',
  				700: '#334155',
  				800: '#1e293b',
  				900: '#0f172a',
  				950: '#020617',
  			},
  			// Success colors
  			success: {
  				50: '#f0fdf4',
  				100: '#dcfce7',
  				200: '#bbf7d0',
  				300: '#86efac',
  				400: '#4ade80',
  				500: '#22c55e',
  				600: '#16a34a',
  				700: '#15803d',
  				800: '#166534',
  				900: '#14532d',
  				950: '#052e16',
  			},
  			// Warning colors
  			warning: {
  				50: '#fffbeb',
  				100: '#fef3c7',
  				200: '#fde68a',
  				300: '#fcd34d',
  				400: '#fbbf24',
  				500: '#f59e0b',
  				600: '#d97706',
  				700: '#b45309',
  				800: '#92400e',
  				900: '#78350f',
  				950: '#451a03',
  			},
  			// Error colors
  			error: {
  				50: '#fef2f2',
  				100: '#fee2e2',
  				200: '#fecaca',
  				300: '#fca5a5',
  				400: '#f87171',
  				500: '#ef4444',
  				600: '#dc2626',
  				700: '#b91c1c',
  				800: '#991b1b',
  				900: '#7f1d1d',
  				950: '#450a0a',
  			},
  			// Semantic colors
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))',
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))',
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))',
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))',
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			xl: 'calc(var(--radius) + 4px)',
  			'2xl': 'calc(var(--radius) + 8px)',
  			'3xl': 'calc(var(--radius) + 12px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
        'slide-left-to-right': {
          '0%': {
            transform: 'translateX(0)'
          },
          '100%': {
            transform: 'translateX(-33.33%)'
  				}
  			},
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-left-to-right': 'slide-left-to-right 30s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'fade-in-down': 'fade-in-down 0.6s ease-out',
        'fade-in-left': 'fade-in-left 0.6s ease-out',
        'fade-in-right': 'fade-in-right 0.6s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'bounce-gentle': 'bounce-gentle 2s infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
  		},
  		fontFamily: {
  			sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  			mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
  			display: ['Inter', 'system-ui', 'sans-serif'],
  		},
  		fontSize: {
  			'2xs': ['0.625rem', { lineHeight: '0.75rem' }],
  			'xs': ['0.75rem', { lineHeight: '1rem' }],
  			'sm': ['0.875rem', { lineHeight: '1.25rem' }],
  			'base': ['1rem', { lineHeight: '1.5rem' }],
  			'lg': ['1.125rem', { lineHeight: '1.75rem' }],
  			'xl': ['1.25rem', { lineHeight: '1.75rem' }],
  			'2xl': ['1.5rem', { lineHeight: '2rem' }],
  			'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  			'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  			'5xl': ['3rem', { lineHeight: '1' }],
  			'6xl': ['3.75rem', { lineHeight: '1' }],
  			'7xl': ['4.5rem', { lineHeight: '1' }],
  			'8xl': ['6rem', { lineHeight: '1' }],
  			'9xl': ['8rem', { lineHeight: '1' }],
  		},
  		spacing: {
  			'18': '4.5rem',
  			'88': '22rem',
  			'128': '32rem',
  			'144': '36rem',
  		},
  		maxWidth: {
  			'8xl': '88rem',
  			'9xl': '96rem',
  		},
  		boxShadow: {
  			'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  			'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  			'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  			'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  			'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  			'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  			'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  			'glow': '0 0 20px rgb(59 130 246 / 0.3)',
  			'glow-lg': '0 0 40px rgb(59 130 246 / 0.4)',
  			'professional': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  			'professional-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  			'professional-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  		},
  		backdropBlur: {
  			xs: '2px',
  		},
  		transitionTimingFunction: {
  			'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  			'ease-out-cubic': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
  			'ease-in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
  		},
  		zIndex: {
  			'60': '60',
  			'70': '70',
  			'80': '80',
  			'90': '90',
  			'100': '100',
  		},
  		screens: {
  			'xs': '475px',
  			'3xl': '1680px',
  			'4xl': '1920px',
  		},
  		aspectRatio: {
  			'4/3': '4 / 3',
  			'3/2': '3 / 2',
  			'2/3': '2 / 3',
  			'9/16': '9 / 16',
  		},
  		typography: {
  			DEFAULT: {
  				css: {
  					maxWidth: 'none',
  					color: '#374151',
  					lineHeight: '1.7',
  					p: {
  						marginTop: '1.25em',
  						marginBottom: '1.25em',
  					},
  					h1: {
  						color: '#111827',
  						fontWeight: '700',
  						fontSize: '2.25em',
  						marginTop: '0',
  						marginBottom: '0.8888889em',
  						lineHeight: '1.1111111',
  					},
  					h2: {
  						color: '#111827',
  						fontWeight: '600',
  						fontSize: '1.5em',
  						marginTop: '2em',
  						marginBottom: '1em',
  						lineHeight: '1.3333333',
  					},
  					h3: {
  						color: '#111827',
  						fontWeight: '600',
  						fontSize: '1.25em',
  						marginTop: '1.6em',
  						marginBottom: '0.6em',
  						lineHeight: '1.6',
  					},
  				},
  			},
  		},
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};
export default config;
