export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div>
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
