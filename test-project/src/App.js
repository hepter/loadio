import "./App.css";

import { withStatus, withPool, useStatus } from "loadio";


function longRunningTask(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

var longRunningTaskWithPool = withPool(longRunningTask);
var longRunningTaskWithPoolCustom = withPool(longRunningTask, "xTask");
var longRunningTaskWithPoolCustom2 = withPool(longRunningTask, "yTask");

function HookTestComponent() {
  var status = useStatus("xTask")
  return (
    <div>
      <h3>Pool: 'xTask'</h3>
      {`${status.isLoading ? "Loading..." : "Loaded"}`}
      <br />
      {`percentage ${status.percentage}%`}
      <br />
      <button onClick={() => {
        longRunningTaskWithPoolCustom(1000);
        longRunningTaskWithPoolCustom(2000);
        longRunningTaskWithPoolCustom(3000);
        longRunningTaskWithPoolCustom(4000);
        longRunningTaskWithPoolCustom(5000);

      }}>
        Load xTask
    </button>
    </div>
  )
}



function App({ isLoading, percentage, statusList }) {
  var yTaskStatus = statusList["yTask"] ?? {};
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h3>Pool: 'default'</h3>
          {`${isLoading ? "Loading..." : "Loaded"}`}
          <br />
          {`percentage ${percentage}%`}
          <br />
          <button onClick={() => {
            longRunningTaskWithPool(1000);
            longRunningTaskWithPool(2000);
            longRunningTaskWithPool(3000);
            longRunningTaskWithPool(4000);
            longRunningTaskWithPool(5000);

          }}>
            Load default
          </button>
        </div>
        <br />
        <HookTestComponent />
        <br />
        <div>
          <h3>Pool: 'yTask'</h3>
          {`${yTaskStatus.isLoading ? "Loading..." : "Loaded"}`}
          <br />
          {`percentage ${yTaskStatus.percentage}%`}
          <br />
          <button onClick={() => {
            longRunningTaskWithPoolCustom2(1000);
            longRunningTaskWithPoolCustom2(2000);
            longRunningTaskWithPoolCustom2(3000);
            longRunningTaskWithPoolCustom2(4000);
            longRunningTaskWithPoolCustom2(5000);

          }}>
            Load yTask
          </button>
        </div>
      </header>
    </div >
  );
}

export default withStatus(App, { poolKey: ["default", "yTask"] })
