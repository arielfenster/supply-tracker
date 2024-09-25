חומרי ניקוי:
	ניקוי כללי
	ניקוי רצפה
	ניקוי כלים ומטבח
	ניקוי שירותים
	ניקוי בגדים
	היגיינה אישית

מזווה:
	קטניות
	רטבים
	שמנים
	תבלינים
	שתיה חמה

UI:
1. create a reuseable FormDialog component
2. create a reuseable Table component?

LOGIC:
[] remove react-hook-form?
[] normalize inventory data structure?
[] add lucia auth?
[] add social auth
[] ADD AUTH CHECKS FOR ALL ACTIONS:
	[] if user is logged in and userId exists in the cookie
	[] if the userId in the cookie is the same as the userId in the item itself
[] send a notification to the user every fixed interval with a list of the missing/low quantity items (for example, on the day the user goes to the shop)
[] add option to invite someone to your inventory management
[] browse page - see the current inventory
[] manage page - see other users that have access to the inventory
[] fix updateCategory and updateSubcategory methods to check for duplication

/**
 * when a user logins, he can choose between his last inventory, browse his existing inventories or create a new one
 * add measurement units - cups, liters, etc. add "custom" unit - the user will decide what and how much it is
 * add createdAt (date and time) and updatedAt (date and time) to schemas
 */
