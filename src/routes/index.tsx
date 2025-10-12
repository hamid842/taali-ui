import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./auth-routes";

const router = createBrowserRouter([...authRoutes]);

export default router;
