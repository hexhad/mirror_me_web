/** The macOS app. The installer is served from this site (public/downloads). */
export const release = {
  version: "1.1.0",
  dmg: "/downloads/MirrorMe-1.1.0.dmg",
  size: "2 MB",
  sha256: "dd3c06dd775c1ad303be4f4dfddccceed5f2b4bd7be6c6e46b363a1db6d550ed",
  minOS: "macOS 14",
  /** One line on what changed in this version, shown next to the download. */
  notes:
    "Show an image, a video or a slideshow on any camera, for every device or just one, with an optional overlay. A new Liquid Glass menu, a media library, and an MCP server for AI agents.",
};

/** Clears the "downloaded from the internet" flag so macOS lets MirrorMe open. */
export const quarantineCommand = "xattr -dr com.apple.quarantine /Applications/MirrorMe.app";
