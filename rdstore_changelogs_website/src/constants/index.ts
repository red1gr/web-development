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

export const VIDEO_LINKS = {
  feature1:
    "https://r2.fivemanage.com/e9ayQ4VVHnYGIcG9ROsZf/snaptik_7496193124834839863_v2.mp4",
  feature2:
    "https://r2.fivemanage.com/e9ayQ4VVHnYGIcG9ROsZf/Render.mp4",
  feature3:
    "https://r2.fivemanage.com/e9ayQ4VVHnYGIcG9ROsZf/snaptik_7470825499380452663_v2.mp4",
  feature4:
    "https://r2.fivemanage.com/e9ayQ4VVHnYGIcG9ROsZf/snaptik_7557756236607835399_v2.mp4",
  feature5:
    "https://r2.fivemanage.com/e9ayQ4VVHnYGIcG9ROsZf/snaptik_7466495367027199238_v2(1).mp4",
  hero1:
    "https://r2.fivemanage.com/e9ayQ4VVHnYGIcG9ROsZf/1005(1)(1).mp4",
  hero2:
    "https://r2.fivemanage.com/e9ayQ4VVHnYGIcG9ROsZf/1005(1)(2).mp4",
  hero3:
    "https://r2.fivemanage.com/e9ayQ4VVHnYGIcG9ROsZf/1005(1)(3).mp4",
  // hero4:
  //   "https://93w95scdts.ufs.sh/f/AOfILeWJzqCcpB0GHsouj1IHWSEokgRuN2hMcUpBq0xQery3",
};
