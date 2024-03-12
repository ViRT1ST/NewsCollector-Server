'use client';

import { FaCheck } from 'react-icons/fa';
import tw from 'tailwind-styled-components';

const Checkbox = ({
  id = null,
  name = null,
  isChecked = false,
  onCheckboxClick,
  children
}) => {
  return (
    <Container onClick={onCheckboxClick}>
      <Input type="checkbox" id={id} name={name} defaultChecked={isChecked} />
      <Label htmlFor={id}>
        {children}
      </Label>
      <Icon />
    </Container>
  );
};

const Container = tw.div`
  h-8 flex flex-row items-center
`;

const Input = tw.input`
  bg-white/60

  w-5 h-5 
  relative peer shrink-0 appearance-none border-0 rounded

  hover:outline-0
  hover:[box-shadow:0px_0px_0px_4px_rgba(128,128,128,0.3)]
`;

const Icon = tw(FaCheck)`
  text-black
  absolute w-3 h-3 ml-1 mt-[1px]
  pointer-events-none hidden peer-checked:block
`;

const Label = tw.label`
  px-2 pt-[1px]
`;

export default Checkbox;
