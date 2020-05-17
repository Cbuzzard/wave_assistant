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

interface wavesData {
    highestWave: highestWave,
    todayWave: todayWave,
    chart: string
}

interface highestWave {
    waveHeight: number,
    day: day,
    time: string
}

interface todayWave {
    waveHeight: number,
    time: string
}

export async function getWavesData(): Promise<wavesData> {
    const data: Array<myJson> = await getMaxWaves();

    const finalData = {
        highestWave: getHighestWave(data),
        todayWave: getTodayWave(data),
        chart: getChart(data)
    }

    return finalData;
}

function getHighestWave(data: Array<myJson>): highestWave {
    
    //finds wave object with highest wave
    const max = data.reduce((prev: myJson, current: myJson) => (prev.swell.absMaxBreakingHeight > current.swell.absMaxBreakingHeight) ? prev : current);

    //date objecct to retrieve day index and get formated hour/time
    const date = (): Date => {return new Date(max.timestamp * 1000)};
    
    const returnData: highestWave = {
        waveHeight: max.swell.absMaxBreakingHeight,
        day: date().getDay(),
        time: date().toLocaleString('en-US', { hour: 'numeric', hour12: true })
    }

    return returnData;
}

function getTodayWave(data: Array<myJson>): todayWave {

    const date = (timestamp: number) => {return new Date(timestamp * 1000)}
    const today = new Date().getDay()

    const allWavesToday: Array<myJson> = [];

    for (let i = 0; date(data[i].timestamp).getDay() === today; i++) {
        allWavesToday.push(data[i]);
    }

    const todayMax = allWavesToday.reduce((prev: myJson, current: myJson) => (prev.swell.absMaxBreakingHeight > current.swell.absMaxBreakingHeight) ? prev : current);

    const returnData: todayWave = {
        waveHeight: todayMax.swell.absMaxBreakingHeight,
        time: date(todayMax.timestamp).toLocaleString('en-US', { hour: 'numeric', hour12: true })
    }

    return returnData;
}

function getChart(data: Array<myJson>): string {
    
    //used to store all wave heights. used for formatting
    const waveHeightArray: Array<Array<number>> = [
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ]
    
    //populates the waveHeightArray
    for (let item of data) {
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

    //handles pushing data from today to saturday
    for (let i = startIndex; i < waveHeightArray.length && !(waveHeightArray[i].length === 0); i++) {
        for (let j = 0; j < waveHeightArray[i].length; j++) {
            formatedData[j].push(waveHeightArray[i][j]);
        }
        dayAxis.push(i);
    }

    //handles all data not pushed by the for loop. will start at 0 and stop at an empty index
    for (let i = 0; i < waveHeightArray.length && !(waveHeightArray[i].length === 0); i++) {
        for (let j = 0; j < waveHeightArray[i].length; j++) {
            formatedData[j].push(waveHeightArray[i][j]);
        }
        dayAxis.push(i);
    }

    //chart api needs each piece of data to have commas between them so this array will store 
    //each column group in "1,2,3,4" format.
    const stringData: Array<string> = [];

    for (const array of formatedData) {
        stringData.push(array.join(','));
    }

    dayAxis = `&chxl=0:|${dayAxis.join('|')}`;
    const finalDataString: string = `&chd=a:${stringData.join('|')}`;
    
    return `https://image-charts.com/chart?cht=bvg&chs=700x150&chxr=1,.5,5&chxt=x,y&chco=1869b7${dayAxis}${finalDataString}`
}