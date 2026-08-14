interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

/**
 * Displays a user-friendly error state and optionally allows the
 * user to retry the failed operation.
 */
function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section className="status-card status-error" role="alert">
      <p>{message}</p>

      {onRetry && (
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </section>
  );
}

export default ErrorState;
