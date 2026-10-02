function Button({ Icon, color }) {
  return (
    <div className="bg-blue-200  w-fit px-2 py-1 rounded-md flex items-center gap-1">
      <Icon color={color} size={15} />
      <p className=" text-xs font-medium" style={{ color: color }}>
        204
      </p>
    </div>
  );
}

export default Button;
