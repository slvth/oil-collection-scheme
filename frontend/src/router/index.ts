import React, { JSX } from "react";
import Auth from "../pages/auth/Auth";
import Main from "../pages/main/Main";

export interface IRoute {
  path: string;
  element: JSX.Element;
  exact?: boolean;
}

export enum RouteNames {
  LOGIN = "/login",
  MAIN = "/",
}

export const publicRoutes: IRoute[] = [
  { path: RouteNames.LOGIN, exact: true, element: React.createElement(Auth) },
];

export const privateRoutes: IRoute[] = [
  { path: RouteNames.MAIN, exact: true, element: React.createElement(Main) },
];
