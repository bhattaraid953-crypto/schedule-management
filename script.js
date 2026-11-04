
/* スケジュール管理 */

// 表示する月（2026年11月）
let currentDate = new Date(2026, 10, 1);

// 選択した日付
let selectedDate = "2026-11-04";

// 予定データ
let schedules = JSON.parse(localStorage.getItem("schedules"));

if (!schedules) {
    schedules = [
        {
            id: 1,
            date: "2026-11-04",
            time: "13:00",
            title: "授業"
        },
        {
            id: 2,
            date: "2026-11-05",
            time: "10:00",
            title: "友達とカフェ"
        },
        {
            id: 3,
            date: "2026-11-06",
            time: "15:00",
            title: "買い物"
        }
    ];

    saveSchedules();
}

// 日付を YYYY-MM-DD にする
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// カレンダーを表示する
function showCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    document.getElementById("monthTitle").textContent =
        `${year}年 ${month + 1}月`;

    const calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    // 曜日を表示
    const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

    weekDays.forEach(function(day) {
        const cell = document.createElement("div");
        cell.className = "day-name";
        cell.textContent = day;
        calendar.appendChild(cell);
    });

    // 月の最初の曜日
    const firstDay = new Date(year, month, 1).getDay();

    // 月の最後の日
    const lastDay = new Date(year, month + 1, 0).getDate();

    // 最初の日まで空白を入れる
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.className = "day";
        calendar.appendChild(empty);
    }

    // 日付を表示
    for (let day = 1; day <= lastDay; day++) {
        const date = new Date(year, month, day);
        const dateString = formatDate(date);

        const cell = document.createElement("div");
        cell.className = "day";
        cell.textContent = day;

        // 選択中の日付を黄色にする
        if (dateString === selectedDate) {
            cell.classList.add("selected");
        }

        // 今日の日付を囲む
        if (dateString === formatDate(new Date())) {
            cell.classList.add("today");
        }

        // 日付をクリックしたとき
        cell.onclick = function() {
            selectedDate = dateString;

            document.getElementById("date").value = dateString;
            document.getElementById("filterDate").value = dateString;

            showCalendar();
            filterSchedules();
        };

        calendar.appendChild(cell);
    }
}

// 前の月・次の月
function changeMonth(amount) {
    currentDate.setMonth(currentDate.getMonth() + amount);
    showCalendar();
}

// 予定を追加する
function addSchedule() {
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const title = document.getElementById("title").value.trim();

    if (date === "" || time === "" || title === "") {
        alert("日付、時間、予定のタイトルを入力してください。");
        return;
    }

    const newSchedule = {
        id: Date.now(),
        date: date,
        time: time,
        title: title
    };

    schedules.push(newSchedule);

    saveSchedules();

    selectedDate = date;
    currentDate = new Date(date + "T12:00:00");

    document.getElementById("title").value = "";

    showCalendar();
    showAllSchedules();
}

// 予定を保存する
function saveSchedules() {
    localStorage.setItem("schedules", JSON.stringify(schedules));
}

// 予定一覧を表示する
function displaySchedules(list) {
    const scheduleList = document.getElementById("scheduleList");
    scheduleList.innerHTML = "";

    if (list.length === 0) {
        const message = document.createElement("p");
        message.className = "empty";
        message.textContent = "予定はありません。";
        scheduleList.appendChild(message);
        return;
    }

    // 日付と時間の順番で並べる
    list.sort(function(a, b) {
        return (a.date + a.time).localeCompare(b.date + b.time);
    });

    list.forEach(function(schedule) {
        const item = document.createElement("div");
        item.className = "schedule-item";

        const info = document.createElement("span");
        info.textContent =
            `${schedule.date} ${schedule.time} ： ${schedule.title}`;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "削除";

        deleteButton.onclick = function() {
            deleteSchedule(schedule.id);
        };

        item.appendChild(info);
        item.appendChild(deleteButton);

        scheduleList.appendChild(item);
    });
}

// 日付で絞り込む
function filterSchedules() {
    const date = document.getElementById("filterDate").value;

    if (date === "") {
        alert("日付を選んでください。");
        return;
    }

    const result = schedules.filter(function(schedule) {
        return schedule.date === date;
    });

    displaySchedules(result);
}

// すべての予定を表示する
function showAllSchedules() {
    displaySchedules([...schedules]);
}

// 予定を削除する
function deleteSchedule(id) {
    const answer = confirm("この予定を削除しますか？");

    if (!answer) {
        return;
    }

    schedules = schedules.filter(function(schedule) {
        return schedule.id !== id;
    });

    saveSchedules();

    const filterDate = document.getElementById("filterDate").value;

    if (filterDate !== "") {
        filterSchedules();
    } else {
        showAllSchedules();
    }
}

// 最初に画面を表示する
document.getElementById("date").value = selectedDate;
document.getElementById("filterDate").value = selectedDate;

showCalendar();
showAllSchedules();
