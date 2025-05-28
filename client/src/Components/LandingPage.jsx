import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Users, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] text-white font-sans overflow-x-hidden px-6 md:px-12 py-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
          <span className="text-white">Connect with </span>
          <span className="text-purple-400">Developers</span> Who Match Your Vibe
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mt-4">
          DevTinder helps you match, chat, and build projects with devs who get your energy.
        </p>
      </motion.div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-6xl mx-auto">
        {[ 
          {
            icon: <Sparkles size={40} className="text-purple-300" />,
            title: "Match by Vibe",
            desc: "Find devs who share your stack, attitude, and goals.",
          },
          {
            icon: <Users size={40} className="text-indigo-300" />,
            title: "Build Together",
            desc: "Collaborate on startups, hackathons, or side projects.",
          },
          {
            icon: <MessageSquare size={40} className="text-pink-300" />,
            title: "Chat & Connect",
            desc: "Real-time messaging to discuss code, memes, or dreams.",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl p-8 text-center shadow-xl hover:scale-[1.02] transition"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-300">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-center mt-20"
      >
        <Link to = "/login"><button className="relative inline-flex cursor-pointer items-center justify-center px-10 py-4 text-lg font-bold text-purple-800 bg-white rounded-full shadow-lg overflow-hidden group hover:scale-105 transition-transform">
          <span className="absolute w-48 h-48 rounded-full bg-purple-300 opacity-20 blur-3xl group-hover:scale-125 transition duration-500"></span>
         Get Started
        </button></Link>
      </motion.div>
    </div>
    
  );
}

export default LandingPage;
