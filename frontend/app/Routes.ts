import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("Routes/Home.tsx"),
  route("login", "Routes/Login.tsx"),
  route("register", "Routes/Register.tsx"),
  route("profile", "Routes/Profile.tsx")
] satisfies RouteConfig;
