"use client";

import React, { useState } from "react";
import UploadForm from "./_components/UploadForm";
import { app } from "@/firebaseConfig";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { metadata } from "@/app/layout";

function Upload() {

  const [progress,setProgress] = useState();

  const storage = getStorage(app);

  const uploadFile = (file) => {

    const metadata = {
      contentType: file.type
    };

    const storageRef = ref(storage, "file-sharing/" + file?.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      setProgress(progress);

      {progress==100&&
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
      });}
    });
  };

  return (
    <div className="p-5 px-8 md:px-28">
      <h2 className="text-[20px] text-center m-5">
        Start
        <strong className="text-primary"> Uploading </strong>
        File and
        <strong className="text-primary"> Share</strong>
      </h2>
      <UploadForm 
        uploadBtnClick={(file) => uploadFile(file)} 
        progress={progress}
      />
    </div>
  );
}

export default Upload;
