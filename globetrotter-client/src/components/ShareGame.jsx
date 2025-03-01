import React from 'react';
import { motion } from 'framer-motion';

const ShareGame = ({ score, username, inviteCode, correctAnswers, incorrectAnswers }) => {
  const shareUrl = new URL('/play', `${window.location.protocol}//${window.location.host}`);
  shareUrl.searchParams.set('inviteCode', inviteCode);

  // Don't force HTTP anymore - let it use the protocol of the site
  const shareUrlString = shareUrl.toString();
  const shareText = encodeURIComponent(`I scored ${score} points in Globetrotter! Can you beat my score? ${shareUrlString}`);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Play Globetrotter with me!',
          text: `I scored ${score} points in Globetrotter! Can you beat my score?`,
          url: shareUrlString
        });
      } catch (error) {
        console.error('Error sharing:', error);
        window.open(whatsappUrl, '_blank');
      }
    } else {
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
          <span>Share Your Score</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ShareGame;