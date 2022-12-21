"use strict"

const axios = require("axios")

module.exports = {
  init(config) {
    const storage_endpoint = `${config.region}/${config.storage_zone}/`

    return {
      upload(file) {
        console.log("upload()")
        return new Promise((resolve, reject) => {
          axios
            .put(`${storage_endpoint}${file.hash}${file.ext}`, file.buffer, { headers: { AccessKey: config.api_key } })
            .then(function (response) {
              if (response.data.HttpCode === 201) {
                file.url = `${config.pull_zone}/${file.hash}${file.ext}`
                resolve()
              }
            })
            .catch(function (error) {
              // console.log(error)
              return reject(error)
            })
        })
      },
      uploadStream(file) {
        console.log("uploadStream()", file.stream)
        return new Promise((resolve, reject) => {
          axios
            .put(`${storage_endpoint}${file.hash}${file.ext}`, file.buffer, { headers: { AccessKey: config.api_key } })
            .then(function (response) {
              if (response.data.HttpCode === 201) {
                console.log(response.data)
                file.url = `${config.pull_zone}/${file.hash}${file.ext}`
                resolve()
              } else {
                console.log(response.data)
                reject(response.data)
              }
            })
            .catch(function (error) {
              // console.log(error)
              return reject(error)
            })
        })
      },
      delete: async (file) => {
        return new Promise((resolve, reject) => {
          axios
            .delete(`${storage_endpoint}${file.hash}${file.ext}`, { headers: { AccessKey: config.api_key } })
            .then(function (response) {
              if (response.data.HttpCode === 200) {
                resolve()
              }
            })
            .catch(function (error) {
              console.log(error.message)
              return reject(error)
            })
        })
      },
    }
  },
}
