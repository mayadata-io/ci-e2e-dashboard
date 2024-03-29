import { isDevMode } from '@angular/core';

export class GlobalConstants {
    public host: string = window.location.origin;
    public static apiURL = function (mayastor?: boolean) {
        const host = window.location.origin;
        if (isDevMode()) {
            return mayastor ? 'http://localhost:8080' : 'http://localhost:3000'; //Uncomment while running localServer
            // return mayastor ? 'https://staging.openebs.ci/xray' : 'staging.openebs.ci/api';
        } else {
            return mayastor ? `https://staging.openebs.ci/xray` : `${host}/api`;
        }
    };

}
