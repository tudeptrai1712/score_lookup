document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const sbdInput = document.getElementById('sbd-input');
    const resultContainer = document.getElementById('result-container');

    let studentData = [];
    let allScores = {};
    let subjectStats = {};

    const combinations = {
        'A00': ['Toán', 'Lí', 'Hóa'],
        'A01': ['Toán', 'Lí', 'NN'],
        'B00': ['Toán', 'Hóa', 'Sinh'],
        'C00': ['Văn', 'Sử', 'Địa'],
        'C01': ['Văn', 'Toán', 'Lí'],
        'C02': ['Văn', 'Toán', 'Hóa'],
        'D01': ['Văn', 'Toán', 'NN'],
        'D07': ['Toán', 'Hóa', 'NN'],
        'D09': ['Toán', 'NN', 'Sử'],
        'D14': ['Văn', 'NN', 'Sử'],
        'D15': ['Văn', 'NN', 'Địa'],
        'D66': ['Văn', 'NN', 'GDKT&PL']
    };

    fetch('../assess/data/điểm khối 12.jsonl')
        .then(response => response.text())
        .then(text => {
            studentData = text.trim().split('\n').map(line => JSON.parse(line));
            
            // Pre-calculate combination scores for all students
            studentData.forEach(student => {
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
                    student[comboKey] = possible ? totalScore : null;
                }
            });

            // Pre-process data for percentile and average calculation
            const subjectsAndCombos = [
                'Toán', 'Văn', 'NN', 'Lí', 'Hóa', 'Sinh', 'Sử', 'Địa', 'GDKT&PL', 'TB',
                ...Object.keys(combinations)
            ];

            subjectsAndCombos.forEach(subject => {
                const scores = studentData
                    .map(s => s[subject])
                    .filter(score => score !== null && score !== undefined)
                    .map(score => parseFloat(score))
                    .filter(score => !isNaN(score));
                
                if (scores.length > 0) {
                    allScores[subject] = [...scores].sort((a, b) => a - b);
                    const sum = scores.reduce((a, b) => a + b, 0);
                    subjectStats[subject] = {
                        avg: (sum / scores.length).toFixed(2)
                    };
                }
            });
        });

    searchBtn.addEventListener('click', () => {
        const sbd = sbdInput.value;
        const student = studentData.find(s => s.SBD.toString() === sbd);

        if (student) {
            let resultHTML = '<h2>Thông tin thí sinh</h2>';
            resultHTML += '<ul class="score-list info-list">';
            const ignoredKeys = ['A00', 'B00', 'B01', 'A01', 'C00', 'C01', 'C02', 'D01', 'D07', 'D09', 'D14', 'D15', 'D66'];
            
            for (const key in student) {
                if (student.hasOwnProperty(key) && !ignoredKeys.includes(key)) {
                    let value = student[key];
                    if (value !== null) {
                        let percentileInfo = '';
                        let avgInfo = '';
                        if (allScores[key] && allScores[key].length > 0) {
                            const scoreToCompare = parseFloat(value);
                            const count = allScores[key].filter(s => s <= scoreToCompare).length;
                            const percentile = (count / allScores[key].length) * 100;
                            percentileInfo = `${percentile.toFixed(0)}th`;
                            avgInfo = `avg: ${subjectStats[key].avg}`;
                        }

                        if (key === 'TB') {
                            value = parseFloat(value).toFixed(2);
                        } else if (typeof value === 'number' && key !== 'SBD') {
                            value = value.toFixed(2);
                        }
                        
                        resultHTML += `<li>
                            <strong>${key}:</strong>
                            <div class="score-details">
                                <span class="score-item">${value}</span>
                                <span class="percentile-item">${percentileInfo}</span>
                                <span class="avg-item">${avgInfo}</span>
                            </div>
                        </li>`;
                    }
                }
            }

            // Display combinations
            resultHTML += '</ul>';
            resultHTML += '<h2>Tổ hợp</h2>';
            resultHTML += '<ul class="score-list combo-list">';
            for (const comboKey in combinations) {
                let value = student[comboKey];
                if (value !== null) {
                    let percentileInfo = '';
                    let avgInfo = '';
                    if (allScores[comboKey] && allScores[comboKey].length > 0) {
                        const scoreToCompare = parseFloat(value);
                        const count = allScores[comboKey].filter(s => s <= scoreToCompare).length;
                        const percentile = (count / allScores[comboKey].length) * 100;
                        percentileInfo = `${percentile.toFixed(0)}th`;
                        avgInfo = `avg: ${subjectStats[comboKey].avg}`;
                    }
                    
                    resultHTML += `<li>
                        <strong>${comboKey}:</strong>
                        <div class="score-details">
                            <span class="score-item">${value.toFixed(2)}</span>
                            <span class="percentile-item">${percentileInfo}</span>
                            <span class="avg-item">${avgInfo}</span>
                        </div>
                    </li>`;
                }
            }

            resultHTML += '</ul>';
            resultContainer.innerHTML = resultHTML;
        } else {
            resultContainer.innerHTML = '<p>Không tìm thấy thí sinh với SBD này.</p>';
        }
    });
});
