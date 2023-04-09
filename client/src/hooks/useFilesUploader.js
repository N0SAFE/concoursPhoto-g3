import useApiFetch from "@/hooks/useApiFetch";

export default function useFilesUploader() {
  const apiFetch = useApiFetch();

  return function uploadFiles(files, code) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append("files[]", files[i]);
    }

    formData.append("code", code);
    return apiFetch("/uploads", {
      method: "POST",
      body: formData,
    }).then(
        response => response.json(),
    );
  }
}
