import { isDevMode } from '@angular/core';

export class GlobalConstants {

    public static apiURL = function () {
        const host = window.location.origin;
        if (isDevMode()) {
            // Replace with localhost:3000 while using local running server
            return 'https://staging.openebs.ci';
        } else {
            return host + '/api' ;
        }
    };
}
