import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';
// Scalar Types -> String, Boolean, Int, Float, ID

// default users
let users = [
  {
    id: '1',
    name: 'Neil',
    email: 'ne@g.com',
    age: 25,
  },
  {
    id: '2',
    name: 'Mayuri 2',
    email: 'ne@g.com',
    age: 22,
  },
  {
    id: '3',
    name: 'Shivendra 3',
    email: 'ne@g.com',
    age: 23,
  },
];

let posts = [
  {
    id: '10',
    title: 'Test',
    body: 'qweq12',
    published: true,
    author: '1',
  },
  {
    id: '11',
    title: 'JSON',
    body: 'ndkanda',
    published: true,
    author: '1',
  },
  {
    id: '12',
    title: 'Graphana',
    body: 'elastic',
    published: false,
    author: '2',
  },
];

let comments = [
  {
    id: '1',
    text: 'bebe',
    author: '1',
    post: '10',
  },
  {
    id: '2',
    text: 'Fuck',
    author: '3',
    post: '11',
  },
  {
    id: '3',
    text: 'Bruh',
    author: '2',
    post: '10',
  },
  {
    id: '4',
    text: 'test',
    author: '1',
    post: '12',
  },
];

// Type definitions(schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }
    type Mutation {
        createUser(data: CreateUserInput!): User!
        createPost(data: CreatePostInput!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteUser(id: ID!): User!
        deletePost(id: ID!): Post!
        deleteComment(id: ID!): Comment!
    }
    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }
    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }
    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int,
        posts: [Post!]!
        comments: [Comment!]!
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      const { query } = args;
      if (!query) return users;
      return users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
    },
    posts(parent, args, ctx, info) {
      const { query } = args;
      if (!query) return posts;
      return posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase())
      );
    },
    comments(parent, args, ctx, info) {
      return comments;
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
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const { data } = args;
      const { email } = data;
      const emailTaken = users.some((user) => user.email === email);
      if (emailTaken) throw new Error('Email Taken');
      const newUser = {
        id: uuidv4(),
        ...data,
      };
      users.push(newUser);
      return newUser;
    },
    deleteUser(parent, args, ctx, info) {
      const { id } = args;
      const userIdx = users.findIndex((user) => user.id === id);
      if (userIdx < 0) throw new Error('User Not Found');
      const deletedUser = users.splice(userIdx, 1);

      posts = posts.filter((post) => {
        const match = post.author === id;
        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id);
        }
        return !match;
      });

      comments = comments.filter((comment) => comment.author !== id);

      return deletedUser[0];
    },
    createPost(parent, args, ctx, info) {
      const { data } = args;
      const { author } = data;
      const userExists = users.some((user) => user.id === author);
      if (!userExists) throw new Error('User not found');
      const newPost = {
        id: uuidv4(),
        ...data,
      };
      posts.push(newPost);
      return newPost;
    },
    deletePost(parent, args, ctx, info) {
      const { id } = args;
      const postIdx = posts.findIndex((p) => p.id === id);
      if (postIdx < 0) throw new Error('Post Not Found');
      const deletedPost = posts.splice(postIdx, 1);
      comments = comments.filter((comment) => comment.post !== id);
      return deletedPost[0];
    },
    createComment(parent, args, ctx, info) {
      const { data } = args;
      const { author, post } = data;
      const userExists = users.some((user) => user.id === author);
      if (!userExists) throw new Error('User not found');
      const postData = posts.find((p) => p.id === post);
      if (!postData) throw new Error('Post not found');
      if (!postData.published) throw new Error('Post not published');
      const comment = {
        id: uuidv4(),
        ...data,
      };
      comments.push(comment);
      return comment;
    },
    deleteComment(parent, args, ctx, info) {
      const { id } = args;
      const commentIdx = comments.findIndex((c) => c.id === id);
      if (commentIdx < 0) throw new Error('Comment Not Found');
      const deletedComment = comments.splice(commentIdx, 1);
      return deletedComment[0];
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      const { author } = parent;
      return users.find((user) => user.id === author);
    },
    comments(parent, args, ctx, info) {
      const { id } = parent;
      return comments.filter((comment) => comment.post === id);
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      const { id } = parent;
      return posts.filter((post) => post.author === id);
    },
    comments(parent, args, ctx, info) {
      const { id } = parent;
      return comments.filter((comment) => comment.author === id);
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      const { author } = parent;
      return users.find((user) => user.id === author);
    },
    post(parent, args, ctx, info) {
      const { post } = parent;
      return posts.find((p) => p.id === post);
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('Bhiya chal gaya!');
});
