const generateDescription = async (todoTitle) => {
  try {
    const response = await fetch('https://todobackend.moajmalnk.in/api/generate-description.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: todoTitle
      })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate description');
    }

    return data.description;
  } catch (error) {
    console.error('Error details:', error);
    throw new Error('Failed to generate description. Please try again later.');
  }
};

export default generateDescription; 