import axios from 'axios';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = 'app3jl1PjYWko4Mhu';
const AIRTABLE_TABLE_NAME = 'Table 1';
const DESTINATION_NUMBER = '+18888489985';

const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const callData = req.body;

  // Map your fields accordingly from SignalWire webhook payload:
  const {
    CallSid: callId,
    From: callerNumber,
    CallerName: callerName,
    PhoneLineType: phoneLineType,
    CarrierName: carrierName,
    To: calledNumber,
  } = callData;

  // TODO: Implement mapping from calledNumber to campaignId and clickId, or pass them in webhook params

  const campaignId = req.query.campaign || 'unknown_campaign';
  const clickId = req.query.clickid || 'unknown_clickid';

  try {
    await axios.post(
      airtableUrl,
      {
        fields: {
          'Click ID': clickId,
          'Campaign ID': campaignId,
          'Date': new Date().toISOString().split('T')[0],
          'Time': new Date().toISOString().split('T')[1].split('.')[0],
          'Call ID': callId,
          'Caller Name': callerName || '',
          'Caller Number': callerNumber,
          'Phone line type': phoneLineType || '',
          'Carrier Name': carrierName || '',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Airtable logging error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to log call data' });
  }

  // TODO: Add SignalWire API call here to forward the call to DESTINATION_NUMBER

  res.status(200).send('Call logged');
}
