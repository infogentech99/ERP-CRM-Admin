// import React from "react"
// import ReactDOM from "react-dom"
// import App from "./app"
// import "./style/app.less"
// import * as serviceWorker from "./serviceWorker"

// console.log("process env", process.env.NODE_ENV)

// ReactDOM.render(<App />, document.getElementById("root"))

// serviceWorker.unregister()



import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import "./style/app.less";
import * as serviceWorker from "./serviceWorker";

console.log("process env", process.env.NODE_ENV);

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();
