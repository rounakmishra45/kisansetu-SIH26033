// ==============================================================================
// KisanSetu B2B - Bhashini National Language Translation Mission Service
// Implements MeitY's official ULCA two-step ASR (Speech-to-Text) pipeline
// ==============================================================================

import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const ULCA_CONFIG_URL = 'https://meity-auth.ulca.gov.in/ulca/apis/v0/model/getModelsPipeline';

/**
 * Step 1: Query ULCA Gateway to obtain dynamic serviceId, callbackUrl,
 * and inference authentication tokens for the requested vernacular language.
 */
export async function getPipelineConfig(sourceLanguage = 'hi') {
  const userId = process.env.BHASHINI_USER_ID;
  const ulcaApiKey = process.env.BHASHINI_ULCA_API_KEY;
  const pipelineId = process.env.BHASHINI_PIPELINE_ID || '64392f96daac500b55c543d6';

  // Check if real credentials are provided
  if (!userId || !ulcaApiKey || ulcaApiKey === 'your_bhashini_ulca_api_key') {
    return { isMock: true, sourceLanguage };
  }

  try {
    const payload = {
      pipelineTasks: [
        {
          taskType: 'asr',
          config: {
            language: {
              sourceLanguage: sourceLanguage
            }
          }
        },
        {
          taskType: 'translation',
          config: {
            language: {
              sourceLanguage: sourceLanguage,
              targetLanguage: 'en'
            }
          }
        }
      ],
      pipelineRequestConfig: {
        pipelineId: pipelineId
      }
    };

    const response = await axios.post(ULCA_CONFIG_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'userId': userId,
        'ulcaApiKey': ulcaApiKey
      },
      timeout: 8000
    });

    const pipelineResponseConfig = response.data?.pipelineResponseConfig || [];
    const asrConfig = pipelineResponseConfig.find(task => task.taskType === 'asr');
    const callbackUrl = response.data?.pipelineInferenceAPIEndPoint?.callbackUrl;
    const inferenceApiKey = response.data?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value;

    return {
      isMock: false,
      serviceId: asrConfig?.config?.[0]?.serviceId,
      callbackUrl: callbackUrl,
      inferenceApiKey: inferenceApiKey,
      sourceLanguage: sourceLanguage
    };
  } catch (error) {
    console.warn('[Bhashini Config Warning] Failed to reach ULCA gateway, falling back to mock pipeline:', error.message);
    return { isMock: true, sourceLanguage };
  }
}

/**
 * Step 2: Compute Call to Bhashini Inference API sending Base64-encoded audio.
 */
export async function computeASR({ audioBase64, serviceId, callbackUrl, inferenceApiKey, sourceLanguage = 'hi' }) {
  try {
    const payload = {
      pipelineTasks: [
        {
          taskType: 'asr',
          config: {
            language: {
              sourceLanguage: sourceLanguage
            },
            serviceId: serviceId,
            audioFormat: 'wav',
            samplingRate: 16000
          }
        }
      ],
      inputData: {
        audio: [
          {
            audioContent: audioBase64
          }
        ]
      }
    };

    const response = await axios.post(callbackUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': inferenceApiKey
      },
      timeout: 10000
    });

    const outputTasks = response.data?.pipelineResponse || [];
    const asrOutput = outputTasks.find(t => t.taskType === 'asr');
    const recognizedText = asrOutput?.output?.[0]?.source || '';

    return {
      success: true,
      text: recognizedText,
      language: sourceLanguage,
      provider: 'BHASHINI_DHRUVA_ULCA'
    };
  } catch (error) {
    console.warn('[Bhashini Compute Error] Inference failed:', error.message);
    throw error;
  }
}

/**
 * High-level orchestration function:
 * Downloads voice note from Twilio MediaUrl, converts to Base64, and transcribes.
 */
export async function transcribeAudioFromUrl(mediaUrl, sourceLanguage = 'hi') {
  console.log(`🎙️ [Bhashini] Processing incoming audio stream from: ${mediaUrl}`);

  // Fetch pipeline configuration
  const config = await getPipelineConfig(sourceLanguage);

  if (config.isMock) {
    return generateRealisticFarmerMockTranscription(sourceLanguage);
  }

  try {
    // Download audio binary from Twilio URL
    const twilioAuth = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
      ? {
          username: process.env.TWILIO_ACCOUNT_SID,
          password: process.env.TWILIO_AUTH_TOKEN
        }
      : undefined;

    const audioResponse = await axios.get(mediaUrl, {
      responseType: 'arraybuffer',
      auth: twilioAuth,
      timeout: 8000
    });

    const audioBase64 = Buffer.from(audioResponse.data).toString('base64');

    // Execute step 2 compute call
    return await computeASR({
      audioBase64,
      serviceId: config.serviceId,
      callbackUrl: config.callbackUrl,
      inferenceApiKey: config.inferenceApiKey,
      sourceLanguage: sourceLanguage
    });
  } catch (err) {
    console.warn('[Bhashini Download/Compute Error] Using mock transcription fallback:', err.message);
    return generateRealisticFarmerMockTranscription(sourceLanguage);
  }
}

/**
 * Realistic vernacular transcriptions for local development & demonstration.
 */
function generateRealisticFarmerMockTranscription(lang = 'hi') {
  const presets = [
    {
      text: "राम-राम भाई! नासिक निफाड़ से 40 क्विंटल लाल प्याज तैयार है। रेट 21 रुपये प्रति किलो चाहिए। आज सुबह 5 बजे खेत से निकाला है।",
      language: "hi",
      confidence: 99.4
    },
    {
      text: "नमस्कार! समराला मंडी के पास से 80 क्विंटल शरबती गेहूं उपलब्ध है। रेट 29 रुपये किलो। तुरंत डिस्पैच के लिए तैयार।",
      language: "pa",
      confidence: 98.6
    },
    {
      text: "हॉस्पिटल कैंटीनसाठी 20 क्विंटल केमिकल-मुक्त काकडी आणि हिरवी मिरची तयार आहे. दर 32 रुपये किलो.",
      language: "mr",
      confidence: 99.1
    }
  ];

  const selected = presets.find(p => p.language === lang) || presets[0];

  return {
    success: true,
    text: selected.text,
    language: selected.language,
    confidence: selected.confidence,
    provider: 'BHASHINI_MOCK_SIMULATOR'
  };
}

export default {
  getPipelineConfig,
  computeASR,
  transcribeAudioFromUrl
};
