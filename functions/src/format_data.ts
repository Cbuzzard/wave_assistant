import {getMaxWaves, wave} from './api_fetch'

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
export async function getInitialResponse() {
    const data: Array<wave> = await getMaxWaves();
    return intialResponse(data)
}

export async function getHighestWaveResponse(): Promise<string> {
    const highestWavesArray: Array<wave> = await getHighestWaveEachDay();
    return highestWaveResponse(highestWavesArray);
}

export async function getHighestWaveEachDayResponse(): Promise<string> {
    const highestWaveEachDayArray: Array<wave> = await getHighestWaveEachDay();
    return highestWaveEachDayResponse(highestWaveEachDayArray);
}

export async function getWavesOverThreeFeetResponse() {
    const highestWavesArray: Array<wave> = await getHighestWaveEachDay();
    return wavesOverThreeFeetResponse(highestWavesArray);
}

export async function getTodayWaveResponse(): Promise<string> {
    const highestWavesArray: Array<wave> = await getHighestWaveEachDay();
    return todayWaveResponse(highestWavesArray);
}

export async function getChartUrl() {
    const waveArray: Array<wave> = await getMaxWaves();
    return chartUrl(waveArray)
}

export async function getChartHighestWaveEachDayUrl() {
    const highestWaveArray: Array<wave> = await getHighestWaveEachDay();
    return chartHighestWaveEachDayUrl(highestWaveArray)
}

//functions that don't require api call for unit testing
function intialResponse(waveArray: Array<wave>): string {
    for (const wave of waveArray) {
        if (wave.swell.absMaxBreakingHeight >= 3) return "Looks like there will be some good waves this week. Would you like to know anything else?"
    }
    return "There aren't any good waves this week. would you like to know anything else?"
}

function highestWaveResponse(waveArray: Array<wave>): string {
    const maxWave = waveArray.reduce((prev: wave, current: wave) => (prev.swell.absMaxBreakingHeight > current.swell.absMaxBreakingHeight) ? prev : current);
    return `The highest waves this week will be 
        ${maxWave.swell.absMaxBreakingHeight} feet high 
        ${getDayString(maxWave.timestamp*1000)} at 
        ${getTimeString(maxWave.timestamp*1000)}.`;
}

function highestWaveEachDayResponse(highestWaveEachDayArray: Array<wave>): string {
    let response = ""
    highestWaveEachDayArray.forEach(wave => {
        response += getDayString(wave.timestamp*1000) + " the waves will have a maxWave height of " + 
        wave.swell.absMaxBreakingHeight + " feet at " + 
        getTimeString(wave.timestamp*1000) + ". "
    })
    return response
}

function wavesOverThreeFeetResponse(waveArray: Array<wave>) {
    let response = ""
    for (const wave of waveArray) {
        if (wave.swell.absMaxBreakingHeight >= 3) {
            response += getDayString(wave.timestamp*1000) + " the waves will have a maxWave height of " + 
            wave.swell.absMaxBreakingHeight + " feet at " + 
            getTimeString(wave.timestamp*1000) + ". ";
        }
    }
    return response;
}

function todayWaveResponse(highestWaveArray: Array<wave>): string {
    const todayWave = highestWaveArray[0];
    return `The highest waves today will be ${todayWave.swell.absMaxBreakingHeight} at ${getTimeString(todayWave.timestamp*1000)}.`
}

function chartUrl(waveArray: Array<wave>): string {
    waveArray.sort((a, b) => (new Date(a.timestamp*1000).getHours())>=new Date(b.timestamp*1000).getHours() ? 1:-1)

    let dataLabels = `&chxl=0:|`;
    for(let i = 0; i < 5; i++) dataLabels+=`${getDayString(waveArray[i].timestamp*1000)}|`
    let dataString: string = '&chd=a:'

    dataString += waveArray.reduce((acc: Array<Array<wave>>, curr) => {
        if (acc[0].length === 0) return acc = [[curr]]
        if (new Date(curr.timestamp*1000).getHours() != new Date(acc[acc.length-1][0].timestamp*1000).getHours()) acc.push([])
        acc[acc.length-1].push(curr)
        return acc
    }, [[]]).map(waveArr => waveArr.map(wave => wave.swell.absMaxBreakingHeight)).join('|')
    
    return `https://image-charts.com/chart?cht=bvg&chs=700x150&chxr=1,.5,5&chxt=x,y&chco=1869b7${dataLabels}${dataString}`
}

function chartHighestWaveEachDayUrl(highestWaveArray: Array<wave>): string {
    let dataString = `&chd=a:`;
    let dataLabels = `&chxl=0:|`;
    highestWaveArray.forEach(wave => {
        dataString+= `${wave.swell.absMaxBreakingHeight},`
        dataLabels+= `${getDayString(wave.timestamp*1000)}|`
    })
    return `https://image-charts.com/chart?cht=bvg&chs=700x150&chxr=1,.5,5&chxt=x,y&chco=1869b7${dataLabels}${dataString}`
}

//Helper Functions
async function getHighestWaveEachDay(): Promise<Array<wave>> {
    const data: Array<wave> = await getMaxWaves();

    data.sort((a, b) => (a.swell.absMaxBreakingHeight > b.swell.absMaxBreakingHeight) ? 1 : -1)

    let highestWavesObject = Object.assign({}, ...data.map(wave => ({[getDayString(wave.timestamp*1000)]: wave})))

    const highestWavesArray: Array<wave> = Object.values(highestWavesObject)

    return highestWavesArray.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1)
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