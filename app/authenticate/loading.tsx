export default function AuthLoading(): React.JSX.Element {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-pulse">
        <div className="mb-8 mx-auto h-7 w-48 rounded-md bg-zinc-200" />
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-24 rounded bg-zinc-200" />
            <div className="h-9 rounded-lg bg-zinc-200" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-16 rounded bg-zinc-200" />
            <div className="h-9 rounded-lg bg-zinc-200" />
          </div>
          <div className="mt-1 h-10 rounded-lg bg-zinc-200" />
        </div>
      </div>
    </main>
  );
}
