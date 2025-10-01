module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#3A47FF",
                secondary: "#792CFF",
                tertiary: "#9299FF",
                success: "#4CAF50",
                danger: "#F44336",
                warning: "#FF9800",
                neutral: {
                    100: "#F5F5F5",
                    200: "#EEEEEE",
                    300: "#E0E0E0",
                    900: "#212121",
                },
            },
            fontFamily: {
                sans: ["Poppins", "sans-serif"],
            }
        },
    },
    plugins: [],
};
