"use strict"

const axios = require("axios")
const { ApplicationError } = require("@strapi/utils").errors

module.exports = {
    init({ apiKey, libraryId, pullZone, apiEndpoint = "https://video.bunnycdn.com" }) {
        console.log("apiEndpoint", apiEndpoint)

        if (!apiKey || !libraryId) {
            throw new ApplicationError("BUNNY_API_KEY, LIBRARY_ID can't be null or undefined.")
        }

        const bunny_api = axios.create({
            baseURL: `${apiEndpoint}/library/${libraryId}/videos`,
            timeout: 0,
            headers: {
                AccessKey: apiKey,
                'content-type': 'application/*+json',
            },
        });

        const upload = (file) =>
            new Promise(async (resolve, reject) => {
                const createVideoData = {
                    title: file.name,
                    thumbnailTime: 0
                };
                const createVideoResponse = await bunny_api.post('', createVideoData);

                const { data: createVideoResponseData } = createVideoResponse;
                if (createVideoResponse.status !== 200) {
                    reject(new Error(`Error uploading to Bunny.net: ${createVideoResponse.statusText}`))
                }

                const data = file.stream || Buffer.from(file.buffer, "binary")
                try {
                    const response = await bunny_api.put(`/${createVideoResponseData.guid}`, data);

                    if (response.status !== 200) {
                        reject(new Error(`Error uploading to Bunny.net: ${response.statusText}`))
                    }

                    file.url = `${pullZone}/${createVideoResponseData.guid}/playlist.m3u8`;
                    file.provider_metadata = {
                        ...file.provider_metadata,
                        guid: createVideoResponseData.guid,
                    };

                    resolve()
                } catch (error) {
                    reject(new Error(`Error uploading to Bunny.net: ${error.message}`))
                }
            })

        return {
            upload(file) {
                return upload(file)
            },
            uploadStream(file) {
                return upload(file)
            },
            delete: async (file) => {
                return new Promise(async (resolve) => {
                    try {
                        const response = await bunny_api.delete(`/${file.provider_metadata.guid}`);

                        if (response.status !== 200) {
                            console.error("Soft Error: Failed to delete file; has it already been deleted?", response.data)
                            resolve()
                        }

                        resolve()
                    } catch (error) {
                        console.error("Soft Error: Failed to delete file; has it already been deleted?", error.message)
                        resolve()
                    }
                })
            },
        }
    },
}

