# Loadio

[![Npm Version][npm-version-image]][npm-version-url]
[![License][license-image]][license-url] 

## About

Simply provides a pool and wrapper to manage the promises that generate loading status and percentage information based on the execution of tasks.

## Demo
<iframe src="https://codesandbox.io/embed/example-usage-loadio-loz1y?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Example usage - loadio"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
   
[![Edit Example usage - loadio](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/example-usage-loadio-loz1y?fontsize=14&hidenavigation=1&theme=dark)
## Installation

Install React Table as a dependency

```shell
# Yarn
$ yarn add loadio

# NPM
$ npm install loadio
```

## Usage

For this example, loading component will automatically appear when wrapped fetch function called

Wrap the function you want to show while running

##### fetch.js

```js
import { withPool } from "loadio";
const customFetch = withPool(fetch);
export { customFetch as fetch };
```

##### index.js

Wrap the main component to inject pool information
The information to be added to the component is as follows:

```ts
{
    // default
    isLoading?: boolean,
    percentage?: number,
    runningTasks?: number,
    // custom pools except 'default'. In order for this data to appear,
    // pool keys must be given while wrapping otherwise this value is empty
    statusList?: any[] {
        [customPoolKey:string]:{
            isLoading?: boolean,
            percentage?: number,
            runningTasks?: number
        },
        ...
    }
}
```

```jsx
import { withLoading } from "loadio";

class Main extends React.Component {
  render() {
    const { isLoading, percentage } = this.props;
    return (
      <>
        <MyLoadingComponent open={isLoading} percentage={percentage} />
        <ExamplePage />
      </>
    );
  }
}
export default withLoading()(Main);
```

##### ExamplePage.jsx

Call the wrapped promise anywhere to show loading screen
When run multiple times at the same time, it will also create a percentage rate until all promises are finished.

```js
import { fetch } from "./customFetch.js";

getData = () => {
  fetch("http://example.com/movies.json");
};
 
```

Or


```js 
const fetch = withPool(fetch);

getData = () => {
  fetch("http://example.com/movies.json");
};
 
```
Or it can be created multiple times dynamically.
It is recommended to be created and used once.

```js  
getData = () => {
  withPool(fetch)("http://example.com/movies.json");
}; 
```
### Multiple usage

The withPool wrapper can be created with a different key and can be used in different screens. Second parameter value is `'default'` by default.

##### fetch.js

```js
import { withPool } from "loadio";
const customFetch = withPool(fetch, "fetch");
export { customFetch as fetch };
```

##### longRunningTask.js

```js
import { withPool } from "loadio";

function myLongRunningTask() {
  return new Promise((resolve) => setTimeout(resolve, 10000));
}
const customLongRunningTask = withPool(myLongRunningTask, "longRunningTask");
export { customLongRunningTask as longRunningTask };
```

##### index.js

The root loading props(isLoading, percentage, runningTasks) come null when using multiple pool keys except for the `'statusList'` prop.
Both pools can be connected to a single page or can be used individually.

```jsx
import { withLoading } from "loadio";

class Main extends React.Component {
  render() {
    const { isLoading, percentage, statusList } = this.props;
    var fetchStatus = statusList["fetch"] ?? {};
    var lrtStatus = statusList["longRunningTask"] ?? {};
    return (
      <>
        <MyLoadingComponent
          open={fetchStatus.isLoading}
          percentage={fetchStatus.percentage}
        />
        <MyLoadingComponent
          open={lrtStatus.isLoading}
          percentage={lrtStatus.percentage}
        />
        <ExamplePage />
      </>
    );
  }
}
export default withLoading({
  poolKey: ["longRunningTask", "fetch"],
})(Main);
```
Or bind only one pool 'longRunningTask' instead of 'default'.
Thus, instead of coming statuses as the list, the bound pool status comes from the props in the root directly.

```jsx
import { withLoading } from "loadio";

class Main extends React.Component {
  render() {
    const { isLoading, percentage, statusList } = this.props;
    return (
      <>
        <MyLoadingComponent
          open={isLoading}
          percentage={percentage}
        />
        <ExamplePage />
      </>
    );
  }
}
export default withLoading({
  poolKey: "longRunningTask",
})(Main);
```
## License

MIT - Mustafa Kuru


[license-image]: http://img.shields.io/npm/l/loadio.svg
[license-url]: LICENSE 
[npm-version-image]: https://img.shields.io/npm/v/loadio.svg
[npm-version-url]: https://www.npmjs.com/package/loadio