# Loadio

[![Npm Version][npm-version-image]][npm-version-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

## About

Simply provides a pool and wrapper to manage the promises that generate loading status and percentage information based on the execution of tasks.

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

##### Main.jsx

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
        <MainPage />
      </>
    );
  }
}
export default withLoading()(Main);
```

##### MainPage.jsx

Call the wrapped promise anywhere to show loading screen
When run multiple times at the same time, it will also create a percentage rate until all promises are finished.

```js
import { fetch } from "./customFetch.js";

class Main extends React.Component {
  getData = () => {
    fetch("http://example.com/movies.json");
  };
}
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

##### Main.jsx

The pool with the 'default' key name is always bound and comes in root props when using multiple pool keys.
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
        <MainPage />
      </>
    );
  }
}
export default withLoading({
  poolKey: ["longRunningTask", "fetch"],
})(Main);
```
Or bind only one pool 'longRunningTask' instead of 'default'

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
        <MainPage />
      </>
    );
  }
}
export default withLoading({
  poolKey: "longRunningTask",
})(Main);
```
## License

MIT


[license-image]: http://img.shields.io/npm/l/loadio.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/loadio.svg
[downloads-url]: http://npm-stat.com/charts.html?package=loadio
[npm-version-image]: https://img.shields.io/npm/v/loadio.svg
[npm-version-url]: https://www.npmjs.com/package/loadio