export const getSemestersForBranch = (branch) => {
  switch (branch) {
    case 'MCA': return 4;
    case 'BCA':
    case 'BBA': return 6;
    case 'BTech CSE':
    case 'BTech IT': return 8;
    default: return 8;
  }
};
