import { createInviteHandler } from "$/data-access/handlers/invites.handler";
import { env } from "$/lib/env";
import { AppRoutes } from "$/lib/routes";
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Tailwind,
    Text,
} from "@react-email/components";

export function InviteEmail({
    invite,
}: {
    invite: NonNullable<Awaited<ReturnType<typeof createInviteHandler>>>;
}) {
    const linkUrl = `${env.server.HOST_URL}${AppRoutes.PAGES.INVITE.RESPONSE}?token=${invite.token}`;
    const senderName = invite.sender.firstName
        ? `${invite.sender.firstName} ${invite.sender.lastName}`
        : invite.sender.email;
    const recipientName = invite.recipient.firstName
        ? `${invite.recipient.firstName} ${invite.recipient.lastName}`
        : invite.recipient.email;

    return (
        <Html>
            <Head />
            <Preview>You&apos;re invited to collaborate on an inventory in Supply Tracker!</Preview>
            <Tailwind>
                <Body className="bg-gray-100 font-sans">
                    <Container className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md">
                        <div className="mb-6 w-16 h-16 bg-blue-500 rounded-full text-white text-xl font-bold mx-auto leading-[4rem] text-center">
                            ST
                        </div>
                        <Heading className="text-2xl font-extrabold text-gray-900 text-center">
                            Collaborate on an Inventory!
                        </Heading>
                        <Text className="text-gray-700 mt-4 text-lg">
                            Hi <strong>{recipientName}</strong>,
                        </Text>
                        <Text className="text-gray-700 mt-2 text-lg">
                            <strong>{senderName}</strong> has invited you to collaborate on his{" "}
                            <strong>{invite.inventory.name}</strong> inventory in Supply
                            Tracker.
                        </Text>
                        <Text className="text-gray-700 mt-4 text-lg">
                            Click the button below to accept the invitation and get started:
                        </Text>
                        <div className="text-center mt-6">
                            <Link
                                href={linkUrl}
                                className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-700 inline-block"
                            >
                                Accept Invitation
                            </Link>
                        </div>
                        <Text className="text-gray-500 text-sm mt-6 text-center">
                            If you didn’t expect this email, you can safely ignore it.
                        </Text>
                    </Container>
                    <div className="text-center text-gray-400 text-xs mt-4 py-4 bg-gray-50 border-t">
                        © {new Date().getFullYear()} Supply Tracker. All rights reserved.
                    </div>
                </Body>
            </Tailwind>
        </Html>
    );
}
