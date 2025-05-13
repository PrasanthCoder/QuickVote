"use client";

import { useEffect, useRef, useState } from "react";
import { CopyIcon, CheckIcon, Share2Icon } from "lucide-react";
import { TwitterIcon, WhatsAppIcon } from "@/components/Icons";

export function ShareButton({ pollId }: { pollId: string | undefined }) {
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  const shareUrl =
    typeof window !== "undefined" && pollId
      ? `${window.location.origin}/poll/${pollId}`
      : "";

  const copyToClipboard = () => {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Clipboard copy failed:", err);
          fallbackCopyTextToClipboard(shareUrl);
        });
    } else {
      fallbackCopyTextToClipboard(shareUrl); // use fallback for unsupported browsers
    }
  };

  const shareOnWhatsApp = () => {
    const text = "Check out this poll:";
    const encodedUrl = encodeURIComponent(shareUrl);
    window.open(`https://wa.me/?text=${text}%0A${encodedUrl}`);
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=Vote on my poll:%0A${shareUrl}`
    );
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // avoid scrolling
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        alert("Copy failed. Please copy manually.");
      }
    } catch (err) {
      console.error("Fallback: Copy command failed", err);
      alert("Copy not supported in this browser.");
    }

    document.body.removeChild(textArea);
  };

  // 🔍 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareRef.current &&
        !shareRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative my-3" ref={shareRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-gray-400 rounded-lg transition"
      >
        <Share2Icon size={16} />
        <span>Share</span>
      </button>

      {dropdownOpen && (
        <div className="absolute z-10 flex flex-col bg-black shadow-lg rounded-lg p-2 w-48 mt-1 border">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 p-2 hover:bg-gray-400 rounded text-left"
          >
            {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
            {copied ? "Copied!" : "Copy link"}
          </button>

          <button
            onClick={shareOnWhatsApp}
            className="flex items-center gap-2 p-2 hover:bg-gray-400 rounded text-left"
          >
            <WhatsAppIcon size={16} />
            WhatsApp
          </button>

          <button
            onClick={shareOnTwitter}
            className="flex items-center gap-2 p-2 hover:bg-gray-400 rounded text-left"
          >
            <TwitterIcon size={16} />
            Twitter
          </button>
        </div>
      )}
    </div>
  );
}
