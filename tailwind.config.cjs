/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui"), require("tailwind-scrollbar")({nocompatible: true})],
    daisyui: {
        themes: [
            {
                mytheme: {

                    "primary": "#547AA5",

                    "secondary": "#914D76",

                    "accent": "#9dbf9b",

                    "neutral": "#2d2e39",

                    "base-100": "#4F5165",

                    "info": "#507CE2",

                    "success": "#41E1C7",

                    "warning": "#FCB769",

                    "error": "#EC5175",
                },
            },
        ],
    },
};
