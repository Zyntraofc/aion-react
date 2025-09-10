const colors = require("./src/styles/colors.js");

module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: colors.primary,
                secondary: colors.secondary,
                success: colors.success,
                danger: colors.danger,
                warning: colors.warning,
                neutral: colors.neutral,
            },
        },
    },
    plugins: [],
};
