# Contributing
## Pull Requests

### Creating a Pull Request
This application has been designed so that people can easily expand it. To request us to review code that you create, you will need to create a pull request. Creating a pull request is described in [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github).

### Linting
Before creating a pull request to this application, you will want to lint it first. This is because linting is a check that is ran when a pull request is made and cannot be merged in if it fails. To lint, simply run `npm run lint`. If there are any errors that can be automatically be fixed, you can execute `npm run lint-and-fix` to automatically do that. This project enforces LF line styles, 4 spaces and no semi-colons. The linting will fail if this is not followed.

### File Location/Types
Anything that is data which is used across the project should be stored in `./src/data`. Any helper functions should be stored in `./src/utils`. Vue templates should be stored in `./src/templates` with a name that makes sense for what it does. The `index.html` file should only be used to handle basic head information and initialise the app.

### Components
Each component should be self-encompassing if possible. The components should contain all the functionality in it for the component to be able to run on its own. Each component should additionally have a name.

## Issue Creation
In the event that you have a issue using the tool, we are more than happy to help. Make sure that when you create your issue, it follows the format for the type of issue you select (it has individual templates for each issue type). Issues include the following:
- Bug Reporting
- Feature Requests
- Help Requests
