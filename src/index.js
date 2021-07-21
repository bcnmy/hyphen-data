import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
// import DepositContextProvider from "./context/deposit_context";
// import AssetTransferContextProvider from "./context/asset_transfer_context";
// import NetworkContextProvider from "./context/network_context";

ReactDOM.render(
  // <AssetTransferContextProvider>
  //   <DepositContextProvider>
  //     <NetworkContextProvider>
        <App />
  //     </NetworkContextProvider>
  //   </DepositContextProvider>
  // </AssetTransferContextProvider>
  ,
  document.getElementById("root")
);
