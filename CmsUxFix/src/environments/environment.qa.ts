// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
    userDomainSuffix: '@unitydevlab.local',
    production: true,
    isCaptchaDisabled: true,
    gDocRefreshInterval: 15000,
    draftContentRefreshInterval: 10000,
    recentlyViewedDrafts: 10,
    API_BASE_URL: 'https://docworksmastertempapiqa.azurewebsites.net',
    diffplexdemo: 'http://diffplexdemo.azurewebsites.net',
    firestore: {
        apiKey: 'AIzaSyBqYdxfDiCVNiI7o0Avsz0aOtH3lUZh00o',
        authDomain: 'unity-qa-docworks.iam.gserviceaccount.com',
        databaseURL: 'https://unity-qa-docworks.firebaseio.com',
        projectId: 'unity-qa-docworks',
        storageBucket: 'unity-qa-docworks.appspot.com',
        messagingSenderId: '112308445214'
    },
    captcha: {
        API_BASE_URL: 'http://DocWorksMasterTempApiStaging.azurewebsites.net',
        RECAPTCHA_SITE_KEY: '6LcTQDIUAAAAAAJ-_IAA83-txP5zjVfuAGMIaDv0',
    },
    assetMaxFileSize: 1024 * 1024,
    pageSize: 20,
};
