"use client";

import Link from "next/link";
import { Twitter, Github, Mail } from "lucide-react";
import { motion } from "framer-motion";

// Animation variants for Framer Motion
const footerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: { scale: 1.2, transition: { duration: 0.3 } },
};

const Footer = () => {
  return (
    <motion.footer
      className="py-12 px-6 bg-gradient-to-tr from-blue-950 via-black to-blue-950 text-white"
      initial="hidden"
      animate="visible"
      variants={footerVariants}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Brand Section */}
        <div>
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            QuickVote
          </h3>
          <p className="mt-2 text-gray-300">
            Create and share polls effortlessly with real-time insights.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="text-lg font-semibold text-white">Explore</h4>
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href="/"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/create"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                Create Poll
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div>
          <h4 className="text-lg font-semibold text-white">Connect</h4>
          <div className="flex justify-center md:justify-start mt-4 space-x-4">
            <motion.a
              href="https://x.com/DanetiPras33"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-400"
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <Twitter size={24} />
            </motion.a>
            <motion.a
              href="https://github.com/prasanthcoder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-400"
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <Github size={24} />
            </motion.a>
            <motion.a
              href="mailto:prasanthdaneti@gmail.com"
              className="text-gray-300 hover:text-blue-400"
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <Mail size={24} />
            </motion.a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 text-center text-gray-400 text-sm border-t border-gray-800 pt-4">
        <p>&copy; {new Date().getFullYear()} QuickVote. All rights reserved.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;
