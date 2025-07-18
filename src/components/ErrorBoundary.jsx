import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		this.setState({
			error,
			errorInfo
		});
		
		// Log error to console in development
		if (process.env.NODE_ENV === 'development') {
			console.error('Error caught by boundary:', error, errorInfo);
		}

		// Here you could also log to an error reporting service
		// logErrorToService(error, errorInfo);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null, errorInfo: null });
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
					<div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 text-center">
						<div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
							<AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
						</div>
						
						<h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
							Something went wrong
						</h1>
						
						<p className="text-slate-600 dark:text-slate-400 mb-6">
							We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
						</p>

						{process.env.NODE_ENV === 'development' && this.state.error && (
							<details className="text-left bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
								<summary className="cursor-pointer font-medium text-slate-700 dark:text-slate-300 mb-2">
									Error Details (Development)
								</summary>
								<pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
									{this.state.error.toString()}
									{this.state.errorInfo?.componentStack}
								</pre>
							</details>
						)}

						<div className="flex flex-col sm:flex-row gap-3">
							<button
								onClick={this.handleReset}
								className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
							>
								<RefreshCw className="w-4 h-4" />
								Try Again
							</button>
							
							<button
								onClick={() => window.location.reload()}
								className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
							>
								Refresh Page
							</button>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
