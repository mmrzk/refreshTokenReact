import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { privateAxiosClient } from "./api";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Notes1 from "./components/Notes1";
import Notes2 from "./components/Notes2";
import Notes3 from "./components/Notes3";
import { RequireAuth } from "./components/RequireAuth";
import AuthProvider from "./contexts/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "dashboard",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: "notes1",
        element: (
          <RequireAuth>
            <Notes1 />
          </RequireAuth>
        ),
      },
      {
        path: "notes2",
        element: (
          <RequireAuth>
            <Notes2 />
          </RequireAuth>
        ),
      },
      {
        path: "notes3",
        element: (
          <RequireAuth>
            <Notes3 />
          </RequireAuth>
        ),
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider axiosClient={privateAxiosClient}>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
