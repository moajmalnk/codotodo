// Create Audio instances for different sounds
const completionAudio = new Audio('/notification.mp3');
const generalAudio = new Audio('/notification.wav');

const playNotificationSound = async (type = 'general') => {
  try {
    const audio = type === 'completion' ? completionAudio : generalAudio;
    // Reset the audio to the beginning if it's already playing
    audio.currentTime = 0;
    await audio.play();
    console.log(`${type} notification sound played successfully`);
  } catch (error) {
    console.error('Audio playback failed:', error);
  }
};

export default playNotificationSound;
