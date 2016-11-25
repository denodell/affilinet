import { describe, beforeEach } from 'ava-spec'
import Affilinet from '../'

describe(`Affilinet`, it => {
	let A

	beforeEach(() => {
		A = new Affilinet({
			publisherId: '',
			publisherPassword: '',
		})
	})

	it('Gets Publisher Credential Token', async expect => {
		let token = await A.getPublisherCredentialToken()
		expect.true(token && token.length > 0)
	})

	it(`Get Merchants`, async expect => {
		let merchants = await A.getMerchants()
		expect.true(Array.isArray(merchants))
	})

	it(`Get Transactions`, async expect => {
		let transactions = await A.getTransactions()
		expect.true(Array.isArray(transactions))
	})
})
