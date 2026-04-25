"use client";

import { useRef, useEffect, useState } from "react";
import Hls from "hls.js";
import Spinner from "@/components/ui/Spinner";
import { getPlayerComponents } from "@/lib/content";

const vp = getPlayerComponents().videoPlayer;

interface VideoPlayerProps {
  videoUrl: string | null;
  onEnded?: () => void;
  loading?: boolean;
}

export default function VideoPlayer({
  videoUrl,
  onEnded,
  loading = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState(false);
  const [buffering, setBuffering] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    setError(false);
    setBuffering(true);

    // Cleanup any existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHls =
      videoUrl.includes(".m3u8") || videoUrl.includes("application/x-mpegURL");

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });

      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setBuffering(false);
        video.play().catch(() => {
          // Autoplay may be blocked; that's fine
        });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setError(true);
              setBuffering(false);
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else if (
      isHls &&
      video.canPlayType("application/vnd.apple.mpegurl")
    ) {
      // Native HLS support (Safari)
      video.src = videoUrl;
      video.addEventListener(
        "loadedmetadata",
        () => {
          setBuffering(false);
          video.play().catch(() => {});
        },
        { once: true }
      );
    } else {
      // Direct MP4 fallback
      video.src = videoUrl;
      video.addEventListener(
        "loadeddata",
        () => {
          setBuffering(false);
        },
        { once: true }
      );
    }

    const handleEnded = () => {
      onEnded?.();
    };

    const handleError = () => {
      setError(true);
      setBuffering(false);
    };

    const handleWaiting = () => {
      setBuffering(true);
    };

    const handlePlaying = () => {
      setBuffering(false);
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
    };
  }, [videoUrl, onEnded]);

  // Cleanup HLS instance on unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  const showSpinner = loading || (buffering && !error && !!videoUrl);

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden aspect-video">
      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        playsInline
        controlsList="nodownload"
      />

      {/* Loading overlay */}
      {showSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <Spinner size="lg" />
        </div>
      )}

      {/* No video selected state */}
      {!videoUrl && !loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <p className="text-muted text-sm">{vp.selectLesson}</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-white font-medium">{vp.videoUnavailable}</p>
          <p className="text-muted text-sm">
            {vp.tryAgainMessage}
          </p>
        </div>
      )}
    </div>
  );
}
