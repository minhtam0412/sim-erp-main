import { AuthenParams } from 'src/app/common/commomodel/AuthenParams';
import { Tax } from './Tax';

export class AddTaxParams {
    authenParams: AuthenParams;
    tax: Tax;
    isNew: boolean;
}