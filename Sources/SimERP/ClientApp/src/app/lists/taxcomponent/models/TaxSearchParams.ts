import { AuthenParams } from 'src/app/common/commomodel/AuthenParams';

export class TaxSearchParams {
    authenParams: AuthenParams;
    searchString: string;
    startRow: number;
    maxRow: number;

    constructor() {
        this.startRow = 0;
        this.maxRow = 20;
    }
}
