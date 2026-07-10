import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

export default function AdminSettings() {
	const { adminCredentials, updateAdminCredentials } = useAuthStore();

	// Form state
	const [displayName, setDisplayName] = useState(adminCredentials.name);
	const [newUserId, setNewUserId] = useState(adminCredentials.userId);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// Visibility toggles
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	// Feedback
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [saving, setSaving] = useState(false);

	const eyeOpen = (
		<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
			<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
			<path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
		</svg>
	);
	const eyeOff = (
		<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
			<path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
		</svg>
	);

	const handleSave = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		// Validate current password
		if (currentPassword !== adminCredentials.password) {
			setError("Current password is incorrect.");
			return;
		}

		// Validate new User ID
		if (!newUserId.trim()) {
			setError("Login ID cannot be empty.");
			return;
		}

		// Validate name
		if (!displayName.trim()) {
			setError("Display name cannot be empty.");
			return;
		}

		// Password change validation (only if user typed something in new password)
		let passwordPatch: string | undefined = undefined;
		if (newPassword) {
			if (newPassword.length < 6) {
				setError("New password must be at least 6 characters.");
				return;
			}
			if (newPassword !== confirmPassword) {
				setError("New passwords do not match.");
				return;
			}
			passwordPatch = newPassword;
		}

		setSaving(true);
		setTimeout(() => {
			updateAdminCredentials({
				userId: newUserId.trim(),
				name: displayName.trim(),
				...(passwordPatch ? { password: passwordPatch } : {}),
			});
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setSaving(false);
			setSuccess("Credentials updated successfully! Use your new credentials next time you log in.");
		}, 400);
	};

	const inputClass =
		"w-full px-4 py-3 pr-12 bg-[#0f111a] border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors";

	const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2";

	return (
		<div className="p-8 max-w-2xl mx-auto w-full space-y-8">
			<div>
				<h1 className="text-3xl font-extrabold tracking-tight text-white">Admin Settings</h1>
				<p className="mt-1 text-sm text-slate-400">Update your display name, login ID, and password.</p>
			</div>

			<div className="bg-[#161927] border border-white/5 rounded-2xl p-8 shadow-xl">
				<form onSubmit={handleSave} className="space-y-6">
					{/* Display Name */}
					<div>
						<label htmlFor="settings-name" className={labelClass}>
							Display Name
						</label>
						<input
							id="settings-name"
							type="text"
							value={displayName}
							onChange={(e) => setDisplayName(e.target.value)}
							placeholder="e.g., Workello Administrator"
							className="w-full px-4 py-3 bg-[#0f111a] border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
							autoComplete="name"
						/>
					</div>

					{/* Login ID */}
					<div>
						<label htmlFor="settings-userid" className={labelClass}>
							Login ID (Username)
						</label>
						<input
							id="settings-userid"
							type="text"
							value={newUserId}
							onChange={(e) => setNewUserId(e.target.value)}
							placeholder="e.g., Admin"
							className="w-full px-4 py-3 bg-[#0f111a] border border-white/10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
							autoComplete="username"
						/>
					</div>

					{/* Divider */}
					<div className="border-t border-white/5 pt-2">
						<p className="text-xs text-slate-500 mb-4">Change password — leave blank to keep current password.</p>
					</div>

					{/* Current Password */}
					<div>
						<label htmlFor="settings-current-pw" className={labelClass}>
							Current Password <span className="text-red-400">*</span>
						</label>
						<div className="relative">
							<input
								id="settings-current-pw"
								type={showCurrent ? "text" : "password"}
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								placeholder="••••••••"
								className={inputClass}
								autoComplete="current-password"
							/>
							<button
								type="button"
								onClick={() => setShowCurrent((v) => !v)}
								className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
								tabIndex={-1}
								aria-label={showCurrent ? "Hide" : "Show"}
							>
								{showCurrent ? eyeOff : eyeOpen}
							</button>
						</div>
					</div>

					{/* New Password */}
					<div>
						<label htmlFor="settings-new-pw" className={labelClass}>
							New Password
						</label>
						<div className="relative">
							<input
								id="settings-new-pw"
								type={showNew ? "text" : "password"}
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								placeholder="Min. 6 characters"
								className={inputClass}
								autoComplete="new-password"
							/>
							<button
								type="button"
								onClick={() => setShowNew((v) => !v)}
								className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
								tabIndex={-1}
								aria-label={showNew ? "Hide" : "Show"}
							>
								{showNew ? eyeOff : eyeOpen}
							</button>
						</div>
					</div>

					{/* Confirm New Password */}
					<div>
						<label htmlFor="settings-confirm-pw" className={labelClass}>
							Confirm New Password
						</label>
						<div className="relative">
							<input
								id="settings-confirm-pw"
								type={showConfirm ? "text" : "password"}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="••••••••"
								className={inputClass}
								autoComplete="new-password"
							/>
							<button
								type="button"
								onClick={() => setShowConfirm((v) => !v)}
								className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
								tabIndex={-1}
								aria-label={showConfirm ? "Hide" : "Show"}
							>
								{showConfirm ? eyeOff : eyeOpen}
							</button>
						</div>
					</div>

					{/* Error */}
					{error && (
						<div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 leading-relaxed">
							{error}
						</div>
					)}

					{/* Success */}
					{success && (
						<div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 leading-relaxed flex items-start gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
								<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							{success}
						</div>
					)}

					<button
						type="submit"
						disabled={saving || !currentPassword}
						className="w-full py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-md shadow-indigo-600/10"
					>
						{saving ? "Saving…" : "Save Changes"}
					</button>
				</form>
			</div>

			{/* Current credentials info */}
			<div className="bg-[#161927] border border-white/5 rounded-2xl p-6">
				<h3 className="text-sm font-bold text-slate-300 mb-3">Current Credentials</h3>
				<div className="space-y-2 text-xs text-slate-400">
					<div className="flex justify-between">
						<span>Display Name</span>
						<span className="text-white font-medium">{adminCredentials.name}</span>
					</div>
					<div className="flex justify-between">
						<span>Login ID</span>
						<span className="text-white font-medium">{adminCredentials.userId}</span>
					</div>
					<div className="flex justify-between">
						<span>Password</span>
						<span className="text-white font-medium">{"•".repeat(adminCredentials.password.length)}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
