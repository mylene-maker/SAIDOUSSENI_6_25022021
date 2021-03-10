const multer = require('multer'); /* Permet de gerer les fichiers entrant (images) */

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ /* Indique où enregister les fichiers */
  destination: (req, file, callback) => { /* Indique que les fichiers doient etre enregster dans le dossier images */
    callback(null, 'images');
  },
  filename: (req, file, callback) => { /* Présice comment nommer les fichiers */
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image'); /* Gere uniquement les telechargements de fichiers images */