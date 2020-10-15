import * as functions from 'firebase-functions';
import {getHighestWaveResponse, getHighestWaveEachDayResponse, getWavesOverThreeFeetResponse, getInitialResponse, getTodayWaveResponse} from './format_data';
import {dialogflow, SimpleResponse} from 'actions-on-google';

const app = dialogflow({ debug: true });

app.intent('how are the waves', async (conv) => {
    
    const response: string = await getInitialResponse();
    
    conv.ask(new SimpleResponse({
        text: response,
        speech: response
    }));
});

app.intent('waves each day', async (conv) => {
    const waves = await getHighestWaveEachDayResponse();

    conv.close(new SimpleResponse({
        text: waves,
        speech: waves
    }));

});

app.intent('best waves', async (conv) => {
    const waves = await getWavesOverThreeFeetResponse();

    conv.close(new SimpleResponse({
        text: waves,
        speech: waves
    }));

});

app.intent('best wave', async (conv) => {
    const waves = await getHighestWaveResponse();

    conv.close(new SimpleResponse({
        text: waves,
        speech: waves
    }));

});

app.intent('waves today', async (conv) => {
    const waves = await getTodayWaveResponse();

    conv.close(new SimpleResponse({
        text: waves,
        speech: waves
    }));

});

export const fulfillment = functions.https.onRequest(app);