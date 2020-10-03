const Post = {
  author(parent, args, { db }, info) {
    const { author } = parent;
    return db.users.find((user) => user.id === author);
  },
  comments(parent, args, { db }, info) {
    const { id } = parent;
    return db.comments.filter((comment) => comment.post === id);
  },
};

export { Post as default };
