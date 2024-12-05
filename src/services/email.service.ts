import { env } from '$/lib/env';
import { render } from '@react-email/components';
import sendgrid from '@sendgrid/mail';
import { ReactElement } from 'react';

sendgrid.setApiKey(env.server.EMAIL.API_KEY);

type SendEmailPayload = {
	to: string;
	subject: string;
	body: ReactElement
}

export async function sendEmail(payload: SendEmailPayload) {
	const { to, subject, body } = payload;

	try {
		const response = await sendgrid.send({
			from: env.server.EMAIL.SENDER,
			to,
			subject,
			html: await render(body)
		});
		if (response[0].statusCode === 202) {
			console.log('Email is sent succesfully');
		} else {
			console.log('Email is not sent succesfully: ', response);
		}
	} catch (error) {
		console.error(
			`Failed to send invite email. payload: ${JSON.stringify({to, subject})}. error: `,
			error,
		);
		throw error;
	}
}
