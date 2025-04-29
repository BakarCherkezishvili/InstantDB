// instant.schema.ts

import { i } from '@instantdb/react';
import { init, id } from '@instantdb/react';

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
});

db.transact(db.tx.goals[id()].update({ title: 'eat' }));

db.transact(
  db.tx.goals[id()].update({
    priority: 'none',
    isSecret: true,
    value: 10,
    aList: [1, 2, 3],
    anObject: { foo: 'bar' },
  }),
);

db.transact(
  db.tx.goals[id()].update({
    title: ['eat', 'sleep', 'hack', 'repeat'][Math.floor(Math.random() * 4)],
  }),
);

const eatId = id();
db.transact(
  db.tx.goals[eatId].update({ priority: 'top', lastTimeEaten: 'Yesterday' }),
);

db.transact(db.tx.goals[eatId].update({ lastTimeEaten: 'Today' }));

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    profiles: i.entity({
      nickname: i.string(),
      createdAt: i.date(),
    }),
    posts: i.entity({
      title: i.string(),
      body: i.string(),
      createdAt: i.date(),
    }),
    comments: i.entity({
      body: i.string(),
      createdAt: i.date(),
    }),
    tags: i.entity({
      title: i.string(),
    }),
  },
  links: {
    postAuthor: {
      forward: { on: 'posts', has: 'one', label: 'author' },
      reverse: { on: 'profiles', has: 'many', label: 'authoredPosts' },
    },
    commentPost: {
      forward: { on: 'comments', has: 'one', label: 'post' },
      reverse: { on: 'posts', has: 'many', label: 'comments' },
    },
    commentAuthor: {
      forward: { on: 'comments', has: 'one', label: 'author' },
      reverse: { on: 'profiles', has: 'many', label: 'authoredComments' },
    },
    postsTags: {
      forward: { on: 'posts', has: 'many', label: 'tags' },
      reverse: { on: 'tags', has: 'many', label: 'posts' },
    },
    profileUser: {
      forward: { on: 'profiles', has: 'one', label: '$user' },
      reverse: { on: '$users', has: 'one', label: 'profile' },
    },
  },
});

// This helps Typescript display better intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema { }
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;