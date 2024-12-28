let listenButton = document.getElementById('listenButton');
let screenAudioButton = document.getElementById('screenAudioButton');
let clearButton = document.getElementById('clearButton');
let questionsArea = document.getElementById('questionsArea');
let answersArea = document.getElementById('answersArea');
let openaiKeyInput = document.getElementById('openaiKeyInput');
let geminiKeyInput = document.getElementById('geminiKeyInput');
let saveOpenaiKeyButton = document.getElementById('saveOpenaiKey');
let saveGeminiKeyButton = document.getElementById('saveGeminiKey');
let deleteApiKeyButton = document.getElementById('deleteApiKey');
let modelSelect = document.getElementById('modelSelect');
let jobGuidelinesTextarea = document.getElementById('jobGuidelines');
let saveGuidelinesButton = document.getElementById('saveGuidelines');
let modal = document.getElementById('modal');
let modalMessage = document.getElementById('modal-message');
let closeModal = document.getElementsByClassName('close')[0];
let modalLogo = document.getElementById('modal-logo');
let openaiKeySection = document.getElementById('openaiKeySection');
let geminiKeySection = document.getElementById('geminiKeySection');
let personalitySelect = document.getElementById('personalitySelect');
let languageSelect = document.getElementById('languageSelect');
let roleSelect = document.getElementById('roleSelect');
let roleInfo = document.getElementById('roleInfo');
let roleSwitch = document.querySelector('.role-switch');
let fileUpload = document.getElementById('fileUpload');
let uploadedFiles = document.getElementById('uploadedFiles');
let companyInfo = document.getElementById('companyInfo');
let hackathonName = document.getElementById('hackathonName');
let problemStatement = document.getElementById('problemStatement');
let criteriaList = document.getElementById('criteriaList');
let addCriterion = document.getElementById('addCriterion');
let sdgGoals = document.getElementById('sdgGoals');
let additionalContext = document.getElementById('additionalContext');

// Add these lines at the beginning of your script
let logoContainer = document.querySelector('.logo-container');
let closeLogo = document.querySelector('.close-logo');

// Add this event listener for the close logo button
closeLogo.addEventListener('click', () => {
    logoContainer.classList.add('logo-hidden');
});

// Load job guidelines and check API keys on startup
window.addEventListener('load', async () => {
    const currentModel = await eel.get_current_model()();
    const hasOpenaiKey = await eel.has_api_key_for_provider('openai')();
    const hasGeminiKey = await eel.has_api_key_for_provider('gemini')();
    const guidelines = await eel.get_job_guidelines()();
    const personality = await eel.get_current_personality()();
    const language = await eel.get_current_language()();
    const role = await eel.get_current_role()();
    const company = await eel.get_company_info()();
    const hackathonData = await eel.get_hackathon_info()();
    
    modelSelect.value = currentModel || '';
    jobGuidelinesTextarea.value = guidelines;
    personalitySelect.value = personality || 'professional';
    languageSelect.value = language || 'en-US';
    roleSelect.value = role || 'interviewer';
    companyInfo.value = company || '';
    
    // Load hackathon info if available
    if (hackathonData) {
        hackathonName.value = hackathonData.name || '';
        problemStatement.value = hackathonData.problem_statement || '';
        loadCriteria(hackathonData.criteria || []);
        loadSDGGoals(hackathonData.sdg_goals || []);
        additionalContext.value = hackathonData.additional_context || '';
    }
    
    updateRoleUI(role);
    
    // Show the appropriate API key section based on saved keys
    if (currentModel === 'gpt') {
        showApiKeySection('openai', hasOpenaiKey);
    } else if (currentModel === 'gemini') {
        showApiKeySection('gemini', hasGeminiKey);
    }
    
    // Update listen button state
    updateListenButtonState(currentModel, hasOpenaiKey, hasGeminiKey);
});

personalitySelect.addEventListener('change', async () => {
    try {
        const personality = personalitySelect.value;
        const result = await eel.set_personality(personality)();
        if (result) {
            showModal(`Interviewer personality updated to: ${personality.charAt(0).toUpperCase() + personality.slice(1)}`);
        }
    } catch (err) {
        console.error('Error setting personality:', err);
        showModal('Failed to update interviewer personality. Please try again.');
    }
});

