import labBgImg from "../assets/images/canna_lab_bg_1779749736485.png";

export default function AppBackground({
  activeSection = "home",
}: {
  activeSection?: string;
}) {
  const getGlowColors = () => {
    switch (activeSection) {
      case "live":
        return { primary: "bg-rose-500/10", secondary: "bg-emerald-500/10" };
      case "science":
        return { primary: "bg-blue-500/10", secondary: "bg-indigo-500/10" };
      case "simulator":
        return { primary: "bg-amber-500/10", secondary: "bg-emerald-500/10" };
      case "community":
        return { primary: "bg-purple-500/10", secondary: "bg-emerald-500/10" };
      default:
        return { primary: "bg-emerald-500/10", secondary: "bg-[#b87333]/10" };
    }
  };

  const colors = getGlowColors();

  return (
    <>
      <div
        id="bg-laboratory-layer"
        className="fixed inset-0 w-full h-full pointer-events-none transition-transform duration-200 ease-out z-0 opacity-20 scale-105 filter blur-[1px]"
        style={{
          backgroundImage: `url(${labBgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform:
            "translate3d(calc(var(--px-x, 0) * -18px), calc(var(--px-y, 0) * -18px), 0px) scale(1.05)",
        }}
      />

      <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-10 left-10 w-48 h-64 border-r border-white/5" />
        <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full border border-emerald-500/10 blur-xl" />
      </div>

      <div
        className={`absolute top-1/4 left-1/4 w-[400px] h-[400px] ${colors.primary} rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen transition-colors duration-1000`}
      />
      <div
        className={`absolute bottom-1/3 right-1/4 w-[500px] h-[500px] ${colors.secondary} rounded-full blur-[140px] pointer-events-none z-0 mix-blend-screen transition-colors duration-1000`}
      />

      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-white rounded-full blur-[1px]" />
        <div className="absolute bottom-1/2 left-2/3 w-1.5 h-1.5 bg-emerald-400 rounded-full blur-[1px]" />
        <div className="absolute top-2/3 left-1/4 w-1 h-1 bg-[#b87333] rounded-full blur-[1px]" />
        <div className="absolute top-20 right-40 w-1 h-1 bg-white rounded-full blur-[1px]" />
      </div>
    </>
  );
}
