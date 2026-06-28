import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import PageSkeleton from "./components/PageSkeleton";
import MainLayout from "./layouts/MainLayout";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Topics = lazy(() => import("./pages/Topics"));
const Vocabularies = lazy(() => import("./pages/Vocabularies"));
const Learn = lazy(() => import("./pages/Learn"));
const QuizPractice = lazy(() => import("./pages/QuizPractice"));
const MyQuizResults = lazy(() => import("./pages/MyQuizResults"));
const LearnTopic = lazy(() => import("./pages/LearnTopic"));
const Achievements = lazy(() => import("./pages/Achievements"));
const ReviewWrongAnswers = lazy(() => import("./pages/ReviewWrongAnswers"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Profile = lazy(() => import("./pages/Profile"));

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<PageSkeleton />}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/learn" element={<Learn />} />
                        <Route path="/topics" element={<Topics />} />
                        <Route path="/vocabularies" element={<Vocabularies />} />
                        <Route path="/quiz" element={<QuizPractice />} />
                        <Route path="/quiz-results" element={<MyQuizResults />} />
                        <Route path="/learn/:topicId" element={<LearnTopic />} />
                        <Route path="/achievements" element={<Achievements />} />
                        <Route path="/review" element={<ReviewWrongAnswers />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
