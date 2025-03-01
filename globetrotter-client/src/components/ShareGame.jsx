import React from 'react';
import { motion } from 'framer-motion';

const ShareGame = ({ score, username, inviteCode }) => {
  // Use window.location.protocol to match the current protocol
  const shareUrl = new URL('/play', `${window.location.protocol}//${window.location.host}`);
  shareUrl.searchParams.set('inviteCode', inviteCode);

  // Force HTTP in the shared URL
  const shareUrlString = shareUrl.toString().replace('https://', 'http://');
  const shareText = encodeURIComponent(`I scored ${score} points in Globetrotter! Can you beat my score? ${shareUrlString}`);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Play Globetrotter with me!',
          text: `I scored ${score} points in Globetrotter! Can you beat my score?`,
          url: shareUrlString  // Use the HTTP version
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to WhatsApp sharing if Web Share API fails
        window.open(whatsappUrl, '_blank');
      }
    } else {
      // Direct WhatsApp sharing for browsers that don't support Web Share API
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <motion.div
      className="share-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <h3>Challenge Your Friends!</h3>
      <p>Your Score: {score}</p>
      <div className="share-button-container">
        <motion.button
          onClick={handleShare}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="share-button"
        >
          <span>Share on WhatsApp</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ShareGame; 