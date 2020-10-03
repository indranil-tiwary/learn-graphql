const Query = {
  users(parent, args, { db }, info) {
    const { query } = args;
    if (!query) return db.users;
    return db.users.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  },
  posts(parent, args, { db }, info) {
    const { query } = args;
    if (!query) return db.posts;
    return db.posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.body.toLowerCase().includes(query.toLowerCase())
    );
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
  me() {
    return {
      id: '123qwe',
      name: 'Neil',
      email: 'ne@g.com',
      age: 25,
    };
  },
  post() {
    return {
      id: '12345',
      title: 'JSON',
      body: 'ndkanda',
      published: true,
    };
  },
};

export { Query as default };