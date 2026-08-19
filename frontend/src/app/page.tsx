export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-3xl font-bold">Theme Test</h1>
      <p className="text-muted mt-2">This text uses the muted color.</p>
      <div className="mt-4 w-32 h-32 bg-accent rounded-lg" />
      <p className="mt-4 border border-border p-4 rounded">
        This box has a border using the border color token.
      </p>
    </div>
  );
}