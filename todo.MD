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
[] !!!! move all the "heavy" logic from data-access files to the services
[] navbar - show "manage" only to editors and owners. remove the checks in the manage page components
[] when updating/adding/removing item/category/subcategory, update the updatedAt timestamp for the inventory itself
[]? add a log of the recent changes to the inventory (item was updated, item was removed, subcategory was renamed, etc.)
[] add option to move item to a different category/subcategory
	1. the items display form(s) will be removed (which will also help complete the migration to the useFormSubmission hook)
	2. add an "actions" dropdown column with edit and delete
	3. edit will open a dialog with the item form
	4. in there, there will be an option to move it to a different (sub)category

/\*\*
_ 1. dashboard page - a summary of the user's inventories (if he has any).
_ each item will be a card with the inventory name, (number of users?), and a line that represents the summary of the inventory - how many items are in stock, low quantity, danger quantity or out of stock,
_ painted in green -> orange -> red -> black.
_ the item is clickable and will redirect the user to that inventory.
_ there will also be a button to create a new inventory
_ if the user doesn't have any inventories, he will only see the button to create a new one.
_ the form to create new inventory should be very small - only name, and be in the same page without navigation. either a dialog form or a simple input element
_
_ 2. inventories/browse -
_ 3. inventories/manage -
\*/
