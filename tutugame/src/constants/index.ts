import { FaDiscord, FaBook, FaYoutube ,FaShoppingCart} from "react-icons/fa";
import {  } from "react-icons/fa6";

export const NAV_ITEMS = [
  { label: "RDSTORE", href: "https://rdstorefivem.com/" },
  { label: "DISCORD", href: "https://discord.rdstorefivem.com/" },
  { label: "DOCS", href: "https://rdstore.gitbook.io/rdstore-docs" },
] as const;

export const LINKS = {
  sourceCode: "https://github.com/red1gr",
} as const;

export const SOCIAL_LINKS = [
  {
    href: "https://discord.gg/zzS3gwSNSA",
    icon: FaDiscord,
  },
  {
    href: "https://rdstore.gitbook.io/rdstore-docs",
    icon: FaBook,
  },
  {
    href: "https://rdstore.tebex.io/",
    icon: FaShoppingCart,
  },
  {
    href: "https://www.youtube.com/@rdstorefivem",
    icon: FaYoutube,
  },
] as const;

