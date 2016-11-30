#RVR report

This is a template guide for Reportal VR report which is an automated script that takes a Reportal Report and processes its data to further present it in VR mode

#Processors and valid classes

Processors are introduced for automatic feature-detection and processing of elements in Reportal. All processing classes must correspond to a list of processors below, prefixed with `.rvr-`. Thus a processing class for a page title would be `.rvr-pageTitle` on a page title Component

### pageTitle

Needs to have a `.rvr-pageTitle` class on it for a RVR to fetch it.

# Commands (configured in package.json)

- `npm install` installs all dependencies of the project
- `npm run build:prd` generates minified build files under `/dist` folder 
- `npm run build:dev` generates build files under `/dist` folder and starts watching all changes made to the project during this session, appending them to the build files
- `npm test` Runs tests that have been written and put into `/src/__tests__` folder. (Note: test should follow name convention: `NameOfClass-test.js` which is a test for `NameOfFile.js`)
- `npm run lint` Lints your JavaScript code placed in src folder.
- `npm run docs` generates documentation for your project `.js` files that use JSDoc3 comments and puls them into `docs` folder
- `npm run docs-commit`  publishes documentation to `http://ConfirmitASA.github.io/[RepoName]/[version]/` where `[RepoName]` is name of your repository as well as name specified in `package.json -> name` AND `[version]` is the version in your `package.json`. 
Please make sure you have the `npm run docs-commit` command configured properly with the correct name of repo to be used there.
