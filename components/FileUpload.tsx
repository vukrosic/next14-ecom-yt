"use client";

import { UploadDropzone } from "@/lib/uploadthing"
import "@uploadthing/react/styles.css"

interface FileUploadProps {
    onUpload: (url: string) => void;
}

export const FileUpload = ({ onUpload }: FileUploadProps) => {
    return (
        <>
            <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res: any) => {
                    onUpload(res?.[0].url);
                }}
                onUploadError={(error: Error) => {
                    console.log(error);
                }}
                className="cursor-pointer"
            />
        </>
    )
}