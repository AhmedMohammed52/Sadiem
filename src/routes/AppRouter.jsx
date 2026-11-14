import { createBrowserRouter } from "react-router-dom";

// Store Layout
import StoreLayout from "../layouts/StoreLayout";

// Store Pages
import Home from "../pages/Home/Home";
import Shop from "../pages/Shop/Shop";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Checkout from "../pages/Checkout/Checkout";
import NotFound from "../pages/NotFound/NotFound";

// Admin Layout
import AdminLayout from "../admin/layouts/AdminLayout";

// Admin Pages
import AdminLogin from "../admin/pages/Login/AdminLogin";
import Overview from "../admin/pages/Overview/Overview";
import Products from "../admin/pages/Products/Products";
import Categories from "../admin/pages/Categories/Categories";
import Orders from "../admin/pages/Orders/Orders";
import Reviews from "../admin/pages/Reviews/Reviews";
import Settings from "../admin/pages/Settings/Settings";

// Authentication
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  // =========================
  // ADMIN LOGIN
  // =========================
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },

  // =========================
  // PROTECTED ADMIN ROUTES
  // =========================
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Overview />,
          },
          {
            path: "products",
            element: <Products />,
          },
          {
            path: "categories",
            element: <Categories />,
          },
          {
            path: "orders",
            element: <Orders />,
          },
          {
            path: "reviews",
            element: <Reviews />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },

  // =========================
  // STORE ROUTES
  // =========================
  {
    path: "/",
    element: <StoreLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "products/:slug",
        element: <ProductDetails />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
