// Create Audio instances for different sounds
const completionAudio = new Audio('/notification.mp3');
const generalAudio = new Audio('/notification.wav');

// Try to unlock audio on first user interaction
let audioUnlocked = false;
const unlockAudio = () => {
  if (!audioUnlocked) {
    generalAudio.volume = 0;
    generalAudio.play().catch(() => {});
    generalAudio.pause();
    generalAudio.currentTime = 0;
    completionAudio.volume = 0;
    completionAudio.play().catch(() => {});
    completionAudio.pause();
    completionAudio.currentTime = 0;
    audioUnlocked = true;
    generalAudio.volume = 1;
    completionAudio.volume = 1;
    console.log('Audio unlocked for notification sounds');
  }
};

window.addEventListener('click', unlockAudio, { once: true });
window.addEventListener('touchstart', unlockAudio, { once: true });

const playNotificationSound = async (type = 'general') => {
  try {
    const audio = type === 'completion' ? completionAudio : generalAudio;
    audio.currentTime = 0;
    await audio.play();
    console.log(`${type} notification sound played successfully`);
  } catch (error) {
    console.error('Audio playback failed:', error);
    if (error.name === 'NotAllowedError') {
      console.warn('Browser blocked audio playback. User interaction may be required.');
    } else if (error.name === 'NotFoundError') {
      console.warn('Notification sound file not found.');
    }
  }
};

export default playNotificationSound;
