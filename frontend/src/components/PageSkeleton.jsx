function PageSkeleton({ variant = "default" }) {
    const cardCount = variant === "dashboard" ? 8 : 4;

    return (
        <div className="mx-auto max-w-7xl space-y-6" aria-label="Loading content">
            <div className="animate-pulse rounded-[2rem] bg-white p-6 shadow-sm">
                <div className="h-5 w-36 rounded-full bg-slate-100" />
                <div className="mt-5 h-9 w-3/4 rounded-2xl bg-slate-100 md:w-1/2" />
                <div className="mt-4 h-4 w-full max-w-xl rounded-full bg-slate-100" />
                <div className="mt-2 h-4 w-2/3 max-w-md rounded-full bg-slate-100" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: cardCount }).map((_, index) => (
                    <div
                        key={index}
                        className="animate-pulse rounded-[1.75rem] bg-white p-5 shadow-sm"
                    >
                        <div className="h-12 w-12 rounded-2xl bg-slate-100" />
                        <div className="mt-5 h-4 w-24 rounded-full bg-slate-100" />
                        <div className="mt-3 h-8 w-16 rounded-xl bg-slate-100" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PageSkeleton;
