/** The macOS app. The installer is served from this site (public/downloads). */
export const release = {
  version: "1.0.0",
  dmg: "/downloads/MirrorMe-1.0.0.dmg",
  size: "1 MB",
  sha256: "a8aaf170b97bac1fb46771307cac35f6bde2378289a90ab0c2771af461d59566",
  minOS: "macOS 14",
};

/** Clears the "downloaded from the internet" flag so macOS lets MirrorMe open. */
export const quarantineCommand = "xattr -dr com.apple.quarantine /Applications/MirrorMe.app";
