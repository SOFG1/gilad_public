import React, { useEffect } from "react";
import { EmailsPage, SignIn, WithAuthHOC } from "./pages";
import { Routes, Route } from "react-router-dom";
import i18next from "i18next";
import { useUserActions, useUserState } from "./store/user/hooks";
import { useAppActions, useAppState } from "./store/app/hooks";
import { AlertComponent } from "./components/AlertComponent";


function App() {
  const pageDirection = i18next.dir();
  const { token } = useUserState()
  const { alert } = useAppState()
  const { onHideAlert } = useAppActions()
  useEffect(() => {
    document.body.dir = pageDirection;
  }, [pageDirection]);

  //Get User Info
  const { onGetUserInfo } = useUserActions()
  useEffect(() => {
    onGetUserInfo()
  }, [token])


  return (
    <div>
      <Routes>
        <Route path="/" element={<WithAuthHOC><EmailsPage /></WithAuthHOC>} />
        <Route path="/sign-in" element={<WithAuthHOC><SignIn /></WithAuthHOC>} />
      </Routes>
      {alert && (
        <AlertComponent
          message={alert.text}
          isSuccess={alert.success}
          onClose={onHideAlert}
        />
      )}
    </div>
  );
}

export default App;
