export class GlobalConstants {

    public static apiURL = function () {
        this.host = window.location.host;
        if ((this.host.toString().indexOf('localhost') + 1) && this.host.toString().indexOf(':')) {
            return 'http://localhost:3000';
        } else if (this.host === 'openebs.ci' ) {
            return 'https://openebs.ci/api';
        } else {
            return 'https://staging.openebs.ci/api';
        }
    };
}
