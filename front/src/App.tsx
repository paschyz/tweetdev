import "./App.css";
import { Header } from "./components/index";
import { Outlet } from "react-router-dom";

import { AuthProvider } from "./provider/AuthProvider";
import { ModalProvider } from "./provider/ModalProvider";
import { Toaster } from "react-hot-toast";
import "../src/styles/Variables.css";
function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Toaster />
        <div className="color-fontColor">
          <Header></Header>
        </div>

        <div className="app-container color-fontColor bg-bodyBg">
          <Outlet />
        </div>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
// import "./App.css";
// import { Header } from "./components/index";
// import { Outlet } from "react-router-dom";

// import { AuthProvider } from "./provider/AuthProvider";
// import { Toaster } from "react-hot-toast";
// import "../src/styles/Variables.css";
// import { useEffect, useState } from "react";
// function App() {
//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     if (darkMode) {
//       console.log("dark");
//       document.documentElement.classList.add("dark");
//     } else {
//       console.log("light");
//       document.documentElement.classList.remove("dark");
//     }
//   }, [darkMode]);

//   return (
//     <AuthProvider>
//       <div className="w-screen h-screen ">
//         <Toaster />
//         <div className="color-fontColor">
//           <Header></Header>
//         </div>
//         <div className="app-container color-fontColor bg-white dark:bg-gray-900">
//           <Outlet />
//         </div>
//       </div>
//     </AuthProvider>
//   );
// }

// export default App;
