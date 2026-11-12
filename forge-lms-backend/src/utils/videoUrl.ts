export function isValidVideoUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;

  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.toLowerCase();

    // YouTube URLs
    if (host.includes("youtube.com") || host.includes("youtu.be")) {
      let videoId = "";
      if (host.includes("youtu.be")) {
        videoId = parsed.pathname.slice(1).split("/")[0];
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.replace("/embed/", "").split("/")[0];
      } else if (parsed.pathname.startsWith("/watch")) {
        videoId = parsed.searchParams.get("v") || "";
      } else if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.replace("/shorts/", "").split("/")[0];
      }
      return Boolean(videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId));
    }

    // Vimeo URLs
    if (host.includes("vimeo.com")) {
      let videoId = "";
      if (parsed.pathname.startsWith("/video/")) {
        videoId = parsed.pathname.replace("/video/", "").split("/")[0];
      } else {
        const parts = parsed.pathname.split("/").filter(Boolean);
        videoId = parts[parts.length - 1] || "";
      }
      return Boolean(videoId && /^\d+$/.test(videoId));
    }
  } catch {
    return false;
  }

  return false;
}
