const LIMIT_IN_MB = 5; // 5 MB
const LIMIT_IN_BYTE = LIMIT_IN_MB * Math.pow(1024, 2); // 5 MB

const fileSizeLimiter = (req, res, next) => {
  const files = req.files;
  const filesOverLimit = [];
  Object.keys(files).forEach(key => {
    const fileSizeBytes = files[key].size;
    // MB làm tròn đến 2 chữ số
    const fileSizeInMb = Math.round((fileSizeBytes / Math.pow(1024, 2)) * 100) / 100;
    console.log(`${files[key].name}: ${fileSizeInMb} MB ~ ${fileSizeBytes} bytes`);
    if (fileSizeBytes > LIMIT_IN_BYTE) {
      filesOverLimit.push(files[key].name);
    }
  });

  if (filesOverLimit.length) {
    const properVerb = filesOverLimit.length > 1 ? "are" : "is";
    const sentence = `Upload failed. ${filesOverLimit.join(
      ", ",
    )} ${properVerb} over the file limit of ${LIMIT_IN_MB}`;
    const message =
      filesOverLimit.length < 3
        ? sentence.replace(",", " and")
        : sentence.replace(/,(?=[^,]*$)/, " and");
    // 413: Payload too large
    return res.status(413).json({ status: "error", message });
  }

  next();
};

module.exports = fileSizeLimiter;
