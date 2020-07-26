import {getMaxWaves, waveObject} from './api_fetch'

export enum day {
    Sunday,
    Monday, 
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}

//function calls
export async function getInitialResponse(): Promise<string> {
    const data: Array<waveObject> = await getMaxWaves();
    return initialResponse(data);
}

export async function getHighestWaveResponse(): Promise<string> {
    const highestWavesArray: Array<waveObject> = await getHighestWaveEachDay();
    return highestWaveResponse(highestWavesArray);
}

export async function getHighestWaveEachDayResponse(): Promise<string> {
    const highestWaveEachDayArray: Array<waveObject> = await getHighestWaveEachDay();
    return highestWaveEachDayResponse(highestWaveEachDayArray);
}

export async function getWavesOverThreeFeetResponse(): Promise<string> {
    const highestWavesArray: Array<waveObject> = await getHighestWaveEachDay();
    return wavesOverThreeFeetResponse(highestWavesArray);
}

export async function getTodayWaveResponse(): Promise<string> {
    const highestWavesArray: Array<waveObject> = await getHighestWaveEachDay();
    return todayWaveResponse(highestWavesArray);
}

export async function getChartUrl(): Promise<string> {
    const waveArray: Array<waveObject> = await getMaxWaves();
    return chartUrl(waveArray);
}

export async function getChartHighestWaveEachDayUrl(): Promise<string> {
    const highestWaveArray: Array<waveObject> = await getHighestWaveEachDay();
    return chartHighestWaveEachDayUrl(highestWaveArray);
}

//functions that don't require api call for unit testing
export function initialResponse(waveArray: Array<waveObject>): string {
    for (const wave of waveArray) {
        if (wave.swell.absMaxBreakingHeight >= 3) return "Looks like there will be some good waves this week. Would you like to know anything else?";
    }
    return "There aren't any good waves this week. would you like to know anything else?";
}

export function highestWaveResponse(waveArray: Array<waveObject>): string {
    const maxWave: waveObject = waveArray.reduce((prev: waveObject, current: waveObject) => (prev.swell.absMaxBreakingHeight > current.swell.absMaxBreakingHeight) ? prev : current);
    return `The highest waves this week will be ${maxWave.swell.absMaxBreakingHeight} feet high ${getDayString(maxWave.timestamp*1000)} at ${getTimeString(maxWave.timestamp*1000)}.`;
}

export function highestWaveEachDayResponse(highestWaveEachDayArray: Array<waveObject>): string {
    let response: string = ""
    highestWaveEachDayArray.forEach(wave => {
        response += getDayString(wave.timestamp*1000) + " the waves will have a max height of " + 
        wave.swell.absMaxBreakingHeight + " feet at " +
        getTimeString(wave.timestamp*1000) + ". ";
    });
    return response;
}

export function wavesOverThreeFeetResponse(waveArray: Array<waveObject>) {
    let response: string = "";
    for (const wave of waveArray) {
        if (wave.swell.absMaxBreakingHeight >= 3) {
            response += getDayString(wave.timestamp*1000) + " the waves will have a max height of " + 
            wave.swell.absMaxBreakingHeight + " feet at " + 
            getTimeString(wave.timestamp*1000) + ". ";
        }
    }
    return response;
}

export function todayWaveResponse(highestWaveArray: Array<waveObject>): string {
    const todayWave: waveObject = highestWaveArray[0];
    return `The highest waves today will be ${todayWave.swell.absMaxBreakingHeight} feet at ${getTimeString(todayWave.timestamp*1000)}.`;
}

export function chartUrl(waveArray: Array<waveObject>): string {
    waveArray.sort((a, b) => (new Date(a.timestamp*1000).getHours())>=new Date(b.timestamp*1000).getHours() ? 1:-1);

    let dataLabels: string = `&chxl=0:|`;
    let dataString: string = '&chd=a:';
    for(let i: number = 0; i < 5; i++) dataLabels+=`${getDayString(waveArray[i].timestamp*1000)}|`;

    dataString += waveArray.reduce((acc: Array<Array<waveObject>>, curr) => {
        if (acc[0].length === 0) return acc = [[curr]];
        if (new Date(curr.timestamp*1000).getHours() != new Date(acc[acc.length-1][0].timestamp*1000).getHours()) acc.push([]);
        acc[acc.length-1].push(curr);
        return acc;
    }, [[]]).map(waveArr => waveArr.map(wave => wave.swell.absMaxBreakingHeight)).join('|');
    
    return `https://image-charts.com/chart?cht=bvg&chs=700x150&chxr=1,.5,5&chxt=x,y&chco=1869b7${dataLabels}${dataString}`;
}

export function chartHighestWaveEachDayUrl(highestWaveArray: Array<waveObject>): string {
    let dataString: string = `&chd=a:`;
    let dataLabels: string = `&chxl=0:|`;
    highestWaveArray.forEach(wave => {
        dataString+= `${wave.swell.absMaxBreakingHeight},`;
        dataLabels+= `${getDayString(wave.timestamp*1000)}|`;
    });
    return `https://image-charts.com/chart?cht=bvg&chs=700x150&chxr=1,.5,5&chxt=x,y&chco=1869b7${dataLabels}${dataString}`;
}

//Helper Functions
export async function getHighestWaveEachDay(): Promise<Array<waveObject>> {
    const data: Array<waveObject> = await getMaxWaves();
    return highestWaveEachDay(data);
}

export function highestWaveEachDay(waveArray: Array<waveObject>): Array<waveObject> {
    waveArray.sort((a, b) => (a.swell.absMaxBreakingHeight > b.swell.absMaxBreakingHeight) ? 1 : -1);

    const highestWavesObject = Object.assign({}, ...waveArray.map(wave => ({[getDayString(wave.timestamp*1000)]: wave})));

    const highestWavesArray: Array<waveObject> = Object.values(highestWavesObject);

    return highestWavesArray.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1);
}

export function getDayString(timestamp: number): string {
    const today: Date = new Date();
    today.setHours(today.getHours() - 2);
    const waveDate: Date = new Date(timestamp);

    if(today.getDate() === waveDate.getDate()) {
        return "today";
    }
    
    today.setDate(today.getDate() + 1)
    if(today.getDate() === waveDate.getDate()) {
        return "tommorow";
    }

    return day[waveDate.getDay()];
}

export function getTimeString(timestamp: number): string {
    return new Date(timestamp).toLocaleString('en-US', { hour: 'numeric', hour12: true });
}