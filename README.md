# strapi-provider-upload-bunnynet

Bunny.net Upload Provider for Strapi V4.

## Configurations

See the [using a provider](https://strapi.io/documentation/developer-docs/latest/development/plugins/upload.html#using-a-provider) documentation for information on installing and using a provider. And see the [environment variables](https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#environment-variables) for setting and using environment variables in your configs.

**Example**

`./config/plugins.js`

```js
module.exports = ({ env }) => ({
  //...
  upload: {
    config: {
      provider: "strapi-provider-upload-bunnynet",
      providerOptions: {
        api_key: process.env.BUNNY_API_KEY,
        storage_zone: process.env.BUNNY_STORAGE_ZONE,
        pull_zone: process.env.BUNNY_PULL_ZONE,
      },
    },
  },
  //...
})
```

`.env`

```
BUNNY_API_KEY: Storage Password (Inside FTP & API Access).
BUNNY_STORAGE_ZONE: Storage Zone name.
BUNNY_PULL_ZONE: Pull Zone name.
```

### Security Middleware Configuration

Due to the default settings in the Strapi Security Middleware you will need to modify the `contentSecurityPolicy` settings to properly see thumbnail previews in the Media Library. You should replace `strapi::security` string with the object bellow instead as explained in the [middleware configuration](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/middlewares.html#loading-order) documentation.

`./config/middlewares.js`

```js
module.exports = [
  // ...
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": ["'self'", "data:", "blob:", process.env.BUNNY_PULL_ZONE],
          "media-src": ["'self'", "data:", "blob:", process.env.BUNNY_PULL_ZONE],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  // ...
]
```
