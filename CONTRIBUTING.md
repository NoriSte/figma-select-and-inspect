# Contributing

## Features

First of all, open an issue to describe the feature you would like to build. This helps to avoid you
wasting your time in case something is not needed or we have a different vision about the topic 😊

## Development

## Development guide

*This plugin is built with [Create Figma Plugin](https://yuanqing.github.io/create-figma-plugin/).*

### Pre-requisites

- [Pnpm](https://pnpm.io/) – v8.4.0
- [Node.js](https://nodejs.org) – v18
- [Figma desktop app](https://figma.com/downloads/)
- The dependencies installed through
```
$ pnpm install
```

### Build the plugin

To build the plugin:

```
$ pnpm build
```

This will generate a [`manifest.json`](https://figma.com/plugin-docs/manifest/) file and a `build/`
directory containing the JavaScript bundle(s) for the plugin.


### Development

1. Download [Figma Desktop](https://www.figma.com/downloads/)
2. In Figma, enable HMR through `Plugins (in the menu bar) -> Development -> Hot reload plugin`
3. Watch for code changes and rebuild the plugin automatically
```
$ pnpm watch
```
4. Keep the unit tests running
```
$ pnpm test
```
5. Open the developer console, search for and run `Show/Hide console` via the Quick Actions search bar.

You can use one of the available [Figma files](./src/figma-files/) to play with the plugin.


## See also

- [Create Figma Plugin docs](https://yuanqing.github.io/create-figma-plugin/)
- [`yuanqing/figma-plugins`](https://github.com/yuanqing/figma-plugins#readme)

Official docs and code samples from Figma:

- [Plugin API docs](https://figma.com/plugin-docs/)
- [`figma/plugin-samples`](https://github.com/figma/plugin-samples#readme)
