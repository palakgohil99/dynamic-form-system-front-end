import React, { useState, useRef, useEffect } from "react";
import { Funnel, CalendarDays, Search } from 'lucide-react';
import AdditemDialog from '../../components/AdditemDialog';
import { uploadDocuments, getDocuments, deleteDocuments, downloadDocuments, downloadZip } from '../../api/VaultApi';
import toast from "react-hot-toast";
import dayjs from "dayjs";
import VaultDropDown from "../../components/VaultDropDown";
import { debounce } from "lodash";

const VaultPage = () => {
    const [documents, setDocuments] = useState([]);
    const fileInputRef = useRef(null);
    const updateFileInputRef = useRef(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [paginations, setpaginations] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const isFetching = useRef(false);
    
    var docId = "";

    const fetchDocumentData = async (searchValue = null, page = 1, forceLoad = false) => {
        try {
            console.log('page: ', page)
            console.log('loading: ', loading)
            console.log('hasMore: ', hasMore)
            if (!forceLoad && (loading || !hasMore)) {
                console.log('if');
                return
            };
            setLoading(true);
            let userId = localStorage.getItem('user_id');
            let result = await getDocuments({ 'id': userId, search: searchValue, page: page, limit: 20 });
            if (page === 1) {
                setDocuments(result.data);   // fresh load
            } else {
                setDocuments(prev => [...prev, ...result.data]); // append new
            }
            setpaginations(result.paginations)
            setHasMore(result.paginations.hasMore);
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }

    useEffect(() => {
        fetchDocumentData()
    }, [])

    const selectFile = () => {
        if (docId != "") {
            updateFileInputRef.current.click();
        } else {
            fileInputRef.current.click();
        }
    }

    const handleDocumentsUpload = async (e) => {
        const files = Array.from(e.target.files);
        console.log(files)

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file)
        });
        formData.append('user_id', localStorage.getItem('user_id'));
        console.log('docId: ', docId)
        if (docId != "") {
            formData.append('id', docId);
        }
        let result = await uploadDocuments(formData);
        if (result.data) {
            fetchDocumentData(null, page, true)
            toast.success(result.message);
            docId = ""
        }
    }

    const handleSelect = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    // // Toggle select all
    const handleSelectAll = () => {
        if (selectedItems.length === documents.length) {
            setSelectedItems([]); // unselect all
        } else {
            setSelectedItems(documents.map((doc) => doc._id)); // select all
        }
    };

    const isAllSelected =
        documents.length > 0 && selectedItems.length === documents.length;

    // const searchData = async debounce ((e) => {
    //     fetchDocumentData(e.target.value)
    // }, 500);
    const searchData = debounce((e) => {
        fetchDocumentData(e.target.value, page, true)
      }, 500); // wa

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 10;
        if (bottom && hasMore && !isFetching.current) {
            isFetching.current = true;
            setPage(prev => prev + 1);
        }
    }

    useEffect(() => {
        if (page > 1) {
            fetchDocumentData(null, page);
        }
    }, [page]);

    const replaceDocument = (id) => {
        docId = id;
        console.log('docId: ', docId)
        selectFile()
    }

    const deleteClick = async (id) => {
        try {
            let result = await deleteDocuments({ id: id });
            if (result) {
                fetchDocumentData(null, page, true)
                toast.success(result.message);
            }
        } catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const handleDownload = async (doc) => {
        console.log('doc: ', doc);
        let response = await downloadDocuments(doc._id);
        console.log(response);
        // ✅ Extract file name from Content-Disposition if available
        // const disposition = response.headers["content-disposition"];
        const suggestedName = "document";

        // ✅ Create a Blob and download link
        const url = window.URL.createObjectURL(new Blob([response]));
        console.log('url: ', url)
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${doc.file_name}`);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.remove();
        window.URL.revokeObjectURL(url);
    }

    const handleMultipleDownload = async (docs) => {
        if (!docs.length) {
            toast.error("Please select at least one document");
            return;
        }
        console.log(docs);
        try {
            const response = await downloadZip({ids: docs});
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "documents.zip");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Multiple download failed:", error);
            toast.error("Failed to download selected files");
        }
    }

    const handlePreview = async (doc) => {
        try {
            const response = await downloadDocuments(doc._id, true);
            console.log(response);
            const blob = new Blob([response], { type: doc.file_type });
            console.log(blob);
            const url = window.URL.createObjectURL(blob);
            console.log(doc.file_type)
            if (doc.file_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {

            } else {
                window.open(url, '_blank');
            }

            console.log(url);

        } catch (error) {
            console.error("Preview failed:", error);
        }
    }

    const statusBadge = (status) => {
        if (status === "Active") return "bg-green-100 text-green-700";
        if (status === "Expired") return "bg-red-100 text-red-700";
        if (status === "Expiring soon") return "bg-orange-100 text-orange-700";
        return "bg-gray-100 text-gray-600";
    };
    return (
        <div className="relative flex flex-col w-full h-[calc(100vh-96px)] overflow-hidden bg-white mt-[96px]">
            {/* Sticky Header Section */}
            <div className="sticky top-0 z-20 bg-white">
                <div className="px-6 md:px-8 py-6">
                    {/* Header Title & Search */}
                    <div className="items-start md:items-center justify-between gap-4">
                        <h2 className="text-2xl font-bold text-[30px] text-[#000000]">Document Vault</h2>
                        <p className="top-[177px] left-[320px] font-inter font-normal text-[16px] leading-[150%] tracking-normal mt-2">
                            Manage all your credentialing documents and certifications in one place.
                        </p>
                    </div>
                </div>
            </div>
            <hr className="w-[1088] border-[#D9D9D9] ml-7 w-[1088px] border-[1px]" />
            <div className="w-full max-w-[1088px] ml-7 mt-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="w-full h-auto flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-white border-b border-[#E5E7EB] rounded-t-[12px] gap-4">
                    <input type="text" placeholder="Search for document" className="w-[256px] h-[36px] rounded-[12px] border border-[#E5E7EB] gap-2 px-[10px] py-[8px] bg-[#F9FAFB] shadow-[0px_1px_0.5px_0.05px_#1D293D05] flex items-center placeholder:text-[#6A7282] placeholder:font-normal placeholder:text-sm placeholder:leading-5 placeholder:align-middle" onChange={searchData} />

                    <div className="w-full md:w-auto h-[36px] p-0 gap-3 flex flex-wrap items-center justify-end">
                        <button className="w-[197px] h-[36px] rounded-[12px] flex items-center justify-center gap-1 px-3 py-2 bg-[#1447E6] text-white font-medium text-[14px] leading-5 shadow-[0px_1px_0.5px_0.05px_#1D293D05] hover:bg-[#0F3AC0] hover:shadow-md transition-all duration-200 ease-in-out" onClick={selectFile}>+ Upload new document</button>
                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            onChange={handleDocumentsUpload}
                            style={{ display: "none" }} // 👈 Hide the input
                        />

                        <input
                            type="file"
                            ref={updateFileInputRef}
                            onChange={handleDocumentsUpload}
                            style={{ display: "none" }} // 👈 Hide the input
                        />

                        <button className="w-[110px] h-[36px] rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#4A5565] font-medium text-[14px] leading-5 px-3 py-2 flex items-center justify-center gap-[6px] shadow-[0px_1px_0.5px_0.05px_#1D293D05] hover:bg-gray-100 transition"><Funnel color="#4A5565" size={14} /> Filters</button>

                        {/* <button className="w-[110px] h-[36px] rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#4A5565] font-medium text-[14px] leading-5 px-3 py-2 flex items-center justify-center gap-[6px] shadow-[0px_1px_0.5px_0.05px_#1D293D05] hover:bg-gray-100 transition">Actions</button> */}
                        <VaultDropDown
                            onDownload={() => handleMultipleDownload(selectedItems)}
                            onDelete={() => deleteClick(selectedItems)}
                            buttonClass="w-[110px] h-[36px] rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#4A5565] font-medium text-[14px] leading-5 px-3 py-2 flex items-center justify-center gap-[6px] shadow-[0px_1px_0.5px_0.05px_#1D293D05] hover:bg-gray-100 transition"
                            buttonLabel="Actions"
                        />
                    </div>
                </div>


                <div className="w-full">
                    <table className="min-w-[1088px] text-sm text-gray-700 border-collapse text-left">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="table-head !w-[100px] text-left">
                                    <input type="checkbox" className="w-4 h-4 opacity-100 rounded border-t border-t-[#E5E7EB] bg-[#F9FAFB]" checked={isAllSelected} onChange={handleSelectAll} />
                                </th>
                                <th className="table-head text-left">Document</th>
                                <th className="table-head text-left">Date Uploaded</th>
                                <th className="table-head text-left">Expiration Date</th>
                                <th className="table-head text-left">Status</th>
                                <th className="table-head text-left">Actions</th>
                            </tr>
                        </thead>
                    </table>

                    {/* SCROLLABLE BODY */}
                    <div className="max-h-[350px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300" onScroll={handleScroll}>
                        <table className="min-w-[1088px] text-sm text-gray-700 border-collapse text-left">
                            <tbody className="border-b">
                                {documents.map((doc, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50 even:bg-[#F9FAFB]">
                                        <td className="table-data !w-[56px] text-left">
                                            <input type="checkbox" className="w-4 h-4 opacity-100 rounded border-t border-t-[#E5E7EB] bg-[#F9FAFB]" checked={selectedItems.includes(doc._id)} onChange={() => handleSelect(doc._id)} />
                                        </td>
                                        <td className="table-data text-left">
                                            <div className="flex flex-col">
                                                <a className="hover:text-blue-600 hover:underline cursor-default" onClick={() => handlePreview(doc)}>
                                                    {doc.file_name}
                                                </a>
                                                <span className="text-xs text-gray-400 mt-1">{doc.size}</span>
                                            </div>
                                        </td>

                                        <td className="table-data text-left">
                                            <div className="flex gap-2 items-center">
                                                <CalendarDays size={15} className="text-gray-500" />
                                                {dayjs(doc.uploaded_date).format("D MMM YYYY")}
                                            </div>
                                        </td>

                                        <td className="table-data text-left">
                                            <div className="flex gap-2 items-center">
                                                <CalendarDays size={15} className="text-gray-500" />
                                                {dayjs(doc.uploaded_date).format("D MMM YYYY")}
                                            </div>
                                        </td>

                                        <td className="table-data text-left">
                                            Active
                                        </td>

                                        <td className="relative table-data text-left">
                                            <VaultDropDown
                                                onReplace={() => replaceDocument(doc._id)}
                                                onDownload={() => handleDownload(doc)}
                                                onDelete={() => deleteClick(doc._id)}
                                                buttonClass="p-2 rounded hover:bg-gray-100 transition text-[20px]"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="w-[1088px] h-[76px] flex justify-between p-5 border-t border-t-[#D9D9D9] bg-white rounded-b-[12px] opacity-100">
                    <div className="flex items-center ">
                        <p className="font-normal text-sm leading-5 text-[#4A5565]">Showing <span className="font-medium text-[14px] leading-5">{paginations.start}-{paginations.end}</span> of <span className="font-medium text-[14px] leading-5">{paginations.totalCount}</span></p>
                    </div>
                </div>
            </div>
            {/* <AdditemDialog
                show={showAddItemPopup}
                title=""
                message="Once deleted, your account cannot be recovered."
                onConfirm=''
                onCancel={() => setShowAddItemPopup(false)}
            /> */}
        </div>
    );
}

export default VaultPage;