import { Injectable, Injector } from '@angular/core';
import { HttpService } from '../common/http.service';
import { environment } from '../../environments/environment';
import { AuthoringCacheService } from '../common/authoring-cache.service';

@Injectable()
export class DistributionService {
    constructor(private httpService: HttpService, public injector: Injector,
        public authoringCacheService: AuthoringCacheService) {
    }

    getDistributions(projectId: string) {
        return {
            data: this.authoringCacheService.getDistributions(projectId),
            responseObservable: this.httpService.get(environment.API_BASE_URL + '/api/Projects/' + projectId + '/distributions')
        };
    }

    getProjectBranches(projectId: string) {
        return {
            data: this.authoringCacheService.getBranches(projectId),
            responseObservable: this.httpService.get(environment.API_BASE_URL + '/api/Projects/' + projectId + '/Branches')
        };
    }

    createDistribution(value: any) {
        return this.httpService.post(environment.API_BASE_URL + '/api/Distributions', value).toPromise().then(response => {
            return response.json().responseId as string;
        });
    }

    getDistributionsFromCache(projectId) {
        return this.authoringCacheService.getDistributions(projectId);
    }

    setDistrubutionIdToCache(distributionId) {
        this.authoringCacheService.selectedDistributionId = distributionId;
    }

    getDistributionIdFromCache() {
        return this.authoringCacheService.selectedDistributionId;
    }

    getSelectedDistributionFromCache() {
        return this.authoringCacheService.getSelectedDistribution();
    }

    setDistributions(projectId: string, value: any) {
        this.authoringCacheService.setDistributions(projectId, value);
    }

    setBranches(projectId: string, value: any) {
        this.authoringCacheService.setBranches(projectId, value);
    }

    updateDistribution(value: any) {
        return this.httpService.put(environment.API_BASE_URL + '/api/Distributions', value)
            .toPromise()
            .then(response => {
                return response.json().responseId as string;
            });
    }

    deleteDistribution(value: any) {
        return this.httpService.delete(environment.API_BASE_URL + '/api/Distributions/' + value.distributionId)
            .toPromise()
            .then(response => {
                return response.json().responseId as string;
            });
    }
}
