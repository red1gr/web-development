import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

type DiscordUser = {
  id: string;
  username: string;
  avatar: string | null;
};

type LanyardData = {
  discord_user: DiscordUser;
};

export const About = () => {
  const [discordData, setDiscordData] = useState<LanyardData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const DISCORD_ID = "146007196617015296";


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number;
    }[] = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let rafId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 0, ${p.alpha})`;
        ctx.fill();
      });
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await res.json();
        setDiscordData(json.data);
      } catch (err) {
        console.error("Lanyard error:", err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const avatar = discordData?.discord_user
    ? `https://cdn.discordapp.com/avatars/${discordData.discord_user.id}/${discordData.discord_user.avatar}.png?size=512`
    : "https://cdn.discordapp.com/embed/avatars/0.png";

  const username = discordData?.discord_user?.username || "Loading...";

  useGSAP(() => {

    gsap.fromTo(
      ".about-line",
      { y: 60, opacity: 0, skewY: 3 },
      {
        y: 0,
        opacity: 1,
        skewY: 0,
        duration: 1.4,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: "#about",
          start: "top 80%",
          end: "bottom 30%",
          scrub: false,
          once: true,
        },
      }
    );

    gsap.fromTo(
      ".profile-avatar",
      { scale: 0.6, opacity: 0, rotate: -8 },
      {
        scale: 1,
        opacity: 1,
        rotate: 0,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: {
          trigger: "#about",
          start: "top 80%",
          once: true,
        },
      }
    );

    gsap.fromTo(
      ".profile-badge",
      { x: -30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.4,
        scrollTrigger: {
          trigger: "#about",
          start: "top 80%",
          once: true,
        },
      }
    );

    gsap.fromTo(
      ".stat-card",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.6,
        scrollTrigger: {
          trigger: "#about",
          start: "top 80%",
          once: true,
        },
      }
    );


    gsap.to(".profile-avatar", {
      y: -12,
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2,
    });

    gsap.fromTo(
      ".scan-line",
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.8,
        ease: "expo.inOut",
        scrollTrigger: {
          trigger: "#about",
          start: "top 80%",
          once: true,
        },
      }
    );
  });

  return (
    <section
      id="about"
      className="min-h-screen w-full bg-[#080808] text-white flex items-center justify-center px-4 sm:px-8 md:px-20 py-16 relative overflow-hidden"
      style={{ fontFamily:"'Barlow Condensed', 'Impact', sans-serif" }}
    >
      <style>{`
       
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@1,900&family=DM+Sans:wght@300;400;500&display=swap');

        .about-body { font-family: 'DM Sans', sans-serif; }

        .avatar-ring::before {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 9999px;
          border: 2px solid rgba(255,0,0,0.25);
          animation: ringPulse 3s ease-in-out infinite;
        }
        .avatar-ring::after {
          content: '';
          position: absolute;
          inset: -14px;
          border-radius: 9999px;
          border: 1px solid rgba(255,0,0,0.1);
          animation: ringPulse 3s ease-in-out infinite 0.5s;
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.04); opacity: 1; }
        }

        .badge-glow {
          box-shadow: 0 0 12px rgba(255,0,0,0.5), inset 0 0 8px rgba(255,0,0,0.1);
        }

        .stat-card:hover {
          border-color: rgba(255,0,0,0.6);
          transform: translateY(-3px);
          transition: all 0.25s ease;
        }

        .corner-bracket::before, .corner-bracket::after {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          border-color: #ff0000;
          border-style: solid;
        }
        .corner-bracket::before {
          top: -2px; left: -2px;
          border-width: 2px 0 0 2px;
        }
        .corner-bracket::after {
          bottom: -2px; right: -2px;
          border-width: 0 2px 2px 0;
        }

        .glitch-text {
          position: relative;
        }
        .glitch-text::before {
          content: attr(data-text);
          position: absolute;
          left: 2px;
          top: 0;
          color: #ff0000;
          clip-path: inset(0 0 60% 0);
          animation: glitch 4s infinite steps(1);
          opacity: 0.6;
        }
        @keyframes glitch {
          0%, 95%, 100% { clip-path: inset(0 0 60% 0); transform: translateX(0); }
          96% { clip-path: inset(30% 0 30% 0); transform: translateX(-2px); }
          97% { clip-path: inset(60% 0 0 0); transform: translateX(2px); }
          98% { clip-path: inset(0 0 60% 0); transform: translateX(-1px); }
        }

        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 180px;
        }
      `}</style>

      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-20 z-0"
      >
        <source
          src="https://r2.fivemanage.com/e9ayQ4VVHnYGIcG9ROsZf/BRUXOPSYCHO-LVGHTERSNAX!(SLOWEDREVERB)BRAZILIANPHONK.mp4"
          type="video/mp4"
        />
      </video>


      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
      />

      {/* Noise texture overlay */}
      <div className="noise-overlay absolute inset-0 z-0 opacity-[0.03] pointer-events-none" />

      {/* Red vignette glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(255,0,0,0.07) 0%, transparent 65%), radial-gradient(ellipse at 30% 50%, rgba(255,0,0,0.04) 0%, transparent 60%)",
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl">

        <div className="about-line flex items-center gap-3 mb-8">
          <span
            className="about-body text-[10px] text-[#ff0000] uppercase"
          >
            
          </span>
          <div className="scan-line h-px flex-1 bg-gradient-to-r from-[#ff0000] to-transparent origin-left" />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16">

          
          <div className="flex-shrink-0 flex flex-col items-center gap-5">
            <div className="profile-avatar relative avatar-ring">
              <div className="corner-bracket relative w-44 h-44 sm:w-52 sm:h-52">
                <img
                  src={avatar}
                  alt="Discord Avatar"
                  className="w-full h-full object-cover rounded-full border-2 border-[#ff0000]"
                  style={{
                    boxShadow: "0 0 40px rgba(255,0,0,0.3), 0 0 80px rgba(255,0,0,0.1)",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-full pointer-events-none opacity-20"
                  style={{
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)",
                  }}
                />
              </div>
            </div>
            <div
              className="about-body px-4 py-1.5 rounded-full border border-[#ff0000]/30 text-sm text-gray-400  uppercase"
              style={{ background: "rgba(255,0,0,0.05)" }}
            >
              @{username}
            </div>
            <div className="flex items-center gap-2 about-body text-xs text-gray-500 ">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff0000] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff0000]" />
              </span>
              ONLINE
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-6 text-center md:text-left">
            <p className="about-line about-body text-[10px] sm:text-xs text-[#ff0000] uppercase">
              RDSTORE — OFFICIAL PROFILE
            </p>
            <div className="about-line overflow-hidden">
              <h1
                className="glitch-text text-5xl sm:text-6xl md:text-7xl leading-none "
style={{ fontWeight: 900, letterSpacing: "-0.01em" }}
              >
                RED1
              </h1>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl leading-none mt-1 "
style={{ color: "#ff0000", fontWeight: 900 }}
              >
                RDSTORE OWNER
              </h2>
            </div>
            <div className="about-line flex items-center gap-3">
              <div className="h-px w-8 bg-[#ff0000]" />
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <p className="about-line about-body text-gray-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto md:mx-0">
              Welcome to{" "}
              <span className="text-white font-medium">RDSTORE</span>. Building
              next-generation experiences and professional-grade interfaces —
              one pixel at a time.
            </p>
            <div className="about-line flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="profile-badge badge-glow bg-[#ff0000] text-white px-4 py-1.5 rounded text-xs sm:text-sm font-bold  uppercase about-body">
                LEAD DEV
              </span>
              <span
                className="profile-badge text-white px-4 py-1.5 rounded text-xs sm:text-sm font-bold uppercase about-body border border-white/10"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                OWNER
              </span>
              <span
                className="profile-badge text-[#ff0000] px-4 py-1.5 rounded text-xs sm:text-sm font-bold  uppercase about-body border border-[#ff0000]/30"
                style={{ background: "rgba(255,0,0,0.05)" }}
              >
                FOUNDER
              </span>
            </div>
            <div className="about-line grid grid-cols-3 gap-3 mt-2">
              {[
                { label: "PROJECTS", value: "50+" },
                { label: "CLIENTS", value: "300K+" },
                { label: "UPTIME", value: "99%" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="stat-card border border-white/8 rounded-lg p-4 flex flex-col items-center md:items-start gap-1 cursor-default"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {stat.value}
                  </span>
                  <span
                    className="about-body text-[9px] sm:text-[10px]  text-gray-500 uppercase"
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="about-line mt-12 flex items-center gap-4">
          <div className="scan-line h-px flex-1 bg-gradient-to-r from-transparent to-[#ff0000] origin-right" />
          <span className="about-body text-[10px]  text-gray-600 uppercase">
            RDSTORE
          </span>
        </div>
      </div>
    </section>
  );
};