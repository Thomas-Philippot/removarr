import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Removarr",
  base: "/removarr/",
  description: "Media deletion tool for shared plex library",
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
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/thomas-philippot/removarr" },
    ],
  },
});
