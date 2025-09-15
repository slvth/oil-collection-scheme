import { Routes, Route, redirect, Navigate } from "react-router-dom";
import { privateRoutes, publicRoutes, RouteNames } from "../router";
import { useAppSelector } from "../hooks/redux";

export default function AppRouter() {
  const { isAuth } = useAppSelector((state) => state.scheme);
  return (
    <>
      <Routes>
        {" "}
        {isAuth ? (
          <>
            {privateRoutes.map((route) => (
              <Route path={route.path} element={route.element} />
            ))}
            <Route
              path="*"
              element={<Navigate to={RouteNames.MAIN} replace />}
            />
          </>
        ) : (
          <>
            {publicRoutes.map((route) => (
              <Route path={route.path} element={route.element} />
            ))}
            <Route
              path="*"
              element={<Navigate to={RouteNames.LOGIN} replace />}
            />
          </>
        )}
      </Routes>
    </>
  );
}
