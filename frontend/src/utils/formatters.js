export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatPercentage = (val) => {
  if (typeof val !== 'number') return '0%';
  return `${val.toFixed(1)}%`;
};
