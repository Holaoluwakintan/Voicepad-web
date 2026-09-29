export default function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="toast">
      <span className="toast-dot" />
      {message}
    </div>
  );
}
