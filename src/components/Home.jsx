import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-full overflow-hidden bg-gradient-to-br from-[#0f0f1f] via-[#1a1a2e] to-[#121212] text-white">
      {/* Animated background circles */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-0 left-0 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
      />

      {/* Content container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="z-10 flex flex-col items-center justify-center text-center px-6 md:px-10 lg:px-16"
      >
        {/* Logo */}
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg"
        >
          Journ AI
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-6 text-lg md:text-2xl text-gray-300 max-w-xl italic"
        >
          "Speak Your Mind — <span className="text-purple-300">Journ AI</span> is Listening."
        </motion.p>

        {/* Get Started Button */}
        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          onClick={() => navigate("/chat")}
          className="mt-10 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold shadow-lg shadow-purple-700/30 hover:shadow-pink-700/40 hover:scale-105 transition-transform duration-300"
        >
          Get Started
        </motion.button>

        {/* Sub-text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-4 text-sm text-gray-400"
        >
          Your private AI-powered mental health journaling companion 💜
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Home;
