'use client'; // This makes it a client component for Framer Motion and hooks

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useMDXComponent } from "next-contentlayer/hooks";
import { useState } from "react";
import { FaGithub, FaCalendarAlt, FaBriefcase, FaEye } from "react-icons/fa"; // Assuming react-icons is installed
import { Canvas } from "@react-three/fiber"; // Assuming @react-three/fiber is installed for Three.js
import { Stars } from "@react-three/drei"; // For a simple 3D star background

function formatDate(d) {
  try {
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.toLocaleDateString('en-US', { // Fixed locale to 'en-US' for consistent format (e.g., "Aug 9, 2025")
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return d ?? "";
  }
}

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants = {
  hover: { scale: 1.02, transition: { duration: 0.3 } },
};

export default function ClientDashboard({ posts, now, reels, ventures, nbsNodes }) {
  const NowBody = now ? useMDXComponent(now.body.code) : null;

  // Customized with your actual details from profiles
  const yourName = "Nafis Aslam";
  const yourProfession = "Computer Science Graduate (AI Specialization, Management Minor)";
  const yourRoles = "Data Scientist, AI Builder, Founder of DeepWork AI";
  const yourBook = ""; // No book mentioned
  const subscriberCount = "180+"; // Based on LinkedIn connections/followers
  const yourBio = `Aspiring Data Scientist with a strong academic background in Computer Science (specialization in AI, minor in Management from Universiti Sains Malaysia). Recognized with a gold honor in Mathematics. Honed skills through MITx MicroMasters in Data Science, Coding Ninjas, GeeksforGeeks, and more. Passionate about AI, EdTech, productivity, Machine Learning, NLP, and Deep Learning. Building real-world tools like DeepWork AI, MeedFinance, and 30-ML-Projects. “Success is a war between discipline and distraction.” — Nafis Aslam 💥`;
  const socialLinks = [
    { name: "GitHub", href: "https://github.com/NafisAslam70" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/nafisaslam70" },
    { name: "Medium", href: "https://medium.com/@nafisaslam" },
    { name: "YouTube", href: "https://youtube.com" },
  ];

  // State for GitHub Logs Modal
  const [showLogsModal, setShowLogsModal] = useState(false);

  return (
    <div className="space-y-12 md:space-y-16 relative"> {/* Relative for 3D background */}
      {/* Three.js Background - Modern cosmic theme */}
      <Canvas style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>

      {/* Hero Section with Animation */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="text-center space-y-4 md:space-y-6 relative z-10" // z-10 to overlay 3D
      >
        <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto">
          <Image
            src="/images/white2.jpg"
            alt={yourName}
            fill
            className="rounded-full object-cover shadow-md"
            priority
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Hey Friends 👋</h1>
        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto">
          I’m {yourName}. I’m a {yourProfession} turned {yourRoles}.
        </p>
      </motion.section>

      {/* My Current Work / Journal - All three cards in one row */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="card shadow-sm relative z-10" // z-10 for overlay
      >
        <h2 className="text-xl md:text-2xl font-semibold mb-4">My Current Work / Journal</h2>
        {now ? (
          <div className="prose max-w-none text-fg mb-6">
            <div className="text-xs text-muted mb-2">
              Updated: {formatDate(now.updated)}
            </div>
            {/* <h3 className="font-semibold text-lg">{now.title}</h3>
            <NowBody /> */}
          </div>
        ) : (
          <p className="text-muted mb-6">No current update yet.</p>
        )}

        {/* Single row with three cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* GitHub Card - Only streak */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="card-solid p-4 md:p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <div className="flex items-center space-x-2 mb-4">
              <FaGithub className="text-2xl text-primary" />
              <h3 className="text-lg font-semibold">GitHub (My Daily Grind)</h3>
            </div>
            {/* Only Streak */}
            <div className="space-y-4">
              <h4 className="text-base font-medium">GitHub Streak</h4>
              <Image
                src="https://github-readme-streak-stats.herokuapp.com/?user=NafisAslam70&theme=transparent"
                alt="GitHub Streak"
                width={400}
                height={200}
                className="w-full rounded-lg shadow-sm"
                unoptimized
              />
            </div>
            <Link href="https://github.com/NafisAslam70" className="btn btn-primary w-full mt-4" target="_blank" rel="noopener noreferrer">
              Visit GitHub
            </Link>
          </motion.div>

          {/* My Calendar Card */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="card-solid space-y-3 p-4 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-xl text-primary" />
              <h3 className="text-base font-semibold">My Calendar</h3>
            </div>
            {/* Visual Placeholder - Small */}
            <div className="bg-card-2 p-3 rounded-lg text-center">
              <Image
                src="/placeholder-calendar.png" // Replace with actual
                alt="Calendar Visual"
                width={150}
                height={150}
                className="mx-auto rounded-md shadow-sm"
              />
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <button className="btn btn-primary flex-1 text-sm py-1.5">
                View Routine
              </button>
              <button className="btn btn-primary flex-1 text-sm py-1.5">
                Book Time
              </button>
            </div>
          </motion.div>

          {/* My Ventures Card */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="card-solid space-y-3 p-4 rounded-2xl shadow-md hover:shadow-md transition"
          >
            <div className="flex items-center space-x-2">
              <FaBriefcase className="text-xl text-primary" />
              <h3 className="text-base font-semibold">My Ventures</h3>
            </div>
            {/* Visual Placeholder - Small */}
            <div className="bg-card-2 p-3 rounded-lg text-center">
              <Image
                src="/placeholder-ventures.png" // Replace with actual
                alt="Ventures Visual"
                width={150}
                height={150}
                className="mx-auto rounded-md shadow-sm"
              />
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <Link href="/ventures" className="btn btn-primary flex-1 text-sm py-1.5 text-center">
                View Ventures
              </Link>
              <button className="btn btn-primary flex-1 text-sm py-1.5">
                Latest Updates
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* How Can I Help You? - Customized to your expertise */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="space-y-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center">How Can I Help You?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { title: "Grow Your AI Skills", desc: "Learn Machine Learning, NLP, and Deep Learning through hands-on projects and resources.", href: "/blog" },
            { title: "Be More Productive", desc: "Boost focus with tools like DeepWork AI, productivity systems, and daily grind logs.", href: "/nbs" },
            { title: "Build ML Projects", desc: "Start and scale real-world ML applications, from data analysis to deployment.", href: "/ventures" },
            { title: "...and More!", desc: "Explore DSA, computer vision, EdTech, and all my content.", href: "/reels" },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card text-center space-y-3 shadow-sm hover:shadow-md transition" // Used .card class for consistency
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted">{item.desc}</p>
              <Link href={item.href} className="btn btn-primary block"> {/* Used .btn and .btn-primary */}
                {item.title.includes("More") ? "Explore" : "Get Started"}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Subscription - Moved below How Can I Help You cards */}
        <div className="space-y-3 max-w-md mx-auto text-center">
          <p className="text-base font-medium">Join {subscriberCount} Subscribers</p>
          <form className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition"
              required
            />
            <button type="submit" className="w-full bg-primary text-primary-fg p-3 rounded-lg font-medium hover:brightness-95 transition flex items-center justify-center">
              Subscribe →
            </button>
          </form>
          <p className="text-xs text-muted">By subscribing, you agree to our privacy policy.</p>
        </div>
      </motion.section>

      {/* About Me - Customized bio */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="space-y-4 md:space-y-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold">Hey, I’m {yourName}</h2>
        <p className="text-base text-fg leading-relaxed"> {/* Used text-fg for consistency */}
          {yourBio}
        </p>
        <div className="flex flex-wrap gap-4 text-sm md:text-base">
          <Link href="/blog" className="link font-medium">Read My Articles</Link> {/* Used .link */}
          <Link href="/reels" className="link font-medium">Watch My Videos</Link>
          <Link href="/ventures" className="link font-medium">Explore Ventures</Link>
        </div>
      </motion.section>

      {/* Latest Blogs */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold">Most Popular Resources</h2>
          <Link href="/blog" className="text-sm link">
            View all
          </Link>
        </div>
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-3">
          {posts.length > 0 ? (
            posts.map((p, index) => (
              <motion.article
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card shadow-sm hover:shadow-md transition" // Used .card
              >
                <Link
                  href={`/blog/${p._raw.flattenedPath}`}
                  className="link font-medium block mb-1"
                >
                  {p.title}
                </Link>
                <div className="text-xs text-muted">{formatDate(p.date)}</div>
                {p.summary && <p className="text-sm text-muted mt-2">{p.summary}</p>}
                {Array.isArray(p.tags) && p.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="text-xs rounded-full bg-card-2 px-2 py-1 text-muted">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </motion.article>
            ))
          ) : (
            <p className="text-muted col-span-full">No posts yet.</p>
          )}
        </div>
      </motion.section>

      {/* Featured Reels */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold">Watch My Most Popular Videos</h2>
          <Link href="/reels" className="text-sm link">
            Watch More
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reels.length > 0 ? (
            reels.map((r, index) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card space-y-2 shadow-sm hover:shadow-md transition"
              >
                <div className="text-xs text-muted">
                  {r.type || "reel"} • {formatDate(r.createdAt)}
                </div>
                <div className="font-medium">{r.title}</div>
                {r.ref && (
                  <a
                    href={r.ref}
                    target="_blank"
                    rel="noreferrer"
                    className="link text-sm inline-flex items-center"
                  >
                    Watch →
                  </a>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-muted">No videos yet.</p>
          )}
        </div>
      </motion.section>

      {/* Ventures - Customized to your projects */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold">Check Out My Ventures & Projects</h2>
          <Link href="/ventures" className="text-sm link">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ventures.length > 0 ? (
            ventures.slice(0, 4).map((v, i) => (
              <motion.div
                key={v.slug || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card shadow-sm hover:shadow-md transition"
              >
                <div className="text-xs text-muted">
                  {v.stage || v.status || "Active"}
                </div>
                <div className="font-medium mt-1">
                  <Link
                    href={v.slug ? `/ventures/${v.slug}` : "/ventures"}
                    className="link"
                  >
                    {v.title || v.name || "Venture"}
                  </Link>
                </div>
                {v.description && <p className="text-sm text-muted mt-2">{v.description}</p>}
              </motion.div>
            ))
          ) : (
            <p className="text-muted">No ventures listed yet.</p>
          )}
        </div>
      </motion.section>

      {/* Removed custom footer as layout has SiteFooter */}
    </div>
  );
}