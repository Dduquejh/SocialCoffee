type PastelButtonProps = {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    type?: "button" | "submit" | "reset";
    variant?: "rose" | "lavender" | "peach";
    className?: string;
};

export default function PastelButton({
    children,
    onClick,
    type = "button",
    variant = "rose",
    className = "",
}: PastelButtonProps) {
    const variants = {
        rose: "bg-[#D8A7B1] hover:bg-[#F4A698]",
        lavender: "bg-[#CBAACB] hover:bg-[#B89BB2]",
        peach: "bg-[#F4A698] hover:bg-[#f7b5a7]",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${variants[variant]} text-white font-semibold px-4 py-2 rounded transition-colors duration-300 ${className}`}
        >
            {children}
        </button>
    );
}
