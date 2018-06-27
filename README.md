Package Name Goes Here
------------------------
> What its for Goes here

## Usage

```
  // Add code here

```


## How to Use
- Update package.json with the new package name and description
- Update the top section of this `README.md` file
- Add Library code and unit tests to `lib/` folder 
  - Unit tests must be named with `.spec.js`
- Rememeber to export your library code in the root `index.js`

## How to publish
After you finish writing code
- Make sure your tests pass with `npm test`
- Commit your code to git and make sure the pipeline passes. (Pause while the pipeline run...)
- Run `npm version ` with either the `patch|minor|major` 
  - Example `npm version patch`
  - This will update the package version in the package.json
  - It will do a `git tag` with the new version information and will `push` the tag to git
- Run `npm publish` to publish to our Nexus Repo

## Local Development
To develop locally and use this package in another app you will need to run `npm link` in this repo and then in the application that you want to test this in run `npm link @broadvine/{{package name}}`.

# nateway
