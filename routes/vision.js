var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'AKIARAR74F5B2ZJFROOU', // accessKey for the Rekognition API
  secretAccessKey: '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', //secret key
  region: 'us-east-1' //AWS region
});

var rekognition = new AWS.Rekognition();
router.post('/classify', function(req, res, next) {
  // DON'T return the hardcoded response after implementing the backend
  // let response = ["shoe", "red", "nike"];

  // Your code starts here //
  // Get the uploaded file from the request
  const file = req.files.file;
  // Check if file has uploaded
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Set up parametrs for label ditection
  const params = {
    Image: {
      Bytes: file.data // Raw image data
    },
    MaxLabels: 12,     // Maximum number of labels to return
    MinConfidence: 70  // Minimum confidence level for detected labels (By setting an appropriate MinConfidence value,
                       // can adjust the sensitivity of the label detection. Lower values might result in more labels being detected, 
                       // but some of those labels might have lower confidence scores and might not be very accurate.)
  };

  // Call AWS Rekognition's detectLabels method
  rekognition.detectLabels(params, function(err, data) {
    if (err) {
      console.error('Error detecting labels:', err);
      return res.status(500).json({ error: 'Unable to process the request' });
    }

    // Check if no labels were detected
    if (!data.Labels || data.Labels.length === 0) {
      return res.status(404).json({ error: 'No labels detected' });
    }
    // Extract label names from the detected labels and send the response
    const response = data.Labels.map(label => label.Name);
    res.json({
      labels: response
    });
  });
  
});

module.exports = router;
