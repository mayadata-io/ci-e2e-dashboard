import { isDevMode } from '@angular/core';

export class GlobalConstants {

    public static apiURL = function () {
        const host = window.location.origin;
        if (isDevMode()) {
            return 'http://localhost:3000';
        } else {
            return host + '/api' ;
        }
    };
}
