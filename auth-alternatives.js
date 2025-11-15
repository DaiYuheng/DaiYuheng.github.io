// Different authentication formats to try for iFlytek API

// Option 1: Current format (already implemented)
headers: {
    'Content-Type': 'application/json',
    'Authorization': API_CONFIG.apiKey,
    'X-API-Secret': API_CONFIG.apiSecret,
    'X-Flow-ID': API_CONFIG.flowId
}

// Option 2: Bearer token format
headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_CONFIG.apiKey}`,
    'X-API-Secret': API_CONFIG.apiSecret,
    'X-Flow-ID': API_CONFIG.flowId
}

// Option 3: API Key in body instead of headers
headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify({
    api_key: API_CONFIG.apiKey,
    api_secret: API_CONFIG.apiSecret,
    flow_id: API_CONFIG.flowId,
    // ... rest of body
})

// Option 4: Different header names
headers: {
    'Content-Type': 'application/json',
    'api-key': API_CONFIG.apiKey,
    'api-secret': API_CONFIG.apiSecret,
    'flow-id': API_CONFIG.flowId
}

// Option 5: Basic Auth format
headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(API_CONFIG.apiKey + ':' + API_CONFIG.apiSecret)}`
}