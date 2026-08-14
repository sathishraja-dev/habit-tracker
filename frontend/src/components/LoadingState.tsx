interface LoadingStateProps {
  message?: string;
}

/**
 * Displays a consistent loading message while asynchronous data
 * is being retrieved.
 */
function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <section className="status-card" aria-live="polite">
      <p>{message}</p>
    </section>
  );
}

export default LoadingState;
