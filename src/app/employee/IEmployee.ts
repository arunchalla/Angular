import { Iskill } from './Iskill';

export interface IEmployee{
    id:number;
    fullname:string;
    email:string;
    phone?:string;
    contactpreference:string;
    skills: Iskill[];
}