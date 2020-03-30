/* eslint-disable no-unused-vars */
const Configurati = require('configurati')
const fs = require('fs')
const jsonfile = require('jsonfile')
const Logger = require('../../lib/logger')
const Campaigns = require('../../src/sp/campaigns')

const options = jsonfile.readFileSync('./tests/options.json')
const feature = 'campaigns'

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

async function listCampaigns(profileId) {

	const fnName = new Error()
		.stack
		.split('\n')[1]
		.split('at')[1]
		.split('(')[0]
		.trim()

	const logger = new Logger(feature)
	this.logger = logger.get()

	const credentials = await getCredentials()
	const campaigns = new Campaigns(credentials)

	const response = await campaigns[fnName](profileId)
	const dumpFolder = `${options.dumpFolder}/sp/${feature}`

	fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response, null, 2))

	this.logger.info(`${fnName} saved on dump folder`)

}

async function listCampaignsEx(profileId) {

	const fnName = new Error()
		.stack
		.split('\n')[1]
		.split('at')[1]
		.split('(')[0]
		.trim()

	const logger = new Logger(feature)
	this.logger = logger.get()

	const credentials = await getCredentials()
	const campaigns = new Campaigns(credentials)

	const response = await campaigns[fnName](profileId)
	const dumpFolder = `${options.dumpFolder}/sp/${feature}`

	fs.writeFileSync(`${dumpFolder}/${fnName}.json`, JSON.stringify(response, null, 2))

	this.logger.info(`${fnName} saved on dump folder`)

}

(async () => {

	const { profileId } = options
	// await listCampaigns(profileId)
	await listCampaignsEx(profileId)

})()
