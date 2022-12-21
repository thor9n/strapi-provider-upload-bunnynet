'use strict';

const axios = require('axios');

module.exports = {
  init(config) {
    const storageEndpoint = `${config.region}/${config.storageZone}/`;

    return {
      upload(file) {
        return new Promise((resolve, reject) => {
          axios.put(`${storageEndpoint}${file.hash}${file.ext}`,
            file.buffer,
            {headers: {'AccessKey': config.apiKey}})
            .then(function (response) {
              if (response.data.HttpCode === 201) {
                file.url = `${config.pullZone}/${file.hash}${file.ext}`;

                resolve();
              }
            })
            .catch(function (error) {
              console.log(error);

              return reject(error);
            });
        });
      },
      delete: async (file) => {
        return new Promise((resolve, reject) => {
          axios.delete(`${storageEndpoint}${file.hash}${file.ext}`,
            {headers: {'AccessKey': config.apiKey}})
            .then(function (response) {
              if (response.data.HttpCode === 200) {
                resolve();
              }
            })
            .catch(function (error) {
              console.log(error);

              return reject(error);
            });
        });
      },
    };
  },
};
