import { SOCIAL_LINKS } from "@/constants";

export const Footer = () => {
  return (
    <footer className="w-screen bg-[#0000FF] py-4 text-violet-50">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-8 md:flex-row">
        <p className="text-center text-sm md:text-left">
          &copy; <strong className="font-semibold">RDSTORE</strong>{" "}
          {new Date().getFullYear()}.
        </p>

        <div className="flex justify-center gap-4 md:justify-start">
          {SOCIAL_LINKS.map(({ href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-violet-50 transition-colors duration-500 ease-in-out hover:opacity-75"
            >
              <Icon />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href="#"
            className="text-center text-sm transition hover:underline hover:opacity-75 md:text-right"
          >
            RD
          </a>

          <b>|</b>

          <a
            href="#"
            className="text-center text-sm transition hover:underline hover:opacity-75 md:text-right"
          >
            RULES &amp; TERMS
          </a>
        </div>
      </div>
    </footer>
  );
};
