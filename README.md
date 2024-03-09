# Figma Select and Inspect



![Plugin's logo reporting a screenshot of the Console](./assets/Plugin%20logo.png "Select and Inspect")


![A screenshot of the plugin running in Figma](./assets/Figma%20Community%20screenshot.jpg "Select and Inspect")



## Why?

If you ever implemented a Figma plugin, you know how slow the process of inspecting specific properties (among the hundreds available) and values in a Figma file is.

This plugin aims to solve this problem by making logging as easy as possible!

## Features

1. Select one or more Figma elements to get them logged in the Console
2. Add expressions to be evaluated on the selected Figma elements (`name,id,reactions[0].actions` results in each expression to be evaluated and logged in the Console)
3. Stringy and format the result for better readability
4. Preferences are stored locally

## FAQ

*Why not using [the existing "Inspector" plugin](https://www.figma.com/community/plugin/760351147138040099/inspector?searchSessionId=ltk4azg4-ud0njxlfa8)?*

Because the properties must be added to the UI by the plugin's author, limiting the plugin's scalability (as you can see in the reviews).

<!-- ### Install the plugin

TODO: update this guide, for figma to xstate too.

1. In the Figma desktop app, open a Figma document.
2. Search for and run `Import plugin from manifest…` via the Quick Actions search bar.
3. Select the `manifest.json` file that was generated by the `build` script. -->
