const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth(); // 0부터 시작
let selectedDate = null;

let dataByDate = JSON.parse(localStorage.getItem('dataByDate')) || {
  '2025-04-25': {
    homeworkUrl: 'homework/2024-04-25.html',
    insight: 'DOM은 진짜 중요함!',
    review: '오늘 잘했다'
  },
  '2025-04-26': {
    homeworkUrl: 'homework/2024-04-26.html',
    insight: '이해가 한층 깊어짐',
    review: '재밌었음'
  },
  '2025-04-27': {
    homeworkUrl: 'homework/2024-04-26.html',
    insight: '',
    review: ''
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const homeworkBtn = document.getElementById('homework-btn');
  const insightInput = document.getElementById('insight-input');
  const reviewInput = document.getElementById('review-input');
  const closeBtn = document.querySelector('.close-btn');
  const modal = document.getElementById('homework-modal');
  const iframe = document.getElementById('homework-frame');

      //텍스트에리어 저장 이벤트에 연결
      insightInput.addEventListener('change', () => {
        if (!selectedDate) return;
      
        const prev = dataByDate[selectedDate]?.insight || '';
        const current = insightInput.value;
      
        if (prev !== current) {
          if (!dataByDate[selectedDate]) dataByDate[selectedDate] = {};
          dataByDate[selectedDate].insight = current;
          localStorage.setItem('dataByDate', JSON.stringify(dataByDate));
          showToast('깨달음 저장 완료!');
        }
      });
      
      reviewInput.addEventListener('change', () => {
        if (!selectedDate) return;
      
        const prev = dataByDate[selectedDate]?.review || '';
        const current = reviewInput.value;
      
        if (prev !== current) {
          if (!dataByDate[selectedDate]) dataByDate[selectedDate] = {};
          dataByDate[selectedDate].review = current;
          localStorage.setItem('dataByDate', JSON.stringify(dataByDate));
          showToast('느낀점 저장 완료!');
        }
      });
      
    
  function makeCalendar(year, month) {
    calendarEl.innerHTML = '';
    document.getElementById('current-month').textContent = `${year}년 ${month + 1}월`;

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const totalDays = last.getDate();
    const firstDay = first.getDay();

    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

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

      if (year === todayYear && month === todayMonth && d === todayDate) {
        cell.classList.add('today');
      }

      cell.addEventListener('click', () => {
        document.querySelectorAll('.calendar-day.selected').forEach(el => {
          el.classList.remove('selected');
        });

        cell.classList.add('selected');
        selectedDate = dateStr;

        const data = dataByDate[selectedDate] || {};
        document.getElementById('insight-input').value = data.insight || '';
        document.getElementById('review-input').value = data.review || '';

        if (data.homeworkUrl) {
          homeworkBtn.disabled = false;
        } else {
          homeworkBtn.disabled = true;
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

    // 자동 오늘 선택
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

  // 월 이동
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

  // 모달 열기
  homeworkBtn.addEventListener('click', () => {
    if (!selectedDate || !dataByDate[selectedDate]?.homeworkUrl) return;
    iframe.src = dataByDate[selectedDate].homeworkUrl;
    modal.classList.remove('hidden');
  });

  // 모달 닫기
  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

});
// 토스트 함수 추가 및 호출
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');
  
    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hidden');
    }, 1500); // 1.5초 후 사라짐
  }
