
![loadio](docs/loadio.png)

[![Npm Version][npm-version-image]][npm-version-url] [![License][license-image]][license-url] 
## About

Simply provides a pool and wrapper to manage the promises that generate loading status and percentage information based on the execution of tasks.

## Demo
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


```js
import React from "react";
import { withPool } from "loadio"; 
const fetch = withPool(global.fetch);

class HomePage extends React.Component {

  render(){
    const { isLoading } = this.props;  
    return (
      <>
        {isLoading ? "Loading..." : "Loaded!"}
        <button onClick={() => fetch("get/data")}>Get</button>
      </>
    );
  }
}
export default withStatus(HomePage);
```

Hook
```js
import { withPool, useStatus } from "loadio"; 
const fetch = withPool(global.fetch);

function HomePage() {
  const status = useStatus();
  return (
    <>
      {status.isLoading ? "Loading..." : "Loaded!"}
      <button onClick={() => fetch("get/data")}>Get</button>
    </>
  );
}
```
Promises can also be added directly to the pool without wrapping it

```js
import { PoolManager, useStatus } from "loadio"; 

function HomePage() {
  const status = useStatus();
  return (
    <>
      {status.isLoading ? "Loading..." : "Loaded!"}
      <button onClick={() => PoolManager.append(fetch("get/data"))}>Get</button>
    </>
  );
}
```
## Example
For this example, loading component will automatically appear when wrapped fetch function called
Wrap the function you want to show while running


##### fetch.js

```js
import { withPool } from "loadio"; 
export const fetch = withPool(global.fetch); 
```



Wrap the main component with `'withStatus()'` to inject pool information.
The information to be added to the component is as follows:

```ts
{
    // default
    isLoading?: boolean,
    percentage?: number,
    runningTasks?: number,
    // This property will only be filled to when using a different pool than 'default'
    // Pool keys must be given while wrapping otherwise this value is empty
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
##### index.js
```jsx
import { withStatus } from "loadio";

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
export default withStatus(Main);
```

##### ExamplePage.jsx

Call the wrapped promise anywhere to show loading screen
When run multiple times at the same time, it will also create a percentage rate until all promises are finished.


```js
import { fetch } from "./fetch.js";

getData = () => {
  fetch("http://example.com/movies.json");
};
 
```

Or


```js 
const fetch = withPool(global.fetch);

getData = () => {
  fetch("http://example.com/movies.json");
};
 
```
Or it can be created multiple times dynamically.

```js  
getData = () => {
  withPool(global.fetch)("http://example.com/movies.json");
}; 
```
### Multiple usage

The withPool wrapper can be created with a different key and can be used in different screens. Second parameter value is `'default'` by default.

##### fetch.js

```js
import { withPool } from "loadio";
export const fetch = withPool(global.fetch, "fetch"); 
```

##### longRunningTask.js

```js
import { withPool } from "loadio";

function myLongRunningTask() {
  return new Promise((resolve) => setTimeout(resolve, 10000));
}
export const longRunningTask = withPool(myLongRunningTask, "longRunningTask"); 
```

##### index.js

The root loading props(isLoading, percentage, runningTasks) come null when using multiple pool keys except for the `'statusList'` prop.
Both pools can be connected to a single page or can be used individually.

```jsx
import { withStatus } from "loadio";

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
export default withStatus(Main, {
  poolKey: ["longRunningTask", "fetch"],
});
```
Or bind only one pool 'longRunningTask' instead of 'default'.
Thus, instead of coming statuses as the list, the bound pool status comes from the props in the root directly.

```jsx
import { withStatus } from "loadio";

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
export default withStatus(Main, {
  poolKey: "longRunningTask",
});
```
## API
Check [here](https://hepter.github.io/loadio/modules) for the API document 
## License

MIT - Mustafa Kuru


[license-image]: http://img.shields.io/npm/l/loadio.svg
[license-url]: LICENSE 
[npm-version-image]: https://img.shields.io/npm/v/loadio.svg
[npm-version-url]: https://www.npmjs.com/package/loadio