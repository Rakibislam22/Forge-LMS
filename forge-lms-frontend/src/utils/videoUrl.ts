/**
 * Normalizes user-provided YouTube or Vimeo URLs into safe embed URLs.
 * Returns null if the URL is not from an allowed video host.
 */
export function getSafeEmbedUrl(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.toLowerCase();

    // YouTube URLs: youtube.com, www.youtube.com, m.youtube.com, youtu.be
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

      // Safe alphanumeric video ID check
      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return `https://www.youtube-nocookie.com/embed/${videoId}`;
      }
    }

    // Vimeo URLs: vimeo.com, player.vimeo.com
    if (host.includes("vimeo.com")) {
      let videoId = "";
      if (parsed.pathname.startsWith("/video/")) {
        videoId = parsed.pathname.replace("/video/", "").split("/")[0];
      } else {
        const parts = parsed.pathname.split("/").filter(Boolean);
        videoId = parts[parts.length - 1] || "";
      }

      if (videoId && /^\d+$/.test(videoId)) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }
  } catch {
    return null;
  }

  return null;
}
