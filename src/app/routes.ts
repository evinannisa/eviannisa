import { createBrowserRouter } from "react-router";
import { Layout } from "../components/Layout";
import { Home } from "../pages/Home";
import { About } from "../pages/About";
import { Projects } from "../pages/Projects";
import { Writing } from "../pages/Writing";
import { LiveChat } from "../pages/LiveChat";
import Experience from "@/app/experience/page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      // { path: "experience", Component: Experience },
      { path: "projects", Component: Projects },
      { path: "writing", Component: Writing },
      { path: "chat", Component: LiveChat },
    ],
  },
]);
