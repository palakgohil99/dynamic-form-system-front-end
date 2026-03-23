import SignatureCanvas from "react-signature-canvas";
import { useRef, useState, useEffect } from "react";

const FinalAttestation = ({ data, onChange, onFileChange, documents, onProgressChange }) => {
    const sigRef = useRef(null);
    const [showDraw, setShowDraw] = useState(false);

    // ✅ Hydrate once from DB (documents prop) into parent state (data)
    const didHydrate = useRef(false);
    useEffect(() => {
        if (!documents) return;

        const dateStr = documents.date
            ? new Date(documents.date).toISOString().slice(0, 10)
            : "";

        onChange({
            ...documents,
            date: dateStr,
            required_attachments: documents.required_attachments || {},
            signature: documents.signature || {},
        });
    }, [documents]);

    useEffect(() => {
        const totalFields = 7;

        const isFilled = (v) => {
            if (v === null || v === undefined) return false;

            // ❌ do not count arrays
            if (Array.isArray(v)) return false;

            // ❌ do not count objects
            if (typeof v === "object") return true;

            // strings must not be empty
            if (typeof v === "string") return v.trim() !== "";

            // booleans (true AND false count)
            if (typeof v === "boolean") return true;

            // numbers (0 counts)
            if (typeof v === "number") return true;

            return false;
        };

        const filledFields = Object.values(data || {}).filter(isFilled).length;

        console.log('filledFields: ', Object.values(data || {}).filter(isFilled))

        console.log('data123: ', data);
        onProgressChange?.(filledFields, totalFields);
    }, [data]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onChange({ [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        onChange({ [name]: checked });
    };

    const getFileName = (path) => {
        if (!path) return "";
        const parts = String(path).split(/[/\\]/);
        return parts[parts.length - 1] || "";
    };

    const hasAttachment = (key) => {
        // DB: string path, UI upload: true
        const v = data?.required_attachments?.[key];
        return !!v;
    };

    const handleAttachmentUpload = (key, file) => {
        if (!file) return;

        onChange({
            required_attachments: {
                ...(data.required_attachments || {}),
                // keep it a string (DB shape)
                [key]: file.name,
            },
        });

        onFileChange(key, file);
    };
    const signType = data?.signature?.sign_type;
    const signValue = data?.signature?.sign;

    return (
        <div className="w-full flex-1 min-h-0 p-8 overflow-y-auto bg-white space-y-8">
            {/* ================= HEADER ================= */}
            <div className="max-w-[904px] flex items-center gap-4">
                <p className="font-semibold text-[20px] leading-[150%] text-[#111928]">
                    Final Attestation
                    <span className="ml-2 font-normal text-[16px] text-[#6A7282]">
                        (Not for Use for Employment Purposes)
                    </span>
                </p>
                <div className="flex-1 border-t border-[#E5E7EB]" />
                <p className="text-[12px] font-semibold text-[#057A55] whitespace-nowrap">
                    22 of 32 fields completed
                </p>
            </div>

            {/* ================= ATTESTATION TEXT ================= */}
            <div className="flex flex-col w-[904px] h-[758px] opacity-100 gap-6 mt-3">
                {/* ================= SCROLLABLE AGREEMENT ================= */}
                <div className="space-y-4 h-[578px]">
                    <div className="relative h-[485px] overflow-y-auto rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-[14px] leading-[150%] text-[#111928]">
                        <p className="mb-3 font-normal text-[18px] leading-[150%] tracking-[0%] text-black">
                            I understand and agree that, as part of the credentialing application
                            process for participation and/or clinical privileges (hereinafter referred
                            to as “Participation”) at or with
                        </p>

                        <div className="py-3">
                            <input
                                type="text"
                                className="w-[856px] h-[48px] rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] px-[14px] py-3 shadow-[0px_1px_0.5px_0.05px_#1D293D05]
                placeholder:font-normal placeholder:text-[16px] placeholder:leading-[24px] placeholder:text-[#6A7282]"
                                placeholder="Mention managed care company(s) or hospital(s) name here"
                                name="managed_hospitals"
                                value={data?.managed_hospitals || ""}
                                onChange={handleInputChange}
                            />
                            <span className="block mt-1 font-normal text-[12px] leading-[20px] text-[#4A5565]">
                                (Please indicate managed care company(s) or hospital(s) to which you are
                                applying) (hereinafter, individually referred to as the “entity”)
                            </span>
                        </div>

                        <p className="py-3 font-normal text-[18px] leading-[150%] text-black">
                            and any of the Entity’s affiliated entities, I am required to provide
                            sufficient and accurate information for a proper evaluation of my current
                            licensure, relevant training and/or experience, clinical competence, health
                            status, character, ethics, and any other criteria used by the Entity for
                            determining initial and ongoing eligibility for Participation.
                        </p>

                        <p className="py-3 font-normal text-[18px] leading-[150%] text-black">
                            Each Entity and its representatives, employees, and agent(s) acknowledge
                            that the information obtained relating to the application process will be
                            held confidential to the extent permitted by law.
                        </p>

                        <p className="py-3 font-normal text-[18px] leading-[150%] text-black">
                            I acknowledge that each Entity has its own criteria for acceptance, and I
                            may be accepted or rejected by each independently.
                        </p>

                        <div className="pointer-events-none sticky bottom-0 left-0 h-10 w-full bg-gradient-to-t from-[#F9FAFB] via-[#F9FAFB]/80 to-transparent" />
                    </div>

                    {/* Checkbox */}
                    <label className="flex items-start gap-2 text-[14px] text-[#111928]">
                        <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 rounded border border-[#D1D5DB] accent-[#1447E6]"
                            name="agreed_terms"
                            checked={data?.agreed_terms || false}
                            onChange={handleCheckboxChange}
                        />
                        I have read and agree to the above authorization terms
                    </label>
                </div>

                {/* ================= BASIC INFO ================= */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-[#111928] mb-1">
                            Name *
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm"
                            name="full_name"
                            value={data?.full_name || ""}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#111928] mb-1">
                            Last 4 digits of SSN/NPI *
                        </label>
                        <input
                            type="text"
                            placeholder="Enter last 4 digits of SSN or NPI"
                            className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm"
                            name="ssn"
                            value={data?.ssn || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* ================= SIGNATURE ================= */}
                <div className="space-y-3">
                    <p className="text-sm font-medium text-[#111928]">Add a signature</p>

                    <div className="rounded-lg border border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-4 space-y-3">
                        {/* Buttons */}
                        <div className="flex gap-3 justify-center">
                            <button
                                type="button"
                                onClick={() => setShowDraw(true)}
                                className="rounded-md border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#111928]"
                            >
                                ✍ {signType ? "Replace (Draw)" : "Draw a signature"}
                            </button>

                            <label className="cursor-pointer rounded-md border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#111928]">
                                ⬆ {signType ? "Replace (Upload)" : "Upload a signature"}
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        // store UI info (filename) in state
                                        onChange({
                                            signature: {
                                                sign_type: "upload",
                                                sign: file.name,
                                            },
                                        });

                                        // actual file to parent ref
                                        onFileChange("signature", file);
                                    }}
                                />
                            </label>
                        </div>

                        {/* ✅ Signature preview (DB draw OR newly drawn) */}
                        {signType === "draw" &&
                            typeof signValue === "string" &&
                            signValue.startsWith("data:image") && (
                                <div className="flex justify-center">
                                    <img
                                        src={signValue}
                                        alt="Signature preview"
                                        className="max-w-[420px] h-auto border rounded bg-white p-2"
                                    />
                                </div>
                            )}

                        {/* ✅ Uploaded signature filename */}
                        {signType === "upload" && typeof signValue === "string" && (
                            <p className="text-xs text-[#6B7280] text-center">
                                Uploaded: {getFileName(signValue)}
                            </p>
                        )}

                        {/* Draw Area */}
                        {showDraw && (
                            <div className="space-y-2">
                                <SignatureCanvas
                                    ref={sigRef}
                                    penColor="black"
                                    canvasProps={{
                                        width: 600,
                                        height: 160,
                                        className: "border rounded bg-white",
                                    }}
                                />

                                <div className="flex gap-2 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => sigRef.current?.clear()}
                                        className="px-3 py-1 border rounded text-sm"
                                    >
                                        Clear
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const base64 = sigRef.current?.toDataURL("image/png");
                                            if (!base64) return;

                                            // store in state same shape as DB
                                            onChange({
                                                signature: {
                                                    sign_type: "draw",
                                                    sign: base64,
                                                },
                                            });

                                            // keep your backend flow
                                            onFileChange("signatureBase64", base64);

                                            setShowDraw(false);
                                        }}
                                        className="px-3 py-1 bg-black text-white rounded text-sm"
                                    >
                                        Save Signature
                                    </button>
                                </div>
                            </div>
                        )}

                        <p className="text-[12px] text-[#6B7280] text-center">
                            Please sign in the box. Make sure it looks similar to the signature in your ID.
                        </p>
                    </div>
                </div>

                {/* ================= DATE ================= */}
                <div className="w-[280px]">
                    <label className="block text-sm font-medium text-[#111928] mb-1">
                        Date *
                    </label>
                    <input
                        type="date"
                        className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm"
                        name="date"
                        value={data.date || ""}
                        onChange={handleInputChange}
                    />
                </div>

                {/* ================= ATTACHMENTS ================= */}
                <div className="rounded-lg border border-[#E5E7EB]">
                    <div className="border-b border-[#E5E7EB] px-4 py-3 text-sm font-semibold text-[#111928]">
                        Required Attachments or Supplemental Information
                    </div>

                    {[
                        {
                            label:
                                "Copy of DEA or state DPS Controlled Substances Registration Certificate",
                            key: "copy_of_dea",
                        },
                        {
                            label:
                                "Copy of other Controlled Dangerous Substances Registration Certificate(s)",
                            key: "copy_of_dang_substances_certificates",
                        },
                        {
                            label:
                                "Copy of current professional liability insurance policy face sheet",
                            key: "copy_of_insurence_policy",
                        },
                        {
                            label: "Copies of IRS W-9 for verification of tax ID number",
                            key: "copy_of_verification_tax_no",
                        },
                        {
                            label:
                                "Copy of workers compensation certificate of coverage, if applicable",
                            key: "copy_of_worker_compensation_certificate",
                        },
                        {
                            label: "Copy of CLIA certifications, if applicable",
                            key: "copy_of_clia_certificate",
                        },
                        {
                            label: "Copies of radiology certifications, if applicable",
                            key: "copies_of_radiolofy_certificates",
                        },
                        {
                            label: "Copy of DD214, record of military service, if applicable",
                            key: "record_of_military_service",
                        },
                    ].map(({ label, key }) => (
                        <div
                            key={key}
                            className="flex items-center justify-between border-b last:border-b-0 border-[#E5E7EB] px-4 py-3"
                        >
                            <div className="max-w-[70%]">
                                <p className="text-sm text-[#111928]">{label}</p>

                                {/* DB path -> show filename */}
                                {typeof data?.required_attachments?.[key] === "string" && (
                                    <p className="mt-1 text-xs text-[#6B7280]">
                                        {getFileName(data.required_attachments[key])}
                                    </p>
                                )}
                            </div>

                            <label className="cursor-pointer rounded-md border border-[#E5E7EB] bg-white px-3 py-1.5 text-sm font-medium text-[#111928]">
                                {hasAttachment(key) ? "Replace" : "Upload"}
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) =>
                                        handleAttachmentUpload(key, e.target.files?.[0])
                                    }
                                />
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FinalAttestation;
