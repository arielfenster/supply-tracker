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
[@] add option to invite someone to your inventory management
[] manage page - see other users that have access to the inventory

/**
 * when a user logins, he can choose between his last inventory, browse his existing inventories or create a new one
 */


/**
	* 1. dashboard page - a summary of the user's inventories (if he has any).
	* each item will be a card with the inventory name, (number of users?), and a line that represents the summary of the inventory - how many items are in stock, low quantity, danger quantity or out of stock,
	* painted in green -> orange -> red -> black.
	* the item is clickable and will redirect the user to that inventory.
	* there will also be a button to create a new inventory
	* if the user doesn't have any inventories, he will only see the button to create a new one.
	* the form to create new inventory should be very small - only name, and be in the same page without navigation. either a dialog form or a simple input element
	*
	* 2. inventories/browse -
	* 3. inventories/manage - 
 */