modelSelect.addEventListener('change', async () => {
    const model = modelSelect.value;
    if (model) {
        await eel.set_ai_model(model)();
        
        const hasOpenaiKey = await eel.has_api_key_for_provider('openai')();
        const hasGeminiKey = await eel.has_api_key_for_provider('gemini')();
        
        // Show the appropriate API key section
        if (model === 'gpt') {
            showApiKeySection('openai', hasOpenaiKey);
            hideApiKeySection('gemini');
        } else if (model === 'gemini') {
            showApiKeySection('gemini', hasGeminiKey);
            hideApiKeySection('openai');
        }
        
        updateListenButtonState(model, hasOpenaiKey, hasGeminiKey);
    } else {
        // Hide all API key sections if no model is selected
        hideApiKeySection('openai');
        hideApiKeySection('gemini');
        listenButton.disabled = true;
    }
});

languageSelect.addEventListener('change', async () => {
    try {
        const language = languageSelect.value;
        const result = await eel.set_language(language)();
        if (result) {
            const languageNames = {
                'en-US': 'English (US)',
                'en-IN': 'English (Indian)',
                'en-GB': 'English (UK)',
                'en-AU': 'English (Australian)',
                'hi-IN': 'Hindi',
                'zh': 'Chinese',
                'es': 'Spanish',
                'fr': 'French',
                'de': 'German',
                'ja': 'Japanese',
                'ko': 'Korean'
            };
            showModal(`Speech recognition language updated to: ${languageNames[language] || language}`);
        }
    } catch (err) {
        console.error('Error setting language:', err);
        showModal('Failed to update speech recognition language. Please try again.');
    }
});

roleSelect.addEventListener('change', async () => {
    try {
        const role = roleSelect.value;
        const result = await eel.set_role(role)();
        if (result) {
            updateRoleUI(role);
            const roleMessages = {
                'interviewer': 'AI will conduct the interview and ask questions',
                'expert': 'AI will help you answer interview questions as an expert mentor',
                'developer': 'AI will provide technical expertise and code examples',
                'pitcher': 'AI will help you perfect your hackathon pitch'
            };
            showModal(`Role switched to: ${role === 'interviewer' ? 'Interviewer' : role === 'expert' ? 'Interview Expert' : role === 'developer' ? 'Developer' : 'Pitcher'}\n${roleMessages[role]}`);
        }
    } catch (err) {
        console.error('Error setting role:', err);
        showModal('Failed to update AI role. Please try again.');
    }
});

function showApiKeySection(provider, hasKey) {
    const section = provider === 'openai' ? openaiKeySection : geminiKeySection;
    const input = provider === 'openai' ? openaiKeyInput : geminiKeyInput;
    const saveButton = provider === 'openai' ? saveOpenaiKeyButton : saveGeminiKeyButton;
    
    section.style.display = 'flex';
    input.style.display = hasKey ? 'none' : 'inline-block';
    saveButton.style.display = hasKey ? 'none' : 'inline-block';
    deleteApiKeyButton.style.display = hasKey ? 'inline-block' : 'none';
}

function hideApiKeySection(provider) {
    const section = provider === 'openai' ? openaiKeySection : geminiKeySection;
    section.style.display = 'none';
}

function updateListenButtonState(model, hasOpenaiKey, hasGeminiKey) {
    if (!model) {
        listenButton.disabled = true;
        return;
    }
    
    if (model === 'gpt') {
        listenButton.disabled = !hasOpenaiKey;
    } else {
        listenButton.disabled = !hasGeminiKey;
    }
}

function loadCriteria(criteria) {
    criteriaList.innerHTML = '';
    criteria.forEach(criterion => {
        addCriterionItem(criterion.name, criterion.weight);
    });
    if (criteria.length === 0) {
        addCriterionItem();
    }
}

function loadSDGGoals(goals) {
    Array.from(sdgGoals.options).forEach(option => {
        option.selected = goals.includes(option.value);
    });
}

