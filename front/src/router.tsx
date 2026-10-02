import { createBrowserRouter } from "react-router-dom";
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
import DetailsCode from "./pages/DetailsCode";
import CreateCode from "./pages/CreateCode";
import DetailsWorkflow from "./pages/DetailsWorkflow";
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
        path: "/feed",
        element: <Feed />,
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
      {
        path: "/workflow",
        element: <Workflow />,
      },
      {
        path: "/workflow/:id",
        element: <DetailsWorkflow />,
      },
      {
        path: "/program",
        element: <CreateCode />,
      },

      {
        path: "/program/:id",
        element: <DetailsCode />,
      },

      // {
      //   path: "/header",
      //   element: <Header />
      // }
    ],
  },
]);
