import { InviteMemberForm } from './invite-member-form';

interface MembersTabProps {}

export function MembersTab({}: MembersTabProps) {
	return (
		<div className='border rounded-md p-6 flex flex-col justify-between'>
			<h2 className='text-2xl font-semibold mb-1'>Invite New Member</h2>
			<p className='text-sm'>Invite a new member to collaborate on this inventory</p>
			<div className='mt-6'>
				<InviteMemberForm />
			</div>
		</div>
	);
}
