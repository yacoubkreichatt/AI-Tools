import React, { useState } from 'react';
import { X, Check, Copy, MessageCircle, Share2 } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  toolUrl: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  toolName,
  toolUrl,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(toolUrl);
  const shareText = encodeURIComponent(`Check out this free ${toolName} on AI Tools Hub!`);

  const handleCopy = async () => {
    const success = await copyToClipboard(toolUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id="share-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="share-modal-content"
        className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Share Tool</h3>
              <p className="text-xs text-slate-500">{toolName}</p>
            </div>
          </div>
          <button
            id="share-modal-close"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-3">
          {/* WhatsApp */}
          <a
            id="share-whatsapp"
            href={`https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-800 transition-all font-medium text-sm"
          >
            <span className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                WA
              </span>
              Share to WhatsApp
            </span>
            <span className="text-xs text-slate-400">Direct send</span>
          </a>

          {/* X (Twitter) */}
          <a
            id="share-x"
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full p-3 rounded-xl border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-800 transition-all font-medium text-sm"
          >
            <span className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                X
              </span>
              Share to X (Twitter)
            </span>
            <span className="text-xs text-slate-400">Post update</span>
          </a>

          {/* Facebook */}
          <a
            id="share-facebook"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-slate-800 transition-all font-medium text-sm"
          >
            <span className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                f
              </span>
              Share to Facebook
            </span>
            <span className="text-xs text-slate-400">Feed post</span>
          </a>
        </div>

        {/* Copy Link Section */}
        <div className="pt-3 border-t border-slate-100">
          <label className="block text-xs font-medium text-slate-600 mb-2">Tool Public Link</label>
          <div className="flex items-center gap-2">
            <input
              id="share-link-input"
              type="text"
              readOnly
              value={toolUrl}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 select-all focus:outline-hidden"
            />
            <button
              id="share-copy-btn"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
