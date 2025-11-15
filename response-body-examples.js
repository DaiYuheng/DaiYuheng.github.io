// Different ways to customize your response body and quote user input

// Example 1: Simple user input in parameters
body: JSON.stringify({
    flow_id: API_CONFIG.flowId,
    uid: 21189316967,
    stream: true,
    parameters: {
        "AGENT_USER_INPUT": message  // Direct user input
    },
    api_key: API_CONFIG.apiKey,
    api_secret: API_CONFIG.apiSecret
})

// Example 2: User input with context/formatting
body: JSON.stringify({
    flow_id: API_CONFIG.flowId,
    uid: 21189316967,
    stream: true,
    parameters: {
        "AGENT_USER_INPUT": `User asked: "${message}"`,  // Quoted user input
        "CONTEXT": "Please provide a helpful response"
    },
    api_key: API_CONFIG.apiKey,
    api_secret: API_CONFIG.apiSecret
})

// Example 3: Multiple parameters with user input
body: JSON.stringify({
    flow_id: API_CONFIG.flowId,
    uid: 21189316967,
    stream: true,
    parameters: {
        "USER_QUESTION": message,
        "CONVERSATION_CONTEXT": conversationHistory.slice(-3), // Last 3 messages
        "RESPONSE_STYLE": "helpful and concise"
    },
    api_key: API_CONFIG.apiKey,
    api_secret: API_CONFIG.apiSecret
})

// Example 4: Full conversation history
body: JSON.stringify({
    flow_id: API_CONFIG.flowId,
    uid: 21189316967,
    stream: true,
    parameters: {
        "CURRENT_MESSAGE": message,
        "FULL_HISTORY": conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')
    },
    api_key: API_CONFIG.apiKey,
    api_secret: API_CONFIG.apiSecret
})

// Example 5: Custom formatted input
body: JSON.stringify({
    flow_id: API_CONFIG.flowId,
    uid: 21189316967,
    stream: true,
    parameters: {
        "AGENT_USER_INPUT": JSON.stringify({
            question: message,
            timestamp: new Date().toISOString(),
            messageCount: conversationHistory.length + 1
        })
    },
    api_key: API_CONFIG.apiKey,
    api_secret: API_CONFIG.apiSecret
})

// Example 6: If your API expects different structure
body: JSON.stringify({
    flow_id: API_CONFIG.flowId,
    uid: 21189316967,
    stream: true,
    input: {
        user_message: message,
        chat_history: conversationHistory
    },
    config: {
        api_key: API_CONFIG.apiKey,
        api_secret: API_CONFIG.apiSecret,
        max_tokens: 1000,
        temperature: 0.7
    }
})

// Example 7: Simple text-based input
body: JSON.stringify({
    flow_id: API_CONFIG.flowId,
    uid: 21189316967,
    stream: true,
    query: message,  // Direct message as query
    api_key: API_CONFIG.apiKey,
    api_secret: API_CONFIG.apiSecret
})