import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="theme-page">
      <div className="theme-container">
        <div className="theme-grid p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <p className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-white/80 text-[var(--ink-muted)] shadow-sm">
              ClassAccess Portal
            </p>
            <h1 className="theme-title text-2xl sm:text-3xl md:text-5xl font-semibold text-[var(--ink)] mt-4 md:mt-5">
              Choose your path
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[var(--ink-muted)] max-w-2xl mx-auto mt-3 md:mt-4 px-2">
              Access a shared PDF instantly, or sign in to upload and manage secure sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-10">
            <div className="theme-card p-4 sm:p-6 md:p-8 flex flex-col justify-between">
              <div>
                <h2 className="theme-title text-lg sm:text-xl font-semibold text-[var(--ink)]">Access a PDF</h2>
                <p className="text-xs sm:text-sm md:text-base text-[var(--ink-muted)] mt-2">
                  Enter a session code to view the document immediately.
                </p>
              </div>
              <button
                onClick={() => navigate("/access")}
                className="mt-5 sm:mt-6 w-full theme-button-primary text-sm sm:text-base py-2 sm:py-3"
              >
                Access with Code
              </button>
            </div>

            <div className="theme-card p-4 sm:p-6 md:p-8 flex flex-col justify-between">
              <div>
                <h2 className="theme-title text-lg sm:text-xl font-semibold text-[var(--ink)]">Teacher Login</h2>
                <p className="text-xs sm:text-sm md:text-base text-[var(--ink-muted)] mt-2">
                  Upload PDFs, set expiry windows, and manage sessions.
                </p>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="mt-5 sm:mt-6 w-full theme-button-ghost text-sm sm:text-base py-2 sm:py-3"
              >
                Go to Login
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-[var(--ink-muted)]">
            <span className="theme-chip">Secure sessions</span>
            <span className="theme-chip">Instant access</span>
            <span className="theme-chip">Teacher controls</span>
          </div>

          {/* Documentation Link */}
          <div className="mt-8 sm:mt-10 text-center">
            <a
              href="/docs"
              className="text-xs sm:text-sm text-[var(--accent)] hover:underline inline-flex items-center gap-1 font-medium"
            >
              📚 View Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
