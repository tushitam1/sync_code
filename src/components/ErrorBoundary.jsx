import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-slate-900 text-red-400">
          <p className="font-medium mb-2">Editor failed to load</p>
          <p className="text-sm text-slate-500 mb-4">{this.state.error?.message}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-600"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
