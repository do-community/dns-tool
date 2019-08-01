# DNS-Prototype
Prototyping stuff.

## Development/Building
To setup the build/develop environment, you will need to run `npm i` with Node 10+ installed. This will install the dependencies to allow you to build the project.

To start the development environment, simply run `npm run dev`. This will start a development server that will automatically reload the codebase when changes occur.

If you wish to host this on a service, simply run `npm run build`. You can then take the `dist` folder and put it on your web server/bucket. Travis CI does this automatically for this repository.

## Contributing
### Linting
Before creating a pull request to this application, you will want to lint it first. This is because linting is a check that is ran when a pull request is made and cannot be merged in if it fails. To lint, simply run `npm run lint`. If there are any errors that can be automatically be fixed, you can execute `npm run lint-and-fix` to automatically do that. This project enforces LF line styles, 4 spaces and no semi-colons. The linting will fail if this is not followed.

### File Location/Types
Anything that is data which is used across the project should be stored in `./src/data`. Any helper functions should be stored in `./src/utils`. Vue templates should be stored in `./src/templates` with a name that makes sense for what it does. The `index.html` file should only be used to handle basic head information and initialise the app.

### Components
Each component should be self-encompassing if possible. The components should contain all the functionality in it for the component to be able to run on its own. Each component should additionally have a name.
