import { useAuh } from "./context/auth-context";
import React from "react";
import { ProjectListScreen } from "./screens/project-list";
import { UnauthenticatedApp } from "./unauthenticated-app";

export const AuthenticatedApp = () => {
  const { user, logout } = useAuh();
  return (
    <div>
      {user != null ? (
        <div>
          <button
            onClick={() => {
              logout();
            }}
          >
            登出
          </button>
          <ProjectListScreen />
        </div>
      ) : (
        <UnauthenticatedApp />
      )}
    </div>
  );
};
