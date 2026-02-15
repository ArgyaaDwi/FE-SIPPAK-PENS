interface CardChartProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}
const CardChart = ({ children, title, subtitle }: CardChartProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <h1 className="pt-3 px-4 text-black text-lg font-bold">{title}</h1>
      <p className="px-4 pb-3 text-gray-600 text-xs font-normal">{subtitle}</p>
      <hr />
      <div className="px-4 py-3">{children}</div>
    </div>
  );
};
export default CardChart;
