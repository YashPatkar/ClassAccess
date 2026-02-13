import { useNavigate } from 'react-router-dom';

function Docs() {
  const navigate = useNavigate();

  const pages = [
    {
      category: 'Public Pages',
      description: 'Accessible to all users without authentication',
      routes: [
        {
          path: '/',
          name: 'Home / Landing Page',
          description: 'Entry point for the application. Users can choose between accessing a PDF with a session code or logging in as a teacher.',
          features: ['Choice between Access & Login', 'Responsive grid design', 'Portal branding']
        },
        {
          path: '/login',
          name: 'Teacher Login',
          description: 'Authentication page for teachers. Requires email and password credentials to access dashboard and upload features.',
          features: ['Email/password login', 'Error handling', 'Redirect to upload on success', 'Sign up link']
        },
        {
          path: '/signup',
          name: 'Teacher Sign Up',
          description: 'Registration page for new teachers. Create a new account with email and password.',
          features: ['Account creation', 'Validation', 'Auto-redirect to login', 'Login link']
        },
        {
          path: '/access',
          name: 'PDF Access (Student Entry)',
          description: 'Page where students/users enter a session code to access a PDF. No authentication required.',
          features: ['Session code input', 'Code validation', 'Error messages', 'Navigation to Home']
        },
        {
          path: '/docs',
          name: 'Documentation',
          description: 'Self-serve documentation with page inventory, feature summaries, and architecture overview.',
          features: ['Route catalog', 'Quick navigation', 'Auth/access flow overview', 'Responsive layout']
        }
      ]
    },
    {
      category: 'Protected Pages (Teacher Only)',
      description: 'Requires authentication via JWT token in localStorage',
      routes: [
        {
          path: '/teacher/upload',
          name: 'PDF Upload',
          description: 'Main teacher dashboard for uploading new PDFs. Users specify file and expiry date/time. System generates a unique session code.',
          features: ['File upload', 'Datetime picker', 'Session code generation', 'Copy code button', 'Dashboard & Logout navigation']
        },
        {
          path: '/teacher/dashboard',
          name: 'Teacher Dashboard',
          description: 'Displays all uploaded PDFs in a responsive table. Shows file name, code, expiry, status, creation date, and delete action.',
          features: ['PDF listing', 'Session codes (copyable)', 'Expiry & status display', 'Responsive table', 'Delete functionality', 'Pagination ready']
        }
      ]
    },
    {
      category: 'File Viewing',
      description: 'Accessed via session code or authenticated routes',
      routes: [
        {
          path: '/access/view',
          name: 'PDF Viewer',
          description: 'Displays the PDF document accessed via valid session code. Shows embedded PDF viewer with scrolling and controls.',
          features: ['PDF rendering', 'Session validation', 'Embedded viewer', 'Navigation']
        }
      ]
    }
  ];

  return (
    <div className="theme-page">
      <div className="theme-container">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="theme-title text-2xl sm:text-3xl md:text-4xl font-semibold text-[var(--ink)] mb-2">
            Application Documentation
          </h1>
          <p className="text-sm sm:text-base text-[var(--ink-muted)] max-w-2xl">
            Complete guide to all pages and features in ClassAccess Portal. Use this documentation to understand the application structure and navigate between pages.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-5 theme-card bg-[var(--surface-2)] border-l-4 border-[var(--accent)]">
          <h2 className="theme-title text-base sm:text-lg font-semibold text-[var(--ink)] mb-3">
            Quick Links
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-xs sm:text-sm theme-button-ghost px-2 sm:px-3 py-2 text-center whitespace-nowrap"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-xs sm:text-sm theme-button-ghost px-2 sm:px-3 py-2 text-center whitespace-nowrap"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="text-xs sm:text-sm theme-button-ghost px-2 sm:px-3 py-2 text-center whitespace-nowrap"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate('/access')}
              className="text-xs sm:text-sm theme-button-ghost px-2 sm:px-3 py-2 text-center whitespace-nowrap"
            >
              Access PDF
            </button>
          </div>
        </div>

        {/* Pages by Category */}
        <div className="space-y-6 sm:space-y-8">
          {pages.map((section, idx) => (
            <div key={idx} className="space-y-4">
              {/* Section Header */}
              <div className="border-b-2 border-[var(--accent)] pb-3">
                <h2 className="theme-title text-lg sm:text-xl font-semibold text-[var(--ink)]">
                  {section.category}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--ink-muted)] mt-1">
                  {section.description}
                </p>
              </div>

              {/* Routes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {section.routes.map((route, routeIdx) => (
                  <div
                    key={routeIdx}
                    className="theme-card p-4 sm:p-5 md:p-6 border-l-4 border-[var(--accent)]"
                  >
                    {/* Route Path Badge */}
                    <div className="inline-flex items-center rounded-full bg-[#eef3ff] px-3 py-1 mb-3">
                      <span className="font-mono text-[11px] sm:text-xs text-[#1b3b9a] font-semibold">
                        {route.path}
                      </span>
                    </div>

                    {/* Route Name */}
                    <h3 className="theme-title text-base sm:text-lg font-semibold text-[var(--ink)] mb-2">
                      {route.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[var(--ink-muted)] mb-4 leading-relaxed">
                      {route.description}
                    </p>

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="text-xs sm:text-sm font-semibold text-[var(--ink)] mb-2">
                        Key Features:
                      </h4>
                      <ul className="space-y-1">
                        {route.features.map((feature, featureIdx) => (
                          <li
                            key={featureIdx}
                            className="text-xs sm:text-sm text-[var(--ink-muted)] flex items-start gap-2"
                          >
                            <span className="text-[var(--accent)] mt-0.5 flex-shrink-0">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Navigate Button */}
                    <button
                      onClick={() => navigate(route.path)}
                      className="w-full theme-button-primary text-xs sm:text-sm py-2"
                    >
                      Visit Page →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Architecture Section */}
        <div className="mt-8 sm:mt-10 md:mt-12 theme-grid p-4 sm:p-5 md:p-6">
          <h2 className="theme-title text-lg sm:text-xl font-semibold text-[var(--ink)] mb-4">
            Architecture Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="font-semibold text-[var(--ink)] mb-2 text-sm sm:text-base flex items-center gap-2">
                <span className="text-[var(--accent)]">🔐</span> Authentication Flow
              </h3>
              <ul className="space-y-1 text-xs sm:text-sm text-[var(--ink-muted)]">
                <li>• User logs in via /login</li>
                <li>• JWT token stored in localStorage</li>
                <li>• Protected routes check token</li>
                <li>• Logout clears token & redirects</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--ink)] mb-2 text-sm sm:text-base flex items-center gap-2">
                <span className="text-[var(--accent)]">📄</span> Access Flow
              </h3>
              <ul className="space-y-1 text-xs sm:text-sm text-[var(--ink-muted)]">
                <li>• Teacher uploads PDF via /teacher/upload</li>
                <li>• System generates session code</li>
                <li>• Student/user enters code at /access</li>
                <li>• Views PDF at /access/view</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Summary */}
        <div className="mt-8 sm:mt-10 md:mt-12">
          <h2 className="theme-title text-lg sm:text-xl font-semibold text-[var(--ink)] mb-4">
            Core Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: '📤', title: 'PDF Upload', desc: 'Teachers upload documents with custom expiry' },
              { icon: '🔑', title: 'Session Codes', desc: 'Unique codes for secure access' },
              { icon: '👤', title: 'User Auth', desc: 'JWT-based authentication' },
              { icon: '📋', title: 'Dashboard', desc: 'Manage all uploaded PDFs' },
              { icon: '⏰', title: 'Expiry Control', desc: 'Set document access windows' },
              { icon: '📱', title: 'Responsive', desc: 'Works on all device sizes' }
            ].map((feature, idx) => (
              <div key={idx} className="theme-card p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-3xl mb-2">{feature.icon}</div>
                <h3 className="theme-title text-sm sm:text-base font-semibold text-[var(--ink)]">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--ink-muted)] mt-1">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-10 md:mt-12 p-4 sm:p-5 theme-card bg-[var(--surface-2)] text-center">
          <p className="text-xs sm:text-sm text-[var(--ink-muted)]">
            📚 <span className="font-semibold">ClassAccess Portal</span> - Secure PDF Sharing & Management Platform
          </p>
          <p className="text-xs text-[var(--ink-muted)] mt-2">
            Built with React • Tailwind CSS • Django Backend
          </p>
        </div>
      </div>
    </div>
  );
}

export default Docs;
