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
[@] MOBILE DESIGN!!!!!!
[] add lucia auth?
[] add social auth
[] ADD AUTH CHECKS FOR ALL ACTIONS:
	[] if user is logged in and userId exists in the cookie
	[] if the userId in the cookie is the same as the userId in the item itself
[] send a notification to the user every fixed interval with a list of the missing/low quantity items (for example, on the day the user goes to the shop)
[]? add a log of the recent changes to the inventory (item was updated, item was removed, subcategory was renamed, etc.)
[] when searching, it should search the current subcategory (by default). add a button/key to search globally

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
