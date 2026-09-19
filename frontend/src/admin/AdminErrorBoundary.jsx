import { Component } from 'react';

export class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[AdminError]', error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <div className="ec-admin-role-gate">
          <h3>⚠️ Something went wrong</h3>
          <p>{this.state.error?.message || 'Unexpected error.'}</p>
          <button
            className="ec-admin-btn ec-admin-btn--lime"
            onClick={this.reset}
            style={{ marginTop: 12 }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default AdminErrorBoundary;