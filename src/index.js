import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import Post from './resolvers/Post';
import User from './resolvers/User';
import Comment from './resolvers/Comment';
import './prisma'

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: { Query, Subscription, Mutation, Post, User, Comment },
  context: {
    db,
    pubsub,
  },
});

server.start(() => {
  console.log('Bhiya chal gaya!');
});
