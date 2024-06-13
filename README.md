# TurnALeaf: a fully offline, native Overleaf with seamless switching

<h3 align="center">
  <img style="width: 200px" src="assets/logo/logo_cut_icon.png" />
  </br>
  <i>It's time to turn over a new leaf.</i>
</h3>

## Roadmap

The following roadmap outlines what will be released after which features are implemented. This contains moving targets; items can be added / changed.

1. Basic functionality (0.0.1 / alpha release | 64%) <!-- 18/28 -->
    - [x] Base system <!-- 5/5 -->
        - [x] Framework (Electron)
        - [x] Bundling (Vite)
        - [x] Interface library (React)
        - [x] Styling language (PostCSS / Tailwind)
        - [x] Component library (Mantine)
    - [ ] Base functionality <!-- 9/15 -->
        - [x] Modular interface
        - [x] Safe inter-process communication via API
        - [x] PDF rendering
        - [ ] Git integration <!-- 4/6 -->
            - [x] Git client
            - [x] Overleaf authentication token support & storage
            - [x] Creating projects
            - [ ] Pulling updates
            - [ ] Pushing updates
            - [x] Removing projects
        - [x] Projects overview
        - [ ] File navigator <!-- Done: File browser in frontend; To do: Get file details from backend; Display in frontend; Pass to editor -->
        - [ ] Editor <!-- 0/3 -->
            - [ ] Retrieval from backend
            - [ ] Basic editing
            - [ ] Saving to backend
        - [x] User settings storage
    - [ ] Distribution <!-- 0/3 -->
        - [ ] Downloadable
        - [ ] Installable
        - [ ] Updatable
    - [x] Icon
    - [x] Formatting
    - [x] Code annotation & docstrings
    - [x] Documentation for early testers / contributers
    - [ ] Bug fixing: <!-- 0/1 -->
        - [ ] Double execution of IPC calls
2. Extra features & non-functional requirements (0.1.0 / beta release | 10%) <!-- 2/21 -->
    - [ ] Alpha release tested
    - [ ] File operations <!-- 0/5 -->
        - [ ] Creation
        - [ ] Moving files
        - [ ] Recursive folders
        - [ ] Deletion
        - [ ] Merging
    - [ ] Editor <!-- 0/2 -->
        - [ ] Edit .bib files
        - [ ] View non-editable files (e.g. images)
    - [ ] Sections panel
    - [ ] Landing page
    - [ ] Settings menu
    - [ ] Onboarding tutorial
    - [ ] Test coverage 60%
    - [ ] CI/CD pipeline <!-- 2/4 -->
        - [ ] Tests
        - [x] Build
        - [x] Linting
        - [ ] Release
    - [ ] Auto-updates
    - [ ] Issue templates
    - [ ] GitHub discussion
    - [ ] Documentation
3. Polishing (1.0.0 / stable release | 0%) <!-- 0/7 -->
    - [ ] Beta release tested on a variety of systems
    - [ ] Auto-completion
    - [ ] System features <!-- 0/3 -->
        - [ ] Dark Mode / Light Mode switching
        - [ ] Themes
        - [ ] Native look & feel
    - [ ] Test coverage 80%
    - [ ] Known issues have been resolved or marked
4. Future
    - [ ] Overleaf notifications
    - [ ] TeX Distribution selection
    - [ ] Help pages
    - [ ] Multi-language support
    - [ ] Plugin support
    - [ ] Import files from URL (Zotero)

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
5. Make sure to run `npm test` and `npm run e2e` before submitting a pull request. Linting and formatting are automatically checked, pull requests not compliant are rejected. Make sure to provide and update documentation and docstrings where necessary. The TSDoc format is used.

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
