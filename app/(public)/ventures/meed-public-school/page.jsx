'use client';

import { motion } from "framer-motion";
import Image from "next/image"; // For image placeholders
import Link from "next/link";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function MeedPublicSchool() {
  return (
    <article className="space-y-12 max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Hero Section */}
      <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          The Story of an 18-Year-Old Boy Deeply Impacting Society: Connecting 300+ Families and Growing a 1 Million INR Business to 7-8 Million Per Annum!
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          By Nafis Aslam (Nafees Bhaiya) – Student, Visionary, and Changemaker
        </p>
        <div className="text-sm text-muted">
          DOB: 18/11/2001 | Contact: +9163770... | Email: managingshaikhzifan@gmail.com
        </div>
      </motion.header>

      {/* Introductory Quote */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="card p-6 md:p-8 text-center italic text-muted bg-card-2 rounded-3xl shadow-md"
      >
        <p>
          “Before embarking on this journey, allow me to confide in you, dear reader – I was incredibly hesitant to share my story. It felt foreign, like I was a lone voice in a vast wilderness... But it was my dearest friend, Amit, who compelled me to put pen to paper.”
        </p>
      </motion.section>

      {/* Chapter 1 */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold">Chapter-1: The Very Beginning—HOW DID IT ALL START?</h2>
        <p>
          At the tender age of 14... What led me to embark on this remarkable journey at such a young age? What inspired such profound thoughts within me?
        </p>
        <p>
          In a local shop, I overheard a conversation... 'Padhkar kya kar lega zyaada...' It was a common narrative I encountered regularly.
        </p>
        {/* Image Placeholder */}
        <div className="relative h-64 md:h-96">
          <Image src="/placeholder-chapter1.jpg" alt="Chapter 1 Image" fill className="object-cover rounded-2xl shadow-md" />
        </div>
        <p>
          My initial involvement mostly revolved around organizing small events... Here are some noteworthy examples.
        </p>
        {/* List events with images */}
        <ul className="space-y-6">
          <li>
            <h3 className="text-lg font-semibold">Annual Event 2012: Embracing the Spotlight</h3>
            <p>Back in 2012, I found myself in the role of an anchor...</p>
            <div className="relative h-48">
              <Image src="/placeholder-annual-2012.jpg" alt="Annual Event 2012" fill className="object-cover rounded-2xl shadow-md" />
            </div>
          </li>
          {/* Add similar for other events */}
        </ul>
      </motion.section>

      {/* Repeat similar structure for other chapters */}
      {/* Chapter 2 */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold">Chapter-2: THE INTERMEDIATE: A PERIOD OF LEARNING (2016-2017)</h2>
        <p>I left home for my higher studies but did I leave my goal behind too? No, Not by any chance!</p>
        {/* Image and content */}
      </motion.section>

      {/* Chapter 3 */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold">Chapter-3: THE REAL BATTLEFIELD: (2018-2020)</h2>
        <p>Ah, how could I ever forget the day when... I assumed complete responsibility for every department of the school?</p>
        {/* Subsections like Team Creation, Guiding Principles, etc. */}
        <h3 className="text-xl font-semibold">Team Creation: Core Strategy</h3>
        <p>In the realm of school administration, I adopted a key principle—the ‘Entrepreneurial Spirit.’...</p>
        {/* Lists and images */}
      </motion.section>

      {/* Continue for Chapters 4-7 */}

      {/* Final Section with Links */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="space-y-4 text-center"
      >
        <h2 className="text-2xl font-bold">Connect and Explore More</h2>
        <ul className="space-y-2">
          <li><Link href="#" className="btn btn-primary">School’s YouTube</Link></li>
          <li><Link href="#" className="btn btn-primary">School’s Facebook</Link></li>
          <li><Link href="#" className="btn btn-primary">School’s Website</Link></li>
          <li><Link href="#" className="btn btn-primary">Nafees Foundation Website</Link></li>
        </ul>
        <p className="text-muted">For any further details, contact me at managingshaikhzifan@gmail.com.</p>
      </motion.section>
    </article>
  );
}