<h1 style="display: flex; justify-content: space-between; align-items: center;">
  🔥 node-protonvpn 🔥 
  <a style="color: #EA005E; text-decoration: underline; font-size: 28px;" href="https://github.com/freddie-nelson/username-generators/stargazers">Become a Stargazer</a>
</h1>

**Connect to protonvpn servers through a simple nodejs api**

## Installation

```bash
# with npm
npm install node-protonvpn
```

```bash
# with yarn
yarn add node-protonvpn
```

## Usage

```javascript
// configs can be found at https://account.protonvpn.com/downloads
// - under country configs
// - download all
const configDir = "dir/to/configs";

// optional - fix config compression error
fixConfigCompressionErrorDir(configDir);

// can be found at https://account.protonvpn.com/account
const auth: OpenVpnAuth = {
    user: "opevpn username",
    pass: "openvpn password",
};

const protonVpn = new ProtonVpnController(configDir, auth, {
    enableLogging: true,
});

protonVpn.connect("US");
```

**IMPORTANT: You must have openvpn installed on your machine and run node as administrator on windows (linux not tested)**

## Contributing

### Prerequisites

-   node (lts version)
-   yarn (1.^22.10)

### Setup

```bash
# clone repo
git clone https://github.com/freddie-nelson/node-protonvpn
cd node-protonvpn

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
