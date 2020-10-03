import { GraphQLServer } from 'graphql-yoga';

// Scalar Types -> String, Boolean, Int, Float, ID

// default users
const users = [
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
    age: 25,
  },
  {
    id: '3',
    name: 'Shivendra 3',
    email: 'ne@g.com',
    age: 25,
  },
];

// Type definitions(schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        greeting(name: String): String!
        add(numbers: [Float!]!): Float!
        me: User!
        post: Post!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
        const {query} = args;
        if(!query) return users;
        return users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
    },
    greeting(parent, args, ctx, info) {
      const { name } = args;
      if (name) return `Hello ${name}`;
      return `Hello`;
    },
    add(parent, args, ctx, info) {
      const { numbers } = args;
      return numbers.reduce((total, num) => total + num, 0);
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
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('Bhiya chal gaya!');
});
