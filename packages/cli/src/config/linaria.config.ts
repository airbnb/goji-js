module.exports = {
  // always set `displayName` to `false` to enable customization of generated class name
  displayName: false,
  classNameSlug: (hash: string, title: string) => {
    // hash length 5 is enough
    const shortenedHash = hash.substr(0, 5);

    return process.env.NODE_ENV === 'development' ? `${title}_${shortenedHash}` : shortenedHash;
  },
};
