import fetch, { Response } from 'node-fetch';
import {getKey} from './api_key'

export interface myJson {
    timestamp: number,
    swell: {
        absMaxBreakingHeight: number
    }
}

export async function getMaxWaves(): Promise<Array<myJson>>{
    const data: Response = await fetch(`http://magicseaweed.com/api/${getKey()}/forecast/?spot_id=60&fields=timestamp,swell.absMaxBreakingHeight`);
    const newData: Array<myJson> = await data.json();
    return newData;
}