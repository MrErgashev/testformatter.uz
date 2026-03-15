import { Component, type ReactNode, type ErrorInfo } from 'react';
import i18n from '../../i18n';
import { useAppStore } from '../../store/app-store';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    useAppStore.getState().reset();
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-light-base dark:bg-dark-base">
          <div className="max-w-md w-full text-center p-8 rounded-2xl glass-strong neo-raised">
            <div className="mb-4 flex justify-center">
              <svg
                className="w-16 h-16 text-red-400 dark:text-red-500/70"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2
              className="text-xl font-bold text-slate-800 dark:text-white/90 mb-2"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {i18n.t('errors.crashTitle')}
            </h2>
            <p
              className="text-sm text-slate-500 dark:text-white/50 mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {i18n.t('errors.crashMessage')}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:brightness-110 transition-all cursor-pointer"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              {i18n.t('errors.tryAgain')}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
