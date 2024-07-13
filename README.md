# TurnALeaf: a fully offline, native Overleaf with seamless switching

<h3 align="center">
  <img style="width: 200px" src="concept_files/logo/logo_cut_icon_gen.png" />
  </br>
  <i>It's time to turn over a new leaf.</i>
</h3>

## Contents

-   [Motivation](#motivation)
-   [Roadmap](#roadmap)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [Design Choices](#design-choices)
    -   [Ideas, questions, contributions?](#ideas-questions-contributions)

## Motivation

Overleaf is a fantastic tool for writing LaTeX documents that is widely used among academics.
The main reasons it's so great:

-   user-friendly (i.e. has good defaults so you won't have to pick between a bazillion compilers and editors)
-   accessible (i.e. does not require installing five gigabytes of compiler + dependencies)
-   shareable (i.e. collaboration is easy with built-in review and chat)

However, it has one big problem: **it relies on an internet connection** to do the heavy lifting of compiling on a server, and any minor internet disruption breaks the editing process.
That is far from ideal when working on the plane on your way to a conference or on the train during your commute.

With the success of [Native Overleaf](https://github.com/fjwillemsen/NativeOverleaf), which wrapped the website in a native app and added native OS integration, the most requested feature was to be able to work online.
This requires a completely different approach that is a lot more involved than extending a website and wrapping it.

Hence, introducing... TurnALeaf!
A completely new app for writing and compiling LaTeX documents without any of the associated hurdles.
As it runs on your own device, not only are you no longer dependent on an internet connection, you also get much tighter system integration than any website can bring.
The best part? It's all free!

## Roadmap

TurnALeaf is currently in development.
The following roadmap outlines what will be released after which features are implemented. This contains moving targets; items can be added / changed.

1. Basic functionality (0.0.1 / alpha release | 86%) <!-- 36/42 -->
    - [x] Base system <!-- 5/5 -->
        - [x] Framework (Electron)
        - [x] Bundling (Vite)
        - [x] Interface library (React)
        - [x] Styling language (PostCSS / Tailwind)
        - [x] Component library (Mantine)
    - [ ] Base functionality <!-- 19/21 -->
        - [x] Modular interface
        - [x] Safe inter-process communication via API
        - [x] PDF rendering
        - [ ] Git integration <!-- 6/8 -->
            - [x] Git client
            - [x] Overleaf authentication token support & storage
            - [x] Creating projects
            - [ ] Fetching updates
            - [ ] Pulling updates
            - [x] Pushing updates
            - [x] Removing projects
            - [x] Human-readable commit messages
        - [x] Projects overview
        - [x] File navigator
        - [x] Editor <!-- 6/6 -->
            - [x] Retrieval from backend
            - [x] Basic editing
            - [x] Line counter & polishing
            - [x] Tab-based editor
            - [x] Auto-saving to backend
            - [x] Retrieval from frontend on PDF render
        - [x] User settings storage
        - [x] Onboarding
    - [ ] Distribution <!-- 1/4 -->
        - [x] Electron-Forge implementation
        - [ ] Downloadable
        - [ ] Installable
        - [ ] Updatable
    - [x] Icon
    - [x] Formatting
    - [x] Code annotation & docstrings
    - [x] Documentation for early testers / contributers
    - [x] Public GitHub repository <!-- 4/4 -->
        - [x] Protected branches
        - [x] Pull request templates
        - [x] Issue templates
        - [x] Discussion boards
    - [x] Bug fixing: <!-- 3/4 -->
        - [x] Double execution of IPC calls
        - [x] Working input files for TeX compilation
        - [x] Off-center modals
        - [ ] Reconfigure ESLint & TSDoc
2. Extra features & non-functional requirements (0.1.0 / beta release | 7%) <!-- 2/29 -->
    - [ ] Alpha release tested
    - [ ] Settings menu <!-- 0/4 -->
        - [ ] Authentication token
        - [ ] Commit author identification
        - [ ] Auto-saving & updating settings
        - [ ] Resetting local storage
    - [ ] File operations <!-- 0/5 -->
        - [ ] Creation
        - [ ] Moving & renaming files
        - [ ] Lazy recursive folder expansion
        - [ ] Deletion
        - [ ] Merging
    - [ ] Editor <!-- 0/4 -->
        - [ ] Edit .bib files
        - [ ] Syntax highlighting
        - [ ] View non-editable files (e.g. images)
        - [ ] Temporary file viewing on single click
    - [ ] PDF rendering <!-- 0/5 -->
        - [ ] Use new rendering backend
        - [ ] One-off TeX resource download
        - [ ] Selecting main file
        - [ ] Only overwrite changed files
        - [ ] Log with warnings and errors
    - [ ] Editor top-bar navigation between sections and subsections as in VSCode
    - [ ] Sections panel
    - [ ] Polished layout
    - [ ] Landing page
    - [ ] Onboarding tutorial
    - [ ] Test coverage 60%
    - [ ] CI/CD pipeline <!-- 2/4 -->
        - [ ] Tests
        - [x] Build
        - [x] Linting
        - [ ] Release
    - [ ] Auto-updates
    - [ ] Documentation
3. Polishing (1.0.0 / stable release | 0%) <!-- 0/10 -->
    - [ ] Beta release tested on a variety of systems
    - [ ] Project overview 'shelves' with previews
    - [ ] Auto-completion
    - [ ] Keyboard shortcuts
    - [ ] System features <!-- 0/3 -->
        - [ ] Dark Mode / Light Mode switching
        - [ ] Themes
        - [ ] Native look & feel
    - [ ] Test coverage 80%
    - [ ] Known issues have been resolved or marked
    - [ ] Availability on HomeBrew / App Store
4. Future
    - [ ] View of commit history with differences between files
    - [ ] Preloading of TeX files during installation
    - [ ] TeX Distribution selection
    - [ ] Import files from URL (Zotero)
    - [ ] Moving between editor and PDF location
    - [ ] Help pages
    - [ ] Browser extension support
    - [ ] Plugin support
    - [ ] Rich text editor
    - [ ] Multi-language support
    - [ ] Overleaf notifications

## Installation

Installation is as simple as [downloading the latest release](https://github.com/fjwillemsen/TurnALeaf/releases/latest) for Mac, Linux, and Windows. HomeBrew and App Store releases are planned (see [Roadmap](#roadmap)).
To use TurnALeaf with Overleaf, you need to have access to Overleaf's git integration (premium feature). If you don't have this, you can still use the app by for by hosting it on any Git platform (e.g. GitHub). Local file support is currently not planned, because Git is used to automatically backup your important work.
For building from source, see [Setting up the development environment](#setting-up-the-development-environment).

## Usage

TurnALeaf runs as a native web app, similar to Native Overleaf, but has a completely standalone editor and viewer built-in that functions as much like Overleaf as possible.
The Git integration built into Overleaf allows for seamless switching between TurnALeaf and Overleaf. <!--: when the "go offline" button is pressed, the latest changes are downloaded and the view is changed to the local editor and viewer.-->
Under the hood, TurnALeaf uses [SwiftLaTeX](https://github.com/SwiftLaTeX/SwiftLaTeX) to compile LaTeX to PDF locally and very fast thanks to WebAssembly. Note that an internet connection may still be required to download some files for compilation.
Edits are automatically saved to both your system and the remote server, meaning you won't have to worry about losing your work.

### Design Choices

For those interested, this project involved a lot of design decisions.
One of the most difficult choices was in picking between Electron and a more native approach, Tauri being the most popular.
On the one hand, the small bundle size, performance, self-updater and tight embedding in the OS provided by Tauri was very appealing.
On the other, Electron remains massively popular, well-documented and, most importantly, provides a consistent experience across platforms because of the bundled browser.
As this is one of the reasons the previous project [Native Overleaf](https://github.com/fjwillemsen/NativeOverleaf) was hard to maintain, Electron was chosen. Vite is used as a bundler (for hot-reload speed), React as the interface library, and PostCSS / Tailwind as the styling language (for convenience), based on a [electron-forge-react-vite boilerplate](https://github.com/flaviodelgrosso/electron-forge-react-vite-boilerplate).
[Mantine](https://mantine.dev/) is used as the UI component library.
To provide a standalone, Node-compatible git implementation, [isomorphic git](https://www.npmjs.com/package/isomorphic-git) is used.
Between [Electron-Forge](https://www.electronforge.io) and [Electron-Builder](https://www.electron.build), `electron-forge` is used, the reasons for which are well summarized [here](https://stackoverflow.com/a/43024627).

### Ideas, questions, contributions?

Please use the [GitHub discussions page](https://github.com/fjwillemsen/TurnALeaf/discussions) for this project. This allows others to read and chime in as well.
If you'd like to contribute, great! Feel free to submit pull requests via forks. Please note that pull requests on features in active development (see [Roadmap](#roadmap)) will likely not be accepted; to avoid duplicate work, first open an issue.
Be sure to check the [contributing guidelines](./CONTRIBUTING.md) for more practical information.
