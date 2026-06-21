function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Login
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-3 rounded mb-4"
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-3 rounded mb-4"
                />

                <button
                    className="w-full bg-blue-600 text-white p-3 rounded"
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default Login;