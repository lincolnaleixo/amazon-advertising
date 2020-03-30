const Configurati = require('configurati')
const jsonfile = require('jsonfile')

const options = jsonfile.readFileSync('./tests/options.json')

async function getCredentials() {

	const type = 'gsheets'

	const configurati = new Configurati(type, options)

	const config = await configurati.get()

	const credentials = {
		advertisingClientId: config.credentials.ADVERTISING_CLIENT_ID,
		advertisingClientSecret: config.credentials.ADVERTISING_CLIENT_SECRET,
		advertisingRefreshToken: config.credentials.ADVERTISING_REFRESH_TOKEN,
		advertisingAccessToken: config.credentials.ADVERTISING_ACCESS_TOKEN,
		advertisingRegion: config.credentials.ADVERTISING_REGION,
	}

	return credentials

}

(async () => {

	console.log(await getCredentials())

})()
