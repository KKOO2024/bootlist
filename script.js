const today = new Date();
let currentYear = today.getFullYear(); // 오늘 날짜로 초기화
let currentMonth = today.getMonth();   // 오늘 월로 초기화 (0부터 시작)

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const homeworkBtn = document.getElementById('homework-btn');
  const insightBox = document.getElementById('insight');
  const reviewBox = document.getElementById('review');
  const contentBox = document.getElementById('contentbox');

  const dataByDate = {
    '2024-04-25': {
      homeworkUrl: 'homework/2024-04-25.html',
      insight: 'DOM은 진짜 중요함!',
      review: '오늘 잘했다'
    },
    '2024-04-26': {
      homeworkUrl: 'homework/2024-04-26.html',
      insight: '이해가 한층 깊어짐',
      review: '재밌었음'
    }
  };

  let currentHomeworkUrl = null;

  function makeCalendar(year, month) {
    calendarEl.innerHTML = ''; // 초기화
    document.getElementById('current-month').textContent =
      `${year}년 ${month + 1}월`;

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const totalDays = last.getDate();
    const firstDay = first.getDay();

    // 오늘 날짜 정보 미리 저장
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    // 요일 헤더
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const header = document.createElement('div');
    header.className = 'calendar-row';
    dayNames.forEach(d => {
      const dayEl = document.createElement('div');
      dayEl.textContent = d;
      dayEl.className = 'calendar-cell calendar-header';
      header.appendChild(dayEl);
    });
    calendarEl.appendChild(header);

    let row = document.createElement('div');
    row.className = 'calendar-row';

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar-cell';
      row.appendChild(empty);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const cell = document.createElement('div');
      cell.textContent = d;
      cell.className = 'calendar-cell calendar-day';

      // ✅ 오늘 날짜이면 .today 클래스 추가
      if (year === todayYear && month === todayMonth && d === todayDate) {
        cell.classList.add('today');
      }

      cell.addEventListener('click', () => {
        document.querySelectorAll('.calendar-day.selected').forEach(el => {
          el.classList.remove('selected');
        });

        cell.classList.add('selected');

        const data = dataByDate[dateStr];
        if (data) {
          currentHomeworkUrl = data.homeworkUrl;
          homeworkBtn.disabled = false;
          insightBox.textContent = data.insight;
          reviewBox.textContent = data.review;
        } else {
          currentHomeworkUrl = null;
          homeworkBtn.disabled = true;
          insightBox.textContent = '내용 없음';
          reviewBox.textContent = '내용 없음';
        }
      });

      row.appendChild(cell);

      const isEndOfWeek = (firstDay + d) % 7 === 0;
      const isLastDay = d === totalDays;

      if (isEndOfWeek || isLastDay) {
        const filled = row.children.length;
        for (let i = filled; i < 7; i++) {
          const empty = document.createElement('div');
          empty.className = 'calendar-cell';
          row.appendChild(empty);
        }

        calendarEl.appendChild(row);
        row = document.createElement('div');
        row.className = 'calendar-row';
      }
    }

    // ✅ 오늘 날짜 자동 선택 (렌더링 완료 후)
    if (year === todayYear && month === todayMonth) {
      requestAnimationFrame(() => {
        const todayCell = Array.from(document.querySelectorAll('.calendar-day'))
          .find(cell => cell.textContent === todayDate.toString());
        if (todayCell) todayCell.click();
      });
    }
  }

  // 최초 렌더링
  makeCalendar(currentYear, currentMonth);

  // 월 변경 버튼
  document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    makeCalendar(currentYear, currentMonth);
  });

  document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    makeCalendar(currentYear, currentMonth);
  });

  // homework iframe 삽입
  homeworkBtn.addEventListener('click', () => {
    if (!currentHomeworkUrl) return;
    const existing = document.querySelector('#contentbox iframe');
    if (existing) existing.remove();

    const iframe = document.createElement('iframe');
    iframe.src = currentHomeworkUrl;
    iframe.width = '100%';
    iframe.height = '400px';
    iframe.style.border = '1px solid #ccc';
    iframe.style.marginTop = '10px';

    contentBox.appendChild(iframe);
  });
});
