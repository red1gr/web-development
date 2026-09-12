import { VIDEO_LINKS } from "@/constants";
import { PropsWithChildren, useRef, useState } from "react";
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
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

interface BentoCardProps {
  src: string;
  title: React.ReactNode;
  description?: string;
  version?: string;
}

const BentoCard = ({ src, title, description, version }: BentoCardProps) => {
  return (
    <article className="relative w-full h-full rounded-md overflow-hidden border border-gray-800">
      <video
        src={src}
        loop
        muted
        autoPlay
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="relative z-10 flex h-full flex-col justify-between p-5 bg-black/40 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && <p className="text-xl mt-2 md:text-base">{description}</p>}
          {version && <p className="mt-1 text-sm text-blue-300 opacity-70">{version}</p>}
        </div>
      </div>
    </article>
  );
};

export const Docs = () => {
  return (
    <section className="bg-black pb-8">
      <div className="container mx-auto px-2 md:px-10">
        <div className="px-3 py-20">
          <p className="font-circular-web text-lg text-blue-50 font-bold">
            RDSTORE DOCS
          </p>
          <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
            Check out the latest updates and new Docs in our scripts and services.
          </p>
        </div>

        <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh] glare-hover">
          <BentoCard
            src={VIDEO_LINKS.feature1}
            title={<><b>RD PHARMACY</b> Script</>}
            description="Our Pharmacy script is launching soon!"
            version="v1.0.0 – Coming Soon" 
          />
        </BentoTilt>

        <div id="nexus" className="grid h-[135vh] grid-cols-2 grid-rows-3 gap-7">
          <BentoTilt className="row-span-1 md:col-span-1 md:row-span-2">
            <BentoCard
              src={VIDEO_LINKS.feature2}
              title={<><b>Website Rebuild</b></>}
              description="We rebuilt our website for a smoother user experience."
              version="v2.1.0 – 31/10/2025"
            />
          </BentoTilt>

          <BentoTilt className="row-span-1 md:col-span-1">
            <BentoCard
              src={VIDEO_LINKS.feature3}
              title={<><b>RD VALENTINE</b></>}
              description=""
              version=""
            />
          </BentoTilt>

          <BentoTilt className="md:col-span-1">
            <BentoCard
              src={VIDEO_LINKS.feature4}
              title={<><b>Rubbey Botola</b></>}
              description="A new clothing script is now available in our store."
              version="v1.0.1 – 13/10/2025"
            />
          </BentoTilt>

          <BentoTilt>
            <div className="flex h-full flex-col justify-between bg-[#0000ff] p-5 rounded-md">
              <h1 className="bento-title special-font max-w-64 text-white">
                More <b>Coming Soon!</b>
              </h1>
              <TiLocationArrow className="m-5 scale-125 self-end text-white" />
            </div>
          </BentoTilt>

          <BentoTilt>
            <video
              src={VIDEO_LINKS.feature5}
              loop
              muted
              autoPlay
              className="w-full h-full object-cover rounded-md"
            />
          </BentoTilt>
        </div>
      </div>
    </section>
  );
};
