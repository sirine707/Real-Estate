import PropTypes from "prop-types";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ArticlePopup = ({ url, description, onClose }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Prevent body scroll when popup is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Fetch summary from backend when url changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");
    setSummary("");
    fetch(`/api/article-summary?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data.success && data.summary) {
            setSummary(data.summary);
          } else {
            setError(data.message || "No summary available.");
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError("Failed to fetch summary.");
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [url]);

  // Calculate the current scroll position
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return createPortal(
    <div
      className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      style={{
        top: `${scrollTop}px`,
        height: "100vh",
      }}
    >
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="absolute right-4 top-4">
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="prose prose-lg max-w-none">
            {loading ? (
              <p className="text-gray-400">Loading summary...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <ReactMarkdown
                className="prose prose-lg max-w-none text-lg leading-relaxed text-gray-700 mb-6"
                remarkPlugins={[remarkGfm]}
              >
                {summary}
              </ReactMarkdown>
            )}
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                View Original Article
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

ArticlePopup.propTypes = {
  url: PropTypes.string.isRequired,
  description: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default ArticlePopup;
