import "jasmine";
import { wave } from "../src/api_fetch"
import * as format from "../src/format_data"

describe("highestWaveEachDay", () => {
    const waveArray: Array<wave>  =[{"timestamp":1595656800,"swell":{"absMaxBreakingHeight":0.5}},{"timestamp":1595667600,"swell":{"absMaxBreakingHeight":0.4}},{"timestamp":1595678400,"swell":{"absMaxBreakingHeight":0.3}},{"timestamp":1595689200,"swell":{"absMaxBreakingHeight":0.2}},{"timestamp":1595700000,"swell":{"absMaxBreakingHeight":0.1}},{"timestamp":1595710800,"swell":{"absMaxBreakingHeight":0}},{"timestamp":1595721600,"swell":{"absMaxBreakingHeight":0.15}},{"timestamp":1595732400,"swell":{"absMaxBreakingHeight":0.25}},{"timestamp":1595743200,"swell":{"absMaxBreakingHeight":0.45}}, {"timestamp":1595743200,"swell":{"absMaxBreakingHeight":1}}, {"timestamp":1595743200,"swell":{"absMaxBreakingHeight":2}}];
    it("should return return array with 2 waves with heights .5 and 2", () => {
        expect(format.highestWaveEachDay(waveArray)).toEqual([{"timestamp":1595656800,"swell":{"absMaxBreakingHeight":0.5}},{"timestamp":1595743200,"swell":{"absMaxBreakingHeight":2}}]);
    });

    const waveArray2: Array<wave>  =[{"timestamp":1595656800,"swell":{"absMaxBreakingHeight":0}}, {"timestamp":1595743200,"swell":{"absMaxBreakingHeight":0}}];
    it("should still return zero heigh waves if they are the heighest waves", () => {
        expect(format.highestWaveEachDay(waveArray2)).toEqual([{"timestamp":1595656800,"swell":{"absMaxBreakingHeight":0}}, {"timestamp":1595743200,"swell":{"absMaxBreakingHeight":0}}]);
    });

    const waveArray3: Array<wave>  =[{"timestamp":1595656800,"swell":{"absMaxBreakingHeight":0.5}}, {"timestamp":1595649600,"swell":{"absMaxBreakingHeight":2}}];
    it("should equal the wave at the very begining of the day", () => {
        expect(format.highestWaveEachDay(waveArray3)).toEqual([{"timestamp":1595649600,"swell":{"absMaxBreakingHeight":2}}]);
    });

    const waveArray4: Array<wave>  =[{"timestamp":1595649600,"swell":{"absMaxBreakingHeight":0.5}}, {"timestamp":1595649599,"swell":{"absMaxBreakingHeight":2}}];
    it("should equal two waves even though they a second appart", () => {
        expect(format.highestWaveEachDay(waveArray4)).toEqual([{"timestamp":1595649599,"swell":{"absMaxBreakingHeight":2}}, {"timestamp":1595649600,"swell":{"absMaxBreakingHeight":0.5}}]);
    });
});

describe("getDayString", () => {;
    const currentDate = new Date().getTime()
    it("should return the string 'today'", () => {
        expect(format.getDayString(currentDate)).toEqual("today");
    })

    const tommorowDate = new Date();
    tommorowDate.setDate(tommorowDate.getDate() + 1);
    it("should return the string 'today'", () => {
        expect(format.getDayString(tommorowDate.getTime())).toEqual("tommorow");
    })

    it("should return the string 'sunday'", () => {
        expect(format.getDayString(1594526400000)).toEqual("Sunday");
    })
})

describe("getTimeString", () => {
    it("should return string saying 12 AM", () => {
        expect(format.getTimeString(1594612800000)).toEqual("12 AM")
    })

    it("should return string saying 11 PM", () => {
        expect(format.getTimeString(1594695600000)).toEqual("11 PM")
    })
})

describe("initialResponse", () => {
    const waveArray: Array<wave>  =[{"timestamp":1595649600,"swell":{"absMaxBreakingHeight":2}}];
    it("should return no good waves", () => {
        expect(format.initialResponse(waveArray)).toEqual("There aren't any good waves this week. would you like to know anything else?");
    })

    const waveArray2: Array<wave>  =[{"timestamp":1595649600,"swell":{"absMaxBreakingHeight":5}}];
    it("should return that there are good waves", () => {
        expect(format.initialResponse(waveArray2)).toEqual("Looks like there will be some good waves this week. Would you like to know anything else?");
    })

    const waveArray3: Array<wave>  =[{"timestamp":1595649600,"swell":{"absMaxBreakingHeight":3}}];
    it("edge case should return that there are good waves", () => {
        expect(format.initialResponse(waveArray3)).toEqual("Looks like there will be some good waves this week. Would you like to know anything else?");
    })
})

