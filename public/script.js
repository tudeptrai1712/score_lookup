document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const sbdInput = document.getElementById('sbd-input');
    const resultContainer = document.getElementById('result-container');

    let studentData = [];

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
            for (const key in student) {
                if (student.hasOwnProperty(key)) {
                    resultHTML += `<li><strong>${key}:</strong> ${student[key] !== null ? student[key] : 'N/A'}</li>`;
                }
            }
            resultHTML += '</ul>';
            resultContainer.innerHTML = resultHTML;
        } else {
            resultContainer.innerHTML = '<p>Không tìm thấy thí sinh với SBD này.</p>';
        }
    });
});