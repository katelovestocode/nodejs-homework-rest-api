const fs = require("fs/promises");
const path = require("path");
const { User } = require("../../models/users");

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const updateAvatar = async (req, res, next) => {
  // get avatar path and file name from req.file
  const { path: tempUpload, originalname } = req.file;
  const { _id } = req.user;
  // unique name
  const avatarNewName = `${_id}_${originalname}`;

  try {
    // Unique Name:
    // // getting an extention from the filename
    // const [extention] = filename.split(".").reverse();
    // // creating a unique avatar name with ID and extention
    // const avatarNewName = `${_id}.${extention}`;

    // path for the final location of the avatar
    const resultUpload = path.join(avatarsDir, avatarNewName);

    // move avatar from the temp folder into a destination folder or cloud
    await fs.rename(tempUpload, resultUpload);

    // Полученный URL /avatars/<имя файла с расширением> сохрани в поле avatarURL пользователя
    const avatarURL = path.join("avatars", avatarNewName);

    // update a database with a new path to the avatar
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    // if we can't move file from the temp folder, then just delete it from temp folder
    await fs.unlink(req.file.path);
    throw error;
  }
};

module.exports = updateAvatar;
