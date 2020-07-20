import {getMaxWaves, myJson} from './api_fetch'

export enum day {
    Sunday,
    Monday, 
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}

export async function getInitialResponse() {
    const data: Array<myJson> = await getMaxWaves();
    for (const d of data) {
        if (d.swell.absMaxBreakingHeight >= 3) {
            return "Looks like there will be some good waves this week. Would you like to know anything else?"
        }
    }
    return "There aren't any good waves this week. would you like to know anything else?"
}

export async function getHighestWave(): Promise<string> {

    const data: Array<myJson> = await getMaxWaves();
    
    const maxWave = data.reduce((prev: myJson, current: myJson) => (prev.swell.absMaxBreakingHeight > current.swell.absMaxBreakingHeight) ? prev : current);
    
    const response = `The highest waves this week will be 
        ${maxWave.swell.absMaxBreakingHeight} feet high 
        ${getDayString(maxWave.timestamp*1000)} at 
        ${getTimeString(maxWave.timestamp*1000)}.`;

    return response;
}

export async function getHighestWaveEachDay(): Promise<string> {

    const data: Array<myJson> = await getMaxWaves();

    const highestWaveForEachDay = new Map();
    
    for (const d of data) {
        const dayString: day = new Date(d.timestamp * 1000).getDay()
        if (highestWaveForEachDay.get(dayString) < d.swell.absMaxBreakingHeight || !(highestWaveForEachDay.has(dayString))) {
            highestWaveForEachDay.set(dayString, d);
        }
    }
    
    let response: string = "";
    const highestWavesArray: Array<myJson> = [];

    highestWaveForEachDay.forEach((value: myJson, key: day) => {
        highestWavesArray.push(value)
    });

    highestWavesArray.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1)

    for (const wave of highestWavesArray) {
        response += getDayString(wave.timestamp*1000) + " the waves will have a maxWave height of " + 
        wave.swell.absMaxBreakingHeight + " feet at " + 
        getTimeString(wave.timestamp*1000) + ". ";
    }

    return response;

}

export async function getWavesOverThreeFeet() {

    const data: Array<myJson> = await getMaxWaves();

    const highestWaveForEachDay = new Map();
    
    for (const d of data) {
        const dayString: day = new Date(d.timestamp * 1000).getDay()
        if (d.swell.absMaxBreakingHeight >= 3) {
            if (highestWaveForEachDay.get(dayString) < d.swell.absMaxBreakingHeight || !(highestWaveForEachDay.has(dayString))) {
                highestWaveForEachDay.set(dayString, d);
            }
        }
    }

    let response: string = "";
    const highestWavesArray: Array<myJson> = [];

    highestWaveForEachDay.forEach((value: myJson, key: day) => {
        highestWavesArray.push(value)
    });

    highestWavesArray.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1)

    for (const wave of highestWavesArray) {
        response += getDayString(wave.timestamp*1000) + " the waves will have a maxWave height of " + 
        wave.swell.absMaxBreakingHeight + " feet at " + 
        getTimeString(wave.timestamp*1000) + ". ";
    }

    return response;

}

export async function getTodayWave(): Promise<string> {

    const data: Array<myJson> = await getMaxWaves();

    const allWavesToday: Array<myJson> = [];

    for (let i = 0; getDayString(data[i].timestamp*1000) === 'today'; i++) { allWavesToday.push(data[i]); }

    const todayMax = allWavesToday.reduce((prev: myJson, current: myJson) => (prev.swell.absMaxBreakingHeight > current.swell.absMaxBreakingHeight) ? prev : current);

    const response = `The highest waves today will be ${todayMax.swell.absMaxBreakingHeight} at ${getTimeString(todayMax.timestamp*1000)}.`

    return response;
}

export async function getChart(): Promise<string> {

    const data: Array<myJson> = await getMaxWaves();
    
    const waveHeightArray: Array<Array<number>> = [
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ]
    
    for (const item of data) {
        const waveDay: day = new Date(item.timestamp * 1000).getDay();
        waveHeightArray[waveDay].push(item.swell.absMaxBreakingHeight);
    }

    const startIndex: number = new Date().getDay();
    const formatedData: Array<Array<number>> = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ]
    let dayAxis: Array<day> | string = []

    for (let i = startIndex; i < waveHeightArray.length && !(waveHeightArray[i].length === 0); i++) {
        for (let j = 0; j < waveHeightArray[i].length; j++) {
            formatedData[j].push(waveHeightArray[i][j]);
        }
        dayAxis.push(i);
    }

    for (let i = 0; i < waveHeightArray.length && !(waveHeightArray[i].length === 0); i++) {
        for (let j = 0; j < waveHeightArray[i].length; j++) {
            formatedData[j].push(waveHeightArray[i][j]);
        }
        dayAxis.push(i);
    }

    const stringData: Array<string> = [];

    for (const array of formatedData) {
        stringData.push(array.join(','));
    }

    dayAxis = `&chxl=0:|${dayAxis.join('|')}`;
    const finalDataString: string = `&chd=a:${stringData.join('|')}`;
    
    return `https://image-charts.com/chart?cht=bvg&chs=700x150&chxr=1,.5,5&chxt=x,y&chco=1869b7${dayAxis}${finalDataString}`
}

function getDayString(timestamp: number): string {
    const today: Date = new Date();
    today.setHours(today.getHours() - 2);
    const waveDate: Date = new Date(timestamp);

    if(today.getDay() === waveDate.getDay()) {
        return "today";
    }
    
    if(today.getDay()+1 === waveDate.getDay()) {
        return "tommorow";
    }

    return day[waveDate.getDay()];
}

function getTimeString(timestamp: number): string {
    return new Date(timestamp).toLocaleString('en-US', { hour: 'numeric', hour12: true })
}