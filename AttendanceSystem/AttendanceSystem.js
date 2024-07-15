document.addEventListener('DOMContentLoaded', function() {
    // ページの読み込みが完了したら実行される処理
    // 現在時刻を表示
    displayCurrentTime();

    // localStorageから初期の勤怠履歴と統計を表示
    displayInitialAttendanceHistory();
    displayInitialAttendanceStats();

    // 打刻ボタンのイベントリスナーを設定
    document.getElementById('start-button').addEventListener('click', function() {
        // 開始時刻を記録する
        recordTime('start-time');
    });

    document.getElementById('end-button').addEventListener('click', function() {
        // 終了時刻を記録する
        recordTime('end-time');
    });

    // リセットボタンのイベントリスナーを設定
    document.getElementById('reset-start-time').addEventListener('click', function() {
        // 開始時刻の入力フィールドをリセットする
        document.getElementById('start-time').value = '';
    });

    document.getElementById('reset-end-time').addEventListener('click', function() {
        // 終了時刻の入力フィールドをリセットする
        document.getElementById('end-time').value = '';
    });

    // 登録ボタンのイベントリスナーを設定
    document.getElementById('register-button').addEventListener('click', function() {
        // 勤怠を登録する
        registerAttendance();
    });

    // リセットボタンのイベントリスナーを設定
    document.getElementById('reset-button').addEventListener('click', function() {
        // データをリセットする
        resetData();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // ページの読み込みが完了したら実行される処理
    // 現在時刻を表示
    displayCurrentTime();

    // 1秒ごとに現在時刻を更新する
    setInterval(displayCurrentTime, 1000);

    // 他の処理は省略
});

// 現在時刻を表示する関数
function displayCurrentTime() {
    var now = new Date();
    var hours = now.getHours().toString().padStart(2, '0'); // 時を取得し、2桁で表示する
    var minutes = now.getMinutes().toString().padStart(2, '0'); // 分を取得し、2桁で表示する
    var seconds = now.getSeconds().toString().padStart(2, '0'); // 秒を取得し、2桁で表示する
    var currentTime = hours + ':' + minutes + ':' + seconds; // 時間と分と秒を結合して現在時刻を作成する
    document.getElementById('current-time').innerHTML = '<strong>現在時刻:</strong> ' + currentTime; // 現在時刻を表示する要素に挿入する
}


// 時刻を記録する関数
function recordTime(inputId) {
    var now = new Date();
    var hours = now.getHours().toString().padStart(2, '0'); // 時を取得し、2桁で表示する
    var minutes = now.getMinutes().toString().padStart(2, '0'); // 分を取得し、2桁で表示する
    var recordedTime = hours + ':' + minutes; // 時間と分を結合して記録する時刻を作成する
    document.getElementById(inputId).value = recordedTime; // 指定された入力フィールドに記録した時刻をセットする
}

// 勤怠を登録する関数
function registerAttendance() {
    var employeeId = document.getElementById('employee-id').value; // 社員IDを取得する
    var date = document.getElementById('date').value; // 日付を取得する
    var workType = document.getElementById('work-type').value; // 勤務区分を取得する
    var startTime = document.getElementById('start-time').value; // 開始時刻を取得する
    var endTime = document.getElementById('end-time').value; // 終了時刻を取得する
    var breakTime = parseInt(document.getElementById('break-time').value, 10); // 休憩時間を取得し、整数に変換する

    // 稼働時間を計算する
    var start = parseTime(startTime); // 開始時刻をパースする
    var end = parseTime(endTime); // 終了時刻をパースする
    var workHours = calculateWorkHours(start, end, breakTime); // 稼働時間を計算する

    // 残業時間を計算する
    var overtimeHours = calculateOvertimeHours(workHours); // 残業時間を計算する

    // 新しい勤怠エントリを作成する
    var entry = {
        employeeId: employeeId,
        date: date,
        workType: workType,
        startTime: startTime,
        endTime: endTime,
        breakTime: breakTime,
        workHours: workHours,
        overtimeHours: overtimeHours
    };

    // エントリをlocalStorageに保存する
    saveAttendanceEntry(entry);

    // UIを更新する：新しいエントリを履歴リストに追加し、統計を更新する
    updateAttendanceHistory(entry);
    updateAttendanceStats();

    // フォームのフィールドをクリアする
    document.getElementById('attendance-form').reset();
}

// データをリセットする関数
function resetData() {
    // localStorageをクリアする
    localStorage.removeItem('attendanceHistory');

    // UIをクリアする
    document.getElementById('history-list').innerHTML = '';
    document.getElementById('stats-output').innerHTML = '';

    // フォームのフィールドをクリアする
    document.getElementById('attendance-form').reset();
}

// 勤怠エントリをlocalStorageに保存する関数
function saveAttendanceEntry(entry) {
    var history = JSON.parse(localStorage.getItem('attendanceHistory')) || []; // localStorageから履歴を取得する。なければ空の配列を設定する
    history.push(entry); // 新しいエントリを履歴に追加する
    localStorage.setItem('attendanceHistory', JSON.stringify(history)); // 履歴をlocalStorageに保存する
}

// 初期の勤怠履歴を表示する関数
function displayInitialAttendanceHistory() {
    var history = JSON.parse(localStorage.getItem('attendanceHistory')) || []; // localStorageから履歴を取得する。なければ空の配列を設定する
    var historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // 履歴リストをクリアする

    // 各エントリをリストアイテムとして表示する
    history.forEach(function(entry) {
        var li = document.createElement('li'); // 新しいリストアイテムを作成する
        li.innerHTML = `
            <strong>勤務区分:</strong> ${entry.workType}<br>
            <strong>出勤時刻:</strong> ${entry.startTime}<br>
            <strong>退勤時刻:</strong> ${entry.endTime}<br>
            <strong>休憩時間:</strong> ${entry.breakTime} 分<br>
            <strong>稼働時間:</strong> ${entry.workHours.toFixed(2)} 時間<br>
            <strong>残業時間:</strong> ${entry.overtimeHours.toFixed(2)} 時間<br>
            <strong>社員ID:</strong> ${entry.employeeId}<br>
            <strong>日付:</strong> ${entry.date}<br><br>
        `;
        historyList.appendChild(li); // 履歴リストに追加する
    });
}

// 初期の勤怠統計を表示する関数
function displayInitialAttendanceStats() {
    var history = JSON.parse(localStorage.getItem('attendanceHistory')) || []; // localStorageから履歴を取得する。なければ空の配列を設定する
    var statsOutput = document.getElementById('stats-output');

    // 各種統計データを計算する
    var totalBreakTime = history.reduce((acc, entry) => acc + entry.breakTime, 0); // 休憩時間の合計を計算する
    var workDays = history.filter(entry => entry.workType === '出勤').length; // 出勤日数を計算する
    var remoteWorkDays = history.filter(entry => entry.workType === '在宅ワーク').length; // 在宅ワーク日数を計算する
    var offDays = history.filter(entry => entry.workType === '公休').length; // 公休日数を計算する
    var paidLeaveDays = history.filter(entry => entry.workType === '有給休暇').length; // 有給休暇日数を計算する
    var totalWorkHours = history.reduce((acc, entry) => acc + entry.workHours, 0); // 稼働時間の合計を計算する
    var totalOvertimeHours = history.reduce((acc, entry) => acc + entry.overtimeHours, 0); // 残業時間の合計を計算する

    // 統計情報をHTMLに出力する
    statsOutput.innerHTML = `
        <strong>休憩時間:</strong> ${totalBreakTime} 分<br>
        <strong>出勤日数:</strong> ${workDays} 日<br>
        <strong>在宅ワーク日数:</strong> ${remoteWorkDays} 日<br>
        <strong>公休日数:</strong> ${offDays} 日<br>
        <strong>有給休暇日数:</strong> ${paidLeaveDays} 日<br>
        <strong>計稼働時間:</strong> ${totalWorkHours.toFixed(2)} 時間<br>
        <strong>計残業時間:</strong> ${totalOvertimeHours.toFixed(2)} 時間<br>
    `;
}

// 勤怠履歴を更新する関数
function updateAttendanceHistory(entry) {
    var historyList = document.getElementById('history-list'); // 履歴リストの要素を取得する
    var li = document.createElement('li'); // 新しいリストアイテムを作成する
    li.innerHTML = `
        <strong>勤務区分:</strong> ${entry.workType}<br>
        <strong>出勤時刻:</strong> ${entry.startTime}<br>
        <strong>退勤時刻:</strong> ${entry.endTime}<br>
        <strong>休憩時間:</strong> ${entry.breakTime} 分<br>
        <strong>稼働時間:</strong> ${entry.workHours.toFixed(2)} 時間<br>
        <strong>残業時間:</strong> ${entry.overtimeHours.toFixed(2)} 時間<br>
        <strong>社員ID:</strong> ${entry.employeeId}<br>
        <strong>日付:</strong> ${entry.date}<br><br>
    `;
    historyList.appendChild(li); // 履歴リストに追加する
}

// 勤怠統計を更新する関数
function updateAttendanceStats() {
    var history = JSON.parse(localStorage.getItem('attendanceHistory')) || []; // localStorageから履歴を取得する。なければ空の配列を設定する
    var statsOutput = document.getElementById('stats-output');

    // 各種統計データを計算する
    var totalBreakTime = history.reduce((acc, entry) => acc + entry.breakTime, 0); // 休憩時間の合計を計算する
    var workDays = history.filter(entry => entry.workType === '出勤').length; // 出勤日数を計算する
    var remoteWorkDays = history.filter(entry => entry.workType === '在宅ワーク').length; // 在宅ワーク日数を計算する
    var offDays = history.filter(entry => entry.workType === '公休').length; // 公休日数を計算する
    var paidLeaveDays = history.filter(entry => entry.workType === '有給休暇').length; // 有給休暇日数を計算する
    var totalWorkHours = history.reduce((acc, entry) => acc + entry.workHours, 0); // 稼働時間の合計を計算する
    var totalOvertimeHours = history.reduce((acc, entry) => acc + entry.overtimeHours, 0); // 残業時間の合計を計算する

    // 統計情報をHTMLに出力する
    statsOutput.innerHTML = `
        <strong>休憩時間:</strong> ${totalBreakTime} 分<br>
        <strong>出勤日数:</strong> ${workDays} 日<br>
        <strong>在宅ワーク日数:</strong> ${remoteWorkDays} 日<br>
        <strong>公休日数:</strong> ${offDays} 日<br>
        <strong>有給休暇日数:</strong> ${paidLeaveDays} 日<br>
        <strong>計稼働時間:</strong> ${totalWorkHours.toFixed(2)} 時間<br>
        <strong>計残業時間:</strong> ${totalOvertimeHours.toFixed(2)} 時間<br>
    `;
}

// 時間をパースする関数
function parseTime(timeString) {
    if (!timeString) return { hours: 0, minutes: 0 }; // 時刻が指定されていない場合、デフォルトで0時0分を返す
    var parts = timeString.split(':'); // 時刻文字列を「:」で分割する
    return {
        hours: parseInt(parts[0], 10), // 時間部分を整数に変換する
        minutes: parseInt(parts[1], 10) // 分部分を整数に変換する
    };
}

// 勤務時間を計算する関数
function calculateWorkHours(start, end, breakTime) {
    var startMinutes = start.hours * 60 + start.minutes; // 開始時刻を分に変換する
    var endMinutes = end.hours * 60 + end.minutes; // 終了時刻を分に変換する
    var totalMinutes = endMinutes - startMinutes - breakTime; // 稼働時間を分で計算する
    return totalMinutes / 60; // 稼働時間を時間に変換して返す
}

// 残業時間を計算する関数
function calculateOvertimeHours(workHours) {
    var standardWorkHours = 8; // 標準労働時間を定義する
    if (workHours <= standardWorkHours) {
        return 0; // 標準労働時間未満の場合、残業時間は0とする
    } else {
        return workHours - standardWorkHours; // 標準労働時間を超過している場合、超過分を残業時間とする
    }
}
