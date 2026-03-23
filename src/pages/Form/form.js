import React, { useState, useRef, useEffect } from "react";
import { ChevronRight, House, Search, MoveRight } from 'lucide-react'
import PersonalInformation from "../../components/PersonalInformation";
import EducationInformation from "../../components/EducationInformation";
import WorkExp from "../../components/WorkExp";
import Compliance from "../../components/Compliance";
import FinalAttestation from "../../components/FinalAttestation";
import { addCredentialing, getDetails } from "../../api/CredentialingApi"
import PostGraduate from "../../components/EducationModels/PostGraduate";
import OtherGraduate from "../../components/EducationModels/OtherGraduate";
import License from "../../components/EducationModels/License";
import CurrentHospitalPrivilegs from "../../components/WorkExpModels/CurrentHospitalPrivilegs";
import PrevHospitalPrivileg from "../../components/WorkExpModels/PrevHospitalPrivileg";
import BilingDetail from "../../components/WorkExpModels/BilingDetail";
import CurrentMalpractice from "../../components/WorkExpModels/CurrentMalpractice";
import PrevMalpractice from "../../components/WorkExpModels/PrevMalpractice";
import Colleagues from '../../components/WorkExpModels/Colleagues'
import toast from "react-hot-toast";

const FormPage = () => {
    const [step, setStep] = useState(1);
    const [value, setValue] = useState(null);
    const [valueCredentiallingDetails, setCredentiallingDetails] = useState({});

    const [currentHospitalEditData, setCurrentHospitalEditData] = useState(null);
    const [prevHospitalEditData, setPrevHospitalEditData] = useState(null);
    const [billingDetailsEditData, setBillingDetailsEditData] = useState(null);
    const [currentMalpracticeEditData, setCurrentMalpracticeEditData] = useState(null);
    const [prevMalpracticeEditData, setPrevMalpracticeEditData] = useState(null);
    const [coulleagueEditData, setCoulleagueEditData] = useState(null);

    const [currentHospitalKey, setCurrentHospitalKey] = useState(0);
    const [prevHospitalKey, setPrevHospitalKey] = useState(0);
    const [billingDetailsKey, setBillingDetailsKey] = useState(0);
    const [currentMalpracticeKey, setCurrentMalpracticeKey] = useState(0);
    const [prevMalpracticeKey, setPrevMalpracticeKey] = useState(0);

    const [postGradList, setPostGradList] = useState([]);
    const [OtherGradList, setOtherGradList] = useState([]);
    const [valueLicenceList, setLicenceList] = useState([]);

    const [valuePostgraduatePopup, setValuePostgraduatePopup] = useState(null);
    const [valueOthergraduatePopup, setValueOthergraduatePopup] = useState(null);
    const [valueLicensePopup, setValueLicensePopup] = useState(null);
    const [valueCurrentHospitalProvilegPopup, setValueCurrentHospitalProvilegPopup] = useState(null);
    const [valuePrevHospitalProvilegPopup, setValuePrevHospitalProvilegPopup] = useState(null);
    const [valueBillingDetailPopup, setValueBillingDetailPopup] = useState(null);
    const [valueCurrentMalpracticePopup, setValueCurrentMalpracticePopup] = useState(null);
    const [valuePrevMalpracticePopup, setValuePrevMalpracticePopup] = useState(null);
    const [valueColleguePopup, setValueColleguePopup] = useState(null);

    const steps = [
        { id: 1, title: "Personal Information" },
        { id: 2, title: "Education & Certifications" },
        { id: 3, title: "Work experience" },
        { id: 4, title: "Compliance & Disclosure" },
        { id: 5, title: "Documents" },
    ];

    const STEP_NUMBERS = {
        PERSONAL: 1,
        EDUCATION: 2,
        WORK: 3,
        COMPLIANCE: 4,
        DOCUMENTS: 5,
    };

    const [stepProgress, setStepProgress] = useState({
        1: { filled: 0, total: 0 },
        2: { filled: 0, total: 0 },
        3: { filled: 0, total: 0 },
        4: { filled: 0, total: 0 },
        5: { filled: 0, total: 0 },
    });

    const currentProgress = stepProgress[step];

    const currentIndex = steps.findIndex((s) => s.id === step);
    const nextStepTitle = steps[currentIndex + 1]?.title;
    const prevStepTitle = steps[currentIndex - 1]?.title;
    const currentStepTitle = steps.find((s) => s.id === step)?.title || "";

    const updateProgress = (stepId, filled, total) => {
        setStepProgress((prev) => ({
            ...prev,
            [stepId]: { filled, total },
        }));
    };


    const [options, setOptions] = useState([
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
    ]);

    const [formData, setFormData] = useState({
        personal_informations: {},
        education_informations: {},
        work_experience: {},
        compliance: {},
        documents: {}
    });

    const filesRef = useRef({
        required_attachments: {},
        signature: null,
        signatureBase64: null
    });

    const handleChange = (newValue, actionMeta) => {
        console.log("Value changed:", newValue, actionMeta);
        setValue(newValue);
    };

    const handleCreate = (inputValue) => {
        const newOption = { value: inputValue, label: inputValue };
        setOptions(prev => [...prev, newOption]);
        setValue(newOption);
    };

    const updateSection = (section, data) => {
        setFormData(prev => ({
            ...prev,
            [section]: deepMerge(prev[section], data)
        }));
    };

    const mergeById = (existing = [], incoming = []) => {
        const map = new Map();
        [...existing, ...incoming].forEach((item) => {
            const key = item?.id ?? item?._id ?? JSON.stringify(item);
            map.set(key, item);
        });
        return Array.from(map.values());
    };

    const deepMerge = (target = {}, source = {}) => {
        const result = { ...target };

        Object.keys(source).forEach(key => {
            if (
                typeof source[key] === "object" &&
                source[key] !== null &&
                !Array.isArray(source[key])
            ) {
                result[key] = deepMerge(target[key], source[key]);
            } else {
                result[key] = source[key];
            }
        });

        return result;
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <PersonalInformation
                    data={formData.personal_informations}
                    onChange={(data) => updateSection("personal_informations", data)}
                    personalInformations={valueCredentiallingDetails.personal_informations}
                    onProgressChange={(filled, total) =>
                        updateProgress(STEP_NUMBERS.PERSONAL, filled, total)
                    }
                />;
            case 2:
                return <EducationInformation
                    data={formData.education_informations}
                    onChange={(data) => updateSection("education_informations", data)}
                    openGradPopup={handlePostGraduatePopup}
                    postGadList={postGradList}
                    openOtherGradPopup={handleOtherGraduatePopup}
                    otherGradList={OtherGradList}
                    openLicensePopup={handleLicensePopup}
                    licenseList={valueLicenceList}
                    educationInformations={valueCredentiallingDetails.education_informations}
                    onProgressChange={(filled, total) =>
                        updateProgress(STEP_NUMBERS.EDUCATION, filled, total)
                    }
                />;
            case 3:
                return <WorkExp
                    data={formData.work_experience}
                    onChange={(data) => updateSection("work_experience", data)}
                    openCurrentHospitalPrivilegPopup={handleCurrentHospitalProvilegPopup}
                    openPrevHospitalPrivilegPopup={handlePrevHospitalProvilegPopup}
                    openBillingdetailPopup={handleBillingDetailPopup}
                    openCurrentMalPracticePopup={handleCurrentMalpracticePopup}
                    openPrevMalPracticePopup={handlePrevMalpracticePopup}
                    openColleaguePopup={handleColleaguePopup}
                    workExperience={valueCredentiallingDetails.work_experience}
                    onProgressChange={(filled, total) =>
                        updateProgress(STEP_NUMBERS.WORK, filled, total)
                    }
                />;
            case 4:
                return <Compliance
                    data={formData.compliance}
                    onChange={(data) => updateSection("compliance", data)}
                    compliance={valueCredentiallingDetails.compliance}
                    onProgressChange={(filled, total) =>
                        updateProgress(STEP_NUMBERS.COMPLIANCE, filled, total)
                    }
                />;
            case 5:
                return <FinalAttestation
                    data={formData.documents}
                    onChange={(data) => updateSection("documents", data)}
                    onFileChange={(key, file) => {
                        if (key === "signature") {
                            filesRef.current.signature = file;
                        } else if (key === "signatureBase64") {
                            filesRef.current.signatureBase64 = file;
                        } else {
                            filesRef.current.required_attachments[key] = file;
                        }
                    }}
                    documents={valueCredentiallingDetails.documents}
                    onProgressChange={(filled, total) =>
                        updateProgress(STEP_NUMBERS.DOCUMENTS, filled, total)
                    }
                />;
            default:
                return null;
        }
    };
    const buildFinalDocuments = () => {
        const dbDocs = valueCredentiallingDetails?.documents || {};
        const uiDocs = formData?.documents || {};

        return {
            ...dbDocs,
            ...uiDocs,

            // required_attachments must be fully preserved
            required_attachments: {
                ...(dbDocs.required_attachments || {}),
                ...(uiDocs.required_attachments || {}),
            },

            // signature must be preserved
            signature: {
                ...(dbDocs.signature || {}),
                ...(uiDocs.signature || {}),
            },
        };
    };
    const handleSubmit = async () => {
        const fd = new FormData();
        const userId = localStorage.getItem("user_id");
        fd.append("user_id", userId);

        // ✅ Build complete documents payload including existing DB paths
        const finalDocuments = buildFinalDocuments();

        const cleanFormData = structuredClone(formData);
        cleanFormData.documents = finalDocuments;

        // If you have UI-only keys
        delete cleanFormData.documents.signaturePreview;

        fd.append("user_details", JSON.stringify(cleanFormData));

        // ✅ Attach ONLY replaced signature
        if (filesRef.current.signature instanceof File) {
            fd.append("signature", filesRef.current.signature);
        }

        // ✅ Attach ONLY replaced drawn signature
        if (
            typeof filesRef.current.signatureBase64 === "string" &&
            filesRef.current.signatureBase64.startsWith("data:image")
        ) {
            fd.append("signatureBase64", filesRef.current.signatureBase64);
        }

        // ✅ Attach ONLY replaced attachments
        Object.entries(filesRef.current.required_attachments).forEach(([key, file]) => {
            if (file instanceof File) {
                fd.append(`required_attachments[${key}]`, file);
            }
        });


        var result = await addCredentialing(fd);

        if (result.data) {
            setCredentiallingDetails(result.data);
            toast.success(result.message);
            setStep(1);
        }
    };

    useEffect(() => {
        async function fetchCredentiallingData() {
            try {
                let userId = localStorage.getItem('user_id');
                let result = await getDetails({ 'user_id': userId });
                console.log('result:', result.data.documents)
                setCredentiallingDetails(result.data);
            } catch {
                setCredentiallingDetails(null)
            }
        }
        fetchCredentiallingData()
    }, [])

    const handlePostGraduatePopup = (data) => {
        setValuePostgraduatePopup(data);
    };

    const handlePostGraduateData = (childFormData) => {
        setFormData((prev) => {
            const existing =
                prev.education_informations?.post_graduate_educations ??
                valueCredentiallingDetails.education_informations?.post_graduate_educations ??
                [];

            const id = childFormData.id ?? childFormData._id;

            const updated = [
                childFormData,
                ...existing.filter((x) => (x.id ?? x._id) !== id),
            ];

            return {
                ...prev,
                education_informations: {
                    ...(prev.education_informations || {}),
                    post_graduate_educations: updated,
                },
            };
        });

        setValuePostgraduatePopup(false);
    };

    const handleOtherGraduatePopup = (data) => {
        setValueOthergraduatePopup(data);
    };

    const handleOtherGraduateData = (childFormData) => {
        setFormData((prev) => {
            const existing =
                prev.education_informations?.other_graduate_educations ??
                valueCredentiallingDetails.education_informations?.other_graduate_educations ??
                [];

            const id = childFormData.id ?? childFormData._id;

            const updated = [
                childFormData,
                ...existing.filter((x) => (x.id ?? x._id) !== id),
            ];

            return {
                ...prev,
                education_informations: {
                    ...(prev.education_informations || {}),
                    other_graduate_educations: updated,
                },
            };
        }); // add new entry
        setValueOthergraduatePopup(false); // close popup (optional)
    };

    const handleLicensePopup = (data) => {
        setValueLicensePopup(data);
    };

    const handleLicenseData = (childFormData) => {
        setFormData((prev) => {
            const existing =
                prev.education_informations?.other_licenses ??
                valueCredentiallingDetails.education_informations?.other_licenses ??
                [];

            const id = childFormData.id ?? childFormData._id;

            const updated = [
                childFormData,
                ...existing.filter((x) => (x.id ?? x._id) !== id),
            ];

            return {
                ...prev,
                education_informations: {
                    ...(prev.education_informations || {}),
                    other_licenses: updated,
                },
            };
        }); // add new entry// add new entry
        setValueLicensePopup(false); // close popup (optional)
    };

    const handleCurrentHospitalProvilegPopup = (data) => {
        setCurrentHospitalKey((k) => k + 1);
        setCurrentHospitalEditData(data === true ? null : data);
        setValueCurrentHospitalProvilegPopup(data);
    };

    const handleCurrentHospitalProvilegData = (childFormData) => {
        setFormData((prev) => {
            const prevList = prev?.work_experience?.current_hospital_privileges || [];
            const id = childFormData.id ?? childFormData._id;

            const updatedList = [
                childFormData,
                ...prevList.filter((x) => (x.id ?? x._id) !== id),
            ];

            return {
                ...prev,
                work_experience: {
                    ...(prev.work_experience || {}),
                    current_hospital_privileges: updatedList,
                },
            };
        });

        setValueCurrentHospitalProvilegPopup(false);
    };

    const handlePrevHospitalProvilegData = (childFormData) => {
        setFormData((prev) => {
            const prevList = prev?.work_experience?.prev_hospital_privileges || [];
            const id = childFormData.id ?? childFormData._id;

            const updatedList = [
                childFormData,
                ...prevList.filter((x) => (x.id ?? x._id) !== id),
            ];

            return {
                ...prev,
                work_experience: {
                    ...(prev.work_experience || {}),
                    prev_hospital_privileges: updatedList,
                },
            };
        });

        setValueCurrentHospitalProvilegPopup(false);
    };

    const handleBillingDetailsData = (childFormData) => {
        setFormData(() => {
            return {
                work_experience: {
                    billing_company_details: childFormData,
                },
            };
        }); // add new entry
        setValueBillingDetailPopup(false); // close popup (optional)
    };

    const handleCurrentMalpracticeData = (childFormData) => {
        setFormData(() => {
            return {
                work_experience: {
                    current_malpractice_insurence_currier: childFormData,
                },
            };
        }); // add new entry
        setValueCurrentMalpracticePopup(false); // close popup (optional)
    };

    const handlePrevMalpracticeData = (childFormData) => {
        setFormData(() => {
            return {
                work_experience: {
                    prev_malpractice_insurence_currier: childFormData,
                },
            };
        }); // add new entry
        setValuePrevMalpracticePopup(false); // close popup (optional)
    };

    const handleColleagueData = (childFormData) => {
        setFormData((prev) => {
            const prevList = prev?.work_experience?.colleague_names || [];
            const id = childFormData.id ?? childFormData._id;

            const updatedList = [
                childFormData,
                ...prevList.filter((x) => (x.id ?? x._id) !== id),
            ];

            return {
                ...prev,
                work_experience: {
                    ...(prev.work_experience || {}),
                    colleague_names: updatedList,
                },
            };
        });

        setValueColleguePopup(false);
    };

    const handlePrevHospitalProvilegPopup = (data) => {
        setPrevHospitalKey((k) => k + 1);
        setPrevHospitalEditData(data === true ? null : data);
        setValuePrevHospitalProvilegPopup(data);
    };

    const handleBillingDetailPopup = (data) => {
        setBillingDetailsKey((k) => k + 1);
        setBillingDetailsEditData(data === true ? null : data);
        setValueBillingDetailPopup(data);
    };

    const handleCurrentMalpracticePopup = (data) => {
        setCurrentMalpracticeKey((k) => k + 1);
        setCurrentMalpracticeEditData(data === true ? null : data);
        setValueCurrentMalpracticePopup(data);
    };

    const handlePrevMalpracticePopup = (data) => {
        setPrevMalpracticeKey((k) => k + 1);
        setPrevMalpracticeEditData(data === true ? null : data);
        setValuePrevMalpracticePopup(data);
    };

    const handleColleaguePopup = (data) => {
        setCoulleagueEditData(data === true ? null : data);
        setValueColleguePopup(data);
    };

    return (
        <div className="h-screen overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-white">
                <div className="w-full h-[150px] relative rotate-0 opacity-100 top-[96px] pt-6 gap-2">
                    <div className="sticky w-[1152px] h-[20px] rotate-0 opacity-100 pr-8 pl-8 gap-[10px]">
                        <nav className="font-[14px] text-sm leading-5 tracking-normal text-[#4A5565] h-[20px] rotate-0 opacity-100 gap-[6px] rounded-[6px]" aria-label="Breadcrumb">
                            <ol class="flex items-center gap-2">
                                <li> <House size={14} color="#4A5565" /> </li>
                                <li>
                                    <a href="#" class="hover:text-gray-900"> Dashboard</a>
                                </li>
                                <li> <ChevronRight size={14} color="#4A5565" /> </li>
                                <li>
                                    <a href="#" class="hover:text-gray-900">Credentials</a>
                                </li>
                                <li><ChevronRight size={14} color="#4A5565" /></li>
                                <li class="text-gray-900 font-[14px]">
                                    Credentialing Application Form
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="w-[1152px] h-[137px] flex justify-between rotate-0 opacity-100 p-8">
                    <div className="w-[579px] h-[73px] rotate-0 opacity-100">
                        <p className="font-bold text-[28px] leading-[150%] tracking-normal text-[#111928]">Credentialing Application Form</p>
                        <p className="font-inter font-normal text-[15px] leading-[150%] tracking-normal text-[#6A7282] mt-1">You can fill out any section at any time; your progress is saved automatically.</p>
                    </div>
                    <div className="w-[460px] h-[48px] flex items-center rotate-0 rotate-0 opacity-100 gap-4">
                        <button className="h-[48px] w-[250px] flex items-center gap-[6px] pt-3 pr-5 pb-3 pl-5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] shadow-[0px_1px_0.5px_0.05px_#1D293D05] font-medium text-[16px] text-[#4A5565]">Search within this form <Search size={16} color="#4A5565" /> </button>
                        {/* <button className="w-[200px] h-[48px] flex items-center rotate-0 opacity-100 pt-3 pr-5 pb-3 pl-5 gap-[6px] rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] shadow-[0px_1px_0.5px_0.05px_#1D293D05] font-medium font-[16px] text-[#4A5565]">Synchronise data <MoveRight size={16} color="#4A5565" /> </button> */}
                    </div>
                </div>

                <div class="w-full flex justify-between h-[72px] rotate-0 opacity-100 pt-2 pr-8 pb-2 pl-8 gap-6 bg-[#F3F4F6] border-b border-[#E5E7EB]">
                    {/* <button class={`flex items-center w-[205px] h-[56px] rotate-0 opacity-100 pt-4 pr-3 pb-4 pl-2 gap-1.5  text-[16px] leading-[150%] tracking-[0%] 
                        ${step === 1
                            ? "bg-[#E5E7EB] rounded-[8px] font-semibold text-[#1A56DB]"
                            : "text-[#4A5565] hover:text-[#111928]"
                        }`}>
                        <span>1.</span> Personal Information
                    </button>
                    <button class={`flex items-center gap-2 px-4 py-2 font-normal text-[16px] leading-[150%] tracking-[0%] 
                        ${step === 2
                            ? "bg-[#E5E7EB] rounded-[8px] font-semibold text-[#1A56DB]"
                            : "text-[#4A5565] hover:text-[#111928]"
                        }
                        `}>
                        <span>2.</span> Education & Certifications
                    </button>

                    <button class={`flex items-center gap-2 px-4 py-2 font-normal text-[16px] leading-[150%] tracking-[0%]
                        ${step === 3
                            ? "bg-[#E5E7EB] rounded-[8px] font-semibold text-[#1A56DB]"
                            : "text-[#4A5565] hover:text-[#111928]"
                        }`}>
                        <span>3.</span> Work experience
                    </button>

                    <button class={`flex items-center gap-2 px-4 py-2 font-normal text-[16px] leading-[150%] tracking-[0%]
                     ${step === 4
                            ? "bg-[#E5E7EB] rounded-[8px] font-semibold text-[#1A56DB]"
                            : "text-[#4A5565] hover:text-[#111928]"
                        }
                    `}>
                        <span>4.</span> Compliance & Disclosure
                    </button>

                    <button class={`flex items-center gap-2 px-4 py-2 font-normal text-[16px] leading-[150%] tracking-[0%]
                    ${step === 5
                            ? "bg-[#E5E7EB] rounded-[8px] font-semibold text-[#1A56DB]"
                            : "text-[#4A5565] hover:text-[#111928]"
                        }`}>
                        <span>5.</span> Documents
                    </button> */}
                    {steps.map((s) => {
                        const isActive = step === s.id;

                        return (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setStep(s.id)}
                                className={[
                                    "flex items-center h-[56px] px-4 py-2 text-[16px] leading-[150%] tracking-[0%] rounded-[8px]",
                                    isActive
                                        ? "bg-[#E5E7EB] font-semibold text-[#1A56DB]"
                                        : "text-[#4A5565] hover:text-[#111928] hover:bg-[#E5E7EB]/50",
                                ].join(" ")}
                            >
                                <span className="mr-2">{s.id}.</span>
                                {s.title}
                            </button>
                        );
                    })}
                </div>
            </div>
            {renderStep()}
            <div className="sticky bottom-0 z-50 bg-white border-t border-[#E5E7EB]">
                <div className="w-full flex justify-between items-center px-8 py-4">
                    {/* Left */}
                    <div className="flex items-center gap-3">
                        <p className="font-medium text-sm text-[#111928]">
                            {currentStepTitle}
                        </p>
                        <span className="px-2 py-1 rounded-full bg-[#ECFDF3] text-[#057A55] text-xs font-medium">
                            {currentProgress?.filled ?? 0} of {currentProgress?.total ?? 0} fields completed
                        </span>
                    </div>

                    {/* Right buttons */}
                    <div className="flex items-center gap-3">
                        {step > 1 && (
                            <button
                                onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
                                className="flex items-center gap-2 px-4 py-2 rounded-[10px]
               border border-[#E5E7EB] text-sm font-medium
               text-[#4A5565] bg-white"
                            >
                                ← Previous: {prevStepTitle}
                            </button>
                        )}
                        {step === 5 ? (
                            <button
                                className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#1A56DB] text-white text-sm font-medium"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        ) : (
                            <button
                                onClick={() => setStep((prev) => Math.min(prev + 1, 5))}
                                className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-[#1A56DB] text-white text-sm font-medium"
                            >
                                Next: {nextStepTitle} →
                            </button>
                        )}

                    </div>
                </div>
            </div>

            <PostGraduate open={valuePostgraduatePopup} onClose={() => setValuePostgraduatePopup(false)} onSave={handlePostGraduateData}></PostGraduate>

            <OtherGraduate open={valueOthergraduatePopup} onClose={() => setValueOthergraduatePopup(false)} onSave={handleOtherGraduateData}></OtherGraduate>

            <License open={valueLicensePopup} onClose={() => setValueLicensePopup(false)} onSave={handleLicenseData}></License>

            <CurrentHospitalPrivilegs
                key={currentHospitalKey}
                open={valueCurrentHospitalProvilegPopup}
                onClose={() => setValueCurrentHospitalProvilegPopup(false)}
                onSubmit={handleCurrentHospitalProvilegData}
                initialData={currentHospitalEditData}
            >
            </CurrentHospitalPrivilegs>

            <PrevHospitalPrivileg
                key={prevHospitalKey}
                open={valuePrevHospitalProvilegPopup}
                onClose={() => setValuePrevHospitalProvilegPopup(false)}
                onSave={handlePrevHospitalProvilegData}
                initialData={prevHospitalEditData}
            >
            </PrevHospitalPrivileg>

            <BilingDetail
                key={billingDetailsKey}
                open={valueBillingDetailPopup}
                onClose={() => setValueBillingDetailPopup(false)}
                onSave={handleBillingDetailsData}
                initialData={billingDetailsEditData}
            >
            </BilingDetail>
            <CurrentMalpractice
                key={currentMalpracticeKey}
                open={valueCurrentMalpracticePopup}
                onClose={() => setValueCurrentMalpracticePopup(false)}
                onSave={handleCurrentMalpracticeData}
                initialData={currentMalpracticeEditData}
            >
            </CurrentMalpractice>
            <PrevMalpractice
                key={prevMalpracticeKey}
                open={valuePrevMalpracticePopup}
                onClose={() => setValuePrevMalpracticePopup(false)}
                onSave={handlePrevMalpracticeData}
                initialData={prevMalpracticeEditData}
            >
            </PrevMalpractice>
            <Colleagues
                open={valueColleguePopup}
                onClose={() => setValueColleguePopup(false)}
                onSave={handleColleagueData}
                initialData={coulleagueEditData}
            >
            </Colleagues>
        </div>
    )
}

export default FormPage