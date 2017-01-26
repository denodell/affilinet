import 'babel-polyfill'
import 'source-map-support/register'
import soap from 'soap-as-promised'

const PUBLISHER_LOGIN_SERVICE_URL = `https://api.affili.net/V2.0/Logon.svc?wsdl`
const PUBLISHER_PROGRAM_SERVICE_URL = `https://api.affili.net/V2.0/PublisherProgram.svc?wsdl`
const PUBLISHER_VOUCHER_SERVICE_URL = `https://api.affili.net/V2.0/PublisherInbox.svc?wsdl`
const PUBLISHER_TRANSACTION_SERVICE_URL = `https://api.affili.net/V2.0/PublisherStatistics.svc?wsdl`

export default class Affilinet {
	config = {
		publisherId: '',
		publisherPassword: '',
		productPassword: '',
	}

	constructor({ publisherId, publisherPassword, productPassword }) {
		this.config = Object.assign({}, this.config, {
			publisherId,
			publisherPassword,
			productPassword,
		})
	}

	getPublisherCredentialToken() {
		return (async () => {
			const client = await soap.createClient(PUBLISHER_LOGIN_SERVICE_URL)
			return new Promise((resolve, reject) => {
				client.Logon({
	 				'q2:Username': this.config.publisherId,
	 				'q2:Password': this.config.publisherPassword,
	 				'q2:WebServiceType': 'Publisher',
	 			}, (err, result) => {
					if (err) {
						reject(err)
						return
					}

					resolve(result)
	 			})
			})
		})()
	}

	getMerchants() {
		return (async () => {
			const CredentialToken = await this.getPublisherCredentialToken()
			const client = await soap.createClient(PUBLISHER_PROGRAM_SERVICE_URL)
			const response = await client.GetPrograms({
				'CredentialToken': CredentialToken,
				'DisplaySettings': {
					'CurrentPage': 1,
					'PageSize': 100,
				},
				'GetProgramsQuery': {
					'PartnershipStatus': [{
						'ProgramPartnershipStatusEnum': 'Active',
					}],
				},
			})
			const { ProgramCollection = {} } = response || {}
			const { Program = [] } = ProgramCollection
			return Program
		})()
	}

	getVouchers() {
		return (async () => {
			const CredentialToken = await this.getPublisherCredentialToken()
			const client = await soap.createClient(PUBLISHER_VOUCHER_SERVICE_URL)
			const response = await client.SearchVoucherCodes({
				'CredentialToken': CredentialToken,
				'DisplaySettings': {
					'CurrentPage': 1,
					'PageSize': 1000,
				},
				'SearchVoucherCodesRequestMessage': {
					'ProgramPartnershipStatus': 'Accepted',
				},
			})
			const { VoucherCodeCollection = {} } = response || {}
			const { VoucherCodeItem = [] } = VoucherCodeCollection || {}
			return VoucherCodeItem
		})()
	}

	getTransactions() {
		function padZero(num) {
			return num < 10 ? ('0' + num) : num
		}

		const endDateObj = new Date()
		const endDate = `${endDateObj.getFullYear()}-${padZero(endDateObj.getMonth() + 1)}-${padZero(endDateObj.getDate())}`
		const startDate = `2000-01-01`

		return (async () => {
			const CredentialToken = await this.getPublisherCredentialToken()
			const client = await soap.createClient(PUBLISHER_TRANSACTION_SERVICE_URL)
			const response = await client.GetTransactions({
				'CredentialToken': CredentialToken,
				'PageSettings': {
					'CurrentPage': 1,
					'PageSize': 100,
				},
				'TransactionQuery': {
					'EndDate': endDate,
					'StartDate': startDate,
					'TransactionStatus': `All`,
				},
			})
			const { TransactionCollection = {} } = response || {}
			const { Transaction = [] } = TransactionCollection || {}
			return Transaction.map(transaction => Object.assign({}, transaction, {
				NetPrice: +transaction.NetPrice,
				PublisherCommission: +transaction.PublisherCommission,
			}))
		})()
	}
}
