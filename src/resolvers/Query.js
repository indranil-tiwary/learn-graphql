const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query,
          },
          {
            email_contains: args.query,
          },
        ],
      };
    }

    return prisma.query.users(opArgs, info);
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [{
          title_contains: args.query
        }, {
          body_contains: args.query
        }]
      }
    }

    return prisma.query.posts(opArgs, info);
    // const { query } = args;
    // if (!query) return db.posts;
    // return db.posts.filter(
    //   (post) =>
    //     post.title.toLowerCase().includes(query.toLowerCase()) ||
    //     post.body.toLowerCase().includes(query.toLowerCase())
    // );
  },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
    // return db.comments;
  },
  me() {
    return {
      id: "123qwe",
      name: "Neil",
      email: "ne@g.com",
      age: 25,
    };
  },
  post() {
    return {
      id: "12345",
      title: "JSON",
      body: "ndkanda",
      published: true,
    };
  },
};

export { Query as default };
