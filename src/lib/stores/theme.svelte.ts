function createThemeStore() {
	let dark = $state(false);
	let initialized = false;

	function applyDark(value: boolean) {
		dark = value;
		if (initialized) {
			document.documentElement.classList.toggle('dark', value);
		}
	}

	return {
		get dark() {
			return dark;
		},
		set dark(value: boolean) {
			applyDark(value);
		},
		toggle() {
			this.dark = !dark;
		},
		init() {
			if (initialized) return;
			initialized = true;

			const mq = window.matchMedia('(prefers-color-scheme: dark)');
			applyDark(mq.matches);

			mq.addEventListener('change', (e) => {
				applyDark(e.matches);
			});
		}
	};
}

export const themeStore = createThemeStore();
