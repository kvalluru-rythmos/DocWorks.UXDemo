// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
    userDomainSuffix: '@unitydevlab.local',
    production: false,
    isCaptchaDisabled: true,
    gDocRefreshInterval: 15000,
    draftContentRefreshInterval: 10000,
    recentlyViewedDrafts: 10,
    API_BASE_URL: 'https://DocWorksMasterTempApiStaging.azurewebsites.net',
    diffplexdemo: 'http://diffplexdemo.azurewebsites.net',
    firestore: {
        apiKey: 'AIzaSyACT8N5Z9q9CfVHsckou4lxuCrEZoMZDaI',
        authDomain: 'unity-qa-stg-docworks.iam.gserviceaccount.com',
        databaseURL: 'https://unity-qa-stg-docworks.firebaseio.com',
        projectId: 'unity-qa-stg-docworks',
        storageBucket: 'unity-qa-stg-docworks.appspot.com',
        messagingSenderId: '536606502871'
    },
    captcha: {
        API_BASE_URL: 'http://DocWorksMasterTempApiStaging.azurewebsites.net',
        RECAPTCHA_SITE_KEY: '6LcTQDIUAAAAAAJ-_IAA83-txP5zjVfuAGMIaDv0',
    },
    assetMaxFileSize: 1024 * 1024,
    pageSize: 20,
};
