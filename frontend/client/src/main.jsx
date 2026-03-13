import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./App/Router.jsx";
import "./index.css";
import { ChatProvider } from "./context.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChatProvider>
      <RouterProvider router={router} />
    </ChatProvider>
  </React.StrictMode>
);
