import React, { useState, useEffect } from 'react';
import { ToolDefinition } from '../types/tools';
import { useApp } from '../context/AppContext';
import { SeoHead } from './SeoHead';
import { copyToClipboard } from '../utils/clipboard';
import {
  Youtube,
  Download,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Layers,
  ArrowRight,
  ClipboardPaste,
  X,
  CheckCircle2,
} from 'lucide-react';

interface YouTubeThumbnailToolProps {
  tool: ToolDefinition;
}

interface ThumbnailOption {
  quality: 'maxres' | 'sd' | 'hq' | 'mq' | 'default';
  label: string;
  resolution: string;
  url: string;
}

export function extractYouTubeVideoId(inputUrl: string): string | null {
  if (!inputUrl || typeof inputUrl !== 'string') return null;
  const trimmed = inputUrl.trim();

  // Handle standard watch URLs, youtu.be short links, shorts, embeds, and live streams
  const patterns = [
    /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})(?:&.*)?$/,
    /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})(?:[/?].*)?$/,
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:[/?].*)?$/,
    /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:[/?].*)?$/,
    /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/live\/([a-zA-Z0-9_-]{11})(?:[/?].*)?$/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Fallback check for raw 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export const YouTubeThumbnailTool: React.FC<YouTubeThumbnailToolProps> = ({ tool }) => {
  const { navigate, addRecent } = useApp();

  const [urlInput, setUrlInput] = useState('');
  const [extractedId, setExtractedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [availableThumbnails, setAvailableThumbnails] = useState<ThumbnailOption[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState<ThumbnailOption | null>(null);
  const [copiedType, setCopiedType] = useState<'url' | 'id' | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    addRecent('youtube-thumbnail-downloader');
  }, []);

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrlInput(text.trim());
          setErrorMessage(null);
        }
      }
    } catch {
      // Clipboard permission denied or unavailable
    }
  };

  const handleClear = () => {
    setUrlInput('');
    setExtractedId(null);
    setAvailableThumbnails([]);
    setSelectedThumbnail(null);
    setErrorMessage(null);
  };

  const verifyThumbnailUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // YouTube returns a 120x90 placeholder if maxres is missing
        if (img.naturalWidth > 120) {
          resolve(true);
        } else {
          resolve(false);
        }
      };
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const handleExtract = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const videoId = extractYouTubeVideoId(urlInput);
    if (!videoId) {
      setErrorMessage(
        'Please enter a valid YouTube video URL. Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/dQw4w9WgXcQ'
      );
      return;
    }

    setIsLoading(true);
    setExtractedId(videoId);

    try {
      const maxresUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      const sdUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
      const hqUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      const mqUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

      // Check maxres availability
      const hasMaxRes = await verifyThumbnailUrl(maxresUrl);
      const hasSd = hasMaxRes ? true : await verifyThumbnailUrl(sdUrl);

      const options: ThumbnailOption[] = [];

      if (hasMaxRes) {
        options.push({
          quality: 'maxres',
          label: 'Maximum HD (1080p / 720p)',
          resolution: '1280 × 720',
          url: maxresUrl,
        });
      }

      if (hasSd) {
        options.push({
          quality: 'sd',
          label: 'Standard Definition (SD)',
          resolution: '640 × 480',
          url: sdUrl,
        });
      }

      options.push({
        quality: 'hq',
        label: 'High Quality (HQ)',
        resolution: '480 × 360',
        url: hqUrl,
      });

      options.push({
        quality: 'mq',
        label: 'Medium Quality (MQ)',
        resolution: '320 × 180',
        url: mqUrl,
      });

      setAvailableThumbnails(options);
      setSelectedThumbnail(options[0]);
    } catch {
      // Fallback to default HQ thumbnail
      const fallbackUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      const fallback: ThumbnailOption = {
        quality: 'hq',
        label: 'High Quality (HQ)',
        resolution: '480 × 360',
        url: fallbackUrl,
      };
      setAvailableThumbnails([fallback]);
      setSelectedThumbnail(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDownload = async (thumbnailUrl: string, qualityLabel: string) => {
    if (!extractedId) return;
    setDownloading(true);
    const filename = `youtube-thumbnail-${extractedId}-${qualityLabel.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;

    try {
      const response = await fetch(thumbnailUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('Fetch failed');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Direct browser fallback if CORS prevents blob creation
      const link = document.createElement('a');
      link.href = thumbnailUrl;
      link.target = '_blank';
      link.download = filename;
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = async (text: string, type: 'url' | 'id') => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  return (
    <div id="youtube-thumbnail-tool" className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <SeoHead
        title="Free YouTube Thumbnail Downloader — Download HD & 4K Thumbnails"
        description="Download high-resolution YouTube video and Shorts thumbnails in HD and JPG for free. No watermark, no signup, instant preview and download."
        canonicalPath="/tools/youtube-thumbnail-downloader"
        toolName="YouTube Thumbnail Downloader"
        categoryName="YouTube"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button onClick={() => navigate('/')} className="hover:text-slate-900 transition-colors">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('/categories/youtube')} className="hover:text-slate-900 transition-colors">
            YouTube
          </button>
          <span>/</span>
          <span className="text-slate-900">Thumbnail Downloader</span>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shadow-2xs">
              <Youtube className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                YouTube Thumbnail Downloader
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Paste any YouTube video or Shorts link to extract and download high-resolution cover images.
              </p>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleExtract} className="space-y-4 mt-6">
            <div>
              <label htmlFor="youtube-url-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Paste a YouTube Video URL
              </label>
              <div className="relative flex items-center">
                <input
                  id="youtube-url-input"
                  type="text"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className={`w-full px-4 py-3.5 pr-28 text-sm bg-slate-50/70 border rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errorMessage
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-slate-200 focus:border-red-500 focus:ring-red-50'
                  }`}
                />

                <div className="absolute right-2.5 flex items-center gap-1">
                  {urlInput && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
                      title="Clear input"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handlePasteFromClipboard}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl shadow-2xs transition-colors"
                    title="Paste from clipboard"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Paste</span>
                  </button>
                </div>
              </div>

              {/* Inline Error Message */}
              {errorMessage && (
                <div id="url-error-alert" className="flex items-start gap-2 mt-2.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                id="get-thumbnail-button"
                type="submit"
                disabled={isLoading || !urlInput.trim()}
                className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Get Thumbnail</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setUrlInput('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
                  setErrorMessage(null);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                Try an example
              </button>
            </div>
          </form>
        </div>

        {/* Thumbnail Extraction Results */}
        {selectedThumbnail && extractedId && (
          <div id="thumbnail-results-card" className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Thumbnail Extracted
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    ID: {extractedId}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  Resolution: {selectedThumbnail.resolution} ({selectedThumbnail.label.split('(')[0].trim()})
                </h2>
              </div>

              {/* Quality Selector Tabs */}
              {availableThumbnails.length > 1 && (
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  {availableThumbnails.map((opt) => (
                    <button
                      key={opt.quality}
                      type="button"
                      onClick={() => setSelectedThumbnail(opt)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        selectedThumbnail.quality === opt.quality
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {opt.quality.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Preview Stage */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-inner group aspect-video flex items-center justify-center">
              <img
                src={selectedThumbnail.url}
                alt={`YouTube Thumbnail for video ${extractedId}`}
                className="w-full h-full object-contain"
                loading="eager"
              />
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                {selectedThumbnail.resolution}
              </div>
            </div>

            {/* Action Buttons Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {/* Button 1: Download HD */}
              <button
                id="download-hd-btn"
                type="button"
                onClick={() => triggerDownload(availableThumbnails[0]?.url || selectedThumbnail.url, 'HD')}
                disabled={downloading}
                className="px-4 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download HD (1280×720)</span>
              </button>

              {/* Button 2: Download JPG */}
              <button
                id="download-jpg-btn"
                type="button"
                onClick={() => triggerDownload(selectedThumbnail.url, 'Standard')}
                disabled={downloading}
                className="px-4 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download JPG</span>
              </button>

              {/* Button 3: Open Image in New Tab */}
              <a
                id="open-image-link"
                href={selectedThumbnail.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-all"
              >
                <ExternalLink className="w-4 h-4 text-slate-500" />
                <span>Open Image</span>
              </a>

              {/* Button 4: Copy Image URL */}
              <button
                id="copy-image-url-btn"
                type="button"
                onClick={() => handleCopy(selectedThumbnail.url, 'url')}
                className="px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedType === 'url' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Copied URL!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Copy Image URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Explanatory Guide & Original Content */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-10 space-y-8">
          {/* Section 1: What is a YouTube Thumbnail Downloader */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-500" />
              What is a YouTube Thumbnail Downloader?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              A <strong>YouTube Thumbnail Downloader</strong> is a specialized utility that extracts the official high-definition preview images generated for any public YouTube video, YouTube Shorts clip, or live stream. When creators upload a video, YouTube automatically renders multiple resolutions of the cover image and stores them on its global Content Delivery Network (CDN).
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our free web tool reads the public video identifier directly from your link and immediately retrieves the highest-resolution official image without watermarks, compression artifacts, or forced account registrations.
            </p>
          </section>

          {/* Section 2: How to Use It (3 Steps) */}
          <section className="space-y-4 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900">How to Use It in 3 Simple Steps</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-2">
                <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-sm text-slate-900">Copy the Video Link</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Open YouTube in your browser or mobile app and copy the share link of any public video or Shorts.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-2">
                <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-sm text-slate-900">Paste & Extract</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Paste the URL into the input field above and click &quot;Get Thumbnail&quot;. The tool verifies image quality in milliseconds.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-2">
                <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h3 className="font-bold text-sm text-slate-900">Download or Copy</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Download the HD (1280x720) or standard JPG image, copy the direct URL, or open the image full-size in a new browser tab.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Supported YouTube URLs */}
          <section className="space-y-4 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900">Supported YouTube URL Formats</h2>
            <p className="text-sm text-slate-600">
              Our downloader supports every valid public YouTube URL format without requiring manual cleanup:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="px-4 py-2.5">Platform / Format</th>
                    <th className="px-4 py-2.5">Example URL</th>
                    <th className="px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">Desktop Watch URL</td>
                    <td className="px-4 py-2 font-mono text-slate-500">https://www.youtube.com/watch?v=dQw4w9WgXcQ</td>
                    <td className="px-4 py-2 text-emerald-600 font-semibold">Supported</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">Shortened Link (youtu.be)</td>
                    <td className="px-4 py-2 font-mono text-slate-500">https://youtu.be/dQw4w9WgXcQ</td>
                    <td className="px-4 py-2 text-emerald-600 font-semibold">Supported</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">YouTube Shorts URL</td>
                    <td className="px-4 py-2 font-mono text-slate-500">https://www.youtube.com/shorts/dQw4w9WgXcQ</td>
                    <td className="px-4 py-2 text-emerald-600 font-semibold">Supported</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">Mobile URL (m.youtube.com)</td>
                    <td className="px-4 py-2 font-mono text-slate-500">https://m.youtube.com/watch?v=dQw4w9WgXcQ</td>
                    <td className="px-4 py-2 text-emerald-600 font-semibold">Supported</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">Embedded Video URL</td>
                    <td className="px-4 py-2 font-mono text-slate-500">https://www.youtube.com/embed/dQw4w9WgXcQ</td>
                    <td className="px-4 py-2 text-emerald-600 font-semibold">Supported</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-slate-900">Live Stream URL</td>
                    <td className="px-4 py-2 font-mono text-slate-500">https://www.youtube.com/live/dQw4w9WgXcQ</td>
                    <td className="px-4 py-2 text-emerald-600 font-semibold">Supported</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: FAQs */}
          <section className="space-y-4 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              Frequently Asked Questions (FAQ)
            </h2>

            <div className="space-y-3">
              {[
                {
                  q: 'Is it legal to download YouTube thumbnails?',
                  a: 'Yes. YouTube thumbnails are publicly indexed images distributed openly via YouTube’s content delivery servers. You are permitted to download and inspect them for personal reference, design inspiration, fair use commentary, and editorial reviews. Please ensure you respect the original creator’s intellectual property rights and avoid re-uploading someone else’s thumbnail as your own.',
                },
                {
                  q: 'Why are some thumbnails only 640x480 or 480x360 instead of 1280x720 HD?',
                  a: 'When an author uploads a video with a custom 1280x720 image, YouTube creates the "maxresdefault" file. However, for older videos (often uploaded before 2012) or lower-resolution clips, YouTube only generated standard definition (640x480) or high quality (480x360) images. Our tool checks for the 1280x720 file first and automatically presents the highest resolution that actually exists.',
                },
                {
                  q: 'Does this tool download the actual YouTube video?',
                  a: 'No. This tool strictly retrieves the static cover thumbnail image associated with the video ID. It does not scrape, download, or stream video or audio files.',
                },
                {
                  q: 'Can I download thumbnails from private or unlisted videos?',
                  a: 'For unlisted videos, if you possess the exact share link, the public CDN image is generally accessible. For private videos, thumbnails cannot be retrieved because YouTube restricts access to authorized channel managers.',
                },
                {
                  q: 'Is there any daily limit or watermark on downloaded thumbnails?',
                  a: 'No. Our YouTube Thumbnail Downloader is 100% free with unlimited usage, zero watermarks, and no sign-up requirements.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        faqOpenIndex === idx ? 'rotate-180 text-red-600' : ''
                      }`}
                    />
                  </button>
                  {faqOpenIndex === idx && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Related Tools */}
          <section className="border-t border-slate-100 pt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Related Creator & YouTube Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => navigate('/tools/youtube-title-generator')}
                className="p-4 bg-slate-50 hover:bg-red-50/50 border border-slate-200 hover:border-red-200 rounded-2xl text-left transition-all group"
              >
                <div className="font-bold text-sm text-slate-900 group-hover:text-red-600 flex items-center justify-between">
                  <span>YouTube Title Generator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Generate 20 high-CTR video title ideas based on viral formulas.
                </p>
              </button>

              <button
                type="button"
                onClick={() => navigate('/tools/image-prompt-generator')}
                className="p-4 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 rounded-2xl text-left transition-all group"
              >
                <div className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 flex items-center justify-between">
                  <span>AI Image Generator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Create custom channel art and thumbnail backgrounds with AI.
                </p>
              </button>

              <button
                type="button"
                onClick={() => navigate('/tools/tiktok-hook-generator')}
                className="p-4 bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-200 rounded-2xl text-left transition-all group"
              >
                <div className="font-bold text-sm text-slate-900 group-hover:text-purple-600 flex items-center justify-between">
                  <span>TikTok & Shorts Hook Generator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Hook viewers in the first 3 seconds of your YouTube Shorts.
                </p>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
