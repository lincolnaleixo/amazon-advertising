const fetch = require('node-fetch')
const urljoin = require('url-join')
const Core = require('../core/core')
const Logger = require('../../lib/logger')
const requiredParams = require('../../resources/requiredParams.json')

class Campaigns {

	constructor(credentials) {

		this.feature = 'campaigns'
		this.core = new Core(credentials)
		this.logger = new Logger(this.feature)
		this.logger = this.logger.get()

	}

	prepareHeaders(credentials, profileId) {

		const { headers } = requiredParams[this.feature]

		headers.Authorization = requiredParams.AuthorizationType
		+ credentials.advertisingAccessToken
		headers['Amazon-Advertising-API-ClientId'] = credentials.advertisingClientId
		headers['Amazon-Advertising-API-Scope'] = profileId

		return headers

	}

	async isResponseValid(response) {

		if (response.status === 401) {

			const jsonResponse = await response.json()

			if (jsonResponse.details === 'HTTP 401 Unauthorized') {

				console.log('Not authenticated, refreshing token and trying again...')
				await this.core.refreshToken()

			} else {

				console.log(jsonResponse)

			}

			return false

		}

		if (response.status !== 200) {

			console.log('Error on requestProfiles')
			console.log(`Status Code: ${response.status}: ${response.statusText}`)

		}

		return true

	}

	async listCampaigns(profileId) {

		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		try {

			const credentials = this.core.getCredentials()
			const headers = this.prepareHeaders(credentials, profileId)
			const url = urljoin(requiredParams.endpoint,
				requiredParams[this.feature].apiVersion,
				requiredParams[this.feature].apiIdentifier,
				requiredParams[this.feature][fnName].requestURI)

			const response = await fetch(url, {
				method: requiredParams[this.feature][fnName].method,
				headers,
			})

			if (await this.isResponseValid(response)) {

				const responseData = await response.json()

				return responseData

			}

			return await this[fnName](profileId)

		} catch (error) {

			console.log(`Error on ${fnName}: ${error}`)

		}

		return false

	}

	async listCampaignsEx(profileId) {

		const fnName = new Error()
			.stack
			.split(/\r\n|\r|\n/g)[1].split('.')[1].split('(')[0].trim()

		try {

			const credentials = this.core.getCredentials()
			const headers = this.prepareHeaders(credentials, profileId)
			const url = urljoin(requiredParams.endpoint,
				requiredParams[this.feature].apiVersion,
				requiredParams[this.feature].apiIdentifier,
				requiredParams[this.feature][fnName].requestURI)

			const response = await fetch(url, {
				method: requiredParams[this.feature][fnName].method,
				headers,
			})

			if (await this.isResponseValid(response)) {

				const responseData = await response.json()

				return responseData

			}

			return await this[fnName](profileId)

		} catch (error) {

			console.log(`Error on ${fnName}: ${error}`)

		}

		return false

	}

}

module.exports = Campaigns
