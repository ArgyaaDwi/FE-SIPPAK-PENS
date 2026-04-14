import React from "react";
interface HeaderSubFormProps {
  title: string;
}
const HeaderSubForm = ({ title }: HeaderSubFormProps) => {
  return (
    <h3 className="text-gray-800 text-lg font-bold px-4 pb-4 pt-2">{title}</h3>
  );
};

export default HeaderSubForm;
