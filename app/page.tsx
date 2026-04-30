"use client";
import Image from "next/image";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();

  return (
    <div>
      {/* Header */}
      <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white border-b border-gray-200 text-sm py-3 sm:py-0 dark:bg-neutral-800 dark:border-neutral-700">
        <nav className="relative p-4 max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8" aria-label="Global">
          <div className="flex items-center justify-between">
            <Image src="/logo2.png" alt="logo" width={150} height={150} />
          </div>

          <div className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end sm:ps-7 cursor-pointer">
              {!user ? (
                <SignInButton mode="modal" signUpForceRedirectUrl="/dashboard">
                  <div className="flex items-center gap-x-2 font-medium text-gray-500 hover:text-red-600 sm:border-s sm:border-gray-300 py-2 sm:py-0 sm:ms-4 sm:my-6 sm:ps-6 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-red-500">
                    <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4z" />
                    </svg>
                    Get Started
                  </div>
                </SignInButton>
              ) : (
                <UserButton />
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-[url('https://preline.co/assets/svg/examples/polygon-bg-element.svg')] dark:before:bg-[url('https://preline.co/assets/svg/examples-dark/polygon-bg-element.svg')] before:bg-no-repeat before:bg-top before:bg-cover before:size-full before:-z-[1] before:transform before:-translate-x-1/2">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
          <div className="flex justify-center">
            <a className="inline-flex items-center gap-x-2 bg-white border border-gray-200 text-sm text-gray-800 p-1 ps-3 rounded-full transition hover:border-gray-300 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:border-neutral-600 dark:text-neutral-200"
               target="_blank" rel="noopener noreferrer">

              <span className="py-1.5 px-2.5 inline-flex justify-center items-center gap-x-2 rounded-full bg-red-600 text-white font-semibold text-sm">
                <svg className="flex-shrink-0 size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
            </a>
          </div>

          <div className="mt-5 max-w-2xl text-center mx-auto">
            <h1 className="block font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl dark:text-neutral-200">
              howtoYT: Smarter
              <span className="bg-clip-text bg-gradient-to-tl from-red-600 to-red-400 text-transparent"> YouTube Growth with AI</span>
            </h1>
          </div>

          <div className="mt-5 max-w-3xl text-center mx-auto">
            <p className="text-lg text-gray-600 dark:text-neutral-400">
              Analyze, Optimize, and Grow your YouTube channel with AI — all in one platform built for creators.
            </p>
          </div>

          <div className="mt-8 gap-3 flex justify-center">
            <a className="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 border border-transparent text-white text-sm font-medium rounded-md py-3 px-4 dark:focus:ring-offset-gray-800"
              href="/dashboard">
              Get started
              <svg className="flex-shrink-0 size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "AI Thumbnail Generator", desc: "Create stunning thumbnails using AI." },
            { title: "Thumbnail Search", desc: "Explore top-performing thumbnails across YouTube." },
            { title: "Outlier Detection", desc: "Identify videos performing unusually well or poorly." },
            { title: "YouTube Content Generator", desc: "Generate viral video scripts and content ideas." },
            { title: "Trending Keywords", desc: "Stay ahead with real-time YouTube keyword trends." },
            { title: "Competitor Analysis", desc: "Analyze competitor channels for insights and strategies." },
            { title: "Optimize Performance", desc: "Get AI suggestions to improve titles, tags, and more." },
          ].map((feature, i) => (
            <a key={i} className="group flex flex-col justify-center hover:bg-gray-50 rounded-xl p-4 md:p-7 dark:hover:bg-neutral-800" href="#">
              <div className="flex justify-center items-center size-12 bg-red-600 rounded-xl text-white text-lg font-bold">{i + 1}</div>
              <div className="mt-5">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400">{feature.title}</h3>
                <p className="mt-1 text-gray-600 dark:text-neutral-400">{feature.desc}</p>
                <span className="mt-2 inline-flex items-center gap-x-1.5 text-sm text-red-600 decoration-2 group-hover:underline font-medium">
                  Learn more
                  <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
