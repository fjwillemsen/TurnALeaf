# TurnALeaf: a fully offline, native Overleaf with seamless switching

<h3 align="center">
  <img style="width: 200px" src="assets/logo/logo_cut_icon.png" />
  </br>
  <i>It's time to turn over a new leaf.</i>
</h3>

## Roadmap

The following roadmap outlines what will be released after which features are implemented. This contains moving targets; items can be added / changed. 

1. Basic functionality (0.0.1 / alpha release | 59%) <!-- 10/17 -->
    - [x] Base system
        - [x] Framework (Electron)
        - [x] Bundling (Vite)
        - [x] Interface library (React)
        - [x] Styling language (PostCSS / Tailwind)
        - [x] Component library (Mantine)
    - [ ] Base functionality
        - [x] Modular interface
        - [x] PDF rendering
        - [ ] Git integration
        - [ ] Editor
        - [ ] File navigator
    - [ ] Distribution
        - [ ] Downloadable
        - [ ] Installable
        - [ ] Updatable
    - [x] Icon
    - [x] Formatting
    - [ ] Code annotation & docstrings
    - [x] Documentation for early testers / contributers
2. Extra features & non-functional requirements (0.1.0 / beta release | 15%) <!-- 2/13 -->
    - [ ] Alpha release tested
    - [ ] Sections panel
    - [ ] Landing page
    - [ ] Projects overview
    - [ ] Settings menu
    - [ ] Test coverage 60%
    - [ ] CI/CD pipeline
      - [ ] Tests
      - [x] Build
      - [x] Linting
    - [ ] Auto-updates
    - [ ] Issue templates
    - [ ] GitHub discussion
    - [ ] Documentation
3. Polishing (1.0.0 / stable release | 0%) <!-- 0/6 -->
    - [ ] Beta release tested on a variety of systems
    - [ ] System features
        - [ ] Dark Mode / Light Mode switching
        - [ ] Themes
        - [ ] Native look & feel
    - [ ] Test coverage 80%
    - [ ] Known issues have been resolved or marked
4. Future
    - [ ] Overleaf notifications
    - [ ] TeX Distribution selection
    - [ ] Help pages
    - [ ] Onboarding tutorial
    - [ ] Multi-language support
    - [ ] Plugin support

## Installation

Installation is as simple as `brew install turnaleaf` on Mac, or by [downloading the latest release](https://github.com/fjwillemsen/TurnALeaf/releases/latest) for Linux, Windows and Mac.
It requires that `git` is installed on your system and you have access to Overleaf's git integration (premium feature).
For building from source, see [Setting up the development environment](#setting-up-the-development-environment).

## Motivation

Overleaf is a fantastic tool for writing LaTeX documents that is widely used among academics.
The main reasons it's so great:

-   user-friendly (i.e. has good defaults so you won't have to pick between a bazillion compilers and editors)
-   accessible (i.e. does not require installing five gigabytes of compiler + dependencies)
-   shareable (i.e. collaboration is easy with built-in review and chat)

However, it has one big problem: **it relies on an internet connection** to do the heavy lifting of compiling on a server, and any minor internet disruption breaks the editing process.
That is far from ideal when working on the plane on your way to a conference or on the train back home.

With the success of [Native Overleaf](https://github.com/fjwillemsen/NativeOverleaf), which wrapped the website in a native app and added native OS integration, the most requested feature was to be able to work online.
This requires a completely different approach that is a lot more involved than extending a website and wrapping it.

## Usage

TurnALeaf runs as a native web app, similar to Native Overleaf, but has a completely standalone editor and viewer built-in that functions as much like Overleaf as possible.
The Git integration built into Overleaf allows for seamless switching between standard Overleaf and TurnALeaf's offline mode: when the "go offline" button is pressed, the latest changes are downloaded and the view is changed to the local editor and viewer.
It uses the great [SwiftLaTeX](https://github.com/SwiftLaTeX/SwiftLaTeX) to compile LaTeX to PDF completely locally and very fast thanks to WebAssembly.
When you're ready to go back online for collaborating, the "go online" button will push the changes made to Overleaf.

### Design Choices

One of the most difficult choices was in picking between Electron and a more native approach, Tauri being the most popular.
On the one hand, the small bundle size, performance, self-updater and tight embedding in the OS provided by Tauri was very appealing.
On the other, Electron remains massively popular, well-documented and, most importantly, provides a consistent experience across platforms because of the bundled browser.
As this is one of the reasons the previous project [Native Overleaf](https://github.com/fjwillemsen/NativeOverleaf) was hard to maintain, Electron was chosen. Vite is used as a bundler (for hot-reload speed), React as the interface library, and PostCSS / Tailwind as the styling language (for convenience), based on the [electron-vite-react template](https://github.com/electron-vite/electron-vite-react).
[Mantine](https://mantine.dev/) is used as the UI component library.
To provide a standalone, Node-compatible git implementation, [isomorphic git](https://www.npmjs.com/package/isomorphic-git) is used.

### Ideas, questions, contributions?

Please use the [GitHub discussions page](https://github.com/fjwillemsen/TurnALeaf/issues) for this project. This allows others to read and chime in as well.
If you'd like to contribute, great! Feel free to submit pull requests via forks.

---

## Developer Info

If you're looking to contribute, please make sure to check the issues and discussions to avoid duplicates, and make sure the tests are passed before submitting a pull request.

### Setting up the development environment

1. Open your terminal and `cd` to wherever you want to build TurnALeaf.
2. Recursively clone this repository (to include the submodules) with `git clone --recurse-submodules https://github.com/fjwillemsen/TurnALeaf.git`.
3. Run `npm install` to install the dependencies.
4. Run `npm run dev` to run the development server.

### Directory structure

Common React application structure, just with an `electron` folder on top.  
Files in this folder will be separated from your React application and built into `dist-electron`.

```tree
├── electron                                 Electron-related code
│   ├── main                                 Main-process source code
│   └── preload                              Preload-scripts source code
│
├── release                                  Generated after production build, contains executables
│   └── {version}
│       ├── {os}-{os_arch}                   Contains unpacked application executable
│       └── {app_name}_{version}.{ext}       Installer for the application
│
├── public                                   Static assets
└── src                                      Renderer source code, your React application
```

### Debugging

![electron-vite-react-debug.gif](/electron-vite-react-debug.gif)
