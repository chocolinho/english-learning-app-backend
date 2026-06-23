function StatCard({ icon, title, value, subtitle, color }) {
    return (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
                <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${color}`}
                >
                    {icon}
                </div>

                <div>
                    <p className="text-slate-500 text-sm font-semibold">
                        {title}
                    </p>

                    <h3 className="text-3xl font-black text-slate-800">
                        {value}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                        {subtitle}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default StatCard;