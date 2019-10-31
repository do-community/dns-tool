# Contributing

## Pull Requests

### Creating a Pull Request

This application has been designed so that people can easily expand it.
To request us to review code that you create, you will need to create a pull request.
Creating a pull request is described in
 [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github).

### Linting

Before creating a pull request to this application, you will want to lint it first.
This is because linting is a check that is ran when a pull request is made and cannot be merged in if it fails.

To lint, simply run `npm test`. This will lint all the TS, Vue & SCSS files within the app.

If there are any errors that can be automatically be fixed with the TS & Vue files, you can execute
 `npm run test:ts-vue:fix` to automatically do that.
 
This project enforces LF line styles, 4 spaces and no semi-colons.
The linting will fail if this is not followed.

### File Location/Types

Please see [README: Source Structure](README.md#source-structure) for information on how files should be organised.

## Issue Creation

In the event that you have a issue using the tool or have a suggest for a change but don't want to contribute code,
 we are more than happy to help.
Make sure that when you create your issue, it follows the format for the type of issue you select
 (it has individual templates for each issue type).
 
Issue template types include the following:
 - Bug Reporting
 - Feature Requests
 - Help Requests
