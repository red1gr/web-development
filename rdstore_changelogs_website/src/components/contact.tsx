import { Button } from "./button";

interface ImageClipBoxProps {
  src: string;
  alt: string;
  clipClass?: string;
}

const ImageClipBox = ({ src, alt, clipClass }: ImageClipBoxProps) => (
  <div className={clipClass}>
    <img src={src} alt={alt} />
  </div>
);

export const Contact = () => {
  return (
    <section id="contact" className="my-20 min-h-96 w-screen px-10">
      <div className="relative rounded-lg bg-black py-24 text-blue-50 sm:overflow-hidden">
        <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96">
          <ImageClipBox
            src="/img/contact-1.webp"
            alt="Contact bg 1"
            clipClass="contact-clip-path-1"
          />

          <ImageClipBox
            src="/img/contact-2.webp"
            alt="Contact bg 2"
            clipClass="contact-clip-path-2 lg:translate-y-40 translate-y-60"
          />
        </div>

        <div className="absolute -top-40 left-20 w-60 sm:top-1/2 md:left-auto md:right-10 lg:top-20 lg:w-80">
          <ImageClipBox
            src="/img/swordman-partial.webp"
            alt="Swordman partial"
            clipClass="absolute md:scale-125"
          />

          <ImageClipBox
            src="/img/swordman.webp"
            alt="Swordman"
            clipClass="sword-man-clip-path md:scale-125"
          />
        </div>

        <div className="flex flex-col items-center text-center">

      <p className="special-font mt-10 w-full font-zentry text-5xl leading-[0.9] md:text-[6rem]">
        CONTACT <b>US</b> <b>NOW</b>
        <br /> AND J<b>O</b>IN THE <br /> NEW ERA<br></br> <b>O</b>F F<b>IV</b>EM SCRI<b>P</b>TS
      </p>



          <a
            href="https://discord.gg/zzS3gwSNSA"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button containerClass="mt-10 cursor-pointer">Contact Us</Button>
          </a>
        </div>
      </div>
    </section>
  );
};
