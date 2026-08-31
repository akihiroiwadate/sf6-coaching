import {
  useRef,
  useState,
} from "react";

import {
  supabase,
} from "../../lib/supabase";

import Avatar
  from "./Avatar";

import "../../styles/avatar.css";


const MAX_FILE_SIZE =
  5 * 1024 * 1024;


function AvatarUploader({
  userId,
  name,
  avatarPath,
  userType = "student",
  tableName = "students",
  onUploaded,
}) {
  const inputRef =
    useRef(null);


  const [
    uploading,
    setUploading,
  ] = useState(false);


  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  function handleSelectFile() {
    if (uploading) {
      return;
    }

    inputRef.current?.click();
  }


  async function handleFileChange(
    event
  ) {
    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setErrorMessage(
        "画像ファイルを選択してください"
      );

      return;
    }


    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      setErrorMessage(
        "画像は5MB以下にしてください"
      );

      return;
    }


    try {
      setUploading(true);

      setErrorMessage("");


      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "jpg";


      const folder =
        userType ===
        "coach"
          ? "coaches"
          : "students";


      const filePath =
        `${folder}/${userId}/avatar-${Date.now()}.${extension}`;


      const {
        error: uploadError,
      } = await supabase
        .storage
        .from("avatars")
        .upload(
          filePath,
          file,
          {
            cacheControl:
              "3600",

            upsert:
              false,
          }
        );


      if (uploadError) {
        throw uploadError;
      }


      const {
        data: publicUrlData,
      } = supabase
        .storage
        .from("avatars")
        .getPublicUrl(
          filePath
        );


      const publicUrl =
        publicUrlData.publicUrl;


      const {
        error: updateError,
      } = await supabase
        .from(
          tableName
        )
        .update({
          avatar_path:
            publicUrl,
        })
        .eq(
          "id",
          userId
        );


      if (updateError) {
        throw updateError;
      }


      await removeOldAvatar(
        avatarPath
      );


      if (onUploaded) {
        onUploaded(
          publicUrl
        );
      }

    } catch (error) {
      console.error(
        "アイコンアップロードエラー:",
        error
      );


      setErrorMessage(
        error.message ||
        "アイコンの変更に失敗しました"
      );

    } finally {
      setUploading(false);


      if (
        inputRef.current
      ) {
        inputRef.current.value =
          "";
      }
    }
  }


  async function removeOldAvatar(
    oldAvatarPath
  ) {
    if (!oldAvatarPath) {
      return;
    }


    const marker =
      "/storage/v1/object/public/avatars/";


    if (
      !oldAvatarPath.includes(
        marker
      )
    ) {
      return;
    }


    const oldFilePath =
      oldAvatarPath
        .split(marker)[1];


    if (!oldFilePath) {
      return;
    }


    const {
      error,
    } = await supabase
      .storage
      .from("avatars")
      .remove([
        oldFilePath,
      ]);


    if (error) {
      console.warn(
        "古いアイコン削除エラー:",
        error
      );
    }
  }


  return (
    <div className="avatar-uploader">

      <button
        type="button"
        className="avatar-click-button"
        onClick={
          handleSelectFile
        }
        disabled={
          uploading
        }
        aria-label="プロフィールアイコンを変更"
      >

        <Avatar
          name={
            name
          }
          avatarPath={
            avatarPath
          }
          type={
            userType
          }
          size="large"
        />


        <span className="avatar-click-overlay">
          {uploading
            ? "処理中"
            : "変更"}
        </span>

      </button>


      <input
        ref={
          inputRef
        }
        className="avatar-file-input"
        type="file"
        accept="image/*"
        onChange={
          handleFileChange
        }
      />


      {errorMessage && (

        <p className="avatar-upload-error">
          {errorMessage}
        </p>

      )}

    </div>
  );
}


export default AvatarUploader;