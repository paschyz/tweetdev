import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Hub from "./pages/Hub";
import DetailsPost from "./pages/DetailsPost";
import Workflow from "./pages/Workflow";
import Program from "./pages/Program";

export default createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Feed />,
      },
      {
        path: "/feed",
        element: <Navigate to="/" replace />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
      {
        path: "/profile/:username",
        element: <Profile />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/create-post",
        element: <CreatePost />,
      },
      {
        path: "/hub/:name",
        element: <Hub />,
      },
      {
        path: "/post/:id",
        element: <DetailsPost />,
      },
      // the keys make "new" and "existing" separate instances: going from one to the other starts clean
      {
        path: "/workflow",
        element: <Workflow key="all" />,
      },
      {
        path: "/workflow/:id",
        element: <Workflow key="one" />,
      },
      {
        path: "/program",
        element: <Program key="new" />,
      },
      {
        path: "/program/:id",
        element: <Program key="existing" />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
