const AWS = require('aws-sdk');
const sharp = require('sharp');
const FileType = require('file-type');
const s3 = new AWS.S3();
const {execFile} = require('child_process');
const Gifsicle = require('gifsicle-wrapper');

const destBucket = process.env.DEST_BUCKET;
const quality = parseInt(process.env.QUALITY);

exports.handler = function main(event, context) {
  // Fail on mising data
  if (!destBucket || !quality) {
    context.fail('Error: Environment variable DEST_BUCKET or QUALITY missing');
    return;
  }
  if (event.Records === null) {
    context.fail('Error: Event has no records.');
    return;
  }

  // Make a task for each record
  let tasks = [];
  for (let i = 0; i < event.Records.length; i++) {
    tasks.push(conversionPromise(event.Records[i], destBucket));
  }

  Promise.all(tasks)
    .then(() => { context.succeed(); })
    .catch((err) => { context.fail(err); });
};

function conversionPromise(record, destBucket) {
  return new Promise((resolve, reject) => {
    // The source bucket and source key are part of the event data
    const srcBucket = record.s3.bucket.name;
    const srcKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    // Modify destKey if an alternate copy location is preferred
    const destKey = srcKey;
    const conversion = 'compressing (quality ' + quality + '): ' + srcBucket + ':' + srcKey + ' to ' + destBucket + ':' + destKey;

    console.log('Attempting: ' + conversion);

    get(srcBucket, srcKey)
      .then(original => compress(original, destKey))
      .then(modified => put(destBucket, destKey, modified))
      .then(() => {
        console.log('Success: ' + conversion);
        return resolve('Success: ' + conversion);
      })
      .catch(error => {
        console.error(error);
        return reject(error);
      });
  });
}

function get(srcBucket, srcKey) {
  return new Promise((resolve, reject) => {
    s3.getObject({
      Bucket: srcBucket,
      Key: srcKey
    }, (err, data) => {
      if (err) {
        console.error('Error getting object: ' + srcBucket + ':' + srcKey);
        return reject(err);
      } else {
        resolve(data.Body);
      }
    });
  });
}

async function put(destBucket, destKey, data) {
  const { mime } = await FileType.fromBuffer(data);
  return new Promise((resolve, reject) => {
    s3.putObject({
      Bucket: destBucket,
      Key: destKey,
      Body: data,
      ContentType: mime
    }, (err, data) => {
      if (err) {
        console.error('Error putting object: ' + destBucket + ':' + destKey);
        return reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

async function compress(inBuffer, destKey) {
  const ext = destKey.split('.').pop();
  let image;
  if(ext !== 'gif') {
    image = await sharp(inBuffer).jpeg({ quality: quality });
    return image.toBuffer();
  }
  else {
    image = await Gifsicle(inBuffer)
		.optimize({ level: Gifsicle.level.O2, lossiness: 20 })
		.toBuffer();
    return image;
  }
}