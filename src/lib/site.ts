/** The macOS app. The installer is served from this site (public/downloads). */
export const release = {
  version: "1.0.2",
  dmg: "/downloads/MirrorMe-1.0.2.dmg",
  size: "1 MB",
  sha256: "f0c8b15c5eeef2a1ef75cd87112909134c51f5832ad1c9f648496987bd6b11ca",
  minOS: "macOS 14",
  /** One line on what changed in this version, shown next to the download. */
  notes:
    "Faster all round. The menu opens instantly, the camera keeps up with a dragged window, and a camera looking at a still screen uses almost no CPU.",
};

/** Clears the "downloaded from the internet" flag so macOS lets MirrorMe open. */
export const quarantineCommand = "xattr -dr com.apple.quarantine /Applications/MirrorMe.app";
