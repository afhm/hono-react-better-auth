import { pool } from '../server/db/db';
import { user, todos } from '../server/db/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { randomUUID } from 'crypto';

const seedDb = async () => {
  const db = drizzle(pool);

  console.log('Starting database seed...');

  try {
    // Clear existing data
    await db.delete(todos);
    await db.delete(user);

    // Create test users
    const testUsers = [
      {
        id: `user_${randomUUID()}`,
        name: 'John Doe',
        email: 'john@example.com',
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: `user_${randomUUID()}`,
        name: 'Jane Smith',
        email: 'jane@example.com',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: `user_${randomUUID()}`,
        name: 'Bob Wilson',
        email: 'bob@example.com',
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Insert users
    const insertedUsers = await db.insert(user).values(testUsers).returning();
    console.log(`Created ${insertedUsers.length} users`);

    // Create todos for each user
    const todosToInsert = [];
    const todoTitles = [
      'Buy groceries',
      'Read a book',
      'Call mom',
      'Finish project',
      'Exercise',
      'Learn something new',
      'Clean the house',
      'Pay bills',
    ];

    for (const insertedUser of insertedUsers) {
      // Create 3-5 todos per user
      const todoCount = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < todoCount; i++) {
        todosToInsert.push({
          userId: insertedUser.id,
          title: todoTitles[Math.floor(Math.random() * todoTitles.length)],
          subtitle: Math.random() > 0.5 ? 'Important task' : null,
          description: Math.random() > 0.5 ? 'Need to complete this soon' : null,
          completed: Math.random() > 0.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // Insert todos
    const insertedTodos = await db.insert(todos).values(todosToInsert).returning();
    console.log(`Created ${insertedTodos.length} todos`);

    console.log('✅ Database seeded successfully!');

    // Display summary
    console.log('\nSeed Summary:');
    console.log('=============');
    for (const seedUser of insertedUsers) {
      const userTodos = insertedTodos.filter(t => t.userId === seedUser.id);
      console.log(`${seedUser.name} (${seedUser.email}): ${userTodos.length} todos`);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

seedDb()
  .then(() => {
    console.log('Seed completed');
    return pool.end();
  })
  .catch((err) => {
    console.error(`Failed to seed database:\n${err}`);
    pool.end().then(() => process.exit(1));
  });