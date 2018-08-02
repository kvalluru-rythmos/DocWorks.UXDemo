import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Rx';


export const mockRouter = {
    navigateByUrl(url: string) { return url; },
    navigate(url: string) { return url; }
};
export const mockActivatedRoute = {
    snapshot: { queryParams: { postLoginUrl: '' } },
};
export const mockNotificationService = {
    navigate: jasmine.createSpy('NotificationService')
};

// Spy services used for components
export class LoginServiceSpy {
    userInfo = { token: 1, Name: 'Login User' };
    doLogin1= jasmine.createSpy('doLogin').and.callFake(() => Promise
        .resolve(true)
        .then(() => Object.assign({}, this.userInfo))
    );

    doLogin = jasmine.createSpy('doLogin').and.returnValue({ subscribe: () => ['/dashboard'] });
}

export class NotificationServiceSpy {
    subscribeTopic = jasmine.createSpy('subscribeTopic').and.callFake(() => Promise
        .resolve(true)
        .then(() => Object.assign({}, 'success'))
    );

    unsubscribeTopic = jasmine.createSpy('unsubscribeTopic').and.callFake(() => Promise
        .resolve(true)
        .then(() => Object.assign({}, 'success'))
    );

    getFCMToken = jasmine.createSpy('getFCMToken').and.callFake(() => Promise
        .resolve(true)
        .then(() => Object.assign({}, 'success'))
    );

    registerFCMTokenWithServer = jasmine.createSpy('getFCMToken').and.callFake(() => Promise
        .resolve(true)
        .then(() => Object.assign({}, 'success'))
    );

    getNotificationEmitter = jasmine.createSpy('getNotificationEmitter').and.returnValue({ subscribe: () => { } });

    handleError = jasmine.createSpy('handleError').and.returnValue('success');
}

export class ProjectServiceSpy {
    getTypeOfContent = jasmine.createSpy('getTypeOfContent').and.callFake(() => Promise
        .resolve(true)
        .then(() => Object.assign({}, []))
    );

    requestProjects = jasmine.createSpy('requestProjects').and.callFake(() => Promise
        .resolve(true)
        .then(() => Object.assign({}, []))
    );
}

export class FakeProjectService {
    doLogin(username: string, password: string) {
        return 'success';
    }
}
export class FakeLoginService {
    doLogin(username: string, password: string) {
        return 'success';
    }
}
export class FakeNotificationService {
    getTest() {
        return Observable.interval(500).map(i => [{ $value: 'testvalue1' }, { $value: 'testvalue2' }, { $value: 'testvalue3' }]);
    }

    subscribeTopic(name: string) {
        return 'success';
    }


    unsubscribeTopic(name: string) {
        return 'success';
    }
}
