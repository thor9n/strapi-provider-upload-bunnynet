# strapi-provider-upload-bunnycdn

BunnyCDN Upload Provider for Strapi. Fork from (https://github.com/laukatu/strapi-provider-upload-bunnycdn) to fix support for Strapi V4.

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
        region: env("BUNNYCDN_HOST"),
        apiKey: env("BUNNYCDN_API_KEY"),
        storageZone: env("BUNNYCDN_STORAGE_ZONE"),
        pullZone: env("BUNNYCDN_PULL_ZONE"),
      },
    },
    actionOptions: {
      upload: {},
      delete: {},
    },
  },
  //...
})
```

`.env`

```
BUNNYCDN_HOST: Storage primary Hostname (Inside FTP & API Access).
BUNNYCDN_API_KEY: Storage Password (Inside FTP & API Access).
BUNNYCDN_STORAGE_ZONE: Storage Zone name.
BUNNYCDN_PULL_ZONE: Pull Zone name.
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
          "img-src": ["'self'", "data:", "blob:", "dl.airtable.com", env("BUNNYCDN_HOST"), env("BUNNYCDN_PULL_ZONE")],
          "media-src": ["'self'", "data:", "blob:", "dl.airtable.com", env("BUNNYCDN_HOST"), env("BUNNYCDN_PULL_ZONE")],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  // ...
]
```
