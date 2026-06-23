import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Topics from "./pages/Topics";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/topics" element={<Topics />} />
                    <Route path="/vocabularies" element={<div>Vocabulary Page</div>} />
                    <Route path="/quiz" element={<div>Quiz Page</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;