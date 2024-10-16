import { Invite, User } from '$/db/schemas';
import { env } from '$/lib/env';
import { Resend } from 'resend';

const resend = new Resend(env.server.EMAIL.API_KEY);

export async function sendInviteEmail(invite: Invite & { sender: User; recipient: User }) {
	invite.recipient.email = 'arielfenster1610@gmail.com';

	try {
		const response = await resend.emails.send({
			from: 'opensource.hub.manager@gmail.com',
			to: invite.recipient.email,
			subject: "You're Invited to Collaborate on an Inventory",
			html: `<div>hello</div>`,
		});

		console.log(response);
	} catch (error) {
		console.error(
			`Failed to send invite email. payload: ${JSON.stringify(invite)}. error: `,
			error,
		);
		throw error;
	}
}
