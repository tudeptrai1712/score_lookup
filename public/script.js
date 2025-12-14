document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const sbdInput = document.getElementById('sbd-input');
    const resultContainer = document.getElementById('result-container');

    let studentData = [];

    const combinations = {
        'A00': ['Toán', 'Lí', 'Hóa'],
        'A01': ['Toán', 'Lí', 'NN'],
        'B00': ['Toán', 'Hóa', 'Sinh'],
        'C00': ['Văn', 'Sử', 'Địa'],
        'C01': ['Văn', 'Toán', 'Lí'],
        'C02': ['Văn', 'Toán', 'Hóa'],
        'D01': ['Văn', 'Toán', 'NN'],
        'D07': ['Toán', 'NN', 'Sử'],
        'D09': ['Toán', 'NN', 'Sử'],
        'D14': ['Văn', 'NN', 'Sử'],
        'D15': ['Văn', 'NN', 'Địa'],
        'D66': ['Văn', 'NN', 'GDKT&PL']
    };

    fetch('../assess/data/điểm khối 12.jsonl')
        .then(response => response.text())
        .then(text => {
            studentData = text.trim().split('\n').map(line => JSON.parse(line));
        });

    searchBtn.addEventListener('click', () => {
        const sbd = sbdInput.value;
        const student = studentData.find(s => s.SBD.toString() === sbd);

        if (student) {
            let resultHTML = '<h2>Thông tin thí sinh</h2>';
            resultHTML += '<ul>';
            const ignoredKeys = ['A00', 'B00', 'B01', 'A01', 'C00', 'C01', 'D01', 'D07', 'D09', 'D14', 'D15', 'D66'];
            for (const key in student) {
                if (student.hasOwnProperty(key) && !ignoredKeys.includes(key)) {
                    let value = student[key];
                    if (value !== null) {
                        if (key === 'TB') {
                            value = parseFloat(value).toFixed(2);
                        } else if (typeof value === 'number' && key !== 'SBD') {
                            value = value.toFixed(2);
                        }
                        resultHTML += `<li><strong>${key}:</strong> ${value}</li>`;
                    }
                }
            }

            // Calculate and display combinations
            for (const comboKey in combinations) {
                const subjects = combinations[comboKey];
                let totalScore = 0;
                let possible = true;
                for (const subject of subjects) {
                    if (student[subject] === null || student[subject] === undefined) {
                        possible = false;
                        break;
                    }
                    totalScore += student[subject];
                }

                if (possible) {
                    resultHTML += `<li><strong>${comboKey}:</strong> ${totalScore.toFixed(2)}</li>`;
                }
            }

            resultHTML += '</ul>';
            resultContainer.innerHTML = resultHTML;
        } else {
            resultContainer.innerHTML = '<p>Không tìm thấy thí sinh với SBD này.</p>';
        }
    });
});
