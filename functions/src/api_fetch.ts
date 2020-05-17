import fetch, { Response } from 'node-fetch';

export interface myJson {
    timestamp: number,
    swell: {
        absMaxBreakingHeight: number
    }
}

export async function getMaxWaves(): Promise<Array<myJson>>{
    const data: Response = await fetch('http://magicseaweed.com/api/bea1c287853de990886e3599274b5f07/forecast/?spot_id=60&fields=timestamp,swell.absMaxBreakingHeight');
    const newData: Array<myJson> = await data.json();
    return newData;
}