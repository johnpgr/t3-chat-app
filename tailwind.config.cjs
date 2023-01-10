/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                mytheme: {

                    "primary": "#3d79b5",

                    "secondary": "#0dafe5",

                    "accent": "#e50914",

                    "neutral": "#151828",

                    "base-100": "#372F42",

                    "info": "#507CE2",

                    "success": "#41E1C7",

                    "warning": "#FCB769",

                    "error": "#EC5175",
                },
            },
        ],
    },
};
