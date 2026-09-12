import { VIDEO_LINKS } from "@/constants";
import { PropsWithChildren, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TiLocationArrow } from "react-icons/ti";

interface BentoTiltProps {
  className?: string;
}

const BentoTilt = ({ children, className = "" }: PropsWithChildren<BentoTiltProps>) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current) return;

    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - left) / width;
    const relativeY = (e.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.98, 0.98, 0.98)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => setTransformStyle("");

  return (
    <div
      ref={itemRef}
      className={`transition-transform duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

interface ChangeLogEntry {
  version: string;
  date: string;
  changes: string[];
}

interface BentoChangeCardProps {
  src?: string;
  title: string;
  logs: ChangeLogEntry[];
}

const BentoChangeCard = ({ src, title, logs }: BentoChangeCardProps) => {
  return (
    <article className="relative w-full h-full overflow-hidden border border-gray-800 bg-black rounded-sm">
      {src && (
        <video
          src={src}
          loop
          muted
          autoPlay
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover opacity-30"
        />
      )}

      <div className="relative z-10 flex h-full flex-col justify-between p-5 text-blue-50 bg-black/70 backdrop-blur-sm">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-2xl md:text-3xl font-extrabold special-font mb-4 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"
          >
            {title.toUpperCase()}
          </motion.h1>

          {logs.map((log, index) => (
            <div
              key={index}
              className="mb-5 transition-all duration-300 hover:translate-x-1 hover:text-blue-200"
            >
              <p className="text-sm text-blue-300 mb-1 font-semibold">
                <b>{log.version}</b> • {log.date.toUpperCase()}
              </p>
              <ul className="list-disc list-inside text-sm text-blue-100 space-y-1">
                {log.changes.map((change, i) => (
                  <li key={i}>{change.toUpperCase()}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export const Features = () => {
  return (
    <section className="bg-black pb-24">
      <div className="container mx-auto px-4 md:px-10">

        {/* MAIN HEADER */}
        <motion.div
          className="text-center py-24"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-7xl md:text-8xl font-extrabold special-font text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-2xl animate-pulse">
            RDSTORE CHANGE LOGS
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-blue-50 opacity-80 uppercase">
            Stay updated with the latest releases, advanced features, and powerful system upgrades for all RD Scripts.
          </p>
        </motion.div>

        {/* MAIN CARD */}
        <BentoTilt className="relative mb-10 h-96 w-full overflow-hidden rounded-sm md:h-[70vh] shadow-2xl">
          <BentoChangeCard
            src={"https://r2.fivemanage.com/e9ayQ4VVHnYGIcG9ROsZf/snaptik_7466495367027199238_v2(1).mp4"}
            title="RD FIRE JOB SCRIPT"
            logs={[
              {
                version: "V1.0.0",
                date: "COOMING SOON",
                changes: [
                  "A COMPLETE FIRE JOB SYSTEM",
                  "FULLY INTEGRATED BILLING SYSTEM WITH SMART RECEIPTS",
                  "UNIQUE BOSS MENU FOR MANAGING EMPLOYEES AND STOCK",
                  "MULTI-FRAMEWORK SUPPORT: ESX - QBCORE - QBOX",
                  "OPTIMIZED PERFORMANCE - CLEAN UI - EASY CONFIGURATION",
                  "COMPLETE ROLE MANAGEMENT AND INVOICE HISTORY",
                  "AND MORE ..."
                ],
              },
            ]}
          />
        </BentoTilt>

        {/* GRID SECTION */}
        <div id="nexus" className="grid grid-cols-1 md:grid-cols-2 gap-7">
          <BentoTilt>
            <BentoChangeCard
              title="RD PHARMACY JOB"
              src="https://r2.fivemanage.com/e9ayQ4VVHnYGIcG9ROsZf/snaptik_7496193124834839863_v2.mp4"
              logs={[
                
                {
                  version: "V1.0.0",
                  date: "JAN 2026",
                  changes: [
                  "INTRODUCING A COMPLETE PHARMACY JOB SYSTEM",
                  "BUILT-IN SHOP SYSTEM TO BUY AND SELL MEDICINES",
                  "CRAFT CUSTOM MEDECAMENTS USING REALISTIC INGREDIENTS",
                  "FULLY INTEGRATED BILLING SYSTEM WITH SMART RECEIPTS",
                  "UNIQUE BOSS MENU FOR MANAGING EMPLOYEES AND STOCK",
                  "MULTI-FRAMEWORK SUPPORT: ESX - QBCORE - QBOX",
                  "OPTIMIZED PERFORMANCE - CLEAN UI - EASY CONFIGURATION",
                  "COMPLETE ROLE MANAGEMENT AND INVOICE HISTORY",
                ],
                },
              ]}
            />
          </BentoTilt>
          <BentoTilt>
            <BentoChangeCard
              title="RD PRIORITY SYSTEM"
              src={VIDEO_LINKS.feature2}
              logs={[
                {
                  version: "V1.0.1",
                  date: "NOVEMBER 2025",
                  changes: [
                    "ADDED EXPORT TO CHECK COOLDOWN STATUS FOR CUSTOM HEIST INTEGRATIONS",
                    "FULL SUPPORT FOR MULTIPLE JOBS AND GRADES CONFIGURATION",
                    "BETTER ERROR HANDLING AND LOGGING IMPROVEMENTS",
                  ],
                },
                {
                  version: "V1.0.0",
                  date: "OCTOBER 2025",
                  changes: [
                    "FULL SUPPORT FOR ESX LEGACY AND QBCORE",
                    "IMPROVED PRIORITY QUEUE PERFORMANCE",
                  ],
                },
              ]}
            />
          </BentoTilt>
              
          <BentoTilt>
            <BentoChangeCard
              title="RD LOCKERS"
              src={VIDEO_LINKS.feature3}
              logs={[
                {
                  version: "V1.5.2",
                  date: "OCTOBER 2025",
                  changes: [
                    "MAJOR OPTIMIZATION UPDATE FOR INVENTORY SYNC",
                    "FIXED INVENTORY NOT OPENING IN QB-INVENTORY FRAMEWORK",
                  ],
                },
              ]}
            />
          </BentoTilt>
        </div>

        {/* FINAL CARD (RDSTORE DOCS LINK) */}
        <div className="mt-14">
          <BentoTilt>
            <a
              href="https://rdstore.gitbook.io/rdstore-docs"
              rel="noopener noreferrer"
              className="relative flex h-48 flex-col justify-between bg-gradient-to-r from-blue-700 to-purple-800 p-7 rounded-sm text-white shadow-2xl hover:shadow-blue-500/30 transition-all overflow-hidden"
            >
              <video
                src={VIDEO_LINKS.feature4}
                loop
                muted
                autoPlay
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover opacity-30"
              />
              <div className="relative z-10">
                <h1 className="bento-title text-3xl md:text-4xl font-extrabold tracking-widest uppercase">
                  RDSTORE <b>DOCUMENTATION</b>
                </h1>
                <p className="text-sm opacity-80 mt-2">
                  EXPLORE ALL INSTALLATIONS STEPS, CONFIGURATION GUIDES, AND ADVANCED SETUPS.
                </p>
              </div>
              <TiLocationArrow className="m-2 scale-150 self-end animate-pulse relative z-10" />
            </a>
          </BentoTilt>
        </div>
      </div>
    </section>
  );
};