describe("highestWaveResponse", () => {
    const waveArray: Array<wave>  =[{"timestamp":1595649600,"swell":{"absMaxBreakingHeight":2}}, {"timestamp":1594526400,"swell":{"absMaxBreakingHeight":5}}];
    it("should say the highest waves will be 5ft", () => {
        expect(format.highestWaveResponse(waveArray)).toEqual("The highest waves this week will be 5 feet high Sunday at 12 AM.")
    })
})

describe("highestWaveEachDayResponse", () => {
    const waveArray: Array<wave>  =[{"timestamp":1594526400,"swell":{"absMaxBreakingHeight":5}}, {"timestamp":1594612800,"swell":{"absMaxBreakingHeight":3}}];
    it("should say the highest waves will be 5ft", () => {
        expect(format.highestWaveEachDayResponse(waveArray)).toEqual("Sunday the waves will have a max height of 5 feet at 12 AM. Monday the waves will have a max height of 3 feet at 12 AM. ")
    })

    const waveArray2: Array<wave>  =[{"timestamp":1594526400,"swell":{"absMaxBreakingHeight":5}}, {"timestamp":1594612800,"swell":{"absMaxBreakingHeight":3}}, {"timestamp":1594612800,"swell":{"absMaxBreakingHeight":4}}];
    it("should not eliminate any waves from given array", () => {
        expect(format.highestWaveEachDayResponse(waveArray2) === "Sunday the waves will have a max height of 5 feet at 12 AM. Monday the waves will have a max height of 3 feet at 12 AM. ").toBeFalse()
    })
})

describe("wavesOverThreeFeetResponse", () => {
    const waveArray: Array<wave>  =[{"timestamp":1595649600,"swell":{"absMaxBreakingHeight":2}}, {"timestamp":1594526400,"swell":{"absMaxBreakingHeight":5}}];
    it("should say the highest waves will be 5ft", () => {
        expect(format.wavesOverThreeFeetResponse(waveArray)).toEqual("Sunday the waves will have a max height of 5 feet at 12 AM. ")
    })

    const waveArray2: Array<wave>  =[{"timestamp":1595649600,"swell":{"absMaxBreakingHeight":2}}, {"timestamp":1594526400,"swell":{"absMaxBreakingHeight":3}}];
    it("edge case should say the highest waves will be 3ft", () => {
        expect(format.wavesOverThreeFeetResponse(waveArray2)).toEqual("Sunday the waves will have a max height of 3 feet at 12 AM. ")
    })
})

describe("todayWaveResponse", () => {
    const waveArray: Array<wave>  =[{"timestamp":1595649600,"swell":{"absMaxBreakingHeight":2}}, {"timestamp":1594526400,"swell":{"absMaxBreakingHeight":5}}];
    it("should say the highest wave today is 2ft", () => {
        expect(format.todayWaveResponse(waveArray)).toEqual("The highest waves today will be 2 feet at 12 AM.")
    })

    const waveArray2: Array<wave>  =[{"timestamp":1594526400,"swell":{"absMaxBreakingHeight":3}}, {"timestamp":1595649600,"swell":{"absMaxBreakingHeight":2}}];
    it("should say the highest wave today is 3ft", () => {
        expect(format.todayWaveResponse(waveArray2)).toEqual("The highest waves today will be 3 feet at 12 AM.")
    })
})

