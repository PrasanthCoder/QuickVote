"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, BarChart3, Share2, Github, Linkedin } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      {/* Heading */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl font-bold text-blue-500 mb-4">
          About QuickVote
        </h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          QuickVote is a fast, user-friendly polling platform designed to help
          you create polls instantly, get smart AI-suggested options, analyze
          votes live, and share with anyone in seconds.
        </p>
      </motion.section>

      {/* Developer Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row items-center justify-center gap-10 mb-24"
      >
        <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-blue-500">
          <Image
            src="https://drive.google.com/uc?export=view&id=1ahCM8wMSbh86hTa84UPnUzYOMVjAeoGG" // Ensure this is in public/ as profile.png
            alt="Prasanth Daneti"
            fill
            className="object-cover"
          />
        </div>
        <div className="text-center md:text-left max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-blue-400">
            Meet the Developer
          </h2>
          <p className="mb-3 text-gray-300">
            Hi, I’m{" "}
            <span className="font-semibold text-white">Prasanth Daneti</span>,
            the creator of QuickVote. I built this app to make online decisions
            faster, smarter, and more interactive for everyone.
          </p>
          <div className="flex justify-center md:justify-start gap-4 mb-4">
            <Link
              href="https://github.com/prasanthcoder"
              target="_blank"
              className="hover:text-blue-400"
            >
              <Github size={22} />
            </Link>
            <Link
              href="https://www.linkedin.com/in/daneti-prasanth-117280229/"
              target="_blank"
              className="hover:text-blue-400"
            >
              <Linkedin size={22} />
            </Link>
          </div>
          <Link
            href="/create"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Create a Poll
          </Link>
        </div>
      </motion.section>

      {/* Key Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold mb-12 text-blue-400 text-center">
          What Makes QuickVote Special?
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          {[
            {
              icon: <Sparkles size={24} />,
              title: "AI-Suggested Options",
              desc: "Get smart, context-aware poll options generated instantly by AI.",
            },
            {
              icon: <BarChart3 size={24} />,
              title: "Live Analytics",
              desc: "Watch votes roll in live, with insights that keep you in control.",
            },
            {
              icon: <Share2 size={24} />,
              title: "Instant Sharing",
              desc: "One-click sharing with no signup — just a link and you're live.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center max-w-xs"
            >
              <div className="w-14 h-14 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
