import Link from "next/link";
import Styles from "../../app/activity-list/activity-list.module.css";
import LikeHeart from "../like-hearts";
import { AVATAR_PATH } from "@/config/api-path";
import { useAuth } from "@/context/auth-context";
import Swal from "sweetalert2"; // 引入 SweetAlert2


export default function ActivityCard({ activity, onQuickSignUp, onLikeToggle }) {
  // 取得當前日期
  const currentDate = new Date();
  const activityDate = new Date(activity.activity_time);
  const { auth } = useAuth(); // 獲取會員認證資料

  // 判斷活動是否過期
  const isExpired = activityDate < currentDate;

  return (
    <div
      className={`${Styles.card} mx-auto ${isExpired ? Styles.expired : ""}`}
    >
      {isExpired && <span className={Styles.expiredTag}>已過期</span>}
      <div className={`${Styles.list} row`}>
        <div className={`${Styles.img} col-md-4`} style={{ position: 'relative' }}>
          <div className={`${Styles.iconLikeStroke}`}>
            <LikeHeart
              checked={activity.is_favorite}
              activityId={activity.al_id}
              onClick={onLikeToggle}
            />
          </div>
          <img
            src={
              activity.avatar
                ? `${AVATAR_PATH}${activity.avatar}`
                : `${AVATAR_PATH}TeamB-logo-greenYellow.png`
            }
            alt=""
            className={`${Styles.avatarImage}`}
          />
        </div>
        <div className={`${Styles.information} col-md-6`}>
          <div className={`${Styles.title} row`}>
            <div className={`${Styles.titleIcons} col-1`}>
              {activity.sport_name === "籃球" ? (
                <span className={`icon-Basketball ${Styles.iconTitle}`}></span>
              ) : activity.sport_name === "排球" ? (
                <span className={`icon-Volleyball ${Styles.iconTitle}`}></span>
              ) : activity.sport_name === "羽球" ? (
                <span className={`icon-Badminton ${Styles.iconTitle}`}></span>
              ) : null}
            </div>
            <h2 className={`${Styles.titleText} col`}>
              {activity.activity_name}
            </h2>
          </div>
          <div className={`${Styles.info}`}>
            <p>
              <span className={`${Styles.infoTitle}`}>地  點：</span>
              <span>{activity.court_name}</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=台南市${activity.court_name}`}
                target="_blank"
              >
                <i className="fa-solid fa-location-dot" />
              </a>
            </p>
            <p>
              <span className={`${Styles.infoTitle}`}>活動時間：</span>
              <span>{activity.activity_time}</span>
            </p>
            <p>
              <span className={`${Styles.infoTitle}`}>報名期限：</span>
              <span>{activity.deadline}</span>
            </p>
            <p>
              <span className={`${Styles.infoTitle}`}>費  用：</span>每人 
              <span>{activity.payment}</span> 元
            </p>
            <p>
              <span className={`${Styles.infoTitle}`}>主  揪：</span>
              <span>{activity.name}</span>
            </p>
          </div>
        </div>

        <div
          className={`col-sm-2 d-sm-flex flex-sm-column align-items-sm-end ${Styles.groupButton}`}
        >
          <div className={`${Styles.registerInfo}`}>
            <button type="button" className={Styles.registerInfoBtn}>
              <span className={Styles.number}>目前人數</span>
              <br />
              <span className={Styles.total}>
                {activity.registered_people}/{activity.need_num}人
              </span>
            </button>
          </div>
          <div className={Styles.buttonWrapper}>
            <a href={`/activity-list/${activity.al_id}`}>
              <button type="button" className={Styles.joinButton}>
                查看詳情
              </button>
            </a>
          </div>
          <div className={Styles.buttonWrapper}>
            <button
              type="button"
              className={`${Styles.joinButton} ${Styles.joinInformation} ${
                isExpired || new Date(activity.deadline) < new Date()
                  ? Styles.buttonDisabled
                  : ""
              }`}
              onClick={() => {
                if (!auth?.id) {
                  // 顯示 SweetAlert2 提示框
                  Swal.fire({
                    icon: "warning",
                    text: "請先登入",  // 顯示後端回傳的訊息
                    confirmButtonText: "確定",
                    confirmButtonColor: "#29755D", // 修改按鈕顏色
                    timer: 1300, // 顯示 1.3 秒後自動關閉
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    didClose: () => {
                      window.location.href = "/auth/login"; // 或用 router.push
                    }
                  });
                  return;
                } else if (
                  !isExpired &&
                  activity.registered_people < activity.need_num
                ) {
                  // 呼叫父元件傳來的快速報名功能
                  if (typeof onQuickSignUp === "function") {
                    onQuickSignUp(activity);
                  }
                }
              }}
              disabled={
                isExpired ||
                activity.registered_people >= activity.need_num ||
                new Date(activity.deadline) < new Date()
              }
            >
              {isExpired
                ? "已過期"
                : new Date(activity.deadline) < new Date()
                ? "報名截止"
                : activity.registered_people >= activity.need_num
                ? "已額滿"
                : "快速報名"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
