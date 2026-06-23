function ProgressCard({ title, value, target }) {
    const percent = Math.min(Math.round((value / target) * 100), 100);

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-black text-slate-800">
                        {title}
                    </h3>

                    <p className="text-slate-500 text-sm">
                        {value} / {target} completed
                    </p>
                </div>

                <div className="w-16 h-16 rounded-full bg-[#58CC02]/10 flex items-center justify-center">
                    <span className="text-[#58CC02] font-black text-lg">
                        {percent}%
                    </span>
                </div>
            </div>

            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#58CC02] rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    );
}

export default ProgressCard;