import AvatarUploader from "../common/AvatarUploader";
import { getRewardLevel, getTotalPoints } from "../../utils/studentRewards";

function StudentProfileHeader({ student, rewards, onStudentUpdated }) {
  const currentLevel = getRewardLevel(getTotalPoints(rewards));

  function handleAvatarUploaded(avatarPath) {
    onStudentUpdated((currentStudent) => ({
      ...currentStudent,
      avatar_path: avatarPath,
    }));
  }

  return (
    <header>
      <div className="student-mypage-profile">
        <AvatarUploader
          userId={student.id}
          name={student.name}
          avatarPath={student.avatar_path}
          userType="student"
          tableName="students"
          onUploaded={handleAvatarUploaded}
        />

        <div className="student-mypage-profile-text">
          <h2>{student.name}</h2>
          <p>マイページ</p>

          <div className="student-mypage-profile-meta">
            <span>{student.rank || "ランク未設定"}</span>
            <span>MR {student.mr ?? "-"}</span>
            <span>LEVEL {currentLevel.level}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default StudentProfileHeader;
