import * as functions from 'firebase-functions';
import {getWavesData, day} from './format_data';
import {dialogflow, SimpleResponse, Image, BasicCard} from 'actions-on-google';

const app = dialogflow({ debug: true });

app.intent('how are the waves', async (conv) => {
    
    const waves = await getWavesData();
    
    conv.close(new SimpleResponse({
        text: `The highest waves this week will be ${waves.highestWave.waveHeight} feet high on ${day[waves.highestWave.day]} at ${waves.highestWave.time}.`,
        speech: `The highest waves this week will be ${waves.highestWave.waveHeight} feet high on ${day[waves.highestWave.day]} at ${waves.highestWave.time}.`
    }))

    conv.close(new BasicCard({
        text: `The highest waves this week will be ${waves.highestWave.waveHeight} feet high on ${day[waves.highestWave.day]} at ${waves.highestWave.time}.`,
        image: new Image({
            url: waves.chart,
            alt: 'BuzzardsView.com'
        })
    }))
});


export const fulfillment = functions.https.onRequest(app);