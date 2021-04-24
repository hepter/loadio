import "./App.css";

import { withLoading, withPool } from "loadio";


function longRunningTask(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

var longRunningTaskWithPool = withPool(longRunningTask);
var longRunningTaskWithPoolCustom = withPool(longRunningTask, "xTask");

function App({ isLoading, percentage, statusList }) {
  var xTaskStatus = statusList["xTask"] ?? {};
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h3>Pool: 'default'</h3>
          {`${isLoading ? "Loading..." : "Loaded"}`}
          <br />
          {`percentage ${percentage}%`}
          <button onClick={() => {
            longRunningTaskWithPool(1000);
            longRunningTaskWithPool(2000);
            longRunningTaskWithPool(3000);
            longRunningTaskWithPool(4000);
            longRunningTaskWithPool(5000);

          }}>
            Load
          </button>
        </div>
        <br />
        <div>
          <h3>Pool: 'xTask'</h3>
          {`${xTaskStatus.isLoading ? "Loading..." : "Loaded"}`}
          <br />
          {`percentage ${xTaskStatus.percentage}%`}
          <button onClick={() => {
            longRunningTaskWithPoolCustom(1000);
            longRunningTaskWithPoolCustom(2000);
            longRunningTaskWithPoolCustom(3000);
            longRunningTaskWithPoolCustom(4000);
            longRunningTaskWithPoolCustom(5000);

          }}>
            Load
          </button>
        </div>

      </header>
    </div >
  );
}

const app = withLoading({
  poolKey: ["xTask"]
})(App)
export default app;
// export default (App);
