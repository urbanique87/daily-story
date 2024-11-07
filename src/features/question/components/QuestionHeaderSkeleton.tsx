export function QuestionHeaderSkeleton() {
  return (
    <header className="flex justify-between items-center h-20 px-5">
      <section className="flex flex-col gap-1">
        <div className="text-xs">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
        <div className="text-lg font-medium">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </section>

      <div className="w-12 h-12 rounded-full overflow-hidden">
        <div className="w-full h-full bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </header>
  )
}
