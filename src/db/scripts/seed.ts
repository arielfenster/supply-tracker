import { hashPassword } from '$/services/auth/password.service';
import 'dotenv/config';
import { db } from '../db';
import {
	categories,
	inventories,
	items,
	subcategories,
	users,
	usersToInventories,
} from '../schemas';

async function main() {
	const [user] = await db
		.insert(users)
		.values({
			email: 'ariel@gmail.com',
			password: await hashPassword('arielfenster'),
		})
		.returning();

	const [inventory] = await db.insert(inventories).values({ name: 'Home', ownerId: user.id }).returning();

	await db
		.insert(usersToInventories)
		.values({ inventoryId: inventory.id, userId: user.id, role: 'Owner' })
		.returning();

	// Insert categories
	const newCategories = await db
		.insert(categories)
		.values([
			{ name: 'Pantry Staples', inventoryId: inventory.id },
			{ name: 'Snacks', inventoryId: inventory.id },
			{ name: 'Beverages', inventoryId: inventory.id },
		])
		.returning();

	// Insert subcategories
	const newSubcategories = await db
		.insert(subcategories)
		.values([
			{ name: 'Grains & Rice', categoryId: newCategories[0].id },
			{ name: 'Canned Goods', categoryId: newCategories[0].id },
			{ name: 'Chips & Crackers', categoryId: newCategories[1].id },
			{ name: 'Nuts & Seeds', categoryId: newCategories[1].id },
			{ name: 'Tea & Coffee', categoryId: newCategories[2].id },
			{ name: 'Juices', categoryId: newCategories[2].id },
		])
		.returning();

	// Insert items (with some below warning, danger thresholds, and out of stock)
	await db
		.insert(items)
		.values([
			// Grains & Rice
			{
				id: 'item-1',
				name: 'Brown Rice',
				quantity: '1',
				measurement: 'Kg',
				warningThreshold: 2,
				dangerThreshold: 1,
				subcategoryId: newSubcategories[0].id,
			}, // Below warning threshold
			{
				id: 'item-2',
				name: 'Quinoa',
				quantity: '0',
				measurement: 'Kg',
				warningThreshold: 2,
				dangerThreshold: 1,
				subcategoryId: newSubcategories[0].id,
			}, // Out of stock

			// Canned Goods
			{
				id: 'item-3',
				name: 'Chickpeas',
				quantity: '4',
				measurement: 'Kg',
				warningThreshold: 5,
				dangerThreshold: 2,
				subcategoryId: newSubcategories[1].id,
			}, // Below warning threshold
			{
				id: 'item-4',
				name: 'Black Beans',
				quantity: '2',
				measurement: 'Kg',
				warningThreshold: 4,
				dangerThreshold: 2,
				subcategoryId: newSubcategories[1].id,
			}, // On the danger threshold

			// Chips & Crackers
			{
				id: 'item-5',
				name: 'Tortilla Chips',
				quantity: '4',
				measurement: 'Piece',
				warningThreshold: 2,
				dangerThreshold: 1,
				subcategoryId: newSubcategories[2].id,
			}, // Normal stock
			{
				id: 'item-6',
				name: 'Whole Wheat Crackers',
				quantity: '0',
				measurement: 'Piece',
				warningThreshold: 3,
				dangerThreshold: 1,
				subcategoryId: newSubcategories[2].id,
			}, // Out of stock

			// Nuts & Seeds
			{
				id: 'item-7',
				name: 'Almonds',
				quantity: '1',
				measurement: 'Bag',
				warningThreshold: 1,
				dangerThreshold: 0.5,
				subcategoryId: newSubcategories[3].id,
			}, // Just above danger threshold
			{
				id: 'item-8',
				name: 'Pumpkin Seeds',
				quantity: '0.2',
				measurement: 'Bag',
				warningThreshold: 0.5,
				dangerThreshold: 0.25,
				subcategoryId: newSubcategories[3].id,
			}, // Below danger threshold

			// Tea & Coffee
			{
				id: 'item-9',
				name: 'Green Tea',
				quantity: '3',
				measurement: 'Piece',
				warningThreshold: 5,
				dangerThreshold: 2,
				subcategoryId: newSubcategories[4].id,
			}, // Below warning threshold
			{
				id: 'item-10',
				name: 'Ground Coffee',
				quantity: '1.5',
				measurement: 'Cup',
				warningThreshold: 1,
				dangerThreshold: 0.5,
				subcategoryId: newSubcategories[4].id,
			}, // Normal stock

			// Juices
			{
				id: 'item-11',
				name: 'Orange Juice',
				quantity: '0.5',
				measurement: 'Liter',
				warningThreshold: 1,
				dangerThreshold: 0.5,
				subcategoryId: newSubcategories[5].id,
			}, // On the danger threshold
			{
				id: 'item-12',
				name: 'Apple Juice',
				quantity: '1',
				measurement: 'Liter',
				warningThreshold: 2,
				dangerThreshold: 1,
				subcategoryId: newSubcategories[5].id,
			}, // Below warning threshold
		])
		.returning();
}

main().finally(() => console.log('Successfully seeded the database'));
