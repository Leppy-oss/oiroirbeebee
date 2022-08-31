/** @type {import('tailwindcss').Config} */
const withAnimations = require('animated-tailwindcss');
module.exports = withAnimations({
    content: [
        "./src/**/*.{js,jsx,ts,tsx, css}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'roboto': ['Roboto', 'sans-serif'],
                'comfortaa': ['Comfortaa', 'sans-serif']
            },
            colors: {
                'oiroirbeebee-yellow-1': '#e9d992',
                'oiroirbeebee-greyllow-1': '#443e3b',
                'oiroirbeebee-greyllow-2': '#cab18a',
                'oiroirbeebee-greyllow-3': 'rgba(245, 244, 224, 0.3)',
            },
            animations: {
                'jello': 'animate__animated animate__jello'
            }
        },
    },
    plugins: [],
});