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
		const token = await A.getPublisherCredentialToken()
		expect.true(token && token.length > 0)
	})

	it(`Get Merchants`, async expect => {
		const merchants = await A.getMerchants()
		expect.true(Array.isArray(merchants))
	})

	it(`Get Vouchers`, async expect => {
		const vouchers = await A.getVouchers()
		expect.true(Array.isArray(vouchers))
	})

	it(`Get Transactions`, async expect => {
		const transactions = await A.getTransactions()
		expect.true(Array.isArray(transactions))
	})
})
