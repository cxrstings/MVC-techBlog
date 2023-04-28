const fs = require('fs');
const path = require('path');
const { User, Post, Comment } = require('../models');

const usersSeedFile = path.join(__dirname, 'users.json');
const postsSeedFile = path.join(__dirname, 'posts.json');
const commentsSeedFile = path.join(__dirname, 'comments.json');

const seedUsers = JSON.parse(fs.readFileSync(usersSeedFile, 'utf-8'));
const seedPosts = JSON.parse(fs.readFileSync(postsSeedFile, 'utf-8'));
const seedComments = JSON.parse(fs.readFileSync(commentsSeedFile, 'utf-8'));

async function seed() {
  try {
    await User.bulkCreate(seedUsers, { individualHooks: true });
    console.log('Users seeded successfully.');

    await Post.bulkCreate(seedPosts, { individualHooks: true });
    console.log('Posts seeded successfully.');

    await Comment.bulkCreate(seedComments);
    console.log('Comments seeded successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();