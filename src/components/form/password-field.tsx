'use client';

import Image from 'next/image';
import { forwardRef, useState } from 'react';
import { TextField, TextFieldProps } from './textfield';
import { MIN_PASSWORD_LENGTH } from '$/schemas/auth/password.schema';

interface PasswordFieldProps extends Partial<TextFieldProps> {}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
	function PasswordField({ label = 'Password', name = 'password', ...rest }, ref) {
		const [showPassword, setShowPassword] = useState(false);

		function handleEyeClick() {
			setShowPassword(!showPassword);
		}

		return (
			<div className='w-full relative flex flex-row justify-between'>
				<TextField
					label={label}
					name={name}
					ref={ref}
					type={showPassword ? 'text' : 'password'}
					required
					placeholder={`Minimum ${MIN_PASSWORD_LENGTH} characters`}
					{...rest}
					endIcon={
						<Image
							className='h-5 w-5 cursor-pointer'
							onClick={handleEyeClick}
							width={20}
							height={20}
							src={
								showPassword
									? '/icons/password/show-password.png'
									: '/icons/password/hide-password.png'
							}
							alt=''
						/>
					}
				/>
			</div>
		);
	},
);
