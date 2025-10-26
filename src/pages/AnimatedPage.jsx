
const pageVariants = {
    initial: {
        opacity: 0,
    },
    in: {
        opacity: 1,
    },
    out: {
        opacity: 0,
    },
};

const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.5, // Aumentei um pouco a duração para um fade mais notável
};

const AnimatedPage = ({ children }) => (
    <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="h-full w-full flex justify-center items-center"
    >
        {children}
    </motion.div>
);

export default AnimatedPage;