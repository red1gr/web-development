import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import { AnimatedTitle } from "./animated-title";

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

return (
  <div id="about" className="min-h-screen w-screen">
    <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
      <p className="font-general text-sm uppercase md:text-[10px]">
        Welcome to <b>rdstore</b>
      </p>

      <AnimatedTitle containerClass="mt-5 !text-black text-center">
        {"<b>Red1</b> — Store Owner and Lead Dev in <b>rdstore</b>"}
      </AnimatedTitle>

      <div className="about-subtext text-center">
        <p>Building and managing the ultimate <b>rdstore</b> experience</p>
        <p>Creating tools, scripts, and adventures for the <b>community</b></p>
      </div>
    </div>

    <div className="h-dvh w-screen" id="clip">
      <div className="mask-clip-path about-image">
        <img
          src="/img/about.webp"
          alt="Background"
          className="absolute left-0 top-0 size-full object-cover"
        />
      </div>
    </div>
  </div>
);

};
