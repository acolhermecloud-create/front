import NotFound from "@/pages/404";
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    location.href = "/404";
    console.error("Erro capturado pelo boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <NotFound/>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;