const User = {
  posts(parent, args, { db }, info) {
    const { id } = parent;
    return db.posts.filter((post) => post.author === id);
  },
  comments(parent, args, { db }, info) {
    const { id } = parent;
    return db.comments.filter((comment) => comment.author === id);
  },
};

export { User as default };
