# Contributing to TurnALeaf

Thank you for your interest in contributing to this project! Here are some guidelines to help you get started.
Most importantly, please make sure to check the issues and discussions to avoid duplicates, and make sure the tests are passed before submitting a pull request.

Contents:

- [How to contribute](#how-to-contribute)
- [App \& Directory structure](#app--directory-structure)
- [Publishing](#publishing)
- [Legal](#legal)
  - [Code of Conduct](#code-of-conduct)
  - [License](#license)

## How to contribute

1. Open your terminal and `cd` to wherever you want to build TurnALeaf.
2. Recursively clone this repository (to include the submodules) with `git clone --recurse-submodules https://github.com/fjwillemsen/TurnALeaf.git`.
3. Run `npm install` to install the dependencies.
4. Edit the code base your way. VSCode is the recommended editor; a workspace settings file and recommended extensions are included.
5. Run `npm start` to run the development server.
6. Make sure to run `npm test` before submitting a pull request. Linting and formatting are automatically checked, pull requests not compliant are rejected. Make sure to provide and update documentation and docstrings where necessary. The TSDoc format is used. Please make sure that your commit messages and pull request are clear and descriptive.

## App & Directory structure

The app has a common electron-forge application structure and uses the three-fold Electron process model:

1. `main` is the general entry point of the application, running in a Node environment. It handles the creation of `BrowserWindow`s and interacts with the operating system.
2. `renderer` provides the UI, visually rendering web content. We use several frameworks also used in web development for this.
3. `preload` scripts provide the communication between the `main` and `renderer` processes. Technically they are ran in the `renderer` context but with more privileges to access Node APIs.

The idea behind this setup is to both mitigate security concerns and prevent long-running processes from making the entire app unresponsive.
We adhere to modern Electron best-practices by using inter-processes communication (IPC) and channels.

A concrete overview of the code is as follows:

```tree
├── assets                                  Assets available throughout the app
|   ├── fonts
│   └── icons
├── config                                  Vite configuration files
├── out                                     The output folder for built distributions
├── public                                  Static assets automatically copied into the distributions
├── scripts                                 Scripts
├── src                                     App source code folder, top-level files are Electron files
│   ├── @types                              - Type definitions
│   ├── channels                            - Enumeration files for channel communication
│   ├── ipc                                 - Inter-process communication files
│   ├── menu                                - The main / appbar menu
│   ├── shared                              - Abstract classes shared between Electron and React
│   ├── ui                                  - The Renderer (React) part of the app
│   │   ├── atoms                           -- Atomic react files
│   │   ├── components                      -- React component files
│   │   ├── modals                          -- Modals, especially globally used ones
│   │   ├── pages                           -- Full pages
│   │   ├── theme                           -- Theme definitions
│   │   ├── App.tsx                         -- The React app
│   │   ├── main.tsx                        -- The React entry point
│   │   └── router.tsx                      -- The React app router
│   ├── appWindow.ts                        - The Electron app
│   ├── main.ts                             - The Electron main entry point
│   └── preload.ts                          - The Electron preload scripts
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── eslint.config.mjs                       The ESLint configuration file
├── forge.config.ts                         The Electron Forge configuration file
├── forge.env.d.ts
├── index.html                              The base page of the web app
├── package-lock.json
├── package.json                            The NPM package definition
└── tsconfig.json                           The TypeScript configuration file
```

## Publishing

The app is built and published via Electron Forge, with the build files hosted on GitHub.
This allows for automatic updates and has been 'blessed' by the Electron project, so will be the standard for the forseeable future.
To build locally, run `npm run make`. To publish, run `npm run publish`.
To update dependencies, use `npx npm-check-updates`.

## Legal

### Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

### License

By contributing to this project, you agree that your contributions will be licensed under the terms of the [license](./LICENSE).
