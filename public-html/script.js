
document.addEventListener('DOMContentLoaded', () => {
  const audioInput = document.getElementById('audioFile');
  const uploadBtn = document.getElementById('uploadBtn');
  const loader = document.getElementById('loader');
  const transcriptionDiv = document.getElementById('transcription');
  const summaryDiv = document.getElementById('summary');

  uploadBtn.addEventListener('click', async () => {
    const file = audioInput.files[0];
    if (!file) {
      alert('Please select an audio file first');
      return;
    }

    // Show loader
    loader.classList.remove('hidden');
    transcriptionDiv.textContent = '';
    summaryDiv.textContent = '';

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response_transcribe = await fetch(CONFIG.TRANSCRIBER_URL, {
        method: 'POST',
        body: formData
      });
	  
	  const transcribe = await response_transcribe.json();
	  var transcribe_str = JSON.stringify(transcribe);
	  
      const response_summarize = await fetch(CONFIG.SUMMARIZER_URL, {
        method: 'POST',
        body: transcribe_str
      });
	  
      const summarize = await response_summarize.json();
      
      // Update UI with results
      transcriptionDiv.textContent = transcribe.transcript;
      summaryDiv.textContent = summarize.summary;
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during processing');
    } finally {
      // Hide loader
      loader.classList.add('hidden');
    }
  });
});
