import React from "react";
import "./App.css";
// import { AuthenticatedApp } from "./authenticated-app";
// import { UnauthenticatedApp } from "./unauthenticated-app";
import { useAuth } from "context/auth-context";
import { ErrorBoundary } from "./components/error-boundary";
import { FullPageErrorFallback, FullPageLoading } from "./components/lib";

const AuthenticatedApp = React.lazy(() => import("./authenticated-app"));
const UnauthenticatedApp = React.lazy(() => import("./unauthenticated-app"));

function App() {
  const { user } = useAuth();
  return (
    <div className="App">
      {/*当子组件出现渲染错误时，统一处理*/}
      <ErrorBoundary fallbackRender={FullPageErrorFallback}>
        <React.Suspense fallback={<FullPageLoading />}>
          {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
        </React.Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
