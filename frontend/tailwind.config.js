/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    500: '#8b5cf6', // Violet-500
                    600: '#7c3aed',
                    700: '#6d28d9',
                    900: '#4c1d95',
                },
                surface: {
                    50: '#fafafa', // Minimalist neutral
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    900: '#171717',
                },
                success: {
                    50: '#f0fdf4',
                    500: '#22c55e',
                    700: '#15803d',
                },
                danger: {
                    50: '#fef2f2',
                    500: '#ef4444',
                    700: '#b91c1c',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
