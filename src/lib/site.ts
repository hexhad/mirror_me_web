/** The macOS app. The installer is served from this site (public/downloads). */
export const release = {
  version: "1.0.1",
  dmg: "/downloads/MirrorMe-1.0.1.dmg",
  size: "1 MB",
  sha256: "0fa7cdf0266aa95b6d08ae37a9c5201a0b4a604a640ef3f4381f01a01ba7fc9e",
  minOS: "macOS 14",
};

/** Clears the "downloaded from the internet" flag so macOS lets MirrorMe open. */
export const quarantineCommand = "xattr -dr com.apple.quarantine /Applications/MirrorMe.app";
