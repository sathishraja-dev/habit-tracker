interface EmptyStateProps {
  title: string;
  message: string;
}

/**
 * Displays a consistent message when there is no data to show.
 */
function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <section className="status-card">
      <h2>{title}</h2>
      <p>{message}</p>
    </section>
  );
}

export default EmptyState;
