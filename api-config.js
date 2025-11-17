// API Configuration for different LLM providers
// Copy the configuration you need and update the main script.js file

const API_CONFIGURATIONS = {
    // Custom Model API Configuration (iFlytek Xingchen)
    custom: {
        endpoint: 'http(s)://xingchen-api.xf-yun.com/workflow/v1/chat/completions',
        apiKey: 'cb39d80bed4cd4906f3f61c3474eb83d',
        apiSecret: 'NjA4Nzc1OGI1NTY5M2I0ZDYxNTJmYjM2',
        flowId: '7395016121178791938',
        // Correct headers format for iFlytek API
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'Authorization': 'Bearer cb39d80bed4cd4906f3f61c3474eb83d:NjA4Nzc1OGI1NTY5M2I0ZDYxNTJmYjM2'  // Format: Bearer API_KEY:API_SECRET
        },
        // Correct request body format
        requestBody: (message) => ({
            flow_id: '7395016121178791938',
            uid: '21189316967',
            parameters: {
                'AGENT_USER_INPUT': message
            },
            ext: {
                bot_id: 'workflow',
                caller: 'workflow'
            },
            stream: true
        })
    },

    // OpenAI GPT Configuration
    openai: {
        endpoint: 'https://api.openai.com/v1/chat/completions',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
        },
        requestBody: (messages) => ({
            model: 'gpt-3.5-turbo', // or 'gpt-4'
            messages: messages,
            max_tokens: 1000,
            temperature: 0.7,
            stream: false
        })
    },

    // Anthropic Claude Configuration
    anthropic: {
        endpoint: 'https://api.anthropic.com/v1/messages',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'YOUR_ANTHROPIC_API_KEY',
            'anthropic-version': '2023-06-01'
        },
        requestBody: (messages) => ({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1000,
            messages: messages.filter(msg => msg.role !== 'system'),
            system: messages.find(msg => msg.role === 'system')?.content || ''
        })
    },

    // Google Gemini Configuration
    gemini: {
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        headers: {
            'Content-Type': 'application/json'
        },
        requestBody: (messages) => ({
            contents: messages.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            })),
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000
            }
        }),
        // Add API key as query parameter
        getUrl: (baseUrl, apiKey) => `${baseUrl}?key=${apiKey}`
    },

    // Local/Self-hosted API Configuration
    local: {
        endpoint: 'http://localhost:8000/v1/chat/completions',
        headers: {
            'Content-Type': 'application/json'
        },
        requestBody: (messages) => ({
            model: 'local-model',
            messages: messages,
            max_tokens: 1000,
            temperature: 0.7
        })
    },

    // Hugging Face Inference API
    huggingface: {
        endpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
        headers: {
            'Authorization': 'Bearer YOUR_HUGGINGFACE_TOKEN',
            'Content-Type': 'application/json'
        },
        requestBody: (messages) => ({
            inputs: messages[messages.length - 1].content,
            parameters: {
                max_length: 1000,
                temperature: 0.7
            }
        })
    }
};

// Example usage in your main script:
/*
// 1. Choose your provider (use custom for your model)
const provider = API_CONFIGURATIONS.custom;

// 2. Update the callLLMAPI method in script.js
async callLLMAPI(message) {
    const conversationHistory = this.messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
    }));
    
    conversationHistory.push({ role: 'user', content: message });
    
    const response = await fetch(provider.endpoint, {
        method: 'POST',
        headers: provider.headers,
        body: JSON.stringify(provider.requestBody(conversationHistory))
    });
    
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Parse response based on provider
    if (provider === API_CONFIGURATIONS.custom) {
        // Adjust this based on your API's response format
        return data.response || data.message || data.content || data.text;
    } else if (provider === API_CONFIGURATIONS.openai) {
        return data.choices[0].message.content;
    } else if (provider === API_CONFIGURATIONS.anthropic) {
        return data.content[0].text;
    } else if (provider === API_CONFIGURATIONS.gemini) {
        return data.candidates[0].content.parts[0].text;
    }
    // Add more providers as needed
}
*/

// Quick Setup for Custom API:
// 1. Replace the placeholder values above with your actual:
//    - YOUR_INTERFACE_ADDRESS (e.g., 'https://api.yourservice.com/v1/chat')
//    - YOUR_API_KEY
//    - YOUR_API_SECRET  
//    - YOUR_API_FLOWID
// 
// 2. Adjust the headers and requestBody format to match your API specification
// 3. Update the response parsing in the example above
// 4. Copy the configuration to script.js and replace the mock implementation

export default API_CONFIGURATIONS;