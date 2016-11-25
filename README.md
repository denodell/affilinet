Affilinet API Helper Methods
-----------------------------------

_Warning: ALPHA release - unstable API and feature incomplete_

Contains utilities to simplify interaction with the Affilinet marketing network APIs.

## Prerequisites

 - Node.js / NPM
 - Affilinet Publisher ID
 - Affilinet Publisher Web Service password
 - Affilinet Product Web Service password

## Install

```
npm i affilinet-api --save
```

## Usage

```
var Affilinet = require('affilinet-api')

var A = new Affilinet({
 publisherId: 'xxxx',
 publisherPassword: 'xxxx',
 productPassword: 'xxxx',
})

A.getMerchants().then(merchants => {
	// Returns a list of merchants active with the given publisher
})

A.getTransactions().then(transactions => {
	// Returns a list of transactions that have taken place with the given publisher's merchants
})
```
