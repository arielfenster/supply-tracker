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
[@] add RHF to all forms
[] add client form validation to items table and edit sidebar item
[] add lucia auth?
[] add social auth
[] ADD AUTH CHECKS FOR ALL ACTIONS:
	[] if user is logged in and userId exists in the cookie
	[] if the userId in the cookie is the same as the userId in the item itself
[] send a notification to the user every fixed interval with a list of the missing/low quantity items (for example, on the day the user goes to the shop)
[] add option to invite someone to your inventory management
[] manage page - see other users that have access to the inventory

/**
 * when a user logins, he can choose between his last inventory, browse his existing inventories or create a new one
 */
