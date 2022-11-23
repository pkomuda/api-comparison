import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode
}

export class ErrorBoundary extends Component<Props> {

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        window.location.replace('/error');
    }

    render() {
        return this.props.children;
    }
}
