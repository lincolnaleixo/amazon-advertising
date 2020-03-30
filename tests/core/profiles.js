const Configurati = require('configurati')
const fs = require('fs')
const jsonfile = require('jsonfile')
const Logger = require('../../lib/logger')
const Profiles = require('../../src/core/profiles')

const options = jsonfile.readFileSync('./tests/options.json')
const feature = 'profiles'
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

async function listProfiles() {

	const logger = new Logger(feature)
	this.logger = logger.get()

	const credentials = await getCredentials()
	const profiles = new Profiles(credentials)
	const profilesList = await profiles.listProfiles()
	const dumpFolder = `${options.dumpFolder}/core/${feature}`

	fs.writeFileSync(`${dumpFolder}/listProfiles.json`, JSON.stringify(profilesList, null, 2))

	this.logger.info('Profiles saved on dump folder')

}

(async () => {

	await listProfiles()

})()
