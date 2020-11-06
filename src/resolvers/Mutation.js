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
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const { email, name, age } = data;
    const user = db.users.find((user) => user.id === id);
    if (!user) throw new Error('User Not Found');
    if (typeof email === 'string') {
      const emailTaken = db.users.some((user) => user.email === email);
      if (emailTaken) throw new Error('Email already taken');
      user.email = email;
    }
    if (typeof name === 'string') {
      user.name = name;
    }
    if (typeof age !== 'undefined') {
      user.age = age;
    }
    return user;
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
  createPost(parent, args, { db, pubsub }, info) {
    const { data } = args;
    const { author } = data;
    const userExists = db.users.some((user) => user.id === author);
    if (!userExists) throw new Error('User not found');
    const newPost = {
      id: uuidv4(),
      ...data,
    };
    db.posts.push(newPost);
    if (data.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: 'CREATED',
          data: newPost,
        },
      });
    }
    return newPost;
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const { title, body, published } = data;
    const post = db.posts.find((p) => p.id === id);
    if (!post) throw new Error('Post Not Found');
    const originalPost = { ...post };

    if (typeof title === 'string') {
      post.title = title;
    }
    if (typeof body === 'string') {
      post.body = body;
    }
    if (typeof published === 'boolean') {
      post.published = published;

      if (originalPost.published && !post.published) {
        // delete
        pubsub.publish(`post`, {
          post: {
            mutation: 'DELETED',
            data: post,
          },
        });
      } else if (!originalPost.published && post.published) {
        // Created
        pubsub.publish(`post`, {
          post: {
            mutation: 'CREATED',
            data: post,
          },
        });
      }
    } else if (post.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: 'UPDATED',
          data: post,
        },
      });
    }

    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const { id } = args;
    const postIdx = db.posts.findIndex((p) => p.id === id);
    if (postIdx < 0) throw new Error('Post Not Found');
    const [post] = db.posts.splice(postIdx, 1);
    if (post.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: 'DELETED',
          data: post,
        },
      });
    }
    db.comments = db.comments.filter((comment) => comment.post !== id);
    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
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
    pubsub.publish(`comment ${post}`, { comment: { mutation: "CREATED", data: comment } });
    return comment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const { text } = data;
    const comment = db.comments.find((c) => c.id === id);
    const { post } = comment
    if (!comment) throw new Error('Post Not Found');
    if (typeof text === 'string') {
      comment.text = text;
    }
    pubsub.publish(`comment ${post}`, { comment: { mutation: "UPDATED", data: comment } });

    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const { id } = args;
    console.log(id)
    const commentIdx = db.comments.findIndex((c) => c.id === id);
    if (commentIdx < 0) throw new Error('Comment Not Found');
    const deletedComment = db.comments.splice(commentIdx, 1);
    const { post } = deletedComment[0]
    pubsub.publish(`comment ${post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment[0],
      },
    });
    return deletedComment[0];
  },
};

export { Mutation as default };
