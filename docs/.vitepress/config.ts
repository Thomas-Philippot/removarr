import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Removarr",
  base: "/removarr/",
  description: "Media deletion tool for shared media library",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Installation", link: "/install" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        items: [{ text: "Installation", link: "/install" }],
      },
      {
        text: "Settings",
        items: [{ text: "Plex", link: "/settings/plex" }],
      },
      {
        text: "Support",
        items: [
          { text: "Version 2 upgrade", link: "/support/v2-upgrade" },
          { text: "Version 3 upgrade", link: "/support/v3-upgrade" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/thomas-philippot/removarr" },
    ],
  },
});
