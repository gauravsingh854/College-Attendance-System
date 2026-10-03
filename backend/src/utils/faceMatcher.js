// Calculates Euclidean distance between two 128D face descriptors
export const calculateFaceDistance = (descriptor1, descriptor2) => {
  if (!descriptor1 || !descriptor2 || descriptor1.length !== descriptor2.length) {
    return Infinity;
  }
  
  let sum = 0;
  for (let i = 0; i < descriptor1.length; i++) {
    sum += Math.pow(descriptor1[i] - descriptor2[i], 2);
  }
  
  return Math.sqrt(sum);
};

export const FACE_MATCH_THRESHOLD = 0.55; // Standard strict threshold for face-api.js

export const isFaceMatch = (descriptor1, descriptor2, threshold = FACE_MATCH_THRESHOLD) => {
  const distance = calculateFaceDistance(descriptor1, descriptor2);
  return {
    isMatch: distance < threshold,
    distance,
    confidence: Math.max(0, 1 - distance) // rough confidence score
  };
};
