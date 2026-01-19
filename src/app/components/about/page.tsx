"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGlobalState } from "@/app/globalContext/GlobalState";

export default function AboutPage() {
  const { status } = useGlobalState();
  const theme = status.setting?.theme || "light";
  const lang = status.setting?.lang || "en";

  return (
    <div
      className={`min-h-screen ${
        theme === "light"
          ? "bg-gray-50 text-gray-800"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      {/* Hero Section */}
      <section className="relative w-full h-80">
        <Image
          src="/assets/images/Selam_bus_Ethiopia.png"
          alt="Ethiopian Regional Bus"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
            {lang === "en"
              ? "About Ethiopian Regional Bus Transport System"
              : "ስለ ኢትዮጵያ ክልላዊ የባስ መጓጓዣ ስርዓት"}
          </h1>
          <p className="max-w-2xl text-sm sm:text-md md:text-lg text-white opacity-90">
            {lang === "en"
              ? "Connecting all Ethiopian regions through a modern, reliable, and digitalized bus transport system."
              : "የተዘመነ እና ታማኝ የባስ መጓጓዣ ስርዓትን በመጠቀም ኢትዮጵያ ክልሎችን ሁሉ እንያቀራረብ ነው።"}
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center">
          {lang === "en" ? "Who We Are" : "እኛ ማን ነን"}
        </h2>
        <p className="text-md md:text-lg leading-relaxed text-center max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
          {lang === "en"
            ? "The Ethiopian Regional Bus Transport System is a national initiative dedicated to improving public mobility across all regions. We provide safe, affordable, and accessible transportation solutions that connect cities, rural areas, and regional hubs — supporting social and economic growth."
            : "የኢትዮጵያ ክልላዊ የባስ መጓጓዣ ስርዓት በአገር ዙሪያ የህዝብ እንቅስቃሴን ለማሻሻል የተቋቋመ ብሔራዊ ፕሮጀክት ነው። ከተሞችን፣ ገጠሮችንና ክልላዊ ማዕከላትን በታማኝ እና በአስተማማኝ አገልግሎት እንያቀራረብ ነው።"}
        </p>
      </section>

      {/* Mission and Vision */}
      <section
        className={`${theme === "light" ? "bg-white" : "bg-gray-800"} py-16`}
      >
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-4">
              {lang === "en" ? "Our Mission" : "ተልዕኳችን"}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {lang === "en"
                ? "To ensure reliable and inclusive regional connectivity through digital ticketing, real-time monitoring, and improved passenger experience."
                : "በዲጂታል ቲኬት ስርዓት፣ በቀጥታ ክትትል እና በልዩ የተጓዥ ልምድ መጠቀም ታማኝ እና ሁሉን አቀፍ የክልል ግንኙነትን ማረጋገጥ ነው።"}
            </p>
          </div>

          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-4">
              {lang === "en" ? "Our Vision" : "እንዴትን እንመለከታለን"}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {lang === "en"
                ? "To create a unified Ethiopian transportation network that empowers citizens, supports tourism, and fosters national integration."
                : "ዜጎችን የሚያበረታታ፣ ቱሪዝምን የሚያገዝ እና ብሔራዊ አንድነትን የሚያበረክት አንድ የኢትዮጵያ የመጓጓዣ አውታረ መስመር መፍጠር ነው።"}
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-10">
          {lang === "en" ? "Our Core Values" : "ዋና እሴቶቻችን"}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title_en: "Safety First",
              title_am: "ደህንነት በመጀመሪያ",
              desc_en:
                "Passenger safety and comfort are our highest priorities in every journey.",
              desc_am: "የተጓዥ ደህንነትና ዕረፍት በእያንዳንዱ ጉዞ ላይ ዋና ትኩረታችን ነው።",
            },
            {
              title_en: "Innovation & Technology",
              title_am: "ፈጠራ እና ቴክኖሎጂ",
              desc_en:
                "We use modern digital tools for booking, tracking, and management of buses across all regions.",
              desc_am:
                "በክልሎች ሁሉ የባስ ቲኬት፣ ክትትልና አስተዳደርን በዘመናዊ ዲጂታል መሳሪያዎች እንከናውናለን።",
            },
            {
              title_en: "Regional Integration",
              title_am: "ክልላዊ ግንኙነት",
              desc_en:
                "We aim to strengthen economic, cultural, and social ties among Ethiopian regions.",
              desc_am:
                "የኢትዮጵያ ክልሎች መካከል ያሉ የኢኮኖሚ፣ ባህላዊና ማህበራዊ ግንኙነቶችን ለማጠናከር እንሰራለን።",
            },
          ].map((value, i) => (
            <div
              key={i}
              className={`p-8 rounded-2xl shadow hover:shadow-lg transition ${
                theme === "light" ? "bg-gray-100" : "bg-gray-700"
              }`}
            >
              <h4 className="text-xl font-semibold mb-3">
                {lang === "en" ? value.title_en : value.title_am}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {lang === "en" ? value.desc_en : value.desc_am}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
          {lang === "en"
            ? "Let’s Move Ethiopia Forward Together"
            : "ኢትዮጵያን በአንድነት እንንቀሳቀስ"}
        </h2>
        <p className="max-w-2xl mx-auto mb-6 px-2 text-lg opacity-90">
          {lang === "en"
            ? "Join us in creating a safe, efficient, and smart regional bus network that connects every corner of Ethiopia."
            : "የተስፋ ያለው የኢትዮጵያን ክልላዊ መጓጓዣ አውታረ መስመር አብረን እንፍጠር፤ ደህንነት፣ ፍጥነትና አዳዲስ ቴክኖሎጂ ከሆነ ዘመናዊ ባስ አገልግሎት ጋር።"}
        </p>
        <Link
          href="/contact"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
        >
          {lang === "en" ? "Contact Us" : "አግኙን"}
        </Link>
      </section>
    </div>
  );
}
