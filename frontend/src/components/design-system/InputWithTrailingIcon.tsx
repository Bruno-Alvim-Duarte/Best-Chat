import Image from "next/image";

interface IInputWithTrailingIconProps {
    inputType: string;
    placeholder: string;
    svgPath: string;
    value: string;
    onChange: (e: { target: { name: string; value: string; }}) => void;
    name: string;
  }


export default function InputWithTrailingIcon({
    inputType,
    placeholder,
    svgPath,
    value,
    onChange,
    name,
}: IInputWithTrailingIconProps) {
    return (
      <div className="relative w-full max-w-md">
        <input
          type={inputType}
          className="w-full py-2 pr-9 bg-transparent border-b-2 border-white-300 focus:outline-none focus:border-gray-500"
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          name={name}
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <Image src={svgPath} alt="icon" width="20" height="20"/>
        </div>
      </div>
    );
  }
  