function addCriterionItem(name = '', weight = '') {
    const item = document.createElement('div');
    item.className = 'criteria-item';
    item.innerHTML = `
        <input type="text" placeholder="Criterion (e.g., Innovation)" value="${name}" />
        <input type="number" placeholder="Weight %" min="0" max="100" value="${weight}" />
        <button onclick="this.parentElement.remove()">×</button>
    `;
    criteriaList.appendChild(item);
}

function updateRoleUI(role) {
    // Update role info text
    const roleMessages = {
        'interviewer': 'Current Mode: AI will conduct the interview',
        'expert': 'Current Mode: AI will help you answer interview questions',
        'developer': 'Current Mode: AI will provide technical expertise and code examples',
        'pitcher': 'Current Mode: AI will help you perfect your hackathon pitch'
    };
    roleInfo.textContent = roleMessages[role] || roleMessages['interviewer'];
    
    // Update visual style
    roleSwitch.classList.remove('interviewer-mode', 'expert-mode', 'developer-mode', 'pitcher-mode');
    roleSwitch.classList.add(`${role}-mode`);
    
    // Show/hide relevant sections
    const hackathonInfo = document.querySelector('.hackathon-info');
    const companyInfo = document.querySelector('.company-info');
    const knowledgeBase = document.querySelector('.knowledge-base');
    
    hackathonInfo.style.display = role === 'pitcher' ? 'block' : 'none';
    companyInfo.style.display = role === 'interviewer' ? 'block' : 'none';
    knowledgeBase.style.display = ['expert', 'developer', 'pitcher'].includes(role) ? 'block' : 'none';
    personalitySelect.style.display = role === 'interviewer' ? 'block' : 'none';
}

async function saveHackathonInfo() {
    const criteria = Array.from(criteriaList.children).map(item => ({
        name: item.querySelector('input[type="text"]').value,
        weight: parseInt(item.querySelector('input[type="number"]').value) || 0
    }));
    
    const selectedSDGs = Array.from(sdgGoals.selectedOptions).map(option => option.value);
    
    const hackathonData = {
        name: hackathonName.value,
        problem_statement: problemStatement.value,
        criteria: criteria,
        sdg_goals: selectedSDGs,
        additional_context: additionalContext.value
    };
    
    try {
        const result = await eel.set_hackathon_info(hackathonData)();
        if (result) {
            showModal('Hackathon information saved successfully');
        }
    } catch (err) {
        console.error('Error saving hackathon info:', err);
        showModal('Failed to save hackathon information');
    }
}

// Add event listeners for hackathon info changes
[hackathonName, problemStatement, additionalContext].forEach(element => {
    element.addEventListener('change', saveHackathonInfo);
});

sdgGoals.addEventListener('change', saveHackathonInfo);

// Save criteria when changes are made
criteriaList.addEventListener('input', saveHackathonInfo);

addCriterion.addEventListener('click', () => addCriterionItem());

saveGuidelinesButton.addEventListener('click', async () => {
    const guidelines = jobGuidelinesTextarea.value.trim();
    await eel.set_job_guidelines(guidelines)();
    showModal('Job guidelines saved successfully!');
});

let isScreenAudioCapturing = false;
let mediaRecorder = null;
let audioContext = null;
let mediaStream = null;

