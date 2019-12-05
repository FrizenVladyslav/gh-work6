const fs = require("fs");
const { Transform } = require("stream");

const writeRecordsStream = fs.createWriteStream(__dirname + "/records.txt");
const readRecordsStream = fs.createReadStream(
  __dirname + "/records.txt",
  "utf-8"
);

(function initRecords() {
  for (i = 0; i < 10000; i++) {
    writeRecordsStream.write(`record - ${i} \t`);
  }
})();

readRecordsStream.on("data", chunk => console.log(chunk));

function appEnd(data) {
  writeRecordsStream.write(data);
}

appEnd("Hello");

function upperCase() {
  const transformedToUpperStream = new Transform({
    encoding: "utf-8",
    transform(chunk, enc, done) {
      done(null, String(chunk).toUpperCase());
    }
  });
  transformedToUpperStream.on("data", chunk => console.log(chunk));

  return transformedToUpperStream;
}

function deleteNumbers() {
  const writeNumbersStream = fs.createWriteStream(__dirname + "/numbers.txt", {
    encoding: "utf8",
    flags: "a"
  });

  writeNumbersStream.write(
    JSON.stringify({
      dateAdded: new Date().toISOString(),
      fristName: "Vladyslav",
      lastName: "Frizen",
      rank: "???"
    })
  );

  const transformedNumbersDeletedStream = new Transform({
    encoding: "utf-8",
    transform(chunk, enc, done) {
      writeNumbersStream.write(String(chunk).replace(/\D+/g, "") + '\n');
      done(null, chunk);
    }
  });
  transformedNumbersDeletedStream.on("data", chunk => console.log(chunk));

  return transformedNumbersDeletedStream;
}

function capitalizeCase() {
  const transformedToCapitalizeStream = new Transform({
    encoding: "utf-8",
    transform(chunk, enc, done) {
      chunk = String(chunk).toLowerCase();
      done(null, chunk.charAt(0).toUpperCase() + chunk.slice(1));
    }
  });
  transformedToCapitalizeStream.on("data", chunk => console.log(chunk));

  return transformedToCapitalizeStream;
}

readRecordsStream
  .pipe(upperCase())
  .pipe(deleteNumbers())
  .pipe(capitalizeCase());
