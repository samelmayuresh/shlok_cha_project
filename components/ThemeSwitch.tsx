'use client';

interface ThemeSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const ThemeSwitch = ({ checked = false, onChange }: ThemeSwitchProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <div className="relative inline-block w-[4em] h-[2.2em]">
      <label className="block w-full h-full relative cursor-pointer">
        <input
          checked={!checked}
          onChange={handleChange}
          type="checkbox"
          role="switch"
          aria-label="Toggle dark mode"
          aria-checked={checked}
          className="opacity-0 w-0 h-0"
        />

        {/* Slider */}
        <span className={`absolute inset-0 rounded-[30px] transition-colors duration-400 overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.1)] ${!checked ? 'bg-[#00a6ff]' : 'bg-[#2a2a2a]'}`}>

          {/* Toggle Knob */}
          <span
            className={`absolute left-[0.5em] bottom-[0.5em] w-[1.2em] h-[1.2em] rounded-[20px] transition-all duration-400 ease-[cubic-bezier(0.81,-0.04,0.38,1.5)] bg-transparent
                        ${!checked
                ? 'translate-x-[1.8em] shadow-[inset_15px_-4px_0px_15px_#ffcf48]'
                : 'translate-x-0 shadow-[inset_8px_-4px_0px_0px_#fff]'
              }`}
          ></span>

          {/* Stars - Visible in Dark Mode */}
          <div className={`transition-opacity duration-400 ${!checked ? 'opacity-0' : 'opacity-100'}`}>
            <div className="absolute w-[5px] h-[5px] bg-white rounded-full left-[2.5em] top-[0.5em]"></div>
            <div className="absolute w-[5px] h-[5px] bg-white rounded-full left-[2.2em] top-[1.2em]"></div>
            <div className="absolute w-[5px] h-[5px] bg-white rounded-full left-[3em] top-[0.9em]"></div>
          </div>

          {/* Cloud - Visible in Light Mode */}
          <div className={`absolute w-[3.5em] bottom-[-1.4em] left-[-1.1em] transition-opacity duration-400 ${!checked ? 'opacity-100' : 'opacity-0'}`}>
            <svg viewBox="0 0 16 16">
              <path transform="matrix(.77976 0 0 .78395-299.99-418.63)" fill="#fff" d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925" />
            </svg>
          </div>
        </span>
      </label>
    </div>
  );
};

export default ThemeSwitch;
