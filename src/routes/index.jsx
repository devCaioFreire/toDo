import { Routes, Route } from "react-router-dom";
import Private from "./Private";

// Pages
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from "../pages/Dashboard";
import Task from '../pages/Task';
import Profile from '../pages/Profile';

export default function RoutesApp() {
    return (
        <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
            <Route path="/tasks" element={<Private><Task /></Private>} />
            <Route path="/profile" element={<Private><Profile /></Private>} />
        </Routes>
    )
}