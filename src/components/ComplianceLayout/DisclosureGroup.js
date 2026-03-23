const DisclosureGroup = ({ title, children }) => {
    return (
        <div className="max-w-[904px] space-y-6 pt-6">
            <p className="font-semibold text-[16px] leading-[150%] tracking-[0%] text-[#111928]">
                {title}
            </p>

            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
};

export default DisclosureGroup;