screenAudioButton.addEventListener('click', async () => {
    if (!isScreenAudioCapturing) {
        try {
            // First try with system audio
            const stream = await navigator.mediaDevices.getDisplayMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                },
                video: false
            }).catch(async (err) => {
                console.log('Failed to get system audio, trying with microphone:', err);
                // Fallback to microphone if system audio fails
                return await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
                });
            });

            if (!stream) {
                throw new Error('No audio stream available');
            }

            const audioTrack = stream.getAudioTracks()[0];
            if (!audioTrack) {
                throw new Error('No audio track available in the stream');
            }

            console.log('Audio track settings:', audioTrack.getSettings());
            console.log('Audio track constraints:', audioTrack.getConstraints());
            
            // Set up audio processing
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            
            source.connect(processor);
            processor.connect(audioContext.destination);
            
            mediaStream = stream;
            isScreenAudioCapturing = true;
            screenAudioButton.textContent = 'Stop Audio Capture';
            screenAudioButton.classList.add('active');
            
            // Process audio data
            processor.onaudioprocess = async (e) => {
                if (!isScreenAudioCapturing) return;
                
                const inputData = e.inputBuffer.getChannelData(0);
                // Convert float32 audio data to Int16
                const audioData = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    audioData[i] = Math.min(1, Math.max(-1, inputData[i])) * 0x7FFF;
                }
                
                try {
                    await eel.process_audio_data(Array.from(audioData))();
                } catch (err) {
                    console.error('Error sending audio data:', err);
                }
            };
            
            // Handle stream ending
            audioTrack.onended = () => {
                console.log('Audio track ended');
                stopAudioCapture();
            };
            
            showModal('Audio capture started! Speak clearly into your microphone.');
        } catch (err) {
            console.error('Error capturing audio:', err);
            let errorMessage = 'Failed to start audio capture. ';
            
            if (err.name === 'NotAllowedError') {
                errorMessage += 'Please allow audio access in your browser settings.';
            } else if (err.name === 'NotFoundError') {
                errorMessage += 'No audio input device found. Please connect a microphone.';
            } else if (err.name === 'NotReadableError') {
                errorMessage += 'Your audio device is busy or not responding. Please try again.';
            } else {
                errorMessage += err.message || 'Please check your audio settings and try again.';
            }
            
            showModal(errorMessage);
            stopAudioCapture();
        }
    } else {
        stopAudioCapture();
    }
});

function stopAudioCapture() {
    console.log('Stopping audio capture');
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => {
            console.log('Stopping track:', track.label);
            track.stop();
        });
        mediaStream = null;
    }
    if (audioContext) {
        audioContext.close().catch(console.error);
        audioContext = null;
    }
    isScreenAudioCapturing = false;
    screenAudioButton.textContent = 'Start Audio Capture';
    screenAudioButton.classList.remove('active');
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    stopAudioCapture();
});

saveOpenaiKeyButton.addEventListener('click', async () => {
    const apiKey = openaiKeyInput.value.trim();
    if (apiKey) {
        const result = await eel.set_api_key_for_provider(apiKey, 'openai')();
        if (result) {
            showModal('OpenAI API key saved successfully!', 'OpenAI_Logo.png');
            openaiKeyInput.value = '';
            showApiKeySection('openai', true);
            updateListenButtonState('gpt', true, await eel.has_api_key_for_provider('gemini')());
        } else {
            showModal('Failed to save OpenAI API key. Please try again.');
        }
    } else {
        showModal('Please enter a valid API key.');
    }
});

saveGeminiKeyButton.addEventListener('click', async () => {
    const apiKey = geminiKeyInput.value.trim();
    if (apiKey) {
        const result = await eel.set_api_key_for_provider(apiKey, 'gemini')();
        if (result) {
            showModal('Google Gemini API key saved successfully!');
            geminiKeyInput.value = '';
            showApiKeySection('gemini', true);
            updateListenButtonState('gemini', await eel.has_api_key_for_provider('openai')(), true);
        } else {
            showModal('Failed to save Gemini API key. Please try again.');
        }
    } else {
        showModal('Please enter a valid API key.');
    }
});

deleteApiKeyButton.addEventListener('click', async () => {
    const currentModel = modelSelect.value;
    if (currentModel === 'gpt') {
        await eel.delete_api_key_for_provider('openai')();
        showApiKeySection('openai', false);
    } else if (currentModel === 'gemini') {
        await eel.delete_api_key_for_provider('gemini')();
        showApiKeySection('gemini', false);
    }
    updateListenButtonState(currentModel, false, false);
});

listenButton.addEventListener('click', async () => {
    let isListening = await eel.toggle_listening()();
    listenButton.textContent = isListening ? 'Stop Mic Listening' : 'Start Mic Listening';
    listenButton.classList.toggle('active', isListening);
    
    if (isListening) {
        let spinner = document.createElement('div');
        spinner.className = 'spinner';
        listenButton.appendChild(spinner);
    }
});

