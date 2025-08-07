import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

// Service de monitoring des erreurs frontend
class ErrorMonitor {
  static logError(error, errorInfo, context = {}) {
    const errorData = {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context
    };

    // Log en console pour debug
    console.group('🚨 Error Boundary - Error Caught');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Context:', context);
    console.groupEnd();

    // Envoyer au backend pour monitoring
    this.sendErrorToBackend(errorData);
  }

  static async sendErrorToBackend(errorData) {
    try {
      await fetch('/api/monitoring/frontend-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData)
      });
    } catch (err) {
      console.warn('Failed to send error to backend:', err);
    }
  }
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Met à jour l'état pour afficher l'UI d'erreur
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(36)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log l'erreur avec monitoring
    ErrorMonitor.logError(error, errorInfo, {
      component: this.props.fallbackComponent || 'ErrorBoundary',
      props: this.props,
      errorId: this.state.errorId
    });

    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReportError = () => {
    const errorReport = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      timestamp: new Date().toISOString(),
      component: this.props.fallbackComponent || 'ErrorBoundary'
    };

    // Copier dans le presse-papier pour signalement
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => alert('Rapport d\'erreur copié dans le presse-papier'))
      .catch(() => console.log('Error report:', errorReport));
  };

  render() {
    if (this.state.hasError) {
      // UI d'erreur personnalisée si fournie
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // UI d'erreur par défaut
      return (
        <ErrorFallback 
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          onRetry={this.handleRetry}
          onReport={this.handleReportError}
        />
      );
    }

    return this.props.children;
  }
}

// Composant d'affichage d'erreur par défaut
const ErrorFallback = ({ error, errorInfo, errorId, onRetry, onReport }) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '3rem',
        maxWidth: isDevelopment ? '800px' : '500px',
        textAlign: 'center',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😵</div>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '1rem'
        }}>
          Oups ! Quelque chose s'est mal passé
        </h1>
        
        <p style={{
          color: '#64748b',
          marginBottom: '1rem',
          fontSize: '1.1rem'
        }}>
          {error?.status === 404 
            ? "La page que vous cherchez n'existe pas." 
            : "Une erreur inattendue s'est produite."
          }
        </p>

        {errorId && (
          <p style={{
            color: '#94a3b8',
            fontSize: '0.9rem',
            marginBottom: '2rem',
            fontFamily: 'monospace'
          }}>
            ID d'erreur: {errorId}
          </p>
        )}

        {/* Détails en mode développement */}
        {isDevelopment && error && (
          <details style={{
            textAlign: 'left',
            marginBottom: '2rem',
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '8px',
            fontSize: '0.9rem'
          }}>
            <summary style={{ 
              cursor: 'pointer', 
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              color: '#dc2626'
            }}>
              Détails de l'erreur (développement)
            </summary>
            <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
              <strong>Message:</strong> {error.message}
              {error.stack && (
                <>
                  <br /><br />
                  <strong>Stack:</strong>
                  <br />
                  {error.stack}
                </>
              )}
              {errorInfo?.componentStack && (
                <>
                  <br /><br />
                  <strong>Component Stack:</strong>
                  <br />
                  {errorInfo.componentStack}
                </>
              )}
            </div>
          </details>
        )}

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onRetry}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🔄 Réessayer
          </button>
          
          <button
            onClick={() => window.location.href = '/app/home'}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: '#667eea',
              border: '2px solid #667eea',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🏠 Retour à l'accueil
          </button>

          <button
            onClick={onReport}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: '#dc2626',
              border: '2px solid #dc2626',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}
          >
            📋 Signaler l'erreur
          </button>
        </div>

        <p style={{
          marginTop: '1.5rem',
          fontSize: '0.8rem',
          color: '#94a3b8'
        }}>
          Si le problème persiste, contactez le support technique
        </p>
      </div>
    </div>
  );
};

// Hook pour utiliser Error Boundary avec des composants fonctionnels
export const useErrorHandler = () => {
  return (error, errorInfo) => {
    ErrorMonitor.logError(error, errorInfo, {
      hook: 'useErrorHandler',
      timestamp: new Date().toISOString()
    });
  };
};

export default ErrorBoundary;