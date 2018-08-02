// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
    userDomainSuffix: '@hq.unity3d.com',
    production: true,
    isCaptchaDisabled: false,
    gDocRefreshInterval: 5000,
    draftContentRefreshInterval: 10000,
    recentlyViewedDrafts: 10,
    API_BASE_URL: 'https://docworksapipreview.azurewebsites.net',
    diffplexdemo: 'http://diffplexdemo.azurewebsites.net',
    firestore: {
        apiKey: 'AIzaSyDjEJpxjW_i3x-YLJdqKUkJooFDPH4t0Kg',
        authDomain: 'docworkscms-preview.iam.gserviceaccount.com',
        databaseURL: 'https://docworkscms-preview.firebaseio.com',
        projectId: 'docworkscms-preview',
        storageBucket: 'docworkscms-preview.appspot.com',
        messagingSenderId: '253838990715'
    },
    captcha: {
        API_BASE_URL: 'https://docworksapipreview.azurewebsites.net',
        RECAPTCHA_SITE_KEY: '6LcTQDIUAAAAAAJ-_IAA83-txP5zjVfuAGMIaDv0',
    },
    assetMaxFileSize: 1024 * 1024,
    pageSize: 20,
};
