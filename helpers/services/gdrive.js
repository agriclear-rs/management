// const config = require("config");
// const { coroutine } = require("bluebird");
// const { google } = require("googleapis");

// var key = require("../../config/google.json");
// var jwtClient = new google.auth.JWT(
//   key.client_email,
//   null,
//   key.private_key,
//   ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file"],
//   null
// );

class GDrive {
  constructor() {}
}

GDrive.prototype.getAuth = function () {
  const oauth2Client = new google.auth.OAuth2();
  return new Promise((resolve, reject) => {
    gtoken.getToken(function (err, token) {
      if (err) {
        console.log(err);
        return;
      }
      try {
        oauth2Client.setCredentials({
          access_token: token
        });
        resolve(oauth2Client);
      } catch (e) {
        return next(e);
      }
    });
  });
};

GDrive.prototype.client = coroutine(function* () {
  return google.drive({
    version: "v3",
    auth: jwtClient
  });
});

GDrive.prototype.list = coroutine(function* (data) {
  const drive = yield this.client();
  if (data.folderId) data.q = `'${data.folderId}' in parents`;
  data.fields =
    data.fields || "nextPageToken, files(kind, id, name, modifiedTime, mimeType, webContentLink)";
  return new Promise((resolve, reject) => {
    drive.files.list(data, (err, res) => {
      if (err) reject(err);
      resolve(res.data);
    });
  });
});

GDrive.prototype.upload = coroutine(function* ({ fileMetadata, media }) {
  const drive = yield this.client();
  return new Promise((resolve, reject) => {
    drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: "id, name, webContentLink"
      },
      function (err, file) {
        if (err) {
          reject(err);
        } else {
          resolve(file.data);
        }
      }
    );
  });
});

GDrive.prototype.createFolder = coroutine(function* (data) {
  const drive = yield this.client();
  return new Promise((resolve, reject) => {
    drive.files.create(
      {
        resource: data.fileMetadata,
        fields: "id"
      },
      function (err, file) {
        if (err) {
          reject(err);
        } else {
          resolve(file.data);
        }
      }
    );
  });
});

GDrive.prototype.getDocumentViewUrl = coroutine(function* (fileId) {
  let data = yield jwtClient.authorize();
  return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&access_token=${data.access_token}`;
});

module.exports = {
  GDrive
};

/* drive.files.get({
    mimeType:'application/pdf',
    fileId: fileId,
    alt: 'media'
}, {
    responseType: 'stream',
    encoding: null // make sure that we get the binary data
}, function (err, buffer) {
    // I wrap this in a promise to handle the data
    if (err) reject(err);
    else resolve(buffer);
}).pipe(dest); */
