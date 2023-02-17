module.exports = {
  permalink: (length) => {
    const s = "zxcvbnmasdfghjklqwertyuiop0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += s[Math.floor(Math.random() * s.length)];
    }
    return result;
  },
};
