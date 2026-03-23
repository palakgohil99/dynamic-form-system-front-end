import React, { useState, useRef, useEffect } from "react";
import DisclosureGroup from "./ComplianceLayout/DisclosureGroup";
import DisclosureQuestion from "./ComplianceLayout/DisclosureQuestion";

const Compliance = ({ data, onChange, compliance, onProgressChange }) => {
    const [formData, setFormData] = useState({});
    const didHydrate = useRef(false);

    useEffect(() => {
        const totalFields = 21;

        const isFilled = (v) => {
            if (typeof v === "boolean") return true;

            return false;
        };

        const filledFields = Object.values(data || {}).filter(isFilled).length;

        console.log('filledFields: ', Object.values(data || {}).filter(isFilled))

        console.log('data123: ', data);
        onProgressChange?.(filledFields, totalFields);
    }, [data]);

    useEffect(() => {
        if (didHydrate.current) return;

        if (compliance && Object.keys(data || {}).length === 0) {
            didHydrate.current = true;
            onChange(compliance);
        }
    }, [compliance, data, onChange]);

    const handleRadioChange = (patch) => {
        // merge patch into parent data (single source of truth)
        onChange({ ...(data || {}), ...patch });
    };

    return (
        <div className="w-full flex-1 min-h-0 p-8 overflow-y-auto bg-white space-y-8">
            {/* ================= SECTION HEADER ================= */}
            <div className="max-w-[904px] flex items-center gap-4">
                <p className="font-semibold text-[20px] leading-[150%] text-[#111928]">
                    Compliance & Disclosure
                </p>

                <div className="flex-1 border-t border-[#E5E7EB]" />

                <p className="font-semibold text-[12px] leading-[150%] text-[#057A55] whitespace-nowrap">
                    22 of 32 fields completed
                </p>
            </div>

            {/* ================= LICENSURE ================= */}
            <DisclosureGroup title="Licensure">
                <DisclosureQuestion
                    number="1"
                    text="Has your license to practice, in your profession, ever been denied, suspended, revoked, restricted, voluntarily surrendered while under investigation, or have you ever been subject to a consent order, probation or any conditions or limitations by any state licensing board?"
                    name="is_your_license_suspended"
                    value={data?.is_your_license_suspended}
                    onChange={handleRadioChange}
                />
                <DisclosureQuestion
                    number="2"
                    text="Have you ever received a reprimand or been fined by any state licensing board?"
                    name="received_reprimand"
                    value={data?.received_reprimand}
                    onChange={handleRadioChange}
                />
            </DisclosureGroup>

            {/* Divider */}
            <div className="max-w-[904px]">
                <hr className="border-[#E5E7EB]" />
            </div>

            {/* ================= HOSPITAL PRIVILEGES ================= */}
            <DisclosureGroup title="Hospital Privileges and Other Affiliations">
                <DisclosureQuestion
                    number="3"
                    text="Have your clinical privileges or Medical Staff membership at any hospital or healthcare institution ever been denied, suspended, revoked, restricted, limited, renewed or subject to probation or other disciplinary conditions?"
                    name="is_your_staff_been_suspended"
                    value={data?.is_your_staff_been_suspended}
                    onChange={handleRadioChange}
                />
                <DisclosureQuestion
                    number="4"
                    text="Have you voluntarily surrendered, limited your privileges or not reapplied for privileges while under investigation?"
                    name="have_you_surrendered"
                    value={data?.have_you_surrendered}
                    onChange={handleRadioChange}
                />
                <DisclosureQuestion
                    number="5"
                    text="Have you ever been terminated for cause or not renewed for cause from participation, or been subject to any disciplinary action, by any managed care organizations?"
                    name="is_your_been_terminated"
                    value={data?.is_your_been_terminated}
                    onChange={handleRadioChange}
                />
            </DisclosureGroup>

            {/* Divider */}
            <div className="max-w-[904px]">
                <hr className="border-[#E5E7EB]" />
            </div>

            {/* ================= EDUCATION ================= */}
            <DisclosureGroup title="Education, Training and Board Certification">
                <DisclosureQuestion
                    number="6"
                    text="Were you ever placed on probation, disciplined, formally reprimanded, suspended or asked to resign during your internship, residency, fellowship or other clinical education program?"
                    name="ever_placed_on_probation"
                    value={data?.ever_placed_on_probation}
                    onChange={handleRadioChange}
                />
                <DisclosureQuestion
                    number="7"
                    text="Have you ever, while under investigation, voluntarily withdrawn or prematurely terminated your status as a student or employee in any training program?"
                    name="terminated_status_as_student"
                    value={data?.terminated_status_as_student}
                    onChange={handleRadioChange}
                />
                <DisclosureQuestion
                    number="8"
                    text="Have any of your board certifications or eligibility ever been revoked?"
                    name="board_certification_revoked"
                    value={data?.board_certification_revoked}
                    onChange={handleRadioChange}
                />
                <DisclosureQuestion
                    number="9"
                    text="Have you ever chosen not to re-certify or voluntarily surrendered your board certification while under investigation?"
                    name="ever_chhosen_not_to_recertify"
                    value={data?.ever_chhosen_not_to_recertify}
                    onChange={handleRadioChange}
                />
            </DisclosureGroup>

            {/* Divider */}
            <div className="max-w-[904px]">
                <hr className="border-[#E5E7EB]" />
            </div>
            <DisclosureGroup title="DEA or DPS">
                <DisclosureQuestion
                    number="10"
                    text="Have your Federal DEA and/or DPS Controlled Substances Certificate(s) ever been denied, suspended, revoked, restricted, or voluntarily relinquished?"
                    name="evern_chhosen_to_surrender_certificate"
                    value={data?.evern_chhosen_to_surrender_certificate}
                    onChange={handleRadioChange}
                />
            </DisclosureGroup>

            {/* Divider */}
            <div className="max-w-[904px]">
                <hr className="border-[#E5E7EB]" />
            </div>

            <DisclosureGroup title="Medicare, Medicaid or Other Government Program Participation">
                <DisclosureQuestion
                    number="11"
                    text="Have you ever been disciplined, excluded, debarred, suspended or otherwise restricted from participation in Medicare, Medicaid or other government healthcare programs?"
                    name="dps_controlled_certificate_revoked"
                    value={data?.dps_controlled_certificate_revoked}
                    onChange={handleRadioChange}
                />
            </DisclosureGroup>

            {/* Divider */}
            <div className="max-w-[904px]">
                <hr className="border-[#E5E7EB]" />
            </div>
            <DisclosureGroup title="Other Sanctions or Investigations">
                <DisclosureQuestion
                    number="12"
                    text="Are you currently or have you ever been the subject of an investigation by any hospital, licensing authority, DEA, Medicare or Medicaid program?"
                    name="ever_excluded_from_govt_program"
                    value={data?.ever_excluded_from_govt_program}
                    onChange={handleRadioChange}
                />
                <DisclosureQuestion
                    number="13"
                    text="To your knowledge, has information pertaining to you ever been reported to the National Practitioner Data Bank?"
                    name="investigated_by_authority"
                    value={data?.investigated_by_authority}
                    onChange={handleRadioChange}
                />
                <DisclosureQuestion
                    number="14"
                    text="Have you ever received sanctions from or been the subject of investigation by regulatory agencies?"
                    name="information_reported_npdb"
                    value={data?.information_reported_npdb}
                    onChange={handleRadioChange}
                />
                <DisclosureQuestion
                    number="15"
                    text="Have you ever been investigated or sanctioned by a military hospital or healthcare facility?"
                    name="received_sasaction"
                    value={data?.received_sasaction}
                    onChange={handleRadioChange}
                />
            </DisclosureGroup>

            {/* Divider */}
            <div className="max-w-[904px]">
                <hr className="border-[#E5E7EB]" />
            </div>
            <DisclosureGroup title="Malpractice Claims History">
                <DisclosureQuestion
                    number="16"
                    text="Have you had any malpractice actions within the past 5 years (pending, settled, arbitrated, mediated or litigated)?"
                    name="has_malpractice"
                    value={data?.has_malpractice}
                    onChange={handleRadioChange}
                />
            </DisclosureGroup>
            {/* Divider */}
            <div className="max-w-[904px]">
                <hr className="border-[#E5E7EB]" />
            </div>
            <DisclosureGroup title="Criminal History">
                <DisclosureQuestion
                    number="17"
                    text="Have you ever been convicted of, pled guilty to, or pled no contest to any felony reasonably related to your professional duties?"
                    name="convicted_to_guilty"
                    value={data?.convicted_to_guilty}
                    onChange={handleRadioChange}
                />
                <DisclosureQuestion
                    number="18"
                    text="Have you ever been convicted of a violent crime?"
                    name="convicted_violent_crime"
                    value={data?.convicted_violent_crime}
                    onChange={handleRadioChange}
                />
            </DisclosureGroup>
            {/* Divider */}
            <div className="max-w-[904px]">
                <hr className="border-[#E5E7EB]" />
            </div>

            <DisclosureGroup title="Ability to Perform Job">
                <DisclosureQuestion
                    number="19"
                    text="Are you currently engaged in the illegal use of drugs?"
                    name="engaged_in_illegal_usage_drugs"
                    value={data?.engaged_in_illegal_usage_drugs}
                    onChange={handleRadioChange}
                />
                <DisclosureQuestion
                    number="20"
                    text="Do you have any physical, mental or substance abuse condition that impairs your ability to practice medicine safely?"
                    name="have_any_abuse"
                    value={data?.have_any_abuse}
                    onChange={handleRadioChange}
                />
                <DisclosureQuestion
                    number="21"
                    text="Do you have any condition that would pose a risk to the safety or well-being of your patients?"
                    name="have_any_risk_condition"
                    value={data?.have_any_risk_condition}
                    onChange={handleRadioChange}
                />
            </DisclosureGroup>
        </div>


    )

}

export default Compliance