import fetch, { Response } from 'node-fetch';
import {getKey} from './api_key'

export interface waveObject {
    timestamp: number,
    swell: {
        absMaxBreakingHeight: number
    }
}

export async function getMaxWaves(): Promise<Array<waveObject>>{
    const data: Response = await fetch(`http://magicseaweed.com/api/${getKey()}/forecast/?spot_id=60&fields=timestamp,swell.absMaxBreakingHeight`);
    const newData: Array<waveObject> = await data.json();
    return newData;
}