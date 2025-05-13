"use client";

import Link from "next/link";
import { Sparkles, BarChart3, Share2 } from "lucide-react";
import { motion } from "framer-motion";

// Animation variants for Framer Motion
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    scale: 1.08,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  rest: {
    scale: 1,
    transition: { duration: 0.1, ease: "easeOut" },
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <motion.section
        className="text-center py-24 px-6 bg-gradient-to-br from-gray-900 via-black to-blue-950 shadow-sm"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          QuickVote
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Create polls instantly. Get AI-suggested options. Analyze votes in
          real-time. Share effortlessly.
        </motion.p>
        <Link
          href="/create"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50"
        >
          Create Your Poll Now
        </Link>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 px-6 bg-gradient-to-tr from-blue-950 via-black to-blue-950"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <motion.div
            className="bg-gray-900/80 backdrop-blur-md p-8 rounded-xl shadow-lg border border-gray-700/50"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="rest"
          >
            <Sparkles
              className="mx-auto text-blue-400 animate-pulse"
              size={40}
            />
            <h3 className="text-xl font-semibold mt-4 text-white">
              AI Suggestions
            </h3>
            <p className="mt-2 text-gray-300">
              Get intelligent poll option suggestions powered by AI to save time
              and spark ideas.
            </p>
          </motion.div>
          <motion.div
            className="bg-gray-900/80 backdrop-blur-md p-8 rounded-xl shadow-lg border border-gray-700/50"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="rest"
          >
            <BarChart3
              className="mx-auto text-blue-400 animate-pulse"
              size={40}
            />
            <h3 className="text-xl font-semibold mt-4 text-white">
              Real-time Analytics
            </h3>
            <p className="mt-2 text-gray-300">
              Watch results live as people vote. Visualize trends instantly.
            </p>
          </motion.div>
          <motion.div
            className="bg-gray-900/80 backdrop-blur-md p-8 rounded-xl shadow-lg border border-gray-700/50"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="rest"
          >
            <Share2 className="mx-auto text-blue-400 animate-pulse" size={40} />
            <h3 className="text-xl font-semibold mt-4 text-white">
              Easy Sharing
            </h3>
            <p className="mt-2 text-gray-300">
              Share your polls with a single click to social media.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        className="text-center py-16 bg-gradient-to-tl from-blue-950 via-black to-blue-950"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-4 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Start your first poll in seconds
        </motion.h2>
        <Link
          href="/create"
          className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50"
        >
          Get Started
        </Link>
      </motion.section>
    </main>
  );
}
