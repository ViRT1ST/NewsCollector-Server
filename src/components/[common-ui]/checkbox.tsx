'use client';

import { FaCheck } from 'react-icons/fa';
import { classesBeautify } from '@/utils/styles';

type Props = {
  children: React.ReactNode;
  uuid: string;
  name: string;
  isChecked: boolean;
  onCheckboxClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Checkbox({ children, uuid, name, isChecked, onCheckboxClick }: Props) {
  return (
    <div className={twContainer}>
      <input
        className={twInput}
        onChange={onCheckboxClick}
        type="checkbox"
        id={uuid}
        name={name}
        defaultChecked={isChecked}
      />

      <label className={twLabel} htmlFor={uuid}>
        {children}
      </label>

      <FaCheck className={twIcon} />
    </div>
  );
}

const twContainer = classesBeautify(`
  h-8 flex flex-row items-center
`);

const twInput = classesBeautify(`
  relative w-5 h-5 
  bg-white/60 peer shrink-0 appearance-none border border-transparent rounded
  hover:outline-0
  hover:[box-shadow:0px_0px_0px_4px_rgba(128,128,128,0.3)]
  
`);

const twLabel = classesBeautify(`
  px-2 pt-[1px]
`);

const twIcon = classesBeautify(`
  absolute w-3 h-3 ml-1 mt-[1px]
  text-black pointer-events-none hidden
  peer-checked:block
`);
