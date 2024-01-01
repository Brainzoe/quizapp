const form = document.querySelector('form[action="/attemptQuiz"]');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const answers = {};
  formData.forEach((value, key) => {
    answers[key] = value;
  });
  try {
    const response = await fetch('/attemptQuiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answers),
    });
    // Handle response, e.g., show result
  } catch (error) {
    console.error('Error:', error);
  }
});
