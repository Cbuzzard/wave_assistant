import * as functions from 'firebase-functions';
import {getHighestWave, getChart, getHighestWaveEachDay} from './format_data';
import {dialogflow, SimpleResponse, Image, BasicCard} from 'actions-on-google';

const app = dialogflow({ debug: true });

app.intent('how are the waves', async (conv) => {
    
    const wave: string = await getHighestWave();
    const chart: string = await getChart();
    
    conv.close(new SimpleResponse({
        text: wave,
        speech: wave
    }))

    conv.close(new BasicCard({
        text: wave,
        image: new Image({
            url: chart,
            alt: 'BuzzardsView.com'
        })
    }))
});

app.intent('waves each day', async (conv) => {
    const waves = await getHighestWaveEachDay();

    conv.close(new SimpleResponse({
        text: waves,
        speech: waves
    }));

});

export const fulfillment = functions.https.onRequest(app);