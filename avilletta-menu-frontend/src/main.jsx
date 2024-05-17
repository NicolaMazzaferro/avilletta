import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx';
import Categories from './views/Categories.jsx';
import Products from './views/Products.jsx';
import Details from './views/Details.jsx';
import Dashboard from './views/Dashboard.jsx';
import Login from './views/Login.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';
import Middleware from './components/Middleware.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Categories />,
      },
      {
        path: "/products/:category",
        element: <Products />,
      },
      {
        path: "/product/:id",
        element: <Details />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: '/',
    element: <Middleware />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);