# AI Interview Assistant 🤖

An intelligent interview preparation tool powered by OpenAI's GPT technology. This application helps users practice and prepare for job interviews through interactive Q&A sessions and real-time feedback.

## 🎯 Purpose

The AI Interview Assistant is designed to help job seekers:
- Practice interview questions in a realistic setting
- Receive immediate feedback on their responses
- Improve their interview skills through guided practice
- Prepare for technical and behavioral interviews
- Build confidence through repeated practice

## ✨ Features

- **Interactive Q&A**: Real-time conversation with AI interviewer
- **Custom Topics**: Practice interviews for specific roles or industries
- **Response Analysis**: Get detailed feedback on your answers
- **Voice Input**: Support for voice-based responses
- **Progress Tracking**: Monitor your improvement over time
- **Modern UI**: Clean and intuitive user interface

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/TadashiJei/LazzyMe.git
cd LazzyMe
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up configuration:
```bash
cp config.template.json config.json
```
Edit `config.json` and add your OpenAI API key.

4. Run the application:
```bash
python inter_ass.py
```

## 🛠️ Technical Requirements

- Python 3.8+
- OpenAI API key
- Modern web browser
- Internet connection

## 💻 Usage

1. Start the application using the command above
2. Open your web browser and navigate to `http://localhost:8080`
3. Choose your interview topic or role
4. Begin the interview session
5. Speak or type your responses
6. Receive feedback and suggestions

## 🔧 Functions

### Core Features
- **Interview Initialization**: Set up customized interview sessions
- **Speech Recognition**: Convert voice input to text
- **Response Analysis**: Evaluate user answers using AI
- **Feedback Generation**: Provide constructive feedback
- **Session Management**: Track and save interview progress

### API Integration
- OpenAI GPT integration for natural conversation
- Speech-to-text processing
- Real-time response analysis

## 👨‍💻 Development

### Project Structure
```
.
├── inter_ass.py         # Main application file
├── requirements.txt     # Python dependencies
├── config.json         # Configuration file
└── web/               # Frontend assets
    ├── index.html     # Main HTML file
    ├── script.js      # JavaScript code
    ├── styles.css     # CSS styles
    └── assets/        # Images and other assets
```

### Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Developer

**TadashiJei**
- GitHub: [@TadashiJei](https://github.com/TadashiJei)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Support

For support, email your queries or open an issue on GitHub.

---

Made with ❤️ by TadashiJei
