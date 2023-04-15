import useApiFetch from "@/hooks/useApiFetch";

export default function useFilesUpdater() {
    const apiFetch = useApiFetch();
    
    function deleteFile({path}){
        return apiFetch(path, {
            method: "DELETE"
        }, {rawPath: true});
    }
    
    function uploadFile({file}){
        const formData = new FormData();
        formData.append("file", file);
        return apiFetch("/files", {
            method: "POST",
            body: formData,
        }).then((r) => r.json())
    }

    return {deleteFile, uploadFile};
}
