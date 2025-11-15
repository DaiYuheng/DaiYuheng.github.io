// Chat Interface JavaScript
class ChatInterface {
    constructor() {
        this.messagesContainer = document.getElementById('messagesContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.charCount = document.getElementById('charCount');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        
        this.isLoading = false;
        this.messages = [];
        this.chatId = null; // Will be generated when first API call is made
        
        this.initializeEventListeners();
        this.updateCharCount();
    }
    
    initializeEventListeners() {
        // Send button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key to send (Shift+Enter for new line)
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.autoResizeTextarea();
            this.updateCharCount();
            this.updateSendButton();
        });
        
        // Initial button state
        this.updateSendButton();
    }
    
    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }
    
    updateCharCount() {
        const count = this.messageInput.value.length;
        this.charCount.textContent = `${count}/4000`;
        
        if (count > 3800) {
            this.charCount.style.color = '#ef4444';
        } else if (count > 3500) {
            this.charCount.style.color = '#f59e0b';
        } else {
            this.charCount.style.color = '#64748b';
        }
    }
    
    updateSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText || this.isLoading;
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isLoading) return;
        
        // Add user message
        this.addMessage('user', message);
        
        // Clear input
        this.messageInput.value = '';
        this.autoResizeTextarea();
        this.updateCharCount();
        this.updateSendButton();
        
        // Show loading
        this.setLoading(true);
        
        try {
            // Call API
            const response = await this.callLLMAPI(message);
            
            // Add assistant response
            this.addMessage('assistant', response);
        } catch (error) {
            console.error('Error calling LLM API:', error);
            this.addMessage('assistant', 'Sorry, I encountered an error while processing your request. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }
    
    addMessage(role, content) {
        // Remove welcome message if it exists
        const welcomeMessage = this.messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${role}`;
        
        const avatar = role === 'user' ? '👤' : '🤖';
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageElement.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-bubble">${this.formatMessage(content)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        // Store message
        this.messages.push({ role, content, timestamp: Date.now() });
    }
    
    formatMessage(content) {
        // Basic markdown-like formatting
        return content
            .replace(/\n/g, '<br>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/```([^```]+)```/g, '<pre><code>$1</code></pre>');
    }
    
    setLoading(loading) {
        this.isLoading = loading;
        this.updateSendButton();
        
        if (loading) {
            this.loadingIndicator.style.display = 'block';
            this.messagesContainer.appendChild(this.loadingIndicator);
        } else {
            this.loadingIndicator.style.display = 'none';
        }
        
        this.scrollToBottom();
    }
    
    scrollToBottom() {
        const chatMain = document.querySelector('.chat-main');
        chatMain.scrollTop = chatMain.scrollHeight;
    }
    
    clearChat() {
        this.messages = [];
        this.chatId = null; // Reset chat ID for new conversation
        this.messagesContainer.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">🤖</div>
                <h2>Welcome to AI Assistant</h2>
                <p>How can I help you today?</p>
            </div>
        `;
    }
    
    // Handle streaming response for your API format
    async handleStreamingResponse(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.trim() === '') continue;
                    
                    try {
                        // Remove "data: " prefix if present
                        const jsonStr = line.replace(/^data:\s*/, '');
                        if (jsonStr === '[DONE]') break;
                        
                        const data = JSON.parse(jsonStr);
                        
                        // Parse your specific response format
                        if (data.code === 0 && data.choices && data.choices.length > 0) {
                            const choice = data.choices[0];
                            if (choice.delta && choice.delta.content) {
                                fullContent += choice.delta.content;
                            }
                        }
                    } catch (parseError) {
                        console.warn('Failed to parse streaming chunk:', parseError);
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
        
        return fullContent;
    }

    // API Integration - Custom Model API
    async callLLMAPI(message) {
        // Custom API Configuration - Update these values with your actual API details
        const API_CONFIG = {
            // Direct API endpoint (works with disabled CORS)
            endpoint: 'https://xingchen-api.xf-yun.com/workflow/v1/chat/completions',
            apiKey: 'cb39d80bed4cd4906f3f61c3474eb83d',
            apiSecret: 'NjA4Nzc1OGI1NTY5M2I0ZDYxNTJmYjM2',
            flowId: '7395016121178791938',
        };
        
        try {
            // Prepare conversation history
            const conversationHistory = this.messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            }));
            
            // Add current message
            conversationHistory.push({ role: 'user', content: message });
            
            // For demonstration, return a mock response
            // Remove this and uncomment the actual API call below
            // await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
            // return this.getMockResponse(message);
            
             
            // Custom API call (now enabled with CORS proxy)
            // Prepare history in the required format
            const history = this.messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content_type: 'text',
                content: msg.content
            }));
            
            // Generate unique chat_id if not exists
            if (!this.chatId) {
                this.chatId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
            }
            
            const requestBody = {
                flow_id: API_CONFIG.flowId,
                uid: "21189316967",
                api_key: API_CONFIG.apiKey,      // Try auth in body
                api_secret: API_CONFIG.apiSecret, // Try auth in body
                parameters: {
                    "AGENT_USER_INPUT": message
                },
                ext: {
                    bot_id: "workflow",
                    caller: "workflow"
                },
                stream: true,
                chat_id: this.chatId,
                history: history
            };

            console.log('API Request:', {
                url: API_CONFIG.endpoint,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': API_CONFIG.apiKey,
                    'X-API-Secret': API_CONFIG.apiSecret,
                    'X-Flow-ID': API_CONFIG.flowId
                },
                body: requestBody
            });

            const response = await fetch(API_CONFIG.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': API_CONFIG.apiKey,  // Remove 'Bearer' prefix for iFlytek API
                    'X-API-Secret': API_CONFIG.apiSecret,
                    'X-Flow-ID': API_CONFIG.flowId
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                // Get error details from response
                let errorMessage = `API request failed: ${response.status}`;
                try {
                    const errorData = await response.text();
                    console.error('API Error Response:', errorData);
                    errorMessage += ` - ${errorData}`;
                } catch (e) {
                    console.error('Could not read error response');
                }
                throw new Error(errorMessage);
            }
            
            // Handle streaming response
            if (response.headers.get('content-type')?.includes('text/stream') || 
                response.headers.get('content-type')?.includes('application/stream')) {
                return await this.handleStreamingResponse(response);
            }
            
            // Handle regular JSON response
            const data = await response.json();
            
            // Parse the response according to your format
            if (data.code === 0 && data.choices && data.choices.length > 0) {
                const choice = data.choices[0];
                if (choice.delta && choice.delta.content) {
                    return choice.delta.content;
                }
            }
            
            // Fallback error handling
            if (data.code !== 0) {
                throw new Error(`API Error: ${data.message || 'Unknown error'}`);
            }
            
            return "No response content received";
            
        } catch (error) {
            console.error('LLM API Error:', error);
            throw error;
        }
    }
    
    // Mock response for demonstration (simulates your API response format)
    getMockResponse(message) {
        const responses = [
            "你好！我收到了你的消息：\"" + message + "\"。这是一个演示响应，界面功能正常工作。",
            "很有趣的问题！在实际部署中，这将由真正的语言模型API提供支持，比如你配置的讯飞星火API。",
            "我目前运行在演示模式。要启用真实的AI响应，你需要：\n\n1. 确保API密钥正确\n2. 解决CORS跨域问题\n3. 取消注释实际的API调用代码\n\n你的消息是：\"" + message + "\"",
            "这个聊天界面已经准备好集成LLM了！UI支持：\n\n• 实时消息传递\n• 对话历史管理\n• 加载状态\n• 响应式设计\n• Markdown格式\n\n只需要解决API连接问题就能完全正常工作。"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Parse your specific API response format
    parseAPIResponse(data) {
        // Handle your response format:
        // {
        //   "code": 0,
        //   "message": "Success", 
        //   "id": "cha000c0076@dx191c21ce879b8f3532",
        //   "created": 123412324431,
        //   "workflow_step": { "seq": 0, "progress": 0.4 },
        //   "choices": [
        //     {
        //       "delta": {
        //         "role": "assistant",
        //         "content": "你好，",
        //         "reasoning_content": ""
        //       },
        //       "index": 0,
        //       "finish_reason": null
        //     }
        //   ]
        // }
        
        if (data.code !== 0) {
            throw new Error(`API Error (${data.code}): ${data.message || 'Unknown error'}`);
        }
        
        if (!data.choices || data.choices.length === 0) {
            throw new Error('No choices in API response');
        }
        
        const choice = data.choices[0];
        if (!choice.delta || !choice.delta.content) {
            return ''; // Empty content is valid for streaming
        }
        
        return choice.delta.content;
    }
}

// Initialize chat interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatInterface = new ChatInterface();
});

// Global functions for HTML onclick handlers
function sendMessage() {
    if (window.chatInterface) {
        window.chatInterface.sendMessage();
    }
}

function clearChat() {
    if (window.chatInterface) {
        window.chatInterface.clearChat();
    }
}