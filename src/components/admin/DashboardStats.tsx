interface Props {
  totalOrders: number;
  totalRevenuePaise: number;
  pendingCount: number;
  confirmedCount: number;
}

export default function DashboardStats({
  totalOrders,
  totalRevenuePaise,
  pendingCount,
  confirmedCount,
}: Props) {
  const stats = [
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      icon: "📦",
      sub: "all time",
    },
    {
      label: "Revenue",
      value: `₹${(totalRevenuePaise / 100).toLocaleString("en-IN")}`,
      icon: "💰",
      sub: "confirmed + delivered",
    },
    {
      label: "Pending Payment",
      value: pendingCount.toString(),
      icon: "⏳",
      sub: "awaiting",
    },
    {
      label: "Confirmed",
      value: confirmedCount.toString(),
      icon: "✅",
      sub: "in production",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white border border-[#e8e0d0] p-5 space-y-2"
        >
          <p className="text-xl">{s.icon}</p>
          <p className="text-2xl font-serif font-light text-[#1a2744]">{s.value}</p>
          <div>
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-[#1a2744]">
              {s.label}
            </p>
            <p className="text-[10px] text-[#1a2744]/40 mt-0.5">{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
