import { v4 as uuidv4 } from 'uuid';

const Mutation = {
  createUser(parent, args, { db }, info) {
    const { data } = args;
    const { email } = data;
    const emailTaken = db.users.some((user) => user.email === email);
    if (emailTaken) throw new Error('Email Taken');
    const newUser = {
      id: uuidv4(),
      ...data,
    };
    db.users.push(newUser);
    return newUser;
  },
  deleteUser(parent, args, { db }, info) {
    const { id } = args;
    const userIdx = db.users.findIndex((user) => user.id === id);
    if (userIdx < 0) throw new Error('User Not Found');
    const deletedUser = db.users.splice(userIdx, 1);

    db.posts = db.posts.filter((post) => {
      const match = post.author === id;
      if (match) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
      }
      return !match;
    });

    db.comments = db.comments.filter((comment) => comment.author !== id);

    return deletedUser[0];
  },
  createPost(parent, args, { db }, info) {
    const { data } = args;
    const { author } = data;
    const userExists = db.users.some((user) => user.id === author);
    if (!userExists) throw new Error('User not found');
    const newPost = {
      id: uuidv4(),
      ...data,
    };
    db.posts.push(newPost);
    return newPost;
  },
  deletePost(parent, args, { db }, info) {
    const { id } = args;
    const postIdx = db.posts.findIndex((p) => p.id === id);
    if (postIdx < 0) throw new Error('Post Not Found');
    const deletedPost = db.posts.splice(postIdx, 1);
    db.comments = db.comments.filter((comment) => comment.post !== id);
    return deletedPost[0];
  },
  createComment(parent, args, { db }, info) {
    const { data } = args;
    const { author, post } = data;
    const userExists = db.users.some((user) => user.id === author);
    if (!userExists) throw new Error('User not found');
    const postData = db.posts.find((p) => p.id === post);
    if (!postData) throw new Error('Post not found');
    if (!postData.published) throw new Error('Post not published');
    const comment = {
      id: uuidv4(),
      ...data,
    };
    db.comments.push(comment);
    return comment;
  },
  deleteComment(parent, args, { db }, info) {
    const { id } = args;
    const commentIdx = db.comments.findIndex((c) => c.id === id);
    if (commentIdx < 0) throw new Error('Comment Not Found');
    const deletedComment = db.comments.splice(commentIdx, 1);
    return deletedComment[0];
  },
};

export { Mutation as default };