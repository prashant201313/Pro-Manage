import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import ProManage from "../pages/proManage/ProManage";
import Board from "../pages/board/Board";
import Analytics from "../pages/analytics/Analytics";
import Settings from "../pages/settings/Settings";
import SharedTask from "../pages/sharedTask/SharedTask";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children : [
            {
                path: "/",
                element: <Navigate to="/register" />,  // Redirect from "/" to "/register"
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "task/:id",
                element: <SharedTask />
            },
            {
                path: "pro-manage",
                element: <ProManage />,
                children: [
                    {
                        path: "board",
                        element: <Board />
                    },
                    {
                        path: "analytics",
                        element: <Analytics />
                    },
                    {
                        path: "settings",
                        element: <Settings />
                    }
                ]
            }
        ]
    }
])