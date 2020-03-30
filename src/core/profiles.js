const fetch = require('node-fetch')
const urljoin = require('url-join')
const Core = require('./core')
const Logger = require('../../lib/logger')
const requiredParams = require('../../resources/requiredParams.json')

class Profiles {

	constructor(credentials) {

		this.feature = 'profiles'
		this.core = new Core(credentials)
		this.logger = new Logger(this.feature)
		this.logger = this.logger.get()

	}

	prepareHeaders(credentials) {

		const headers = requiredParams[this.feature]

		headers.Authorization = requiredParams[this.feature].headers.Authorization
		+ credentials.advertisingAccessToken
		headers['Amazon-Advertising-API-ClientId'] = credentials.advertisingClientId

		return headers

	}

	async isResponseValid(response) {

		if (response.status === 401) {

			console.log('Not authenticated, refreshing token and trying again...')
			await this.core.refreshToken()

			return false

		}

		if (response.status !== 200) {

			console.log('Error on requestProfiles')
			console.log(`Status Code: ${response.status}: ${response.statusText}`)

		}

		return true

	}

	async listProfiles() {

		try {

			const credentials = this.core.getCredentials()
			const headers = this.prepareHeaders(credentials)
			const url = urljoin(requiredParams.endpoint,
				requiredParams[this.feature].apiVersion,
				requiredParams[this.feature].apiIdentifier)

			const response = await fetch(url, {
				method: requiredParams[this.feature].method,
				headers,
			})

			if (await this.isResponseValid(response)) {

				const responseData = await response.json()

				return responseData

			}

			return await this.listProfiles()

		} catch (error) {

			console.log(`Error on listProfiles: ${error}`)

		}

		return false

	}

}

module.exports = Profiles
