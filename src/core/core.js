const fetch = require('node-fetch')
const Logger = require('../../lib/logger')
const requiredParams = require('../../resources/requiredParams.json')

class Core {

	constructor(credentials) {

		this.feature = 'core'
		this.credentials = credentials
		this.logger = new Logger(this.feature)
		this.logger = this.logger.get()

	}

	getCredentials() {

		return this.credentials

	}

	setCredentials(credentials) {

		this.credentials = credentials

	}

	prepareRequiredParams() {

		const params = new URLSearchParams()

		params.append('grant_type', 'refresh_token')
		params.append('client_id', this.credentials.advertisingClientId)
		params.append('refresh_token', this.credentials.advertisingRefreshToken)
		params.append('client_secret', this.credentials.advertisingClientSecret)

		return params

	}

	async refreshToken() {

		try {

			const params = this.prepareRequiredParams()
			const { headers } = requiredParams.core.refreshToken

			const response = await fetch(requiredParams.authorizationURL, {
				body: params,
				headers,
				method: requiredParams[this.feature].refreshToken.method,
			})

			const data = await response.json()

			if (response.status === 200 && response.statusText === 'OK') {

				console.log('Refreshed with success!')
				this.credentials.advertisingAccessToken = data.access_token

				return

			}

			if (
				data.error_description === 'The request has an invalid grant parameter : code'
			) console.log('Refresh token is not valid')
			else console.log(data)

			console.log(`Status: ${response.status}`)
			console.log(`Text: ${response.statusText}`)

		} catch (error) {

			console.log(`Error on doRefreshToken: ${error.stack}`)

		}

	}

}

module.exports = Core
