"use client";

import React, { useEffect, useState } from "react";
import UploadForm from "./_components/UploadForm";
import { app } from "@/firebaseConfig";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { metadata } from "@/app/layout";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { generateRandomString } from "@/app/_utils/GenerateRandom";

function Upload() {

  const {user} = useUser()

  const [progress,setProgress] = useState();
  const [uploadComplete,setUploadComplete] = useState(false);

  const storage = getStorage(app);

  const db = getFirestore(app);

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
        saveInfo(file,downloadURL);
      });}
    });
  };

  const saveInfo=async(file,fileUrl)=>{
    const docId=generateRandomString().toString();

    await setDoc(doc(db, "uploadedFile", docId), {
      fileName:file?.name,
      fileSize:file?.size,
      fileType:file?.type,
      fileUrl:fileUrl,
      userEmail:user?.primaryEmailAddress.emailAddress,
      userName:user?.fullName,
      password:'',
      id:docId,
      shortUrl:process.env.NEXT_PUBLIC_BASE_URL+docId
    });

  }

  useEffect(()=>{
    console.log("Trigger")

    progress==100 && setTimeout(()=>{
      setUploadComplete(true);
    },2000)
  },[progress==100])

  // useEffect(()=>{
  //   uploadComplete &&
  //   setTimeout(()=>{
  //     setUploadComplete(false);
  //     window.location.reload();
  //   },2000)
  // },[uploadComplete==true])

  return (
    <div className="p-5 px-8 md:px-28">
      {!uploadComplete &&
      <h2 className="text-[20px] text-center m-5">
        Start
        <strong className="text-primary"> Uploading </strong>
        File and
        <strong className="text-primary"> Share</strong>
      </h2>}
      <UploadForm 
        uploadBtnClick={(file) => uploadFile(file)} 
        progress={progress}
        uploadComplete={uploadComplete}
      />
    </div>
  );
}

export default Upload;
