import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
});

export { prisma as default };

// const createPostForUser = async (authorId, data) => {
//   const userExists = await prisma.exists.User({ id: authorId });

//   if (!userExists) {
//     throw new Error("User not found!");
//   }

//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorId,
//           },
//         },
//       },
//     },
//     `{ id }`
//   );
//   const user = await prisma.query.user(
//     {
//       where: {
//         id: authorId,
//       },
//     },
//     `{ id name email posts { id title published } }`
//   );

//   return user;
// };

// createPostForUser("ckh6irenf00260841nom5asfa", {
//   title: "Book One",
//   body: "Yo Yo",
//   published: true,
// }).then((d) => console.log(JSON.stringify(d, undefined, 2)));

// const updatePostForUser = async (postId, data) => {
//   const post = await prisma.mutation.updatePost(
//     {
//       data,
//       where: {
//         id: postId,
//       },
//     },
//     `{ author { id } }`
//   );
//   const user = await prisma.query.user(
//     {
//       where: {
//         id: post.author.id,
//       },
//     },
//     `{ id name email posts { id title published } }`
//   );
//   return user;
// };

// updatePostForUser("ckh6k5g1n00640841ndzw4xwd", {
//   title: "Book Two",
//   body: "Yo Yo Again",
// }).then((d) => console.log(JSON.stringify(d, undefined, 2)));
