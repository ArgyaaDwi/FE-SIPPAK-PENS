import React from "react";
interface HeaderFormProps {
  title: string;
}
const HeaderForm = ({ title }: HeaderFormProps) => {
  return (
    <h3 className="text-black text-xl font-bold px-4 pb-4 pt-2">{title}</h3>
  );
};

export default HeaderForm;
