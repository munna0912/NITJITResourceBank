const File = require('./file');

async function createFileInfo(fileId) {
  const existingFile = await File.findOne({ fileId });

  if (existingFile) throw new Error('File already exists');

  const newFile = new File({ fileId });
  await newFile.save();
}

async function deleteFileInfo(fileId) {
  const result = await File.deleteOne({ fileId });

  if (result.deletedCount === 0) throw new Error('File not found or already deleted');
}

async function upvoteFile(fileId, userId) {
  const file = await File.findOne({ fileId });

  if (!file) throw new Error('File not found');

  // Remove user from downvotes if present
  await File.updateOne(
    { fileId },
    { $pull: { downvotes: userId } }
  );

  // Add user to upvotes if not already present
  await File.updateOne(
    { fileId },
    { $addToSet: { upvotes: userId } }
  );
}

async function downvoteFile(fileId, userId) {
  const file = await File.findOne({ fileId });

  if (!file) throw new Error('File not found');

  // Remove user from upvotes if present
  await File.updateOne(
    { fileId },
    { $pull: { upvotes: userId } }
  );

  // Add user to downvotes if not already present
  await File.updateOne(
    { fileId },
    { $addToSet: { downvotes: userId } }
  );
}

async function removeUpvote(fileId, userId) {
  const file = await File.findOne({ fileId });

  if (!file) throw new Error('File not found');

  // Remove user from upvotes
  await File.updateOne(
    { fileId },
    { $pull: { upvotes: userId } }
  );
}

async function removeDownvote(fileId, userId) {
  const file = await File.findOne({ fileId });

  if (!file) throw new Error('File not found');

  // Remove user from downvotes
  await File.updateOne(
    { fileId },
    { $pull: { downvotes: userId } }
  );
}

async function getFileVotesStatus(fileId, userId) {
  const file = await File.findOne({ fileId });

  if (!file) throw new Error('File not found');

  const upvotesCount = file.upvotes.length;
  const downvotesCount = file.downvotes.length;
  const userStatus = file.upvotes.includes(userId) ? 'upvoted' : (file.downvotes.includes(userId) ? 'downvoted' : 'none');

  return {
    upvotesCount,
    downvotesCount,
    userStatus
  };
}

module.exports = {createFileInfo, deleteFileInfo, upvoteFile, downvoteFile, removeUpvote, removeDownvote, getFileVotesStatus}