<h1 style="display: flex; justify-content: space-between; align-items: center;">
  🔥 Better Username Generator 🔥 
  <a style="color: #EA005E; text-decoration: underline; font-size: 28px;" href="https://github.com/freddie-nelson/username-generators/stargazers">Become a Stargazer</a>
</h1>

**Generate random usernames based on your own custom templates and rules!**

## Installation

```bash
# with npm
npm install username-generator
```

```bash
# with yarn
yarn add username-generator
```

## Usage

```javascript
import { generateUsername } from "username-generator";

generateUsername("{{firstname:m}}_{{lastname}}"); // "john_smith"
```

## Templates

A template is a string that can contain any number of placeholders. Placeholders are replaced with a random value when generating a username. You can use placeholders multiple times in a template, each placeholder will be replaced with a different value.

You can also place your own text in the string, this text will be included in the generated username.

The following placeholders are available:

-   `{{adj}}` - A random adjective.
-   `{{noun}}` - A random noun.
-   `{{firstname:gender}}` - A random first name. gender can be `m`, `f` or `all`.
-   `{{lastname}}` - A random last name.
-   `{{number:min:max}}` - A random number between `min` and `max`.
-   `{{title:gender}}` - A random title. gender can be `m`, `f` or `all`.
-   `{{prefix}}` - A random prefix.

An example template could be `"{{adj}}{{noun}}{{number:100:999}}"`.

This template would generate a username like `bluecat123`.

Additionally any placeholder can be capitalized by adding a `^` before the placeholder name, or made uppercase by adding `^^` before the placeholder name.

For example, `{{^adj}}` would generate a username like `Bluecat123`, and `{{^^adj}}` would generate a username like `BLUEcat123`.

## Contributing

### Prerequisites

-   node (lts version)
-   yarn (1.^22.10)

### Setup

```bash
# clone repo
git clone https://github.com/freddie-nelson/username-generator
cd username-generator

# install dependencies
yarn

# start dev server
yarn dev

# run build
node dist/index.esm.js
```

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright © 2020 - Present, Freddie Nelson

## Contact

-   [Send me an email 📧](mailto:freddie@freddienelson.co.uk)
-   [Contact me through my website](https://freddienelson.co.uk)
