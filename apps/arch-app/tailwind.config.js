/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{js,jsx,ts,tsx}', './src/**/*.html'],
	theme: {
		extend: {
			// êšIœr
			colors: {
				primary: {
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
					900: '#1e3a8a',
				},
				secondary: {
					50: '#fdf4ff',
					100: '#fae8ff',
					200: '#f5d0fe',
					300: '#f0abfc',
					400: '#e879f9',
					500: '#d946ef',
					600: '#c026d3',
					700: '#a21caf',
					800: '#86198f',
					900: '#701a75',
				},
				success: '#10b981',
				warning: '#f59e0b',
				error: '#ef4444',
				info: '#3b82f6',
			},

			// êšIôÝ
			spacing: {
				128: '32rem',
				144: '36rem',
			},

			// êšIWS
			fontFamily: {
				sans: [
					'Inter',
					'system-ui',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'sans-serif',
				],
				serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
				mono: ['Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'monospace'],
			},

			// êšIW÷
			fontSize: {
				'2xs': '0.625rem',
				'3xl': '1.953rem',
				'4xl': '2.441rem',
				'5xl': '3.052rem',
			},

			// êšIÒ
			borderRadius: {
				'4xl': '2rem',
			},

			// êšI4q
			boxShadow: {
				'inner-lg': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.1)',
				glow: '0 0 20px rgba(59, 130, 246, 0.5)',
				'glow-lg': '0 0 40px rgba(59, 130, 246, 0.6)',
			},

			// êšI¨;
			animation: {
				'spin-slow': 'spin 3s linear infinite',
				'bounce-slow': 'bounce 2s infinite',
				'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				fadeIn: 'fadeIn 0.5s ease-in-out',
				slideUp: 'slideUp 0.3s ease-out',
				slideDown: 'slideDown 0.3s ease-out',
			},

			// êšIs.'
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				slideDown: {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
			},

			// êšI­¹
			screens: {
				xs: '475px',
				'3xl': '1920px',
			},

			// êšI¹h
			container: {
				center: true,
				padding: {
					DEFAULT: '1rem',
					sm: '2rem',
					lg: '4rem',
					xl: '5rem',
					'2xl': '6rem',
				},
			},
		},
	},
	plugins: [],
};
