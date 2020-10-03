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
    age: 22,
  },
  {
    id: '3',
    name: 'Shivendra 3',
    email: 'ne@g.com',
    age: 23,
  },
];

const posts = [
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

const comments = [
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

const db = {
  users,
  posts,
  comments,
};

export { db as default };