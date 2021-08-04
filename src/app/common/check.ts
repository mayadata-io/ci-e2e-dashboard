import { isDevMode } from '@angular/core';

export class GlobalConstants {

    public static apiURL = function () {
        const host = window.location.origin;
        if (isDevMode()) {
            return 'https://staging.openebs.ci';
        } else {
            return host + '/api' ;
        }
    };
}
