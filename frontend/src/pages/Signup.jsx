import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/api';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(email, password);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theme-page flex items-center justify-center py-8 sm:py-12">
      <div className="w-full max-w-md px-4 sm:px-6 md:px-8 theme-card p-4 sm:p-6 md:p-8">
        <h1 className="theme-title text-lg sm:text-xl md:text-2xl font-semibold text-[var(--ink)] mb-4 md:mb-6">Sign Up</h1>
        
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm theme-label mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full theme-input text-sm sm:text-base"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm theme-label mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full theme-input text-sm sm:text-base"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-xs sm:text-sm theme-alert-error">
              <span aria-hidden="true">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full theme-button-primary text-sm sm:text-base py-2 sm:py-3 disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 md:mt-6 text-xs sm:text-sm text-[var(--ink-muted)] text-center">
          Already have an account?{' '}
          <a href="/login" className="text-[var(--accent)] hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;

