## EXPRESS MONGOOSE PASSPORT LOCAL FACEBOOK GOOGLE

#### Express boilerplate set up with mongoose User model, local and social media (facebook/google) oauth sign up/login

### Set Up

Install dependencies
```sh
$ yarn install
```
Create .env file to hold oauth credentials
```sh
$ touch .env
```
Add credentials to .env file

```
FACEBOOK_CLIENT_ID=XXXXXXXXX
FACEBOOK_CLIENT_SECRET=XXXXXXXXX
GOOGLE_CLIENT_ID=XXXXXXXXX
GOOGLE_CLIENT_SECRET=XXXXXXXXX
```
Create config file to hold mongo configuration
```sh
$ touch config.js
```
Add configuration to config file

```
let config = {
	portDB: XXXXX,
	databaseName: "XXXXX"
}

module.exports = config
```

Run in dev

```
$ npm run dev
```