describe("chartUrl", () => {
    const waveArray: Array<wave> = [{"timestamp":1595656800,"swell":{"absMaxBreakingHeight":0.55}},{"timestamp":1595667600,"swell":{"absMaxBreakingHeight":0.47}},{"timestamp":1595678400,"swell":{"absMaxBreakingHeight":0.47}},{"timestamp":1595689200,"swell":{"absMaxBreakingHeight":0.5}},{"timestamp":1595700000,"swell":{"absMaxBreakingHeight":0.21}},{"timestamp":1595710800,"swell":{"absMaxBreakingHeight":0.41}},{"timestamp":1595721600,"swell":{"absMaxBreakingHeight":0.48}},{"timestamp":1595732400,"swell":{"absMaxBreakingHeight":0.52}},{"timestamp":1595743200,"swell":{"absMaxBreakingHeight":0.45}},{"timestamp":1595754000,"swell":{"absMaxBreakingHeight":0.43}},{"timestamp":1595764800,"swell":{"absMaxBreakingHeight":0.49}},{"timestamp":1595775600,"swell":{"absMaxBreakingHeight":0.57}},{"timestamp":1595786400,"swell":{"absMaxBreakingHeight":0.64}},{"timestamp":1595797200,"swell":{"absMaxBreakingHeight":0.62}},{"timestamp":1595808000,"swell":{"absMaxBreakingHeight":0.65}},{"timestamp":1595818800,"swell":{"absMaxBreakingHeight":0.63}},{"timestamp":1595829600,"swell":{"absMaxBreakingHeight":0.54}},{"timestamp":1595840400,"swell":{"absMaxBreakingHeight":0.67}},{"timestamp":1595851200,"swell":{"absMaxBreakingHeight":0.84}},{"timestamp":1595862000,"swell":{"absMaxBreakingHeight":0.91}},{"timestamp":1595872800,"swell":{"absMaxBreakingHeight":0.98}},{"timestamp":1595883600,"swell":{"absMaxBreakingHeight":0.97}},{"timestamp":1595894400,"swell":{"absMaxBreakingHeight":1.15}},{"timestamp":1595905200,"swell":{"absMaxBreakingHeight":1.1}},{"timestamp":1595916000,"swell":{"absMaxBreakingHeight":0.59}},{"timestamp":1595926800,"swell":{"absMaxBreakingHeight":0.71}},{"timestamp":1595937600,"swell":{"absMaxBreakingHeight":0.76}},{"timestamp":1595948400,"swell":{"absMaxBreakingHeight":0.71}},{"timestamp":1595959200,"swell":{"absMaxBreakingHeight":0.57}},{"timestamp":1595970000,"swell":{"absMaxBreakingHeight":0.48}},{"timestamp":1595980800,"swell":{"absMaxBreakingHeight":0.49}},{"timestamp":1595991600,"swell":{"absMaxBreakingHeight":0.49}},{"timestamp":1596002400,"swell":{"absMaxBreakingHeight":0.46}},{"timestamp":1596013200,"swell":{"absMaxBreakingHeight":0.45}},{"timestamp":1596024000,"swell":{"absMaxBreakingHeight":0.36}},{"timestamp":1596034800,"swell":{"absMaxBreakingHeight":0.38}},{"timestamp":1596045600,"swell":{"absMaxBreakingHeight":0.42}},{"timestamp":1596056400,"swell":{"absMaxBreakingHeight":0.42}},{"timestamp":1596067200,"swell":{"absMaxBreakingHeight":0.55}},{"timestamp":1596078000,"swell":{"absMaxBreakingHeight":0.29}}]
    it("should properly format data into chart url", () => {
        expect(format.chartUrl(waveArray)).toEqual("https://image-charts.com/chart?cht=bvg&chs=700x150&chxr=1,.5,5&chxt=x,y&chco=1869b7&chxl=0:|today|tommorow|Monday|Tuesday|Wednesday|&chd=a:0.55,0.45,0.54,0.59,0.46|0.47,0.43,0.67,0.71,0.45|0.47,0.49,0.84,0.76,0.36|0.5,0.57,0.91,0.71,0.38|0.21,0.64,0.98,0.57,0.42|0.41,0.62,0.97,0.48,0.42|0.48,0.65,1.15,0.49,0.55|0.52,0.63,1.1,0.49,0.29")
    })
})

describe("chartHighestWaveEachDayUrl", () => {
    const waveArray: Array<wave> = [{ timestamp: 1595656800, swell: { absMaxBreakingHeight: 0.55 } },{ timestamp: 1595808000, swell: { absMaxBreakingHeight: 0.65 } },{ timestamp: 1595894400, swell: { absMaxBreakingHeight: 1.15 } },{ timestamp: 1595937600, swell: { absMaxBreakingHeight: 0.76 } },{ timestamp: 1596067200, swell: { absMaxBreakingHeight: 0.55 } }]
    it("should properly format data into chart url", () => {
        expect(format.chartHighestWaveEachDayUrl(waveArray)).toEqual("https://image-charts.com/chart?cht=bvg&chs=700x150&chxr=1,.5,5&chxt=x,y&chco=1869b7&chxl=0:|today|tommorow|Monday|Tuesday|Wednesday|&chd=a:0.55,0.65,1.15,0.76,0.55,")
    })
})


