# GPT-like Chat Interface

A modern, responsive chat interface built with vanilla HTML, CSS, and JavaScript, ready for LLM API integration.

## Features

- 🎨 Modern, dark-themed UI similar to ChatGPT
- 📱 Fully responsive design
- ⚡ Real-time messaging with smooth animations
- 🔄 Auto-resizing input textarea
- 💬 Conversation history management
- 🎯 Ready for LLM API integration
- 🚀 No framework dependencies
- ✨ Loading states and error handling

## Quick Start

1. **Clone or download the files**
2. **Open `index.html` in your browser**
3. **Start chatting!** (Currently in demo mode)

## API Integration

The interface is ready to connect to any LLM API. See `api-config.js` for configuration examples.

### Supported Providers

- OpenAI GPT (GPT-3.5, GPT-4)
- Anthropic Claude
- Google Gemini
- Hugging Face
- Local/Self-hosted APIs

### Setup Steps

1. **Choose your LLM provider** from `api-config.js`
2. **Get your API key** from the provider
3. **Update the configuration** in `script.js`:

```javascript
// Replace the mock API call with real implementation
async callLLMAPI(message) {
    const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({
            // Your API request format
        })
    });
    
    const data = await response.json();
    return data.choices[0].message.content; // Adjust based on API response
}
```

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # Complete styling
├── script.js           # Chat functionality & API integration
├── api-config.js       # API configuration examples
└── README.md          # This file
```

## Customization

### Styling
- Edit `styles.css` to change colors, fonts, or layout
- CSS variables make theming easy
- Responsive breakpoints included

### Functionality
- Modify `script.js` for custom features
- Add message formatting, file uploads, etc.
- Extend API integration for specific needs

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers

## Security Notes

- Never expose API keys in client-side code for production
- Use environment variables or server-side proxy
- Implement rate limiting and input validation
- Consider CORS policies for API calls

## Demo Features

The current demo includes:
- Mock responses to test the interface
- All UI interactions working
- Conversation flow simulation
- Loading states demonstration

Replace the `getMockResponse()` method with real API calls for production use.

## License

MIT License - feel free to use in your projects!