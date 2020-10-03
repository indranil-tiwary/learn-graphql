const Comment = {
  author(parent, args, { db }, info) {
    const { author } = parent;
    return db.users.find((user) => user.id === author);
  },
  post(parent, args, { db }, info) {
    const { post } = parent;
    return db.posts.find((p) => p.id === post);
  },
};

export { Comment as default };
