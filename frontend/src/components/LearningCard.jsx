function LearningCard({ icon, title, description, progress, color }) {
    return (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div
                className={`w-16 h-16 rounded-3xl flex items-center justify-center text-4xl mb-4 ${color}`}
            >
                {icon}
            </div>

            <h3 className="text-xl font-black text-slate-800">
                {title}
            </h3>

            <p className="text-slate-500 text-sm mt-1">
                {description}
            </p>

            <div className="mt-4">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#58CC02] rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default LearningCard;