clearButton.addEventListener('click', () => {
    questionsArea.innerHTML = '';
    answersArea.innerHTML = '';
});

function showModal(message, logoSrc = null, htmlContent = null) {
    if (htmlContent) {
        modalMessage.innerHTML = htmlContent;
    } else {
        modalMessage.textContent = message;
    }
    modalMessage.className = 'text-center';
    if (logoSrc) {
        modalLogo.src = logoSrc;
        modalLogo.style.display = 'block';
    } else {
        modalLogo.style.display = 'none';
    }
    modal.style.display = 'block';
}

closeModal.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

fileUpload.addEventListener('change', async (event) => {
    const files = event.target.files;
    for (let file of files) {
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const fileDiv = document.createElement('div');
                fileDiv.className = 'uploaded-file';
                fileDiv.innerHTML = `
                    <span>${file.name}</span>
                    <span class="processing">Processing...</span>
                `;
                uploadedFiles.appendChild(fileDiv);
                
                const result = await eel.upload_file(e.target.result, file.name)();
                
                if (result) {
                    fileDiv.innerHTML = `
                        <span>${file.name}</span>
                        <button onclick="this.parentElement.remove()">×</button>
                    `;
                    showModal(`Successfully processed ${file.name}`);
                } else {
                    fileDiv.innerHTML = `
                        <span>${file.name} (Failed)</span>
                        <button onclick="this.parentElement.remove()">×</button>
                    `;
                    showModal(`Failed to process ${file.name}`);
                }
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error('Error processing file:', err);
            showModal(`Error processing ${file.name}`);
        }
    }
});

companyInfo.addEventListener('change', async () => {
    try {
        const info = companyInfo.value.trim();
        const result = await eel.set_company_info(info)();
        if (result) {
            showModal('Company information updated successfully');
        }
    } catch (err) {
        console.error('Error saving company info:', err);
        showModal('Failed to update company information');
    }
});

eel.expose(update_ui);
function update_ui(question, answer) {
    if (question) {
        let p = document.createElement('p');
        p.textContent = question;
        questionsArea.appendChild(p);
        questionsArea.scrollTop = questionsArea.scrollHeight;
    }
    if (answer) {
        let answerContainer = document.createElement('div');
        answerContainer.className = 'answer-container';
        
        let p = document.createElement('p');
        try {
            const parsedAnswer = JSON.parse(answer);
            p.textContent = parsedAnswer.text;
            
            if (parsedAnswer.audio) {
                let audio = new Audio(`data:audio/mp3;base64,${parsedAnswer.audio}`);
                let isMuted = false;
                
                audio.onplay = function() {
                    eel.audio_playback_started()();
                };
                audio.onended = function() {
                    eel.audio_playback_ended()();
                };
                
                let muteIcon = document.createElement('span');
                muteIcon.className = 'mute-icon';
                muteIcon.innerHTML = '&#x1F50A;';
                muteIcon.title = 'Mute/Unmute';
                muteIcon.onclick = function() {
                    isMuted = !isMuted;
                    audio.muted = isMuted;
                    muteIcon.innerHTML = isMuted ? '&#x1F507;' : '&#x1F50A;';
                    eel.set_muted(isMuted)();
                };
                
                answerContainer.appendChild(muteIcon);
                audio.play().catch(e => console.error("Error playing audio:", e));
            }
        } catch (e) {
            console.error("Error parsing answer:", e);
            p.textContent = answer;
        }
        
        answerContainer.appendChild(p);
        answersArea.appendChild(answerContainer);
        answersArea.scrollTop = answersArea.scrollHeight;
    }
}

let ttsToggle = document.getElementById('ttsToggle');
let ttsEnabled = true;  // Set this to true by default

// Update the UI to reflect the default state
ttsToggle.classList.toggle('disabled', !ttsEnabled);

ttsToggle.addEventListener('click', async () => {
    ttsEnabled = await eel.toggle_tts()();
    ttsToggle.classList.toggle('disabled', !ttsEnabled);
});