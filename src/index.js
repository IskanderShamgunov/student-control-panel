'use strict';
document.addEventListener('DOMContentLoaded', function() {

  let students = [
    {
      name: 'Александр',
      surname: 'Казанцев',
      midname: 'Сергеевич',
      faculty: 'Институт геологии и нефтегазовых технологий',
      birthDate: new Date(1999, 6, 21),
      beginStudyYear: '2020',
    },
    {
      name: 'Максим',
      surname: 'Ситников',
      midname: 'Игоревич',
      faculty: 'Юридический факультет',
      birthDate: new Date(1997, 3, 19),
      beginStudyYear: '2019',
    },
    {
      name: 'Кирилл',
      surname: 'Кузнецов',
      midname: 'Фёдорович',
      faculty: 'Институт статистических исследований и экономики знаний',
      birthDate: new Date(1996, 4, 14),
      beginStudyYear: '2015',
    },
    {
      name: 'Леонид',
      surname: 'Новиков',
      midname: 'Александрович',
      faculty: 'Юридический факультет',
      birthDate: new Date(1997, 11, 26),
      beginStudyYear: '2017',
    },
    {
      name: 'Матвей',
      surname: 'Кузнецов',
      midname: 'Сергеевич',
      faculty: 'Факультет географии и геоинформационных технологий',
      birthDate: new Date(2000, 7, 30),
      beginStudyYear: '2018',
    },
    {
      name: 'Антон',
      surname: 'Козлов',
      midname: 'Михаилович',
      faculty: 'Факультет химии',
      birthDate: new Date(1995, 5, 7),
      beginStudyYear: '2020',
    },
    {
      name: 'Никита',
      surname: 'Заказов',
      midname: 'Станиславович',
      faculty: 'Институт геологии и нефтегазовых технологий',
      birthDate: new Date(1996, 7, 12),
      beginStudyYear: '2021',
    },
    {
      name: 'Павел',
      surname: 'Лебедев',
      midname: 'Романович',
      faculty: 'Факультет физики',
      birthDate: new Date(1996, 9, 25),
      beginStudyYear: '2021',
    },
  ];

  const filterData = {
    input: {
      fullName: '',
      faculty: '',
      beginStudyYear: '',
      endStudyYear: '',
    },
    btn: {
      fullName: false,
      faculty: false,
      birthDate: false,
      studyPeriod: false,
    },
  };

  const form = document.querySelector('.form');
  const formInputs = Array.from(document.querySelectorAll('.form input'));

  const filterInputs = document.querySelectorAll('input[input-filter]');
  const filterBtns = document.querySelectorAll('th[btn-filter]');

  const tableBody = document.querySelector('.tbody');

  function Student(name, surname, midname, faculty, birthDate, beginStudyYear) {
    this.name = name;
    this.surname = surname;
    this.midname = midname;
    this.faculty = faculty;
    this.birthDate = new Date(birthDate);
    this.beginStudyYear = beginStudyYear;
  };

  setTable(students);

  function setTable(studentsArray) {

    tableBody.innerHTML = '';

    let arrayToSet;

    function getFullName(obj) {
      return `${[obj.surname, obj.name, obj.midname].join(' ')}`
    };

    function getYearFromMs(ms) {
      return Math.floor(((((ms / 1000) / 60) / 60) / 24) / 365.25);
    }

    arrayToSet = studentsArray
    .filter((student) => {

      return getFullName(student).toLowerCase().includes((filterData.input.fullName).toLowerCase());

    })
    .filter((student) => {

      return student.faculty.toLowerCase().includes((filterData.input.faculty).toLowerCase());

    })
    .filter((student) => {

      if (filterData.input.beginStudyYear) {

        return +student.beginStudyYear === +filterData.input.beginStudyYear;

      } else {

        // если строка пустая, не сравнивать ее, приводя к нулю, а вернуть true
        return true;

      }

    })
    .filter((student) => {

      if (filterData.input.endStudyYear) {

        return +student.beginStudyYear + 4 === +filterData.input.endStudyYear;

      } else {

        // если строка пустая, не сравнивать ее, приводя к нулю, а вернуть true
        return true;

      }

    })
    .sort((a, b) => {

      const sortKey = Object.keys(filterData.btn).find((key) => {
        return filterData.btn[key] === true;
      });

      if (sortKey === 'fullName') {

        return getFullName(a).toLowerCase().localeCompare(getFullName(b).toLowerCase());

      } else if (sortKey === 'faculty') {

        return a.faculty.toLowerCase().localeCompare(b.faculty.toLowerCase());

      } else if (sortKey === 'birthDate') {

        return a.birthDate - b.birthDate;

      } else if (sortKey === 'studyPeriod') {

        return +a.beginStudyYear - +b.beginStudyYear;

      }

    });


    arrayToSet.forEach((student) => {

      const fullName = getFullName(student);
      const age = getYearFromMs(new Date() - student.birthDate);
      const birthDateStr = student.birthDate.toLocaleDateString();
      const studyPeriod = `${student.beginStudyYear}-${+student.beginStudyYear + 4}`;

      let course;

      if ( ( new Date() - new Date((+student.beginStudyYear + 4), 8, 1) ) >= 0 ) {

        course = 'закончил';

      } else {

        course = `${new Date().getFullYear() - new Date(student.beginStudyYear).getFullYear() + 1}`;

      }

      const tableRow = document.createElement('tr');
      tableRow.innerHTML = `
        <th>${fullName}</th>
        <th>${student.faculty}</th>
        <th>${birthDateStr} (${age})</th>
        <th>${studyPeriod} (${course})</th>`;

      tableBody.append(tableRow);

    });

  };

  function hundleForm(form) {

    const formData = new FormData(form);

    const minBirthDate = new Date(1900, 0, 1);
    let errors = 0;

    const student = new Student(
      formData.get('name').trim(),
      formData.get('surname').trim(),
      formData.get('midname').trim(),
      formData.get('faculty').trim(),
      formData.get('birthDate').trim(),
      formData.get('beginStudyYear').trim()
    );

    // validation
    new Promise(function(resolve, reject) {

      Object.entries(student).forEach(([key, value]) => {

        const input = formInputs.find(input => input.getAttribute('name') === key);
        const alert = input.nextElementSibling;

        if (value instanceof Date) {

          if ( isNaN(value.getDate()) ) {

            input.classList.add('is-invalid');
            alert.textContent = 'Введите дату';

            errors += 1;

          } else if ( value < minBirthDate || value > new Date() ) {

            input.classList.add('is-invalid');
            alert.textContent = `Значение не должно быть раньше ${minBirthDate.toLocaleDateString()} или позднее ${new Date().toLocaleDateString()}`;

            errors += 1;

          } else {

            input.classList.remove('is-invalid');

          };

          return;
        };

        if (key === 'beginStudyYear') {

          if ( +value < 2000 || +value > new Date().getFullYear() ) {

            input.classList.add('is-invalid');
            alert.textContent = `Введите год не ранее 2000 и не позднее ${new Date().getFullYear()}`;

            errors += 1;

          } else {

            input.classList.remove('is-invalid');

          }

          return;
        };

        if (!value) {

          input.classList.add('is-invalid');
          alert.textContent = 'Поле не должно быть пустым';

          errors += 1;

        } else {

          input.classList.remove('is-invalid');

        };

      });

      resolve(errors);

    })
    .then ((errors) => {
      if (!errors) {

        students.push(student);
        setTable(students);

      };
    });

  };

  form.addEventListener('submit', function(e) {

    e.preventDefault();
    hundleForm(form);

  });

  filterInputs.forEach((item) => {
    let inputTimeout;

    item.addEventListener('input', function() {
      clearTimeout(inputTimeout);

      inputTimeout = setTimeout(function() {
        filterData.input[item.getAttribute('input-filter')] = `${item.value.trim()}`;
        console.log(filterData);
        setTable(students);
      }, 500);

    });
  });

  filterBtns.forEach((item) => {
    item.addEventListener('click', function() {

      Object.keys(filterData.btn).forEach((key) => {
        filterData.btn[key] = false;
      });

      filterData.btn[this.getAttribute('btn-filter')] = true;
      setTable(students);

    })
  })

});
