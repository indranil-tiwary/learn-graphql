import { GraphQLServer } from 'graphql-yoga';
import db from './db';
import Comment from './resolvers/Comment';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Post from './resolvers/Post';
import User from './resolvers/User';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: { Comment, Query, Mutation, Post, User },
  context: {
    db
  }
});

server.start(() => {
  console.log('Bhiya chal gaya!');
});
