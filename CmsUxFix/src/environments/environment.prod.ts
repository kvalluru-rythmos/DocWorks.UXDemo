// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
    userDomainSuffix: '@hq.unity3d.com',
    production: true,
    isCaptchaDisabled: true,
    gDocRefreshInterval: 5000,
    draftContentRefreshInterval: 10000,
    recentlyViewedDrafts: 10,
    API_BASE_URL: 'https://DocWorksMasterTempApiStaging.azurewebsites.net',
    diffplexdemo: 'http://diffplexdemo.azurewebsites.net',
    firestore: {
        apiKey: 'AIzaSyB86oB4NMPl76VBVB54qCkVPsZ7BymqWpU',
        authDomain: 'unity3d-4080c.firebaseapp.com',
        databaseURL: 'https://unity3d-4080c.firebaseio.com',
        projectId: 'unity3d-4080c',
        storageBucket: 'unity3d-4080c.appspot.com',
        messagingSenderId: '749711507771'
    },
    captcha: {
        API_BASE_URL: 'http://DocWorksMasterTempApiStaging.azurewebsites.net',
        RECAPTCHA_SITE_KEY: '6LcTQDIUAAAAAAJ-_IAA83-txP5zjVfuAGMIaDv0',
        recapthcha_server_key: '6LcTQDIUAAAAAFjWj88FHAHAYB2airDwJ5Wkr4FN'
    },
    assetMaxFileSize: 1024 * 1024,
    pageSize: 20,
};
