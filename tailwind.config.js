/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#FFD700', // Gold/Yellow
                secondary: '#333333', // Dark Gray
            }
        },
    },
    plugins: [],
}
